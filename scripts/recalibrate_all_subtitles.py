import asyncio
import edge_tts
import json
import os

VOICE_MAP = {
    'vi': 'vi-VN-HoaiMyNeural',
    'en': 'en-US-JennyNeural',
    'zh': 'zh-CN-XiaoxiaoNeural',
    'ko': 'ko-KR-SunHiNeural',
    'ja': 'ja-JP-NanamiNeural',
}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, 'src', 'data', 'museum_data.json')
MOCK_DATA_FILE = os.path.join(BASE_DIR, 'public', 'mock', 'museum_data.json')
AUDIO_DIR = os.path.join(BASE_DIR, 'public', 'audio', 'artifacts')
os.makedirs(AUDIO_DIR, exist_ok=True)

async def recalibrate():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Fix WRM007 ja if needed
    for art in data['artifacts']:
        if art['id'] == 'WRM007':
            cues_ja = art.get('subtitles', {}).get('ja', [])
            if len(cues_ja) >= 2 and '重量約7トン。' in cues_ja[1]['text']:
                cues_ja[1]['text'] = cues_ja[1]['text'].replace('重量約7トン。', '重量約7トンで、')

    total = len(data['artifacts']) * len(VOICE_MAP)
    done = 0

    sem = asyncio.Semaphore(5)

    async def process_art_lang(art, lang, voice):
        nonlocal done
        async with sem:
            art_id = art['id']
            cues = art.get('subtitles', {}).get(lang, [])
            if not cues:
                return

            full_text = " ".join([c['text'] for c in cues])
            out_file = os.path.join(AUDIO_DIR, f"{art_id}_{lang}.mp3")

            boundaries = []
            audio_bytes = bytearray()

            for attempt in range(3):
                try:
                    comm = edge_tts.Communicate(full_text, voice)
                    boundaries.clear()
                    audio_bytes.clear()
                    async for chunk in comm.stream():
                        if chunk['type'] == 'SentenceBoundary':
                            s = chunk['offset'] / 10_000_000
                            d = chunk['duration'] / 10_000_000
                            boundaries.append({
                                'start': s,
                                'end': s + d
                            })
                        elif chunk['type'] == 'audio':
                            audio_bytes.extend(chunk['data'])
                    break
                except Exception as e:
                    print(f"Retry {attempt+1} for {art_id} {lang}: {e}")
                    await asyncio.sleep(1)

            if len(audio_bytes) > 1000:
                with open(out_file, 'wb') as af:
                    af.write(audio_bytes)

            if len(boundaries) == len(cues):
                # Align cue timings accurately
                for i in range(len(cues)):
                    s = boundaries[i]['start']
                    e = boundaries[i]['end']

                    # Start time: First cue starts at 0, subsequent cues start at boundary start
                    cue_start = 0.0 if i == 0 else round(s, 1)

                    # End time:
                    if i < len(cues) - 1:
                        cue_end = round(boundaries[i + 1]['start'], 1)
                    else:
                        cue_end = round(e, 1)

                    # Ensure strictly monotonic
                    if cue_end <= cue_start:
                        cue_end = round(cue_start + 1.0, 1)

                    cues[i]['start'] = cue_start
                    cues[i]['end'] = cue_end

                done += 1
                print(f"[{done}/{total}] OK {art_id} {lang}: {len(cues)} cues calibrated. Total dur: {cues[-1]['end']}s")
            else:
                print(f"Warning: Boundary mismatch for {art_id} {lang}: cues={len(cues)}, bound={len(boundaries)}")

    tasks = []
    for art in data['artifacts']:
        for lang, voice in VOICE_MAP.items():
            tasks.append(process_art_lang(art, lang, voice))

    await asyncio.gather(*tasks)

    # Save data files
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    with open(MOCK_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("Successfully calibrated all subtitle cue timestamps and updated audio!")

if __name__ == '__main__':
    asyncio.run(recalibrate())

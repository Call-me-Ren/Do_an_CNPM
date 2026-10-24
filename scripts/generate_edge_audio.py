import os
import json
import asyncio
import edge_tts

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

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

artifacts = data.get('artifacts', [])
print(f"Loaded {len(artifacts)} artifacts from museum_data.json")

sem = asyncio.Semaphore(4)

async def generate_single(art_id, lang, text, voice, out_path):
    async with sem:
        if os.path.exists(out_path) and os.path.getsize(out_path) > 5000:
            print(f"  [Skip] {os.path.basename(out_path)} ({os.path.getsize(out_path)} bytes)")
            return True
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(text, voice)
                await comm.save(out_path)
                if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
                    print(f"  [OK] {os.path.basename(out_path)} ({os.path.getsize(out_path)} bytes)")
                    return True
            except Exception as e:
                print(f"  [Retry {attempt+1}] {art_id} {lang}: {e}")
                await asyncio.sleep(1)
        return False

async def main():
    tasks = []
    for art in artifacts:
        art_id = art['id']
        subtitles = art.get('subtitles', {})
        
        # Ensure audio dictionary exists on artifact
        if 'audio' not in art or not isinstance(art['audio'], dict):
            art['audio'] = {}

        for lang, voice in VOICE_MAP.items():
            # Update audio link to point to this Edge Natural voice file
            audio_rel_url = f"/audio/artifacts/{art_id}_{lang}.mp3"
            art['audio'][lang] = audio_rel_url

            cues = subtitles.get(lang, [])
            if not cues:
                continue
            full_text = " ".join([c['text'] for c in cues])
            out_filename = f"{art_id}_{lang}.mp3"
            out_path = os.path.join(AUDIO_DIR, out_filename)
            tasks.append(generate_single(art_id, lang, full_text, voice, out_path))

    results = await asyncio.gather(*tasks)
    print(f"Finished generating: {sum(results)} / {len(tasks)} files ready.")

    # Save updated museum_data.json with audio links
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    with open(MOCK_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Updated src/data/museum_data.json and public/mock/museum_data.json with audio URLs!")

if __name__ == '__main__':
    asyncio.run(main())

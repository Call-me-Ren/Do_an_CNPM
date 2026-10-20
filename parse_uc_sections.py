import json, re

with open('uc_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_ucs = []

for k in sorted(data.keys(), key=lambda x: int(x[2:])):
    v = data[k]
    text = v['text']
    # Clean page headers
    text_clean = re.sub(r'--- Page \d+ ---', '', text)

    # Extract Title
    title_match = re.search(r'3\.\d+\s+(USC\d+\s*—\s*[^ \n\r\t]+[^\n\r]*)', text_clean)
    title = title_match.group(1).strip() if title_match else v['name']

    # Extract Actor
    actor_match = re.search(r'Tác nhân(?:\s*\(Actor\))?\s*:\s*([^\n\r]+)', text_clean)
    actor = actor_match.group(1).strip() if actor_match else "Người dùng"

    # Extract Description (Mô tả tóm tắt)
    desc_match = re.search(r'Mô tả tóm tắt\s*:\s*(.*?)(?=Điều kiện tiên|Dòng sự kiện|Luồng|$)', text_clean, re.DOTALL)
    desc = desc_match.group(1).strip() if desc_match else ""
    desc = re.sub(r'\s+', ' ', desc)

    # Extract Preconditions (Điều kiện tiên quyết)
    pre_match = re.search(r'Điều kiện tiên\s*quyết\s*:\s*(.*?)(?=Dòng sự kiện|Hành động|$)', text_clean, re.DOTALL)
    pre = pre_match.group(1).strip() if pre_match else ""
    pre = re.sub(r'\s+', ' ', pre)

    # Extract Flow of events (Dòng sự kiện chính)
    flow_match = re.search(r'Dòng sự kiện\s*chính\s*:\s*(?:Hành động của Actor\s+Phản hồi của Hệ thống)?(.*?)(?=Luồng thay thế|Luồng ngoại lệ|Điều kiện kết thúc|$)', text_clean, re.DOTALL)
    flow = flow_match.group(1).strip() if flow_match else ""

    # Extract Alternative
    alt_match = re.search(r'Luồng thay thế\s*\(Alternative\)\s*:\s*(.*?)(?=Luồng ngoại lệ|Điều kiện kết thúc|$)', text_clean, re.DOTALL)
    alt = alt_match.group(1).strip() if alt_match else "Không có."

    # Extract Exception
    exc_match = re.search(r'Luồng ngoại lệ\s*\(Exception\)\s*:\s*(.*?)(?=Điều kiện kết thúc|Sự kiện kích hoạt|$)', text_clean, re.DOTALL)
    exc = exc_match.group(1).strip() if exc_match else "Không có."

    # Extract Postcondition & Trigger
    post_match = re.search(r'Điều kiện kết thúc\s*:\s*(.*?)(?=Sự kiện kích hoạt|$)', text_clean, re.DOTALL)
    post = post_match.group(1).strip() if post_match else ""
    post = re.sub(r'\s+', ' ', post)

    trig_match = re.search(r'Sự kiện kích hoạt\s*:\s*(.*?)(?=\n\n|$)', text_clean, re.DOTALL)
    trig = trig_match.group(1).strip() if trig_match else ""
    trig = re.sub(r'\s+', ' ', trig)

    parsed_ucs.append({
        'id': k,
        'title': title,
        'actor': actor,
        'desc': desc,
        'pre': pre,
        'flow': flow,
        'alt': alt,
        'exc': exc,
        'post': post,
        'trig': trig,
        'start_page': v['start_page'],
        'end_page': v['end_page']
    })

with open('parsed_ucs.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_ucs, f, ensure_ascii=False, indent=2)

print(f"Parsed {len(parsed_ucs)} UCs successfully.")

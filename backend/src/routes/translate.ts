import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, validate } from '../middleware/auth.js';

export const translateRouter = Router();

const LANG_CODE_MAP: Record<string, string> = {
  vi: 'vi',
  en: 'en',
  zh: 'zh-CN',
  ko: 'ko',
  ja: 'ja',
  auto: 'auto',
};

/** Chia văn bản dài thành các đoạn <= maxLen ký tự theo dòng/câu để tránh giới hạn 500 ký tự của MyMemory. */
function chunkText(text: string, maxLen = 420): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  for (const line of text.split('\n')) {
    if (line.length <= maxLen) {
      chunks.push(line);
      continue;
    }
    let current = '';
    for (const part of line.split(/(?<=[.!?。！？])\s+/)) {
      if ((current + ' ' + part).trim().length > maxLen) {
        if (current) chunks.push(current.trim());
        current = part;
      } else {
        current = current ? `${current} ${part}` : part;
      }
    }
    if (current) chunks.push(current.trim());
  }
  return chunks.filter(Boolean);
}

async function translateViaClients5(clean: string, fromCode: string, toCode: string): Promise<string | null> {
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${fromCode}&tl=${toCode}&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];
      if (typeof first === 'string' && first.trim()) return first;
      if (Array.isArray(first) && typeof first[0] === 'string' && first[0].trim()) return first[0];
    }
  } catch {
    // Fallback below
  }
  return null;
}

async function translateViaGoogleGtx(clean: string, fromCode: string, toCode: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromCode}&tl=${toCode}&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0].map((item: any) => (item && item[0] ? item[0] : '')).join('');
      if (translated.trim()) return translated;
    }
  } catch {
    // Fallback below
  }
  return null;
}

async function translateViaMyMemory(clean: string, fromLang: string, toCode: string): Promise<string | null> {
  try {
    const myMemoryFrom = fromLang === 'auto' ? 'vi' : LANG_CODE_MAP[fromLang] || fromLang;
    const parts = chunkText(clean, 420);
    const out: string[] = [];
    for (const part of parts) {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(part)}&langpair=${myMemoryFrom}|${toCode}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json: any = await res.json();
      const txt = json?.responseData?.translatedText;
      if (!txt || typeof txt !== 'string' || txt.includes('MYMEMORY WARNING') || txt.includes('QUERY LENGTH LIMIT')) {
        return null;
      }
      out.push(txt);
    }
    return out.join('\n');
  } catch {
    return null;
  }
}

async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  const clean = text.trim();
  if (!clean) return '';

  const fromCode = LANG_CODE_MAP[fromLang] || fromLang || 'auto';
  const toCode = LANG_CODE_MAP[toLang] || toLang;

  if (fromCode === toCode) return clean;

  return (
    (await translateViaClients5(clean, fromCode, toCode)) ??
    (await translateViaGoogleGtx(clean, fromCode, toCode)) ??
    (await translateViaMyMemory(clean, fromLang, toCode)) ??
    clean
  );
}

const translateSchema = z.object({
  text: z.string().min(1).max(10000),
  from: z.string().default('auto'),
  to: z.string().min(2).max(10),
});

const batchSchema = z.object({
  text: z.string().min(1).max(10000),
  from: z.string().default('auto'),
  targets: z.array(z.string()).default(['vi', 'en', 'zh', 'ko', 'ja']),
});

translateRouter.post(
  '/translate',
  asyncHandler(async (req, res) => {
    const { text, from, to } = validate(translateSchema, req.body);
    const translatedText = await translateText(text, from, to);
    res.json({ translatedText, from, to });
  })
);

translateRouter.post(
  '/translate/batch',
  asyncHandler(async (req, res) => {
    const { text, from, targets } = validate(batchSchema, req.body);
    const results: Record<string, string> = {};

    for (const target of targets) {
      results[target] = await translateText(text, from, target);
    }

    res.json({ sourceLang: from, translations: results });
  })
);

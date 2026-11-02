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

async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  const clean = text.trim();
  if (!clean) return '';

  const fromCode = LANG_CODE_MAP[fromLang] || fromLang || 'auto';
  const toCode = LANG_CODE_MAP[toLang] || toLang;

  if (fromCode === toCode) return clean;

  // 1. Try Google Translate Single endpoint
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromCode}&tl=${toCode}&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => (item && item[0] ? item[0] : '')).join('');
        if (translated.trim()) {
          return translated;
        }
      }
    }
  } catch {
    // Fallback below
  }

  // 2. Fallback to MyMemory Free API
  try {
    const myMemoryFrom = fromLang === 'auto' ? 'vi' : fromLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${myMemoryFrom}|${toCode}`;
    const res = await fetch(url);
    if (res.ok) {
      const json: any = await res.json();
      const txt = json?.responseData?.translatedText;
      if (txt && typeof txt === 'string' && !txt.includes('MYMEMORY WARNING')) {
        return txt;
      }
    }
  } catch {
    // Ignore
  }

  return clean;
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

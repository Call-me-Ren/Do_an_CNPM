import { SupportedLanguage, SubtitleCue } from '../types';
import { http, apiEnabled } from './http';

export const ALL_LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
];

export const LANG_LABEL_MAP: Record<SupportedLanguage, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
  ko: '한국어',
  ja: '日本語',
};

const GOOGLE_LANG_MAP: Record<SupportedLanguage, string> = {
  vi: 'vi',
  en: 'en',
  zh: 'zh-CN',
  ko: 'ko',
  ja: 'ja',
};

/**
 * Tự động nhận diện ngôn ngữ dựa trên đặc trưng ký tự
 */
export function detectLanguage(text: string): SupportedLanguage {
  const t = text.trim();
  if (!t) return 'vi';

  // Japanese (Hiragana / Katakana)
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(t)) {
    return 'ja';
  }

  // Korean (Hangul)
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(t)) {
    return 'ko';
  }

  // Chinese (CJK Ideographs without Kana)
  if (/[\u4E00-\u9FFF]/.test(t)) {
    return 'zh';
  }

  // Vietnamese diacritics
  if (/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(t)) {
    return 'vi';
  }

  // Default to English or Vietnamese
  return 'en';
}

/**
 * Dịch một đoạn văn bản từ ngôn ngữ nguồn sang ngôn ngữ đích
 */
export async function translateSingle(
  text: string,
  from: SupportedLanguage | 'auto',
  to: SupportedLanguage
): Promise<string> {
  const clean = text.trim();
  if (!clean) return '';
  if (from === to) return clean;

  // 1. Thử qua backend nếu có
  if (apiEnabled) {
    try {
      const res = await http.post<{ translatedText: string }>('/translate', {
        text: clean,
        from,
        to,
      });
      if (res.data && res.data.translatedText) {
        return res.data.translatedText;
      }
    } catch {
      // Tiếp tục fallback bên dưới
    }
  }

  // 2. Thử Google Translate gtx client trực tiếp từ trình duyệt
  try {
    const sl = from === 'auto' ? 'auto' : GOOGLE_LANG_MAP[from] || from;
    const tl = GOOGLE_LANG_MAP[to] || to;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const result = data[0].map((item: any) => (item && item[0] ? item[0] : '')).join('');
        if (result.trim()) return result;
      }
    }
  } catch {
    // Tiếp tục fallback MyMemory
  }

  // 3. Fallback qua MyMemory API
  try {
    const pair = `${from === 'auto' ? 'en' : from}|${to}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${pair}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const txt = json?.responseData?.translatedText;
      if (txt && typeof txt === 'string' && !txt.includes('MYMEMORY WARNING')) {
        return txt;
      }
    }
  } catch {
    // ignore
  }

  return clean;
}

export interface TranslationProgress {
  percent: number;
  message: string;
  currentLang?: SupportedLanguage;
  completedLangs: SupportedLanguage[];
}

/**
 * Tự động dịch một đoạn văn bản sang tất cả các ngôn ngữ còn lại trong hệ thống
 */
export async function translateToAllLanguages(
  text: string,
  sourceLang: SupportedLanguage | 'auto',
  onProgress?: (p: TranslationProgress) => void
): Promise<{
  sourceLang: SupportedLanguage;
  translations: Record<SupportedLanguage, string>;
}> {
  const clean = text.trim();
  const detectedLang: SupportedLanguage = sourceLang === 'auto' ? detectLanguage(clean) : sourceLang;

  const allCodes: SupportedLanguage[] = ['vi', 'en', 'zh', 'ko', 'ja'];
  const targets = allCodes.filter((c) => c !== detectedLang);

  const results: Record<SupportedLanguage, string> = {
    vi: '',
    en: '',
    zh: '',
    ko: '',
    ja: '',
  };
  results[detectedLang] = clean;

  const completedLangs: SupportedLanguage[] = [detectedLang];

  onProgress?.({
    percent: 10,
    message: `Đã xác nhận ngôn ngữ gốc: ${LANG_LABEL_MAP[detectedLang]}`,
    currentLang: detectedLang,
    completedLangs,
  });

  const stepPercent = 90 / targets.length;

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const currentPercent = Math.round(10 + i * stepPercent);

    onProgress?.({
      percent: currentPercent,
      message: `Đang dịch sang ${LANG_LABEL_MAP[target]}...`,
      currentLang: target,
      completedLangs: [...completedLangs],
    });

    try {
      const translated = await translateSingle(clean, detectedLang, target);
      results[target] = translated;
    } catch {
      results[target] = clean;
    }

    completedLangs.push(target);
  }

  onProgress?.({
    percent: 100,
    message: 'Hoàn tất dịch thuật cả 5 ngôn ngữ!',
    completedLangs,
  });

  return {
    sourceLang: detectedLang,
    translations: results,
  };
}

/**
 * Phân tích tệp tải lên (Văn bản hoặc Âm thanh)
 */
export interface ParsedFileInput {
  type: 'text' | 'subtitles' | 'audio';
  text?: string;
  subtitles?: SubtitleCue[];
  audioDataUrl?: string;
  fileName: string;
  suggestedTitle?: string;
}

export function parseFileContent(file: File): Promise<ParsedFileInput> {
  return new Promise((resolve, reject) => {
    const name = file.name;
    const isAudio = /\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(name);
    const isSub = /\.(srt|vtt)$/i.test(name);
    const isJson = /\.json$/i.test(name);

    if (isAudio) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const audioDataUrl = e.target?.result as string;
        const cleanName = name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        resolve({
          type: 'audio',
          audioDataUrl,
          fileName: name,
          suggestedTitle: cleanName,
          text: `[Tệp âm thanh: ${name}]`,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const textReader = new FileReader();
    textReader.onload = (e) => {
      const rawText = (e.target?.result as string) || '';

      if (isSub) {
        const cues: SubtitleCue[] = [];
        const lines = rawText
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l && !l.startsWith('WEBVTT') && !/^\d+$/.test(l) && !l.includes('-->'));

        let curTime = 0;
        lines.forEach((line) => {
          cues.push({
            start: curTime,
            end: curTime + 6,
            text: line,
          });
          curTime += 6;
        });

        resolve({
          type: 'subtitles',
          text: lines.join('\n'),
          subtitles: cues,
          fileName: name,
          suggestedTitle: name.replace(/\.[^/.]+$/, ''),
        });
        return;
      }

      if (isJson) {
        try {
          const parsed = JSON.parse(rawText);
          if (Array.isArray(parsed)) {
            // Danh sách subtitle cues
            resolve({
              type: 'subtitles',
              subtitles: parsed,
              text: parsed.map((p) => p.text || '').join('\n'),
              fileName: name,
            });
            return;
          }
        } catch {
          // Fallback to text
        }
      }

      // Plain text
      resolve({
        type: 'text',
        text: rawText,
        fileName: name,
        suggestedTitle: name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      });
    };
    textReader.onerror = reject;
    textReader.readAsText(file);
  });
}

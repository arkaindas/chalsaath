import en from './en.json';
import hi from './hi.json';

type Lang = 'en' | 'hi';

const translations: Record<Lang, Record<string, unknown>> = { en, hi };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

export function t(lang: Lang, key: string): string {
  return getNestedValue(translations[lang] as Record<string, unknown>, key);
}

export function getLang(stored: string | null): Lang {
  if (stored === 'hi') return 'hi';
  return 'en';
}

export { en, hi };
export type { Lang };

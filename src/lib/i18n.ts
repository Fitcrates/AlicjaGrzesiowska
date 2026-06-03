export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocale(value?: string): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export function withLocalePath(locale: Locale, path: string) {
  return locale === defaultLocale ? path : `/${locale}${path === "/" ? "" : path}`;
}

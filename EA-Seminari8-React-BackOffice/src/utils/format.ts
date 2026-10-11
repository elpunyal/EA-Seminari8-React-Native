const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Castellano',
  ca: 'Catalán',
  en: 'Inglés',
};

export function languageName(code?: string): string {
  if (!code) {
    return '';
  }
  return LANGUAGE_NAMES[code] ?? code;
}

export function truncate(value: string | undefined | null, limit = 80, trail = '...'): string {
  if (!value) return '';
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > limit ? clean.substring(0, limit).trim() + trail : clean;
}

export function formatDate(iso?: string): string {
  if (!iso) {
    return '';
  }
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function formatPrice(price?: number): string {
  if (price === undefined || price === null) return '';
  return `${price.toFixed(2)} €`;
}

export function initials(name: string): string {
  const words = name.split(' ').filter((word) => word);
  const first = words[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1] : '';
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

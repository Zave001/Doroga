// towiki всегда даёт заголовку статьи заглавную первую букву ("Проспект
// Ленина"), а OSM для родового слова обычно хранит его строчным ("проспект
// Ленина") — используем это при переходе с карты на статью.
export function capitalizeFirst(raw: string): string {
  if (!raw) return raw;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function normalizeName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/ё/g, 'е') // ё -> е
    .replace(/\(.*?\)/g, '') // отбросить дизамбигуацию из заголовка вики: "(улица)"
    .replace(/[«»"'.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// OSM и towiki обычно используют один и тот же порядок слов ("проспект Кирова",
// "Академический проспект"), но на всякий случай пробуем и перестановку первых
// двух слов — дешёвый способ поднять процент совпадений без ручной таблицы.
export function candidateKeys(raw: string): string[] {
  const base = normalizeName(raw);
  const keys = new Set([base]);
  const words = base.split(' ');
  if (words.length >= 2) {
    keys.add([words[1], words[0], ...words.slice(2)].join(' '));
  }
  return [...keys];
}

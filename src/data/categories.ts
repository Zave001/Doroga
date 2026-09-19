import type { CategoryDef, StreetItem } from '../types';

function item(name: string, category: StreetItem['category'], hasWikiPage = true): StreetItem {
  return { name, category, hasWikiPage };
}

// "Улицы", "Проспекты" и т.д. — настоящие категории towiki с сотнями статей,
// поэтому они догружаются лениво через MediaWiki API (см. useCategoryStreets).
// Остальные разделы на исходной странице — просто списки ссылок, без категории,
// поэтому их состав зафиксирован тут по данным самой страницы towiki.
export const CATEGORIES: CategoryDef[] = [
  { key: 'street', title: 'Улицы', wikiCategory: 'Категория:Улицы Томска' },
  { key: 'avenue', title: 'Проспекты', wikiCategory: 'Категория:Проспекты Томска' },
  { key: 'trakt', title: 'Тракты', wikiCategory: 'Категория:Тракты Томска' },
  { key: 'lane', title: 'Переулки', wikiCategory: 'Категория:Переулки Томска' },
  { key: 'passage', title: 'Проезды', wikiCategory: 'Категория:Проезды Томска' },
  { key: 'square', title: 'Площади', wikiCategory: 'Категория:Площади Томска' },
  { key: 'settlement', title: 'Посёлки', wikiCategory: 'Категория:Посёлки Томска' },
  {
    key: 'microdistrict',
    title: 'Микрорайоны',
    staticItems: [
      item('Академический микрорайон', 'microdistrict'),
      item('Наука микрорайон', 'microdistrict'),
    ],
  },
  {
    key: 'embankment',
    title: 'Набережные',
    staticItems: [
      item('Набережная Озера', 'embankment', false),
      item('Набережная реки Томи', 'embankment'),
      item('Набережная реки Ушайки', 'embankment'),
      item('Набережная реки Басандайки', 'embankment'),
    ],
  },
  {
    key: 'ascent',
    title: 'Взвозы',
    staticItems: [item('Кузнечный взвоз', 'ascent'), item('Октябрьский взвоз', 'ascent')],
  },
  {
    key: 'deadend',
    title: 'Тупики',
    staticItems: [
      item('Аникинский 4-й тупик', 'deadend'),
      item('Тихий тупик', 'deadend', false),
      item('Усть-Киргизский 2-й тупик', 'deadend', false),
      item('Школьный тупик', 'deadend', false),
    ],
  },
  {
    key: 'town',
    title: 'Городки',
    staticItems: [
      item('Аэропорт городок', 'town', false),
      item('Северный городок', 'town'),
      item('Студенческий городок', 'town'),
    ],
  },
  {
    key: 'row',
    title: 'Ряды',
    staticItems: [
      item('Ново-Кузнечный 1-й ряд', 'row'),
      item('Ново-Кузнечный 2-й ряд', 'row'),
      item('Старо-Кузнечный ряд', 'row', false),
    ],
  },
  {
    key: 'exotic',
    title: 'Экзотика',
    staticItems: [
      item('Войлочная заимка', 'exotic'),
      item('Кордон № 2', 'exotic', false),
      item('Кузовлевское тепличное хозяйство', 'exotic', false),
      item('Новостройка', 'exotic', false),
      item('Опытный участок Ботанического сада', 'exotic', false),
      item('Погрузконтора', 'exotic'),
      item('Радиостанция № 16 (улица)', 'exotic'),
    ],
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  ...Object.fromEntries(CATEGORIES.map((c) => [c.key, c.title])),
  unknown: 'Другое',
};

// Прямые запросы к MediaWiki API towiki.ru из браузера — API отдаёт
// Access-Control-Allow-Origin: * при origin=*, отдельный бэкенд не нужен.
const API_BASE = 'https://towiki.ru/api.php';

// Категории towiki вперемешку с реальными статьями содержат служебные страницы
// (списки, подкатегории, файлы) — эвристически отсеиваем их по ключевым словам.
const NOISE_PATTERNS = [
  'список',
  'элементы',
  'переименован',
  'исчезнувш',
  'развязк',
  'населённых пункт',
  'муницип',
];

// Заголовок самой категории тоже попадает в её собственный список статей
// (напр. "Проспекты Томска" внутри категории "Проспекты Томска").
function isCategorySelfPage(title: string, categoryTitle: string): boolean {
  const bare = categoryTitle.replace(/^Категория:/i, '').trim();
  return title.trim().toLowerCase() === bare.toLowerCase();
}

function looksLikeNoise(title: string, categoryTitle: string): boolean {
  const lower = title.toLowerCase();
  if (isCategorySelfPage(title, categoryTitle)) return true;
  return NOISE_PATTERNS.some((p) => lower.includes(p));
}

export async function fetchCategoryMembers(categoryTitle: string): Promise<string[]> {
  const members: string[] = [];
  let cmcontinue: string | undefined;

  do {
    const url = new URL(API_BASE);
    url.searchParams.set('action', 'query');
    url.searchParams.set('list', 'categorymembers');
    url.searchParams.set('cmtitle', categoryTitle);
    url.searchParams.set('cmlimit', '500');
    url.searchParams.set('cmnamespace', '0');
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');
    if (cmcontinue) url.searchParams.set('cmcontinue', cmcontinue);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`towiki API вернул ${res.status}`);
    const data = await res.json();

    for (const member of data.query?.categorymembers ?? []) {
      if (!looksLikeNoise(member.title, categoryTitle)) members.push(member.title);
    }
    cmcontinue = data.continue?.cmcontinue;
  } while (cmcontinue);

  return members;
}

export interface ParsedArticle {
  html: string;
  links: { title: string; missing: boolean }[];
}

// MediaWiki отдаёт src/href статьи как пути относительно towiki.ru
// ("/images/...", "/view/..."). Внутри нашего приложения они бы резолвились
// относительно нашего домена, поэтому картинки/ссылки нужно абсолютизировать.
function absolutizeWikiUrls(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  for (const el of doc.querySelectorAll('[src]')) {
    const src = el.getAttribute('src');
    if (src?.startsWith('/')) el.setAttribute('src', `https://towiki.ru${src}`);
  }
  for (const el of doc.querySelectorAll('[href]')) {
    const href = el.getAttribute('href');
    if (href?.startsWith('/')) el.setAttribute('href', `https://towiki.ru${href}`);
  }
  return doc.body.innerHTML;
}

export async function fetchArticle(title: string): Promise<ParsedArticle> {
  const url = new URL(API_BASE);
  url.searchParams.set('action', 'parse');
  url.searchParams.set('page', title);
  url.searchParams.set('prop', 'text|links');
  url.searchParams.set('redirects', '1');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`towiki API вернул ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.info ?? 'Статья не найдена');

  const html = absolutizeWikiUrls(data.parse.text['*']);
  const links = (data.parse.links ?? [])
    .filter((l: { ns: number }) => l.ns === 0)
    .map((l: { ['*']: string; exists?: string }) => ({
      title: l['*'],
      missing: l.exists === undefined,
    }));

  return { html, links };
}

export function parseWikiHref(href: string): { title: string } | null {
  try {
    const url = new URL(href, 'https://towiki.ru');
    if (url.hostname !== 'towiki.ru') return null;

    if (url.pathname.startsWith('/view/')) {
      const raw = decodeURIComponent(url.pathname.slice('/view/'.length));
      return { title: raw.replace(/_/g, ' ') };
    }
    if (url.pathname === '/index.php' && url.searchParams.get('title')) {
      const raw = decodeURIComponent(url.searchParams.get('title') as string);
      return { title: raw.replace(/_/g, ' ') };
    }
    return null;
  } catch {
    return null;
  }
}

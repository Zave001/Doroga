import { useEffect } from 'react';
import './Landing.css';

const TOOL_URL = '/app';

function useRevealOnScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (prefersReduced) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function SlideTag({ n, title, seconds }: { n: number; title: string; seconds?: number }) {
  return (
    <p className="eyebrow">
      Слайд {String(n).padStart(2, '0')}/10 · {title}
      {seconds ? ` · ~${seconds} сек` : ''}
    </p>
  );
}

const PRICING_ROWS = [
  {
    name: 'Персональная карта',
    som: '75 млн ₽',
    price: '1 990–8 000 ₽ (с рамкой)',
    margin: '3 500–7 500 ₽ (премиум)',
  },
  {
    name: 'Event Maps',
    som: '5 млн ₽',
    price: '1 500–2 500 ₽',
    margin: '1 000–2 000 ₽',
  },
  {
    name: 'Реклама на местности',
    som: '110 млн ₽/год',
    price: '5 000–15 000 ₽',
    margin: '4 500–14 500 ₽',
  },
  {
    name: '«Узнаю дорогу.рф»',
    som: 'оценивается по пилотам',
    price: 'лицензии / партнёрства',
    margin: '—',
  },
];

const TEAM = [
  'Грищенко Сергей',
  'Карев Степан',
  'Кузнецов Алексей',
  'Маслеников Юрий',
  'Суханов Артём',
  'Тарасенко Галина',
  'Абдурахипов Роман',
  'Васильев Кирилл',
];

export function Landing() {
  useRevealOnScroll();

  return (
    <div className="landing">
      <header className="landing__nav">
        <span className="landing__brand">
          узнаю<strong>дорогу</strong>.рф
        </span>
        <a className="landing__nav-cta" href={TOOL_URL}>
          Открыть инструмент →
        </a>
      </header>

      <main>
        {/* Слайд 1 — Титульный */}
        <section className="hero">
          <p className="eyebrow">Команда «Колобок» · слайд 01/10</p>
          <h1>
            «Знаю дорогу» — от карты для детей
            <br />к 4 продуктовым направлениям
          </h1>
          <p className="hero__lede">
            Кейс №3: поиск новых ниш и проверка спроса для сервиса персонализированных карт.
            Один работающий движок — четыре разных рынка.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={TOOL_URL}>
              Посмотреть живой MVP
            </a>
            <a className="btn btn--ghost" href="#problem">
              Питч ↓
            </a>
          </div>
        </section>

        {/* Слайд 2 — Проблема */}
        <section className="problem reveal" id="problem">
          <SlideTag n={2} title="Проблема" seconds={30} />
          <h2>Технология шире, чем ниша, в которую мы её загнали</h2>
          <ul className="problem__list">
            <li>Организаторы мероприятий делают карты вручную — дорого и долго.</li>
            <li>Локальный бизнес физически рядом с клиентом, но невидим для него.</li>
            <li>
              Люди хотят сохранить личную историю (отношения, путешествие, детство) в
              физическом виде — удобного формата нет.
            </li>
            <li>
              Краеведческий контент города разрознён: тексты про историю улиц существуют
              отдельно от карты.
            </li>
          </ul>
          <p className="callout-quote">
            Узкое позиционирование «карта для детей» держало нас в одной нише — при том
            что технология закрывает четыре разных рынка.
          </p>
        </section>

        {/* Слайд 3 — Решение: 4 продукта */}
        <section className="divergence reveal" id="solution">
          <SlideTag n={3} title="Решение — 4 продукта" seconds={30} />
          <h2>Один движок — четыре разных бизнеса</h2>
          <div className="fork">
            <div className="fork__trunk">
              <span>OSM + towiki движок</span>
            </div>
            <div className="fork__branches">
              <div className="fork__branch">
                <strong>Event Maps</strong>
                <span>Конструктор карт для мероприятий и спорта</span>
              </div>
              <div className="fork__branch">
                <strong>Реклама на местности</strong>
                <span>Физический рекламный объект: сити-формат, карта-навигатор</span>
              </div>
              <div className="fork__branch">
                <strong>Персональная карта</strong>
                <span>История, путешествие, подарок — премиум в раме</span>
              </div>
              <div className="fork__branch fork__branch--live">
                <strong>«Узнаю дорогу.рф»</strong>
                <span>Веб-карта города + краеведческий контент — уже работающий MVP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Слайд 4 — Продукт 4: уже готовый MVP */}
        <section className="concept concept--live reveal" id="product4">
          <SlideTag n={4} title="Продукт 4 — уже готовый MVP" seconds={30} />
          <h2>«Узнаю дорогу.рф»</h2>
          <p className="concept__thesis">
            Карта Томска на OpenStreetMap + статьи towiki.ru. Клик по улице на карте или в
            списке → приближение и карточка с историей → ссылки внутри статьи ведут дальше
            по карте.
          </p>
          <div className="concept__body concept__body--two">
            <div className="concept__col">
              <h3>Технически</h3>
              <p>
                Полностью статичный сайт, бесплатный хостинг на GitHub Pages, без сервера.
                Модель легко тиражируется на другие города, где есть похожие краеведческие
                вики-проекты.
              </p>
            </div>
            <div className="concept__col">
              <h3>Монетизация</h3>
              <p>
                Лицензии школам и вузам — краеведение на уроках. Партнёрства с рекламными
                агентствами — размещение локального бизнеса на карте.
              </p>
            </div>
          </div>
          <a className="btn btn--primary" href={TOOL_URL}>
            Открыть узнаюдорогу.рф →
          </a>
        </section>

        {/* Слайд 5 — Рынок и цены */}
        <section className="market-slide reveal" id="market">
          <SlideTag n={5} title="Рынок и цены" seconds={35} />
          <h2>Где деньги</h2>
          <div className="compare__table">
            <div className="compare__row compare__row--head">
              <span>Направление</span>
              <span>SOM</span>
              <span>Цена</span>
              <span>Маржа с единицы</span>
            </div>
            {PRICING_ROWS.map((row) => (
              <div className="compare__row" key={row.name}>
                <span>{row.name}</span>
                <span>{row.som}</span>
                <span>{row.price}</span>
                <span>{row.margin}</span>
              </div>
            ))}
          </div>
          <p className="market-slide__note">
            Апсейл — рамки: поднимают чек персональной карты в 2–4 раза.
          </p>
        </section>

        {/* Слайд 6 — Как проверяем спрос */}
        <section className="validation reveal" id="validation">
          <SlideTag n={6} title="Как проверяем спрос" seconds={30} />
          <h2>Деньгами, а не мнениями</h2>
          <div className="validation__flow">
            <span>CustDev по реальному поведению</span>
            <span aria-hidden="true">→</span>
            <span>Лендинг с 3–4 сценариями</span>
            <span aria-hidden="true">→</span>
            <span>Ручной MVP</span>
            <span aria-hidden="true">→</span>
            <span className="validation__kpi">KPI: оплаченный заказ</span>
          </div>
          <p className="validation__caption">
            Не «купили бы вы?», а что человек уже покупал — и не клики или лайки, а
            оплаченный заказ.
          </p>
          <div className="callout-box">
            <p className="callout-box__label">Пример нового сегмента — ролевики (LARP)</p>
            <p>
              5 интервью, 3 из 5 самостоятельно назвали потребность в карте (для игры или
              на память), 2 мастера готовы закладывать её в бюджет игры.
            </p>
            <p className="callout-box__verdict">
              Вывод: перспективный под-сегмент внутри Event Maps и «Персональной карты» —
              нужна выборка побольше.
            </p>
          </div>
        </section>

        {/* Слайд 7 — Результаты */}
        <section className="results reveal" id="results">
          <SlideTag n={7} title="Результаты" seconds={30} />
          <h2>Что уже сделано</h2>
          <ul className="results__list">
            <li>Работающий прототип «Узнаю дорогу.рф»: интеграция с OpenStreetMap + towiki.ru.</li>
            <li>Проведены первые CustDev по трём гипотезам, включая новый сегмент — ролевые игры.</li>
            <li>Собрана методология проверки спроса, готовая к масштабированию на все 4 продукта.</li>
          </ul>
        </section>

        {/* Слайд 8 — Каналы выхода на рынок */}
        <section className="channels channels--top reveal" id="channels">
          <SlideTag n={8} title="Каналы выхода на рынок" seconds={30} />
          <h2>Как доберёмся до клиентов</h2>
          <div className="channels__grid">
            <div>
              <p className="channels__label">B2C</p>
              <p>Соцсети, контекстная реклама, блогеры, партнёрства (фотографы, свадебные организаторы, турагентства).</p>
            </div>
            <div>
              <p className="channels__label">B2B</p>
              <p>Прямые продажи локальному бизнесу и event-агентствам, ТЦ/БЦ/отели.</p>
            </div>
            <div>
              <p className="channels__label">B2G/B2B</p>
              <p>Школы и вузы, рекламные агентства — для «Узнаю дорогу.рф».</p>
            </div>
          </div>
        </section>

        {/* Слайд 9 — Команда */}
        <section className="team reveal" id="team">
          <SlideTag n={9} title="Команда" />
          <h2>Команда «Колобок»</h2>
          <ul className="team__grid">
            {TEAM.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>

        {/* Слайд 10 — Запрос к инвесторам + спасибо */}
        <section className="cta reveal" id="ask">
          <SlideTag n={10} title="Запрос к инвесторам" />
          <h2>Инвестиции — на проверку, а не на веру</h2>
          <p>
            Средства пойдут на CustDev по всем 4 направлениям, первые MVP-партии и
            пилотные переговоры со школами и рекламными агентствами.
          </p>
          <a className="btn btn--primary" href={TOOL_URL}>
            Открыть узнаюдорогу.рф →
          </a>
          <p className="cta__thanks">Спасибо за внимание! Готовы ответить на вопросы.</p>
        </section>
      </main>

      <footer className="landing__footer">
        <span>узнаюдорогу.рф</span>
        <a href={TOOL_URL}>Открыть инструмент →</a>
      </footer>
    </div>
  );
}

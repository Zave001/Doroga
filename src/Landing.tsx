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

interface MarketBarProps {
  tam: string;
  sam: string;
  som: string;
  samPct: number;
  somPct: number;
  note?: string;
}

function MarketBar({ tam, sam, som, samPct, somPct, note }: MarketBarProps) {
  return (
    <div className="market">
      <div className="market__bar">
        <div className="market__seg market__seg--sam" style={{ width: `${samPct}%` }} />
        <div className="market__seg market__seg--som" style={{ width: `${somPct}%` }} />
      </div>
      <dl className="market__figures">
        <div>
          <dt>TAM</dt>
          <dd>{tam}</dd>
        </div>
        <div>
          <dt>SAM</dt>
          <dd>{sam}</dd>
        </div>
        <div>
          <dt>SOM</dt>
          <dd>{som}</dd>
        </div>
      </dl>
      {note && <p className="market__note">{note}</p>}
    </div>
  );
}

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
        <section className="hero">
          <p className="eyebrow">Кейс «Знаю дорогу» · сайд-проект</p>
          <h1>
            Одна карта Томска.
            <br />
            Четыре продукта.
          </h1>
          <p className="hero__lede">
            Мы взяли работающий движок «узнаюдорогу.рф» — актуальные данные OpenStreetMap,
            размеченные историей улиц из towiki.ru — и проверили, куда он может вырасти
            как продукт. Получилось четыре разных гипотезы для четырёх разных рынков.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={TOOL_URL}>
              Посмотреть живой инструмент
            </a>
            <a className="btn btn--ghost" href="#context">
              Как мы к этому пришли ↓
            </a>
          </div>
        </section>

        <section className="context reveal" id="context">
          <div className="context__grid">
            <div>
              <p className="eyebrow">Цель кейса</p>
              <p>Найти жизнеспособные продуктовые гипотезы.</p>
            </div>
            <div>
              <p className="eyebrow">Задача команды</p>
              <p>Сгенерировать новые концепции продуктов.</p>
            </div>
            <div>
              <p className="eyebrow">Решение</p>
              <p>Разработаны 4 концепции продуктов на общей технологической базе.</p>
            </div>
          </div>
        </section>

        <section className="divergence reveal">
          <p className="eyebrow">Точка расхождения</p>
          <h2>Один движок — четыре разных бизнеса</h2>
          <p className="section__lede">
            У всех четырёх концепций общий фундамент: связка OSM-геоданных и
            краеведческого контента. Дальше пути расходятся — у каждой концепции
            своя проблема, своя аудитория и своя модель денег.
          </p>
          <div className="fork">
            <div className="fork__trunk">
              <span>OSM + towiki движок</span>
            </div>
            <div className="fork__branches">
              <div className="fork__branch">Подарки</div>
              <div className="fork__branch">Ивенты</div>
              <div className="fork__branch">Реклама на местности</div>
              <div className="fork__branch fork__branch--live">towiki-интеграция</div>
            </div>
          </div>
        </section>

        <section className="concept reveal" id="concept-a">
          <div className="concept__head">
            <p className="eyebrow">Продукт 1</p>
            <h2>«Карта нашей истории»</h2>
            <p className="concept__tag">Персональные карты как подарок</p>
          </div>
          <p className="concept__thesis">
            Продаём не «карту», а эмоцию, память или полезный персональный объект.
          </p>
          <div className="concept__body">
            <div className="concept__col">
              <h3>Проблема</h3>
              <p>
                Типовые сувениры не передают личную историю. На рынке подарков не хватает
                вещи, которая была бы по-настоящему «про нас двоих» или «про нашу семью».
              </p>
            </div>
            <div className="concept__col">
              <h3>Решение</h3>
              <p>
                Карта на основе реальных OSM-данных с отмеченными личными точками —
                первое свидание, свадебный маршрут, путешествие, семейная хроника.
                Печатается как постер или альбом.
              </p>
            </div>
            <div className="concept__col">
              <h3>Целевая аудитория</h3>
              <p>
                Пары, семьи, путешественники; покупатели подарков к годовщинам,
                свадьбам, дням рождения.
              </p>
            </div>
          </div>
          <div className="niches">
            <h3>Три основные ниши</h3>
            <div className="niches__grid">
              <div>
                <p className="channels__label">Подарки и памятные события</p>
                <p>«Наша история на карте».</p>
              </div>
              <div>
                <p className="channels__label">Путешествия</p>
                <p>Персональная карта поездки или маршрута.</p>
              </div>
              <div>
                <p className="channels__label">Корпоративные подарки</p>
                <p>Офисы, регионы присутствия, маршруты и достижения компании.</p>
              </div>
            </div>
            <p className="niches__note">
              Отдельно можно тестировать свадьбы, выпускные, переезды и интерьерные карты.
            </p>
          </div>
          <MarketBar
            tam="≈ 3 млрд ₽"
            sam="≈ 1,5 млрд ₽"
            som="≈ 75 млн ₽"
            samPct={50}
            somPct={2.5}
            note="SAM — 50% рынка, цифрово доступные клиенты в целевых городах. SOM — 5% SAM за 3–5 лет."
          />
        </section>

        <section className="concept reveal" id="concept-b">
          <div className="concept__head">
            <p className="eyebrow">Продукт 2</p>
            <h2>Event Maps</h2>
            <p className="concept__tag">Карты для страйкбола, квестов и мероприятий</p>
          </div>
          <div className="concept__body">
            <div className="concept__col">
              <h3>Концепция</h3>
              <p>
                Персональная карта события под конкретное мероприятие — не просто схема
                территории, а элемент игры: маршрут, точки заданий, зоны команд,
                чекпоинты, тайники.
              </p>
            </div>
            <div className="concept__col">
              <h3>Проблема</h3>
              <p>
                Карты мероприятий сейчас делают вручную: нужен дизайнер, они однотипны,
                сложно адаптируются под новую локацию, материалы готовятся заново каждый
                раз. Организатору нужно одновременно дать понятную навигацию и сделать
                карту частью впечатления от события.
              </p>
            </div>
            <div className="concept__col">
              <h3>Решение</h3>
              <p>
                Конструктор event-карт на базе технологии «Знаю дорогу». Организатор даёт
                локацию, точки, маршрут, задания, логотип и стиль — получает готовую
                карту.
              </p>
            </div>
          </div>
          <div className="channels">
            <h3>Каналы продвижения</h3>
            <div className="channels__grid">
              <div>
                <p className="channels__label">B2B — прямые продажи</p>
                <p>VK и Telegram, сайты event-компаний, каталоги мероприятий, сообщества страйкбола.</p>
              </div>
              <div>
                <p className="channels__label">Партнёрства</p>
                <p>Event-агентства, владельцы полигонов, квест-компании, организаторы фестивалей.</p>
              </div>
              <div>
                <p className="channels__label">Контент</p>
                <p>Социальные сети и инфлюенс-маркетинг.</p>
              </div>
            </div>
          </div>
          <MarketBar
            tam="≈ 1 млрд ₽"
            sam="≈ 300 млн ₽"
            som="≈ 5 млн ₽/год"
            samPct={30}
            somPct={0.5}
            note="При чеке 5 тыс. ₽ — около 1 000 заказов в год."
          />
        </section>

        <section className="concept reveal" id="concept-c">
          <div className="concept__head">
            <p className="eyebrow">Продукт 3</p>
            <h2>Реклама на местности</h2>
            <p className="concept__tag">Из карты — в локальный рекламный носитель</p>
          </div>
          <div className="concept__body">
            <div className="concept__col">
              <h3>Концепция</h3>
              <p>
                Технология превращается из карты в локальный рекламный носитель. Человек
                получает полезную информацию, а бизнес рядом — рекламный контакт.
              </p>
              <ul className="callouts">
                <li>Кофе — 5 минут пешком →</li>
                <li>Бургерная — 8 минут →</li>
                <li>Аптека — 3 минуты →</li>
                <li>Пекарня — 4 минуты →</li>
              </ul>
            </div>
            <div className="concept__col">
              <h3>Проблема бизнеса</h3>
              <p>
                Локальному бизнесу сложно конкурировать за внимание человека, который уже
                находится рядом. Кофейня может быть в 200 метрах от клиента — но клиент
                её не видит, не знает о ней и не понимает, куда идти.
              </p>
              <p className="callout-quote">
                Бизнес физически рядом, но не существует в поле внимания клиента.
              </p>
            </div>
            <div className="concept__col">
              <h3>Целевая аудитория</h3>
              <p>Малый локальный бизнес: парикмахерские, кофейни, пекарни, магазины у дома.</p>
              <p className="pricing-tag">Бумажная карта — 1 990 ₽ за заказ</p>
            </div>
          </div>
          <div className="channels">
            <h3>Каналы продвижения</h3>
            <div className="channels__grid">
              <div>
                <p className="channels__label">Прямые продажи бизнесу</p>
                <p>
                  «Мы размещаем вас на карте, которую ежедневно используют люди в радиусе
                  X км».
                </p>
              </div>
              <div>
                <p className="channels__label">Партнёрства</p>
                <p>ТЦ, БЦ, отели, ЖК, коворкинги.</p>
              </div>
            </div>
          </div>
          <MarketBar
            tam="≈ 5,5 млрд ₽"
            sam="≈ 2,2 млрд ₽"
            som="≈ 110 млн ₽/год"
            samPct={40}
            somPct={2}
          />
        </section>

        <section className="concept concept--live reveal" id="concept-d">
          <div className="concept__head">
            <p className="eyebrow">Продукт 4</p>
            <h2>Интеграция с towiki</h2>
            <p className="concept__tag">Монетизация через рекламные агентства — уже работает</p>
          </div>
          <div className="concept__body">
            <div className="concept__col">
              <h3>Проблема</h3>
              <p>
                Краеведческий контент towiki не монетизирован и почти не имеет
                дистрибуции — он спрятан в отдельной вики, хотя карта — самый естественный
                интерфейс для такого контента. Рекламным агентствам негде размещать
                контекстную локальную рекламу.
              </p>
            </div>
            <div className="concept__col">
              <h3>Решение</h3>
              <p>
                Слой сопоставления геоданных OSM с краеведческой вики — то, что уже
                реализовано на узнаюдорогу.рф: интерактивная карта с историей каждой
                улицы и местом под контекстную рекламу агентств.
              </p>
            </div>
            <div className="concept__col">
              <h3>Статус</h3>
              <p>
                В отличие от остальных трёх — это не гипотеза, а готовый работающий
                прототип. Рынок ещё в оценке, но продукт уже можно открыть и потрогать.
              </p>
              <a className="btn btn--primary btn--small" href={TOOL_URL}>
                Открыть узнаюдорогу.рф →
              </a>
            </div>
          </div>
        </section>

        <section className="compare reveal">
          <p className="eyebrow">Сравнение</p>
          <h2>Где деньги, а где — доказанный продукт</h2>
          <div className="compare__table">
            <div className="compare__row compare__row--head">
              <span>Продукт</span>
              <span>TAM</span>
              <span>SAM</span>
              <span>SOM</span>
            </div>
            <div className="compare__row">
              <span>Карта нашей истории</span>
              <span>3 млрд ₽</span>
              <span>1,5 млрд ₽</span>
              <span>75 млн ₽</span>
            </div>
            <div className="compare__row">
              <span>Event Maps</span>
              <span>1 млрд ₽</span>
              <span>300 млн ₽</span>
              <span>5 млн ₽/год</span>
            </div>
            <div className="compare__row">
              <span>Реклама на местности</span>
              <span>5,5 млрд ₽</span>
              <span>2,2 млрд ₽</span>
              <span>110 млн ₽/год</span>
            </div>
            <div className="compare__row compare__row--live">
              <span>Интеграция с towiki</span>
              <span className="compare__live-badge">✓ Готовый продукт — рынок в оценке</span>
            </div>
          </div>
        </section>

        <section className="cta reveal">
          <h2>Технология уже работает.</h2>
          <p>Четыре продукта — гипотезы поверх неё. Начните с того, что уже готово.</p>
          <a className="btn btn--primary" href={TOOL_URL}>
            Открыть узнаюдорогу.рф →
          </a>
        </section>
      </main>

      <footer className="landing__footer">
        <span>узнаюдорогу.рф</span>
        <a href={TOOL_URL}>Открыть инструмент →</a>
      </footer>
    </div>
  );
}

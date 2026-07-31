import { useMemo, useState } from 'react';

const ALL_TAG = 'all';
const ALL_CATEGORY = 'all';

const languages = [
  { id: 'zh', label: '中文' },
  { id: 'en', label: 'EN' },
];

const ui = {
  zh: {
    mainNav: '主要分頁',
    contentFilter: '內容篩選',
    categories: '分類',
    categoryTabs: '分類頁籤',
    tag: 'Tag',
    country: '國籍',
    items: '筆',
    language: '語言',
    imageAlt: '圖片',
    copied: '已複製',
    copyTable: '複製表格',
    example: '小例子',
    actions: {
      borrow: '前往借閱',
      version: '查看版本',
      series: '查看影集',
      movie: '查看電影',
    },
  },
  en: {
    mainNav: 'Main sections',
    contentFilter: 'Content filters',
    categories: 'Categories',
    categoryTabs: 'Category tabs',
    tag: 'Tag',
    country: 'Country',
    items: 'items',
    language: 'Language',
    imageAlt: 'image',
    copied: 'Copied',
    copyTable: 'Copy table',
    example: 'Example',
    actions: {
      borrow: 'Open library page',
      version: 'View edition',
      series: 'View series',
      movie: 'View movie',
    },
  },
};

const sectionTabs = [
  { id: 'books', label: { zh: '個人愛書', en: 'Favorite Books' } },
  { id: 'series', label: { zh: '推薦影集', en: 'Series Picks' } },
  { id: 'movies', label: { zh: '推薦電影', en: 'Movie Picks' } },
  { id: 'notes', label: { zh: '學習筆記', en: 'Learning Notes' } },
];

const categoryTabs = {
  books: [
    { id: ALL_CATEGORY, label: { zh: '全部', en: 'All' } },
    { id: 'picture-book', label: { zh: '繪本', en: 'Picture Books' } },
    { id: 'classic-literature', label: { zh: '經典文學', en: 'Classics' } },
    { id: 'modern-literature', label: { zh: '現代文學', en: 'Modern Literature' } },
    { id: 'fantasy', label: { zh: '奇幻', en: 'Fantasy' } },
  ],
  series: [{ id: ALL_CATEGORY, label: { zh: '全部', en: 'All' } }],
  movies: [{ id: ALL_CATEGORY, label: { zh: '全部', en: 'All' } }],
};

const tagLabels = {
  all: { zh: '全部', en: 'All' },
  adventure: { zh: '冒險', en: 'Adventure' },
  animals: { zh: '動物', en: 'Animals' },
  comingOfAge: { zh: '成長', en: 'Coming of Age' },
  creativity: { zh: '創作', en: 'Creativity' },
  dailyLife: { zh: '生活練習', en: 'Daily Life' },
  emotionalEducation: { zh: '情緒教育', en: 'Emotional Learning' },
  fantasy: { zh: '奇幻', en: 'Fantasy' },
  friendship: { zh: '友情', en: 'Friendship' },
  games: { zh: '遊戲', en: 'Games' },
  imagination: { zh: '想像力', en: 'Imagination' },
  indianMythology: { zh: '印度神話', en: 'Indian Mythology' },
  literaryAdaptation: { zh: '文學改編', en: 'Literary Adaptation' },
  magic: { zh: '魔幻', en: 'Magic' },
  marriageClass: { zh: '婚姻與階級', en: 'Marriage and Class' },
  modernClassic: { zh: '現代經典', en: 'Modern Classic' },
  modernLiterature: { zh: '現代文學', en: 'Modern Literature' },
  motherDaughter: { zh: '母女', en: 'Mother-Daughter' },
  movie: { zh: '電影', en: 'Movie' },
  musical: { zh: '音樂劇', en: 'Musical' },
  mystery: { zh: '懸疑', en: 'Mystery' },
  raceJustice: { zh: '種族與正義', en: 'Race and Justice' },
  readAloud: { zh: '親子共讀', en: 'Read-Aloud' },
  romance: { zh: '愛情', en: 'Romance' },
  romcom: { zh: '愛情喜劇', en: 'Romantic Comedy' },
  sitcom: { zh: '情境喜劇', en: 'Sitcom' },
  socialComedy: { zh: '社交喜劇', en: 'Comedy of Manners' },
  socialIssues: { zh: '社會議題', en: 'Social Issues' },
  teenDrama: { zh: '青春劇', en: 'Teen Drama' },
  smallTown: { zh: '小鎮', en: 'Small Town' },
  trauma: { zh: '創傷', en: 'Trauma' },
};

const collectionItems = [
  {
    id: 'angry-cat-yoga',
    section: 'books',
    category: 'picture-book',
    title: { zh: '生氣的貓咪做瑜伽', en: 'Angry Cat Does Yoga' },
    creator: { zh: '哿希文 圖；陳靜宜 譯', en: 'Illustrated by Gexiwen; translated by Chen Jingyi' },
    publisher: '小角落文化',
    country: { zh: '台灣出版', en: 'Taiwan edition' },
    tags: ['emotionalEducation', 'animals', 'readAloud'],
    image:
      'https://webcdn2.ebook.hyread.com.tw/bookcover/485545978626782404720260504030247.jpg',
    url: 'https://tycccgov.ebook.hyread.com.tw/bookDetail.jsp?id=485545',
    action: 'borrow',
  },
  {
    id: 'perfect-day-plan',
    section: 'books',
    category: 'picture-book',
    title: { zh: '完美的一日計畫', en: 'A Perfect Day Plan' },
    creator: { zh: '朴謐 作繪；陳怡妡 譯', en: 'Written and illustrated by Park Mi; translated by Chen Yixin' },
    publisher: '小魯文化',
    country: { zh: '台灣出版', en: 'Taiwan edition' },
    tags: ['dailyLife', 'imagination', 'readAloud'],
    image:
      'https://webcdn2.ebook.hyread.com.tw/bookcover/456718978626763202420252426030607.jpg',
    url: 'https://tycccgov.ebook.hyread.com.tw/bookDetail.jsp?id=456718',
    action: 'borrow',
  },
  {
    id: 'emma',
    section: 'books',
    category: 'classic-literature',
    rank: 1,
    title: 'Emma',
    creator: 'Jane Austen',
    publisher: 'Penguin Classics',
    country: { zh: '英國', en: 'United Kingdom' },
    tags: ['socialComedy', 'marriageClass'],
    image: 'https://images.penguinrandomhouse.com/cover/9780141439587',
    url: 'https://www.penguinrandomhouse.com/books/292282/emma-by-jane-austen/',
    action: 'version',
  },
  {
    id: 'to-kill-a-mockingbird',
    section: 'books',
    category: 'modern-literature',
    rank: 1,
    title: 'To Kill a Mockingbird',
    creator: 'Harper Lee',
    publisher: '65th Anniversary Edition',
    country: { zh: '美國', en: 'United States' },
    tags: ['modernClassic', 'socialIssues', 'raceJustice'],
    image: 'https://covers.shakespeareandcompany.com/97800995/9780099549482.jpg',
    url: 'https://www.shakespeareandcompany.com/books/to-kill-a-mockingbird-3',
    action: 'version',
  },
  {
    id: 'a-little-life',
    section: 'books',
    category: 'modern-literature',
    title: 'A Little Life',
    creator: 'Hanya Yanagihara',
    publisher: 'Anchor',
    country: { zh: '美國', en: 'United States' },
    tags: ['modernLiterature', 'socialIssues', 'friendship', 'trauma'],
    image: 'https://images.penguinrandomhouse.com/cover/9780804172707',
    url: 'https://www.penguinrandomhouse.com/books/235759/a-little-life-by-hanya-yanagihara/',
    action: 'version',
  },
  {
    id: 'tomorrow-and-tomorrow-and-tomorrow',
    section: 'books',
    category: 'modern-literature',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    creator: 'Gabrielle Zevin',
    publisher: 'Knopf',
    country: { zh: '美國', en: 'United States' },
    tags: ['modernLiterature', 'games', 'friendship', 'creativity'],
    image: 'https://images.penguinrandomhouse.com/cover/9780593321201',
    url: 'https://www.penguinrandomhouse.com/books/612683/tomorrow-and-tomorrow-and-tomorrow-by-gabrielle-zevin/',
    action: 'version',
  },
  {
    id: 'the-night-circus',
    section: 'books',
    category: 'fantasy',
    title: 'The Night Circus',
    creator: 'Erin Morgenstern',
    publisher: 'Anchor',
    country: { zh: '美國', en: 'United States' },
    tags: ['fantasy', 'magic', 'romance'],
    image: 'https://images.penguinrandomhouse.com/cover/9780307744432',
    url: 'https://www.penguinrandomhouse.com/books/309296/the-night-circus-by-erin-morgenstern/',
    action: 'version',
  },
  {
    id: 'tigers-curse',
    section: 'books',
    category: 'fantasy',
    title: { zh: '白虎之咒', en: "Tiger's Curse" },
    creator: 'Colleen Houck',
    publisher: 'Splinter',
    country: { zh: '美國', en: 'United States' },
    tags: ['fantasy', 'adventure', 'romance', 'indianMythology'],
    image: 'https://images.penguinrandomhouse.com/cover/9781454902492',
    url: 'https://www.penguinrandomhouse.com/books/218584/tigers-curse-by-colleen-houck/',
    action: 'version',
  },
  {
    id: 'anne-with-an-e',
    section: 'series',
    category: 'series',
    rank: 1,
    title: 'Anne With an E',
    creator: 'Moira Walley-Beckett',
    publisher: 'CBC / Netflix',
    country: { zh: '加拿大 / 美國', en: 'Canada / United States' },
    tags: ['comingOfAge', 'literaryAdaptation', 'socialIssues'],
    image: 'https://upload.wikimedia.org/wikipedia/en/7/79/Anne_TV_series_intertitle.png',
    url: 'https://www.netflix.com/title/80136311',
    action: 'series',
  },
  {
    id: 'how-i-met-your-mother',
    section: 'series',
    category: 'series',
    rank: 2,
    title: 'How I Met Your Mother',
    creator: 'Carter Bays / Craig Thomas',
    publisher: 'CBS',
    country: { zh: '美國', en: 'United States' },
    tags: ['sitcom', 'friendship', 'romance'],
    image: 'https://artworks.thetvdb.com/banners/posters/75760-34.jpg',
    url: 'https://www.hulu.com/series/how-i-met-your-mother',
    action: 'series',
  },
  {
    id: 'ginny-and-georgia',
    section: 'series',
    category: 'series',
    rank: 3,
    title: 'Ginny & Georgia',
    creator: 'Sarah Lampert',
    publisher: 'Netflix',
    country: { zh: '美國', en: 'United States' },
    tags: ['teenDrama', 'motherDaughter', 'comingOfAge', 'socialIssues', 'mystery'],
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Ginny_%26_Georgia_title_card.png/1280px-Ginny_%26_Georgia_title_card.png',
    url: 'https://www.netflix.com/title/81025696',
    action: 'series',
  },
  {
    id: 'gilmore-girls',
    section: 'series',
    category: 'series',
    rank: 4,
    title: 'Gilmore Girls',
    creator: 'Amy Sherman-Palladino',
    publisher: 'The WB / The CW',
    country: { zh: '美國', en: 'United States' },
    tags: ['motherDaughter', 'smallTown', 'comingOfAge'],
    image: 'https://media.themoviedb.org/t/p/w500/gwtzCwU2wdLLf8oejQu2TINiWfQ.jpg',
    url: 'https://www.hulu.com/series/gilmore-girls',
    action: 'series',
  },
  {
    id: 'gossip-girl',
    section: 'series',
    category: 'series',
    rank: 5,
    title: 'Gossip Girl',
    creator: 'Josh Schwartz / Stephanie Savage',
    publisher: 'The CW',
    country: { zh: '美國', en: 'United States' },
    tags: ['teenDrama', 'romance', 'mystery'],
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Gossip_girl_titlecard.svg/1280px-Gossip_girl_titlecard.svg.png',
    url: 'https://www.max.com/shows/gossip-girl/8bb99a7e-1007-4b88-9782-9fcd2bb08f17',
    action: 'series',
  },
  {
    id: 'mamma-mia',
    section: 'movies',
    category: 'movies',
    rank: 1,
    title: 'MAMMA MIA!',
    creator: 'Phyllida Lloyd',
    publisher: 'Universal Pictures',
    country: { zh: '美國 / 英國', en: 'United States / United Kingdom' },
    tags: ['movie', 'musical', 'romcom'],
    image: 'https://upload.wikimedia.org/wikipedia/en/9/95/Mamma_Mia_%282008%29_US_poster.jpg',
    url: 'https://www.universalpictures.com/movies/mamma-mia',
    action: 'movie',
  },
];

const learningNotes = [
  {
    id: 'expand-story',
    title: { zh: '放大故事的技巧', en: 'Story Expansion Techniques' },
    summary: {
      zh: '把產品、生活事件或人生轉折拆成可觀察的格子，找出亮點、意外、衝突與適合場景，讓故事更容易被記住。',
      en: 'Break products, life events, and turning points into observable grids to find highlights, surprises, conflict, and use cases.',
    },
    tables: [
      {
        id: 'story-product-fit',
        title: { zh: '表 3A：把產品特色轉成故事', en: 'Table 3A: Turn Features into Story' },
        columns: ['我想到的故事是', '亮點特色是', '普遍特色是', '我賣的產品是'],
        rows: [
          ['去男友家做一道菜的上班族女性故事', '為客人的煩惱找到最適合的書', '種類繁多的書', '書店裡的書'],
          ['', '', '', ''],
        ],
        example:
          '如果產品是「書店裡的書」，不要只說種類很多；把它放進「店長幫客人找到最適合的書」這種具體場景。',
      },
      {
        id: 'competitive-position',
        title: { zh: '表 4：找出有與細', en: 'Table 4: What You Have and What You Do in Detail' },
        columns: ['我的角色是', '人無我有的是', '人有我細的是'],
        rows: [
          ['澎湖旅遊業者', '在地路線與即時天候判斷', '花火節、浮潛、社區導覽的細節安排'],
          ['', '', ''],
        ],
        example: '先列出大家沒有但你有的資源，再把大家都有的服務寫到更細，故事就會有差異。',
      },
      {
        id: 'daily-surprise',
        title: { zh: '表 5A / 5B：生活處處有驚喜', en: 'Table 5A / 5B: Surprise in Daily Life' },
        columns: ['尋找日常故事', '意料之內', '意料之外'],
        rows: [
          ['自己', '吃一個便當十五至三十分鐘', '吃一個便當九十秒'],
          ['自己', '早餐吃一個御飯糰', '早餐吃了十個以上的品項'],
        ],
        example: '日常事件只要出現「跟預期不一樣」的地方，就可能成為故事切入點。',
      },
      {
        id: 'key-moments',
        title: { zh: '表 6A：每個關鍵時刻的故事不只一個', en: 'Table 6A: Key Moments Create Many Stories' },
        columns: ['角色', '低潮時刻', '堅持時刻', '逆境時刻'],
        rows: [
          [
            '每天在不同單位授課的講師',
            '講師生涯剛開始，沒人邀約的時刻',
            '不分寒暑，不論平日假日，每天晨讀六十分鐘的時刻',
            '第一次進行企業授課，因為太緊張而全身晃動的時刻',
          ],
        ],
        example: '同一個角色不要只寫成功，可以從低潮、堅持、逆境拆出三種故事。',
      },
      {
        id: 'quick-story-note',
        title: { zh: '表 7：隨手記錄，就能信手拈來', en: 'Table 7: Capture Stories as They Happen' },
        columns: ['故事摘要', '故事重點'],
        rows: [
          ['會議中聽到一個讓大家突然安靜的問題', '真正重要的問題，常常比答案更能推動討論'],
          ['', ''],
        ],
        example: '先記摘要，再記它能提醒你的重點；以後寫文章或簡報就能快速取用。',
      },
      {
        id: 'life-turning-points',
        title: { zh: '表 10A：有系統地整理生命故事', en: 'Table 10A: Organize Life Stories by Stage' },
        columns: ['欄位', '國小階段', '國中階段', '高中階段', '大學階段', '社會新鮮人階段', '結婚階段', '生孩子階段'],
        rows: [
          ['轉折點', '小三轉學', '手被踢骨折', '書包不見', '女生的拒絕', '襯衫鈕扣', '離婚證書', '打翻飲料'],
          ['故事名稱', '二百分的社會科', '打掃時間', '高三的意外', '第一次聯誼', '第一次讀書會', '錄音婚姻', '一本書的肚量'],
          ['故事放大', '讚美的力量', '交友的真諦', '堅持的力量', '找到優勢', '練習的重要', '溝通的重要', '情緒管理'],
          ['適合場合', '', '', '', '', '', '', ''],
        ],
        example: '先照人生階段列出轉折點，再為每個轉折補上故事名稱、放大角度與適合使用的場合。',
      },
    ],
  },
];

function localize(value, language) {
  if (typeof value === 'string') {
    return value;
  }

  return value[language] ?? value.zh;
}

function toMarkdownTable(table) {
  const header = `| ${table.columns.join(' | ')} |`;
  const divider = `| ${table.columns.map(() => '---').join(' | ')} |`;
  const rows = table.rows.map((row) => `| ${row.join(' | ')} |`);

  return [table.title.zh, '', header, divider, ...rows, '', `例子：${table.example}`].join('\n');
}

function App() {
  const [language, setLanguage] = useState('zh');
  const [activeSection, setActiveSection] = useState('books');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [activeTag, setActiveTag] = useState(ALL_TAG);
  const [copiedTableId, setCopiedTableId] = useState('');

  const copy = ui[language];
  const activeSectionLabel = localize(
    sectionTabs.find((section) => section.id === activeSection)?.label ?? { zh: '收藏', en: 'Collection' },
    language,
  );
  const activeCategories = categoryTabs[activeSection] ?? [];
  const shouldShowCategories = activeCategories.length > 1;
  const isCollectionSection = activeSection !== 'notes';

  const sectionItems = useMemo(() => {
    return collectionItems.filter((item) => item.section === activeSection);
  }, [activeSection]);

  const categoryItems = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) {
      return sectionItems;
    }

    return sectionItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, sectionItems]);

  const availableTags = useMemo(() => {
    const tags = categoryItems.flatMap((item) => item.tags);
    return [ALL_TAG, ...Array.from(new Set(tags))];
  }, [categoryItems]);

  const visibleItems = useMemo(() => {
    return categoryItems
      .filter((item) => activeTag === ALL_TAG || item.tags.includes(activeTag))
      .sort(
        (a, b) =>
          (a.rank ?? 99) - (b.rank ?? 99) ||
          localize(a.title, language).localeCompare(localize(b.title, language)),
      );
  }, [activeTag, categoryItems, language]);

  const activeCategoryLabel = localize(
    activeCategories.find((category) => category.id === activeCategory)?.label ?? {
      zh: activeSectionLabel,
      en: activeSectionLabel,
    },
    language,
  );
  const shouldShowRank = activeSection !== 'books' || activeCategory !== ALL_CATEGORY;

  function changeSection(sectionId) {
    setActiveSection(sectionId);
    setActiveCategory(ALL_CATEGORY);
    setActiveTag(ALL_TAG);
    setCopiedTableId('');
  }

  function changeCategory(categoryId) {
    setActiveCategory(categoryId);
    setActiveTag(ALL_TAG);
  }

  async function copyLearningTable(table) {
    await navigator.clipboard.writeText(toMarkdownTable(table));
    setCopiedTableId(table.id);
  }

  return (
    <main className="site-shell">
      <header className="masthead">
        <h1>LexizReads</h1>
        <div className="language-switch" aria-label={copy.language}>
          {languages.map((option) => (
            <button
              className={language === option.id ? 'is-active' : ''}
              key={option.id}
              type="button"
              aria-pressed={language === option.id}
              onClick={() => setLanguage(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <nav className="primary-tabs" aria-label={copy.mainNav}>
        {sectionTabs.map((tab) => (
          <button
            className={`tab-button ${activeSection === tab.id ? 'is-active' : ''}`}
            type="button"
            key={tab.id}
            aria-pressed={activeSection === tab.id}
            onClick={() => changeSection(tab.id)}
          >
            {localize(tab.label, language)}
          </button>
        ))}
      </nav>

      {isCollectionSection ? (
        <section className="collection-layout" aria-labelledby="collection-heading">
          <aside className="filters" aria-label={copy.contentFilter}>
            {shouldShowCategories && (
              <div className="filter-group">
                <h2 id="collection-heading">{copy.categories}</h2>
                <div className="filter-options" role="tablist" aria-label={copy.categoryTabs}>
                  {activeCategories.map((category) => (
                    <button
                      key={category.id}
                      className={`filter-tab ${activeCategory === category.id ? 'is-active' : ''}`}
                      type="button"
                      aria-selected={activeCategory === category.id}
                      role="tab"
                      onClick={() => changeCategory(category.id)}
                    >
                      {localize(category.label, language)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="filter-group">
              <p className="filter-title">{copy.tag}</p>
              <div className="tag-list">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-button ${activeTag === tag ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={activeTag === tag}
                    onClick={() => setActiveTag(tag)}
                  >
                    {localize(tagLabels[tag], language)}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="collection-section" aria-label={`${activeSectionLabel} list`}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  {activeSectionLabel}
                  {shouldShowCategories ? ` / ${activeCategoryLabel}` : ''}
                </p>
                <h2>
                  {activeTag === ALL_TAG ? activeCategoryLabel : localize(tagLabels[activeTag], language)}
                </h2>
              </div>
              <span>
                {visibleItems.length} {copy.items}
              </span>
            </div>

            <div className="item-grid">
              {visibleItems.map((item) => {
                const title = localize(item.title, language);

                return (
                  <article className="item-card" key={item.id}>
                    <a className="cover-link" href={item.url} target="_blank" rel="noreferrer">
                      {shouldShowRank && item.rank && <span className="rank-badge">No. {item.rank}</span>}
                      <img src={item.image} alt={`${title} ${copy.imageAlt}`} />
                    </a>
                    <div className="item-card__body">
                      <div>
                        <h3>{title}</h3>
                        <p>{localize(item.creator, language)}</p>
                        <p>{localize(item.publisher, language)}</p>
                        <p className="country">
                          {copy.country}: {localize(item.country, language)}
                        </p>
                      </div>
                      <div className="item-card__tags" aria-label={`${title} ${copy.tag}`}>
                        {item.tags.map((tag) => (
                          <span key={tag}>{localize(tagLabels[tag], language)}</span>
                        ))}
                      </div>
                      <a className="item-card__link" href={item.url} target="_blank" rel="noreferrer">
                        {copy.actions[item.action]}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      ) : (
        <section className="learning-section" aria-label={activeSectionLabel}>
          {learningNotes.map((note) => (
            <article className="learning-note" key={note.id}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{activeSectionLabel}</p>
                  <h2>{localize(note.title, language)}</h2>
                </div>
              </div>
              <p className="learning-summary">{localize(note.summary, language)}</p>

              <div className="learning-table-grid">
                {note.tables.map((table) => (
                  <section className="learning-table-panel" key={table.id}>
                    <div className="learning-table-header">
                      <h3>{localize(table.title, language)}</h3>
                      <button type="button" onClick={() => copyLearningTable(table)}>
                        {copiedTableId === table.id ? copy.copied : copy.copyTable}
                      </button>
                    </div>

                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            {table.columns.map((column) => (
                              <th key={column}>{column}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, rowIndex) => (
                            <tr key={`${table.id}-${rowIndex}`}>
                              {row.map((cell, cellIndex) => (
                                <td key={`${table.id}-${rowIndex}-${cellIndex}`}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="learning-example">
                      <strong>{copy.example}:</strong> {table.example}
                    </p>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;

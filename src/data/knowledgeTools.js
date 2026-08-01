export const knowledgeCategories = [
  {
    id: 'all',
    label: { zh: '全部工具', en: 'All tools' },
    description: { zh: '所有可立即複製使用的知識工具。', en: 'Every knowledge tool ready to copy and use.' },
  },
  {
    id: 'habit-building',
    label: { zh: '建立習慣', en: 'Build habits' },
    description: { zh: '把想做的事縮小成容易開始的行動。', en: 'Make a desired behavior easier to begin.' },
  },
  {
    id: 'procrastination',
    label: { zh: '改善拖延', en: 'Improve procrastination' },
    description: { zh: '看見時間與啟動阻力，重新安排下一步。', en: 'See time and activation friction, then choose a next step.' },
  },
  {
    id: 'inner-friction',
    label: { zh: '降低內耗', en: 'Reduce inner friction' },
    description: { zh: '為反覆拉扯與情緒整理保留一個入口。', en: 'A future home for tools that ease rumination and emotional friction.' },
  },
  {
    id: 'creative-expression',
    label: { zh: '創作與表達', en: 'Create and communicate' },
    description: { zh: '把事件、產品與人生經驗轉成可說的故事。', en: 'Turn events, products, and life experiences into memorable stories.' },
  },
];

const storyTables = [
  {
    id: 'story-product-fit',
    type: 'table',
    title: { zh: '表 3A：把產品特色轉成故事', en: 'Table 3A: Turn Features into Story' },
    columns: ['我想到的故事是', '亮點特色是', '普遍特色是', '我賣的產品是'],
    rows: [
      ['去男友家做一道菜的上班族女性故事', '為客人的煩惱找到最適合的書', '種類繁多的書', '書店裡的書'],
      ['', '', '', ''],
    ],
    example: '如果產品是「書店裡的書」，不要只說種類很多；把它放進「店長幫客人找到最適合的書」這種具體場景。',
  },
  {
    id: 'competitive-position',
    type: 'table',
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
    type: 'table',
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
    type: 'table',
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
    type: 'table',
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
    type: 'table',
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
];

export const knowledgeTools = [
  {
    id: 'two-minute-starter',
    categoryId: 'habit-building',
    title: { zh: '兩分鐘啟動器', en: 'Two-Minute Starter' },
    summary: {
      zh: '把想建立的行為縮成兩分鐘內能開始的入口，先練習出現，而不是逼自己一次做到完整。',
      en: 'Shrink a desired behavior into a gateway that takes under two minutes to begin. Practice showing up before demanding a full session.',
    },
    purpose: {
      zh: '適合卡在「知道該做、卻一直沒開始」的時候。你會帶走一個低阻力入口與一個明確的開始情境。',
      en: 'Use this when you know what to do but keep delaying the start. Leave with a low-friction gateway and a clear starting context.',
    },
    duration: { zh: '約 5 分鐘', en: 'About 5 minutes' },
    tags: [
      { id: 'start-small', label: { zh: '從小開始', en: 'Start small' } },
      { id: 'activation', label: { zh: '降低啟動阻力', en: 'Lower activation friction' } },
    ],
    blocks: [
      {
        id: 'two-minute-steps',
        type: 'steps',
        title: { zh: '怎麼使用', en: 'How to use it' },
        items: [
          { zh: '選一件你想穩定做、但常常拖到最後的事。', en: 'Choose one thing you want to do consistently but often postpone.' },
          { zh: '把它縮成兩分鐘內可完成的第一個入口動作。', en: 'Shrink it to a first gateway action that can be completed in under two minutes.' },
          { zh: '指定一個容易出現的開始情境，例如完成早餐後或打開電腦時。', en: 'Name a start context you already encounter, such as after breakfast or when opening your computer.' },
          { zh: '完成入口後可以繼續，也可以停止；目標是讓開始變得可靠。', en: 'After the gateway, you may continue or stop. The goal is to make starting reliable.' },
        ],
      },
      {
        id: 'two-minute-template',
        type: 'table',
        title: { zh: '我的兩分鐘啟動表', en: 'My two-minute starter' },
        columns: [
          { zh: '我想建立的行為', en: 'Behavior I want to build' },
          { zh: '兩分鐘入口', en: 'Two-minute gateway' },
          { zh: '開始情境', en: 'Start context' },
          { zh: '完成入口後可選的下一步', en: 'Optional next step' },
        ],
        rows: [
          [{ zh: '', en: '' }, { zh: '', en: '' }, { zh: '', en: '' }, { zh: '', en: '' }],
        ],
        example: {
          zh: '想養成閱讀習慣時，入口可以是「睡前把書打開並讀一段」；讀完後要不要繼續，都算完成今天的開始。',
          en: 'For a reading habit, the gateway can be “open the book and read one short passage before bed.” Continuing is optional; the start still counts.',
        },
      },
    ],
    sources: [
      {
        title: { zh: 'How to Stop Procrastinating by Using the “2-Minute Rule”', en: 'How to Stop Procrastinating by Using the “2-Minute Rule”' },
        author: { zh: 'James Clear', en: 'James Clear' },
        type: { zh: '文章', en: 'Article' },
        note: {
          zh: '本工具以公開概念重新整理為非官方空白模板；未轉載原文、官方範例或下載資源。',
          en: 'This is an unofficial blank template reorganized from the public concept; it does not reproduce the article, its examples, or downloadable resources.',
        },
        url: 'https://jamesclear.com/how-to-stop-procrastinating',
      },
    ],
  },
  {
    id: 'life-in-weeks',
    categoryId: 'procrastination',
    title: { zh: '人生週格', en: 'Life in Weeks' },
    summary: {
      zh: '把生命時間視覺化成一週一格，讓抽象的「以後再說」變成可以重新安排的下一週。',
      en: 'Visualize life as one cell per week so an abstract “someday” becomes a next week you can deliberately shape.',
    },
    purpose: {
      zh: '適合想重新看待長期目標、優先順序或沒有截止日的拖延。它是反思工具，不是壽命預測，也不保證能解決拖延。',
      en: 'Use it to revisit long-term goals, priorities, or procrastination without a deadline. It is a reflection tool, not a life prediction or a guaranteed cure for procrastination.',
    },
    duration: { zh: '約 10 分鐘', en: 'About 10 minutes' },
    tags: [
      { id: 'time-awareness', label: { zh: '時間覺察', en: 'Time awareness' } },
      { id: 'reflection', label: { zh: '反思', en: 'Reflection' } },
    ],
    blocks: [
      {
        id: 'life-weeks-grid',
        type: 'life-weeks',
        title: { zh: '我的人生週格', en: 'My life-week grid' },
        description: {
          zh: '輸入生日與目標年齡後，以每年 52 格的概念性週格顯示目前位置。這是視覺化估算，每格約為一週，不是精準週曆。',
          en: 'Enter a birth date and target age to map your current position onto a conceptual 52-cell year grid. This is a visual estimate: each cell is about a week, not an exact calendar week.',
        },
        reflectionPrompt: {
          zh: '我想讓接下來這一週，往哪一件真正重視的事靠近？',
          en: 'What matters enough that I want the coming week to move a little closer to it?',
        },
      },
    ],
    sources: [
      {
        title: { zh: 'Your Life in Weeks', en: 'Your Life in Weeks' },
        author: { zh: 'Tim Urban', en: 'Tim Urban' },
        type: { zh: '文章', en: 'Article' },
        note: {
          zh: '靈感來源為 90 年、每年 52 格的 Life Calendar 概念；本頁使用原創介面與說明。',
          en: 'Inspiration for the 90-year, 52-cells-per-year Life Calendar concept; this page uses original interface and explanatory text.',
        },
        url: 'https://waitbutwhy.com/2014/05/life-weeks.html',
      },
      {
        title: { zh: 'Inside the mind of a master procrastinator', en: 'Inside the mind of a master procrastinator' },
        author: { zh: 'Tim Urban / TED', en: 'Tim Urban / TED' },
        type: { zh: '演講', en: 'Talk' },
        note: {
          zh: '用於理解沒有截止日的長期拖延脈絡，不作為醫療或成效保證。',
          en: 'Included for the context of long-term procrastination without a deadline; it is not medical advice or an efficacy guarantee.',
        },
        url: 'https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator',
      },
    ],
  },
  {
    id: 'story-expansion',
    categoryId: 'creative-expression',
    title: { zh: '放大故事的技巧', en: 'Story Expansion Techniques' },
    summary: {
      zh: '把產品、生活事件或人生轉折拆成可觀察的格子，找出亮點、意外、衝突與適合場景，讓故事更容易被記住。',
      en: 'Break products, life events, and turning points into observable grids to find highlights, surprises, conflict, and use cases.',
    },
    purpose: {
      zh: '適合需要整理故事素材、找出差異化或讓個人經驗更具體的時候。',
      en: 'Use it when gathering story material, finding differentiation, or making a personal experience more concrete.',
    },
    duration: { zh: '依題目而定', en: 'Varies by prompt' },
    tags: [
      { id: 'storytelling', label: { zh: '故事', en: 'Storytelling' } },
      { id: 'writing', label: { zh: '寫作', en: 'Writing' } },
    ],
    blocks: storyTables,
    sources: [],
  },
];

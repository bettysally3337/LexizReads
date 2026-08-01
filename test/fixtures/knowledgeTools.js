export const sampleTool = {
  id: 'sample-tool',
  title: { zh: '測試工具', en: 'Sample Tool' },
  summary: { zh: '測試摘要', en: 'Sample summary' },
  purpose: { zh: '測試用途', en: 'Sample purpose' },
  blocks: [
    {
      id: 'steps',
      type: 'steps',
      title: { zh: '步驟', en: 'Steps' },
      items: [
        { zh: '先觀察', en: 'Observe first' },
        { zh: '再行動', en: 'Then act' },
      ],
    },
    {
      id: 'table',
      type: 'table',
      title: { zh: '模板', en: 'Template' },
      columns: [{ zh: '欄|位', en: 'Column|name' }],
      rows: [[{ zh: '第一行\n第二行', en: 'First\nSecond' }]],
      example: { zh: '中文例子', en: 'English example' },
    },
  ],
  sources: [
    {
      title: { zh: '來源文章', en: 'Source article' },
      author: { zh: '作者', en: 'Author' },
      type: { zh: '文章', en: 'Article' },
      note: { zh: '改寫說明', en: 'Adapted note' },
      url: 'https://example.com/source',
    },
  ],
};

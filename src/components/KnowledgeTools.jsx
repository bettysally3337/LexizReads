import { useEffect, useMemo, useRef, useState } from 'react';

import { knowledgeCategories, knowledgeTools } from '../data/knowledgeTools.js';
import {
  calculateLifeWeeks,
  getToolHash,
  getToolIdFromHash,
  localize,
  tableToHtml,
  toMarkdownTable,
  toolToHtml,
  toolToMarkdown,
} from '../lib/knowledgeTools.js';

const ALL_CATEGORY = 'all';

const toolUi = {
  zh: {
    library: '知識工具庫',
    categories: '想解決的事',
    tools: '個工具',
    noTools: '這個分類的工具正在整理中。',
    openTool: '開啟工具',
    back: '返回工具庫',
    purpose: '這個工具的用途',
    howToUse: '怎麼使用',
    sources: '參考來源',
    sourcePending: '這個既有筆記的原始來源尚待補齊，暫不推定出處。',
    duration: '使用時間',
    copyTool: '複製整份工具',
    copyTemplate: '複製空白模板',
    copyTable: '複製此表格',
    copied: '已複製，可直接貼到 Notion。',
    copyFailed: '目前無法存取剪貼簿，請確認瀏覽器權限後重試。',
    privacyTitle: '隱私說明',
    privacy: '生日與目標年齡只在目前頁面即時計算；不會寫入網址、Cookie、localStorage 或任何伺服器。重新整理頁面後即清除。',
    birthDate: '生日',
    targetAge: '目標年齡',
    targetAgeHint: '1–120 歲，預設 90',
    gridTitle: '週格位置',
    emptyGrid: '輸入生日後會在此顯示週格。',
    invalidDate: '請輸入有效的生日與 1 至 120 的目標年齡。',
    futureBirth: '生日不能晚於今天。',
    goalReached: '已到達設定的目標年齡；週格以全部填滿呈現。',
    completed: '已走過',
    remaining: '視覺上剩餘',
    approxWeeks: '約剩餘',
    visualCells: '格',
    weeks: '週',
    gridLegend: '深色為已走過的視覺格，淺色為尚未填滿的格。每一列代表一年、每列 52 格；這是概念性估算，不是精準週曆或壽命預測。',
    copyResult: '複製目前結果',
    copyGrid: '複製週格 PNG',
    downloadGrid: '下載週格 PNG',
    gridCopied: '週格 PNG 已複製，可直接貼到 Notion。',
    gridDownloaded: '週格 PNG 已下載。',
    gridCopyFailed: '此瀏覽器無法複製圖片；可改用下載 PNG。',
    copiedTemplate: '空白模板已複製，可直接貼到 Notion。',
    currentResultNeeded: '請先輸入生日，才能複製目前的週格結果。',
  },
  en: {
    library: 'Knowledge Tools',
    categories: 'What you want to work on',
    tools: 'tools',
    noTools: 'Tools for this category are being collected.',
    openTool: 'Open tool',
    back: 'Back to tools',
    purpose: 'Purpose',
    howToUse: 'How to use it',
    sources: 'Sources',
    sourcePending: 'The original source for this existing note still needs to be added; no source is inferred.',
    duration: 'Time to use',
    copyTool: 'Copy full tool',
    copyTemplate: 'Copy blank template',
    copyTable: 'Copy this table',
    copied: 'Copied. You can paste it into Notion.',
    copyFailed: 'Clipboard access is unavailable. Check browser permission and try again.',
    privacyTitle: 'Privacy',
    privacy: 'Your birth date and target age are calculated only in this page. They are not written to the URL, cookies, localStorage, or any server, and disappear on refresh.',
    birthDate: 'Birth date',
    targetAge: 'Target age',
    targetAgeHint: '1–120, default 90',
    gridTitle: 'Life-grid position',
    emptyGrid: 'Enter a birth date to display the grid.',
    invalidDate: 'Enter a valid birth date and a target age from 1 to 120.',
    futureBirth: 'Your birth date cannot be in the future.',
    goalReached: 'You have reached the chosen target age; the grid is shown as fully filled.',
    completed: 'Visual cells elapsed',
    remaining: 'Visual cells remaining',
    approxWeeks: 'Approx. weeks remaining',
    visualCells: 'cells',
    weeks: 'weeks',
    gridLegend: 'Dark cells show visual cells elapsed and light cells are unfilled. Each row is one year with 52 cells; this is a conceptual estimate, not an exact calendar or life prediction.',
    copyResult: 'Copy current result',
    copyGrid: 'Copy grid PNG',
    downloadGrid: 'Download grid PNG',
    gridCopied: 'Life-grid PNG copied. You can paste it into Notion.',
    gridDownloaded: 'Life-grid PNG downloaded.',
    gridCopyFailed: 'This browser cannot copy images. Download the PNG instead.',
    copiedTemplate: 'Blank template copied. You can paste it into Notion.',
    currentResultNeeded: 'Enter a birth date before copying the current life-grid result.',
  },
};

async function writeToClipboard(markdown, html) {
  if (window.ClipboardItem && navigator.clipboard?.write) {
    try {
      const clipboardItem = new window.ClipboardItem({
        'text/plain': new Blob([markdown], { type: 'text/plain' }),
        'text/html': new Blob([html], { type: 'text/html' }),
      });
      await navigator.clipboard.write([clipboardItem]);
      return;
    } catch {
      // Some browsers expose ClipboardItem but reject rich clipboard writes.
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(markdown);
    return;
  }

  throw new Error('Clipboard is unavailable');
}

function drawLifeGrid(result, language) {
  const columns = 52;
  const cellWidth = 12;
  const cellHeight = 10;
  const labelWidth = 42;
  const top = 48;
  const width = labelWidth + columns * cellWidth + 24;
  const height = top + result.targetAge * cellHeight + 32;
  const pixelRatio = 2;
  const canvas = document.createElement('canvas');
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is unavailable');
  }

  context.scale(pixelRatio, pixelRatio);
  context.fillStyle = '#fffdf9';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#202124';
  context.font = '700 16px sans-serif';
  context.fillText(language === 'zh' ? '人生週格' : 'Life in Weeks', 12, 25);
  context.font = '11px sans-serif';
  context.fillStyle = '#60636b';
  context.fillText(language === 'zh' ? '每列一年，每列 52 格（概念性估算）' : 'One row per year, 52 cells each (conceptual estimate)', 12, 41);

  for (let row = 0; row < result.targetAge; row += 1) {
    if (row % 5 === 0) {
      context.fillStyle = '#60636b';
      context.font = '9px sans-serif';
      context.fillText(String(row), 10, top + row * cellHeight + 8);
    }

    for (let column = 0; column < columns; column += 1) {
      const cellIndex = row * columns + column;
      context.fillStyle = cellIndex < result.filledCells ? '#8a5f2d' : '#e4e2dc';
      context.fillRect(labelWidth + column * cellWidth, top + row * cellHeight, cellWidth - 2, cellHeight - 2);
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Unable to create image'));
      }
    }, 'image/png');
  });
}

function ToolLibrary({ activeCategory, language, onCategoryChange, onToolOpen }) {
  const copy = toolUi[language];
  const visibleTools = knowledgeTools.filter(
    (tool) => activeCategory === ALL_CATEGORY || tool.categoryId === activeCategory,
  );

  return (
    <section className="tools-layout" aria-labelledby="tools-heading">
      <aside className="tools-filters" aria-label={copy.categories}>
        <h2>{copy.categories}</h2>
        <div className="tool-category-list">
          {knowledgeCategories.map((category) => (
            <button
              key={category.id}
              className={`filter-tab ${activeCategory === category.id ? 'is-active' : ''}`}
              type="button"
              aria-pressed={activeCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
            >
              {localize(category.label, language)}
            </button>
          ))}
        </div>
      </aside>

      <section className="tool-library">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.library}</p>
            <h2 id="tools-heading">{localize(knowledgeCategories.find((item) => item.id === activeCategory)?.label, language)}</h2>
          </div>
          <span>
            {visibleTools.length} {copy.tools}
          </span>
        </div>
        <p className="tool-category-description">
          {localize(knowledgeCategories.find((item) => item.id === activeCategory)?.description, language)}
        </p>

        {visibleTools.length === 0 ? (
          <p className="tool-empty-state">{copy.noTools}</p>
        ) : (
          <div className="tool-card-grid">
            {visibleTools.map((tool) => (
              <article className="tool-card" key={tool.id}>
                <p className="tool-card__category">
                  {localize(knowledgeCategories.find((category) => category.id === tool.categoryId)?.label, language)}
                </p>
                <h3>{localize(tool.title, language)}</h3>
                <p>{localize(tool.summary, language)}</p>
                <div className="tool-tag-list" aria-label={`${localize(tool.title, language)} tags`}>
                  {tool.tags.map((tag) => (
                    <span key={tag.id}>{localize(tag.label, language)}</span>
                  ))}
                </div>
                <div className="tool-card__footer">
                  <span>{localize(tool.duration, language)}</span>
                  <button type="button" onClick={() => onToolOpen(tool.id)}>
                    {copy.openTool}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function TableBlock({ block, language, onCopy }) {
  const copy = toolUi[language];

  return (
    <section className="learning-table-panel" key={block.id}>
      <div className="learning-table-header">
        <h3>{localize(block.title, language)}</h3>
        <button type="button" onClick={() => onCopy(block)}>
          {copy.copyTable}
        </button>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {block.columns.map((column, index) => (
                <th key={`${block.id}-column-${index}`}>{localize(column, language)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${block.id}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${block.id}-${rowIndex}-${cellIndex}`}>{localize(cell, language)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="learning-example">
        <strong>{language === 'zh' ? '小例子' : 'Example'}:</strong> {localize(block.example, language)}
      </p>
    </section>
  );
}

function LifeWeeksBlock({ block, language, onCopyResult, onCopyTemplate, onStatusChange }) {
  const copy = toolUi[language];
  const [birthDate, setBirthDate] = useState('');
  const [targetAge, setTargetAge] = useState('90');
  const result = useMemo(
    () => calculateLifeWeeks({ birthDate, targetAge }),
    [birthDate, targetAge],
  );

  async function copyGridImage() {
    if (result.status !== 'ready' && result.status !== 'goal-reached') {
      onStatusChange(copy.currentResultNeeded, 'error');
      return;
    }

    try {
      const image = await drawLifeGrid(result, language);
      if (!window.ClipboardItem || !navigator.clipboard?.write) {
        throw new Error('Image clipboard is unavailable');
      }
      await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': image })]);
      onStatusChange(copy.gridCopied, 'success');
    } catch {
      onStatusChange(copy.gridCopyFailed, 'error');
    }
  }

  async function downloadGridImage() {
    if (result.status !== 'ready' && result.status !== 'goal-reached') {
      onStatusChange(copy.currentResultNeeded, 'error');
      return;
    }

    try {
      const image = await drawLifeGrid(result, language);
      const objectUrl = URL.createObjectURL(image);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'life-in-weeks.png';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
      onStatusChange(copy.gridDownloaded, 'success');
    } catch {
      onStatusChange(copy.gridCopyFailed, 'error');
    }
  }

  const isReady = result.status === 'ready' || result.status === 'goal-reached';

  return (
    <section className="life-weeks-panel" aria-labelledby={block.id}>
      <div className="tool-block-heading">
        <div>
          <p className="eyebrow">{copy.gridTitle}</p>
          <h3 id={block.id}>{localize(block.title, language)}</h3>
        </div>
        <button type="button" className="tool-button tool-button--secondary" onClick={onCopyTemplate}>
          {copy.copyTemplate}
        </button>
      </div>
      <p>{localize(block.description, language)}</p>
      <p className="privacy-notice">
        <strong>{copy.privacyTitle}：</strong> {copy.privacy}
      </p>

      <div className="life-weeks-inputs">
        <label>
          <span>{copy.birthDate}</span>
          <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
        </label>
        <label>
          <span>{copy.targetAge}</span>
          <input
            type="number"
            min="1"
            max="120"
            value={targetAge}
            onChange={(event) => setTargetAge(event.target.value)}
          />
          <small>{copy.targetAgeHint}</small>
        </label>
      </div>

      {result.status === 'empty' && <p className="tool-notice">{copy.emptyGrid}</p>}
      {result.status === 'invalid' && <p className="tool-notice tool-notice--error">{copy.invalidDate}</p>}
      {result.status === 'future-birth' && <p className="tool-notice tool-notice--error">{copy.futureBirth}</p>}
      {result.status === 'goal-reached' && <p className="tool-notice">{copy.goalReached}</p>}

      {isReady && (
        <>
          <div className="life-stat-list">
            <span>
              <strong>{copy.completed}</strong>
              {result.filledCells} / {result.totalCells} {copy.visualCells}
            </span>
            <span>
              <strong>{copy.remaining}</strong>
              {result.remainingCells} {copy.visualCells}
            </span>
            <span>
              <strong>{copy.approxWeeks}</strong>
              {result.remainingApproxWeeks} {copy.weeks}
            </span>
          </div>

          <div className="life-grid-scroll">
            <div className="life-grid" aria-label={copy.gridLegend}>
              {Array.from({ length: result.targetAge }, (_, row) => (
                <div className="life-grid__row" key={row}>
                  <span>{row}</span>
                  <div className="life-grid__cells" aria-hidden="true">
                    {Array.from({ length: 52 }, (_, column) => {
                      const cellIndex = row * 52 + column;
                      return <i className={cellIndex < result.filledCells ? 'is-filled' : ''} key={cellIndex} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="life-grid-legend">{copy.gridLegend}</p>
          <div className="tool-action-row">
            <button type="button" className="tool-button" onClick={() => onCopyResult(result)}>
              {copy.copyResult}
            </button>
            <button type="button" className="tool-button tool-button--secondary" onClick={copyGridImage}>
              {copy.copyGrid}
            </button>
            <button type="button" className="tool-button tool-button--secondary" onClick={downloadGridImage}>
              {copy.downloadGrid}
            </button>
          </div>
        </>
      )}
      <p className="learning-example">
        <strong>{language === 'zh' ? '反思題' : 'Reflection'}:</strong> {localize(block.reflectionPrompt, language)}
      </p>
    </section>
  );
}

function ToolDetail({ tool, language, onBack }) {
  const copy = toolUi[language];
  const [copyStatus, setCopyStatus] = useState(null);
  const statusTimeout = useRef();

  useEffect(
    () => () => {
      window.clearTimeout(statusTimeout.current);
    },
    [],
  );

  function showStatus(message, type) {
    setCopyStatus({ message, type });
    window.clearTimeout(statusTimeout.current);
    statusTimeout.current = window.setTimeout(() => setCopyStatus(null), 3000);
  }

  async function copyText(markdown, html, successMessage = copy.copied) {
    try {
      await writeToClipboard(markdown, html);
      showStatus(successMessage, 'success');
    } catch {
      showStatus(copy.copyFailed, 'error');
    }
  }

  function copyTable(block) {
    const markdown = toMarkdownTable(block, language);
    return copyText(markdown, tableToHtml(block, language));
  }

  function copyWholeTool(lifeWeeks) {
    return copyText(toolToMarkdown(tool, language, lifeWeeks), toolToHtml(tool, language, lifeWeeks));
  }

  function copyLifeTemplate() {
    return copyText(toolToMarkdown(tool, language), toolToHtml(tool, language), copy.copiedTemplate);
  }

  return (
    <section className="tool-detail" aria-labelledby="tool-title">
      <button type="button" className="back-button" onClick={onBack}>
        ← {copy.back}
      </button>
      <div className="tool-detail__header">
        <div>
          <p className="eyebrow">
            {localize(knowledgeCategories.find((category) => category.id === tool.categoryId)?.label, language)}
          </p>
          <h2 id="tool-title">{localize(tool.title, language)}</h2>
          <p className="tool-detail__summary">{localize(tool.summary, language)}</p>
        </div>
        <button type="button" className="tool-button" onClick={() => copyWholeTool()}>
          {copy.copyTool}
        </button>
      </div>

      <div className="tool-meta-row">
        <span>
          <strong>{copy.duration}:</strong> {localize(tool.duration, language)}
        </span>
        <div className="tool-tag-list">
          {tool.tags.map((tag) => (
            <span key={tag.id}>{localize(tag.label, language)}</span>
          ))}
        </div>
      </div>

      {copyStatus && (
        <p className={`copy-status copy-status--${copyStatus.type}`} role="status" aria-live="polite">
          {copyStatus.message}
        </p>
      )}

      <section className="tool-purpose">
        <h3>{copy.purpose}</h3>
        <p>{localize(tool.purpose, language)}</p>
      </section>

      {tool.blocks.some((block) => block.type === 'steps') && (
        <section className="tool-steps">
          <h3>{copy.howToUse}</h3>
          {tool.blocks
            .filter((block) => block.type === 'steps')
            .map((block) => (
              <ol key={block.id}>
                {block.items.map((item, index) => (
                  <li key={`${block.id}-${index}`}>{localize(item, language)}</li>
                ))}
              </ol>
            ))}
        </section>
      )}

      <div className="learning-table-grid">
        {tool.blocks
          .filter((block) => block.type === 'table')
          .map((block) => (
            <TableBlock block={block} language={language} key={block.id} onCopy={copyTable} />
          ))}
      </div>

      {tool.blocks
        .filter((block) => block.type === 'life-weeks')
        .map((block) => (
          <LifeWeeksBlock
            block={block}
            key={block.id}
            language={language}
            onCopyResult={(result) => copyWholeTool(result)}
            onCopyTemplate={copyLifeTemplate}
            onStatusChange={showStatus}
          />
        ))}

      <section className="tool-sources">
        <h3>{copy.sources}</h3>
        {tool.sources.length === 0 ? (
          <p>{copy.sourcePending}</p>
        ) : (
          <ul>
            {tool.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {localize(source.title, language)}
                </a>
                <span> · {localize(source.author, language)} · {localize(source.type, language)}</span>
                <p>{localize(source.note, language)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

export default function KnowledgeTools({ language }) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [selectedToolId, setSelectedToolId] = useState(() => getToolIdFromHash(window.location.hash));
  const selectedTool = knowledgeTools.find((tool) => tool.id === selectedToolId);

  useEffect(() => {
    function syncToolFromHash() {
      setSelectedToolId(getToolIdFromHash(window.location.hash));
    }

    window.addEventListener('hashchange', syncToolFromHash);
    return () => window.removeEventListener('hashchange', syncToolFromHash);
  }, []);

  function openTool(toolId) {
    window.location.hash = getToolHash(toolId);
  }

  function returnToLibrary() {
    window.location.hash = getToolHash();
  }

  return selectedTool ? (
    <ToolDetail tool={selectedTool} language={language} onBack={returnToLibrary} />
  ) : (
    <ToolLibrary
      activeCategory={activeCategory}
      language={language}
      onCategoryChange={setActiveCategory}
      onToolOpen={openTool}
    />
  );
}

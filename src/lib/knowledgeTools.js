const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function localize(value, language) {
  if (typeof value === 'string') {
    return value;
  }

  return value?.[language] ?? value?.zh ?? '';
}

export function escapeMarkdownCell(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br>');
}

export function toMarkdownTable(block, language) {
  const columns = block.columns.map((column) => localize(column, language));
  const header = `| ${columns.map(escapeMarkdownCell).join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const rows = block.rows.map((row) =>
    `| ${row.map((cell) => escapeMarkdownCell(localize(cell, language))).join(' | ')} |`,
  );

  return [
    `## ${localize(block.title, language)}`,
    '',
    header,
    divider,
    ...rows,
    '',
    `**${language === 'zh' ? '小例子' : 'Example'}：** ${localize(block.example, language)}`,
  ].join('\n');
}

function toDateOnlyUtc(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return timestamp;
}

function addWholeYearsUtc(timestamp, years) {
  const start = new Date(timestamp);
  const targetYear = start.getUTCFullYear() + years;
  const month = start.getUTCMonth();
  const day = start.getUTCDate();
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, month + 1, 0)).getUTCDate();

  return Date.UTC(targetYear, month, Math.min(day, lastDayOfTargetMonth));
}

export function calculateLifeWeeks({ birthDate, targetAge, today = new Date() }) {
  const birthTimestamp = parseDateOnly(birthDate);
  const numericTargetAge = Number(targetAge);

  if (!birthDate) {
    return { status: 'empty' };
  }

  if (!birthTimestamp || !Number.isInteger(numericTargetAge) || numericTargetAge < 1 || numericTargetAge > 120) {
    return { status: 'invalid' };
  }

  const todayTimestamp = toDateOnlyUtc(today);

  if (birthTimestamp > todayTimestamp) {
    return { status: 'future-birth' };
  }

  const goalTimestamp = addWholeYearsUtc(birthTimestamp, numericTargetAge);
  const totalDays = Math.max(1, Math.round((goalTimestamp - birthTimestamp) / DAY_IN_MS));
  const elapsedDays = Math.min(totalDays, Math.max(0, Math.floor((todayTimestamp - birthTimestamp) / DAY_IN_MS)));
  const totalCells = numericTargetAge * 52;
  const filledCells = Math.min(totalCells, Math.floor((elapsedDays / totalDays) * totalCells));
  const remainingDays = totalDays - elapsedDays;

  return {
    status: elapsedDays >= totalDays ? 'goal-reached' : 'ready',
    targetAge: numericTargetAge,
    totalCells,
    filledCells,
    remainingCells: totalCells - filledCells,
    elapsedDays,
    remainingDays,
    remainingApproxWeeks: Math.ceil(remainingDays / 7),
  };
}

function getStepsMarkdown(block, language) {
  return [
    `## ${localize(block.title, language)}`,
    '',
    ...block.items.map((item, index) => `${index + 1}. ${localize(item, language)}`),
  ].join('\n');
}

function getLifeWeeksMarkdown(block, language, lifeWeeks) {
  const labels = language === 'zh'
    ? {
        calculation: '目前週格計算',
        target: '目標年齡',
        completed: '已走過格數',
        remaining: '剩餘視覺格數',
        approxWeeks: '約剩餘週數',
        privacy: '出生日期只用於此頁即時計算，未寫入複製內容。',
      }
    : {
        calculation: 'Current life-grid calculation',
        target: 'Target age',
        completed: 'Filled visual cells',
        remaining: 'Remaining visual cells',
        approxWeeks: 'Approximate weeks remaining',
        privacy: 'Your birth date is used only in this page and is not included in copied content.',
      };

  const template = [
    `## ${localize(block.title, language)}`,
    '',
    localize(block.description, language),
    '',
    `- ${localize(block.reflectionPrompt, language)}`,
  ];

  if (lifeWeeks?.status !== 'ready' && lifeWeeks?.status !== 'goal-reached') {
    return template.join('\n');
  }

  return [
    ...template,
    '',
    `### ${labels.calculation}`,
    '',
    `- ${labels.target}: ${lifeWeeks.targetAge}`,
    `- ${labels.completed}: ${lifeWeeks.filledCells} / ${lifeWeeks.totalCells}`,
    `- ${labels.remaining}: ${lifeWeeks.remainingCells}`,
    `- ${labels.approxWeeks}: ${lifeWeeks.remainingApproxWeeks}`,
    `- ${labels.privacy}`,
  ].join('\n');
}

export function toolToMarkdown(tool, language, lifeWeeks) {
  const labels = language === 'zh'
    ? { purpose: '這個工具的用途', sources: '參考來源', pending: '來源待補' }
    : { purpose: 'Purpose', sources: 'Sources', pending: 'Source pending' };
  const sections = [
    `# ${localize(tool.title, language)}`,
    '',
    localize(tool.summary, language),
    '',
    `## ${labels.purpose}`,
    '',
    localize(tool.purpose, language),
  ];

  tool.blocks.forEach((block) => {
    if (block.type === 'steps') {
      sections.push('', getStepsMarkdown(block, language));
    }

    if (block.type === 'table') {
      sections.push('', toMarkdownTable(block, language));
    }

    if (block.type === 'life-weeks') {
      sections.push('', getLifeWeeksMarkdown(block, language, lifeWeeks));
    }
  });

  sections.push('', `## ${labels.sources}`, '');

  if (tool.sources.length === 0) {
    sections.push(labels.pending);
  } else {
    tool.sources.forEach((source) => {
      const details = [
        localize(source.author, language),
        localize(source.type, language),
        localize(source.note, language),
      ]
        .filter(Boolean)
        .join('｜');
      sections.push(`- [${localize(source.title, language)}](${source.url})${details ? ` — ${details}` : ''}`);
    });
  }

  return sections.join('\n');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function tableToHtml(block, language) {
  const header = block.columns
    .map((column) => `<th>${escapeHtml(localize(column, language))}</th>`)
    .join('');
  const rows = block.rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${escapeHtml(localize(cell, language)).replace(/\r?\n/g, '<br>')}</td>`)
          .join('')}</tr>`,
    )
    .join('');
  const exampleLabel = language === 'zh' ? '小例子' : 'Example';

  return [
    `<h2>${escapeHtml(localize(block.title, language))}</h2>`,
    `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`,
    `<p><strong>${exampleLabel}:</strong> ${escapeHtml(localize(block.example, language))}</p>`,
  ].join('');
}

export function toolToHtml(tool, language, lifeWeeks) {
  const labels = language === 'zh'
    ? { purpose: '這個工具的用途', sources: '參考來源', pending: '來源待補', example: '小例子' }
    : { purpose: 'Purpose', sources: 'Sources', pending: 'Source pending', example: 'Example' };
  const sections = [
    `<h1>${escapeHtml(localize(tool.title, language))}</h1>`,
    `<p>${escapeHtml(localize(tool.summary, language))}</p>`,
    `<h2>${labels.purpose}</h2>`,
    `<p>${escapeHtml(localize(tool.purpose, language))}</p>`,
  ];

  tool.blocks.forEach((block) => {
    if (block.type === 'steps') {
      sections.push(
        `<h2>${escapeHtml(localize(block.title, language))}</h2>`,
        `<ol>${block.items.map((item) => `<li>${escapeHtml(localize(item, language))}</li>`).join('')}</ol>`,
      );
    }

    if (block.type === 'table') {
      sections.push(tableToHtml(block, language));
    }

    if (block.type === 'life-weeks') {
      sections.push(
        `<h2>${escapeHtml(localize(block.title, language))}</h2>`,
        `<p>${escapeHtml(localize(block.description, language))}</p>`,
        `<p><strong>${language === 'zh' ? '反思題' : 'Reflection'}:</strong> ${escapeHtml(localize(block.reflectionPrompt, language))}</p>`,
      );

      if (lifeWeeks?.status === 'ready' || lifeWeeks?.status === 'goal-reached') {
        const stats = language === 'zh'
          ? [
              `目標年齡：${lifeWeeks.targetAge}`,
              `已走過格數：${lifeWeeks.filledCells} / ${lifeWeeks.totalCells}`,
              `視覺上剩餘格數：${lifeWeeks.remainingCells}`,
              `約剩餘週數：${lifeWeeks.remainingApproxWeeks}`,
            ]
          : [
              `Target age: ${lifeWeeks.targetAge}`,
              `Filled visual cells: ${lifeWeeks.filledCells} / ${lifeWeeks.totalCells}`,
              `Remaining visual cells: ${lifeWeeks.remainingCells}`,
              `Approximate weeks remaining: ${lifeWeeks.remainingApproxWeeks}`,
            ];
        sections.push(`<ul>${stats.map((stat) => `<li>${stat}</li>`).join('')}</ul>`);
      }
    }
  });

  sections.push(`<h2>${labels.sources}</h2>`);

  if (tool.sources.length === 0) {
    sections.push(`<p>${labels.pending}</p>`);
  } else {
    const sources = tool.sources.map((source) => {
      const title = escapeHtml(localize(source.title, language));
      const author = escapeHtml(localize(source.author, language));
      const type = escapeHtml(localize(source.type, language));
      const note = escapeHtml(localize(source.note, language));
      const url = escapeHtml(source.url);
      return `<li><a href="${url}">${title}</a> — ${author}｜${type}<br>${note}</li>`;
    });
    sections.push(`<ul>${sources.join('')}</ul>`);
  }

  return sections.join('');
}

export function getToolIdFromHash(hash) {
  const match = /^#tools\/([a-z0-9-]+)$/.exec(hash ?? '');
  return match?.[1] ?? '';
}

export function getToolHash(toolId) {
  return toolId ? `#tools/${toolId}` : '#tools';
}

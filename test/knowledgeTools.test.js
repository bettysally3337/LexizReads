import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateLifeWeeks,
  getToolHash,
  getToolIdFromHash,
  toolToHtml,
  toolToMarkdown,
} from '../src/lib/knowledgeTools.js';
import { sampleTool } from './fixtures/knowledgeTools.js';

test('toolToMarkdown localizes content and escapes Markdown table cells', () => {
  const markdown = toolToMarkdown(sampleTool, 'en');

  assert.match(markdown, /# Sample Tool/);
  assert.match(markdown, /\| Column\\\|name \|/);
  assert.match(markdown, /First<br>Second/);
  assert.match(markdown, /\[Source article\]\(https:\/\/example\.com\/source\)/);
});

test('toolToHtml produces semantic tables and linked sources for rich clipboard targets', () => {
  const html = toolToHtml(sampleTool, 'en');

  assert.match(html, /<table>/);
  assert.match(html, /<td>First<br>Second<\/td>/);
  assert.match(html, /<a href="https:\/\/example\.com\/source">Source article<\/a>/);
});

test('calculateLifeWeeks uses a configurable 52-cell year and date-only values', () => {
  const result = calculateLifeWeeks({
    birthDate: '2000-02-29',
    targetAge: 90,
    today: new Date(2045, 1, 28),
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.totalCells, 4680);
  assert.ok(result.filledCells > 0);
  assert.ok(result.remainingApproxWeeks > 0);
});

test('calculateLifeWeeks rejects future birth dates and accepts goal-reached dates', () => {
  const futureResult = calculateLifeWeeks({
    birthDate: '2040-01-01',
    targetAge: 90,
    today: new Date(2030, 0, 1),
  });
  const completedResult = calculateLifeWeeks({
    birthDate: '1900-01-01',
    targetAge: 90,
    today: new Date(2020, 0, 1),
  });

  assert.equal(futureResult.status, 'future-birth');
  assert.equal(completedResult.status, 'goal-reached');
  assert.equal(completedResult.filledCells, completedResult.totalCells);
});

test('tool hash helpers only accept supported tool paths', () => {
  assert.equal(getToolHash('life-in-weeks'), '#tools/life-in-weeks');
  assert.equal(getToolIdFromHash('#tools/life-in-weeks'), 'life-in-weeks');
  assert.equal(getToolIdFromHash('#books/life-in-weeks'), '');
});

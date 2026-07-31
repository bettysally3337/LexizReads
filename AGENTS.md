# LexizReads Agent Notes

## Project Shape

- This is a React + Vite + npm + Sass project.
- The user-facing project location is `D:\Project\LexizReads`.
- Keep the app as a lightweight static React site unless the user explicitly asks for backend features. A backend is not needed for the current personal collection/list use case.
- Main implementation files are `src/App.jsx` for data and UI logic, and `src/styles/main.scss` for styling.

## Collection Updates

- When the user asks to add a book, series, or movie, add it to `src/App.jsx` in `collectionItems`.
- Keep one shared data source for all languages. Do not duplicate separate Chinese and English item lists.
- Put new books into the closest existing category first. Add a new category only when no current category fits.
- Current book categories are picture books, classic literature, modern literature, and fantasy.
- If the user gives a Chinese title, translated title, alternate edition, or library version, identify the original work and use the original publication country for `country`.
- For series and movies, use the original production country/countries for `country`.
- Do not use the publication country of a translation, local library edition, ebook platform, or cover source as the work's country unless that is actually the original publication/production country.
- If the user names a rank for a new item and another item in the same section/category already has that rank, insert the new item at the requested rank and increment the conflicting item and every following ranked item by 1.
- If the user asks to add an item to the current last rank, assign the next number after the current highest rank in that same section/category.
- Ranking is scoped to the active section/category. Multiple book categories can each have their own No. 1.
- Do not show rank badges for `Favorite Books / All`; rank badges should appear for a specific book category or for ranked series/movie lists.
- Keep language support in sync. Add Chinese and English labels for UI text, categories, tags, item titles, countries, and action labels where applicable.
- Prefer stable direct image URLs that return a successful image response. Verify new image URLs before using them.
- If an image is broken in the browser, replace it with a stable direct image URL.

## Learning Notes Updates

- Store learning or knowledge pages in `src/App.jsx` under `learningNotes` unless the project grows enough to justify extracting data files.
- The learning notes section should preserve reusable tables from screenshots, books, or notes as editable HTML tables.
- Each learning table should provide a copy button that copies a Markdown table plus the nearby example.
- When the user provides learning screenshots, extract the reusable framework first, then add a compact example beside or below the table.
- Keep learning notes available through the main `Learning Notes` / `學習筆記` tab.
- Keep Chinese and English UI labels in sync for the learning notes page. The captured source table content may remain Chinese when it comes from Chinese learning material.

## Classification Notes

- `MAMMA MIA!` is a movie, not a series. Keep it under movie picks.
- `Emma` belongs under classic literature.
- `To Kill a Mockingbird` belongs under modern literature / modern classic, and should keep a social issues tag.
- `A Little Life` and `Tomorrow, and Tomorrow, and Tomorrow` belong under modern literature.
- `The Night Circus` and `Tiger's Curse` / `白虎之咒` belong under fantasy.
- `Anne With an E` should keep a social issues tag.

## UI Rules

- The masthead should show the large `LexizReads` brand only. Do not re-add the old subtitle or intro copy.
- Main tabs are books, series picks, and movie picks.
- The books section can include an `All` category filter, but rank badges should be hidden there to avoid showing multiple No. 1 items together.
- Keep the language switch visible and ensure Chinese/English toggles update tabs, filters, tags, country labels, buttons, and localized titles.

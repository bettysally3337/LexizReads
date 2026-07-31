# LexizReads

React + Vite + Sass 的個人閱讀收藏網站。

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## 書籍資料

目前書籍資料先放在 `src/App.jsx` 的 `books` 陣列。之後若要新增「經典文學」、「奇幻」等分類，可以：

1. 在 `genreTabs` 新增或啟用分類。
2. 在 `books` 新增書籍，填入 `category` 與 `tags`。
3. 若資料量變大，再抽成 API 或 CMS。

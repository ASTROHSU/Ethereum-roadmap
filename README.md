# 以太坊升級：讀者痛點地圖

[English](README.en.md)

> 區塊勢・互動工具 — 用痛點對應以太坊升級藍圖（Strawmap），一眼看懂你的問題何時能被解決。

別管那些艱澀的技術名詞了！選擇你目前在使用區塊鏈時遇到的困擾，我們幫你對應以太坊未來的升級藍圖，看看每個痛點背後的解法與預計實現時間。

---

## 功能特色

- **分類導覽**：依「費用與速度」、「帳號與操作」、「隱私與資安」、「節點與去中心化」四大主題切換
- **痛點卡片**：點擊你的困擾，展開對應的以太坊解法說明
- **技術對照**：每個解法附上對應技術名詞（如帳戶抽象、PBS、Verkle Trees 等）與預計實現時間（ETA）
- **響應式介面**：適合桌面與手機瀏覽

## 技術棧

| 項目 | 說明 |
|------|------|
| 框架 | React 18 + Vite 5 |
| 樣式 | Tailwind CSS 3 |
| 圖示 | Lucide React |

## 專案結構

```
Ethereum-roadmap/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          # 入口
    ├── App.jsx           # 根元件
    ├── index.css         # 全域 Tailwind
    └── components/
        └── EthereumRoadmapUX.jsx   # 痛點地圖主元件與資料
```

## 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 本地開發

```bash
npm run dev
```

啟動後在瀏覽器開啟終端顯示的網址（通常為 `http://localhost:5173`）即可預覽。

### 建置與預覽

```bash
# 建置正式版
npm run build

# 預覽建置結果
npm run preview
```

建置產出位於 `dist/`，可部署至任意靜態託管（如 GitHub Pages、Vercel、Netlify）。

---

## 授權與出處

本互動工具與內容概念源自《區塊勢》，供讀者對照以太坊升級藍圖使用。  
程式碼可依專案需求自由使用與改動。

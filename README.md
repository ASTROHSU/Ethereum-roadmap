# 以太坊升級地圖 (Ethereum Roadmap UX)

[English](README.en.md)

> 由區塊勢 (Blocktrend) 維護的互動式網頁工具 — 用一般人聽得懂的語言，帶你了解以太坊升級了什麼、未來還有哪些計畫，以及能解決你的什麼問題。

以太坊官方的技術路線圖 (Strawmap) 通常充滿了艱澀的技術名詞。這個開源專案旨在作為一座橋樑，讓一般使用者也能透過直觀的「痛點卡片」與「視覺化時間軸」，輕鬆對應到背後的升級技術（如 Danksharding, Verkle Trees, Account Abstraction 等）。

---

## 功能特色

- **直覺的主題分類**：依「L2 碎片化」、「費用與速度」、「隱私與資安」等主題切換。
- **白話文痛點卡片**：點擊你的困擾，展開對應的以太坊解法與白話說明。
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

建置產出位於 `dist/`，可部署至任意靜態託管（如 Vercel、GitHub Pages、Netlify）。

### 部署至 Web3 (IPFS)

本專案的 `vite.config.js` 已經設定好相對路徑 (`base: './'`) 支援 IPFS 部署：
1. 先執行打包：`npm run build`
2. 透過 CLI 上傳至 IPFS：`npx thirdweb upload dist` 或手動將 `dist/` 資料夾上傳至 Pinata / Fleek 等服務。

---

## 開源協作與 AI 賦能

這是一個開放協作的開源專案。我們相信知識的傳遞能讓生態更強大。
本網站是在人類企劃設計與 **AI 開發助手** 的緊密合作下打造而成。我們鼓勵大家善用 AI 工具，一起探索、創造對社群有益的產品！

如果你對網站的 UI 有任何想法，或是想幫忙更新最新的升級進度，都非常歡迎直接開 PR 或 Issue！

## 授權與出處

本專案內容源自 [區塊勢 (Blocktrend)](https://www.blocktrend.today) 的內容策展。  
程式碼採開源授權，歡迎依個人或社群需求自由分叉與改動。

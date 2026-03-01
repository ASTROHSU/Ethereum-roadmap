# Ethereum Upgrade: Reader Pain Point Map

> Blocktrend · Interactive Tool — Map your pain points to Ethereum’s upgrade roadmap (Strawmap) and see when your issues will be addressed.

Skip the jargon. Pick the problems you run into when using the blockchain, and we’ll match them to Ethereum’s upcoming upgrades—including solutions and estimated timelines.

---

## Features

- **Category navigation**: Switch among four themes—**Fees & speed**, **Accounts & UX**, **Privacy & security**, and **Nodes & decentralization**
- **Pain point cards**: Tap a problem to expand the corresponding Ethereum solution
- **Tech reference**: Each solution lists related terms (e.g. Account Abstraction, PBS, Verkle Trees) and estimated time of arrival (ETA)
- **Responsive UI**: Works on desktop and mobile

## Tech Stack

| Item | Stack |
|------|--------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |

## Project Structure

```
Ethereum-roadmap/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          # Entry
    ├── App.jsx           # Root component
    ├── index.css         # Global Tailwind
    └── components/
        └── EthereumRoadmapUX.jsx   # Pain point map component & data
```

## Quick Start

### Requirements

- Node.js 18+
- npm or yarn

### Install dependencies

```bash
npm install
```

### Local development

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

### Build & preview

```bash
# Production build
npm run build

# Preview build output
npm run preview
```

Output goes to `dist/` and can be deployed to any static host (e.g. GitHub Pages, Vercel, Netlify).

---

## License & attribution

This interactive tool and its content concept are from **Blocktrend** (區塊勢), for mapping reader pain points to Ethereum’s upgrade roadmap.  
The code may be used and modified freely for your own projects.

---

[中文說明](README.md)

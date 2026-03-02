import React, { useState, useEffect } from 'react';
import VisualRoadmap from './VisualRoadmap';
import {
  Wallet,
  ShieldAlert,
  Zap,
  Server,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  X,
  Sun,
  Moon,
} from 'lucide-react';

// 以太坊官方升級階段
const officialRoadmapPhases = [
  {
    id: 'merge',
    name: 'The Merge',
    nameZh: '合併',
    short: 'PoW → PoS，共識層與執行層合一',
    status: 'completed',
    progress: 100,
    goals: [
      '✅ 從挖礦（PoW）切換為質押（PoS），能耗降低 99.95%',
      '✅ 共識層（信標鏈）與執行層合併完成',
      '✅ 奠定後續所有升級的架構基礎',
    ],
  },
  {
    id: 'surge',
    name: 'The Surge',
    nameZh: '擴容',
    short: '透過 L2 + 分片讓以太坊承載更多交易、更低費用',
    status: 'in_progress',
    progress: 45,
    goals: [
      '✅ EIP-4844 Blobs 上線（Dencun, 2024/3），L2 費用大降',
      '✅ Blob 空間加倍（Pectra / PeerDAS, 2025/5）',
      '🔄 ePBS 搭配 Block Access Lists（Glamsterdam）——此處針對「區塊容量擴大」這面向',
      '📋 Full Danksharding（長期目標，100,000+ TPS）',
    ],
  },
  {
    id: 'scourge',
    name: 'The Scourge',
    nameZh: '淨化',
    short: '解決 MEV 問題、質押集中化與經濟去中心化',
    status: 'in_progress',
    progress: 20,
    goals: [
      '🔄 ePBS（Glamsterdam）——此處針對「提議者 vs 打包者分離」，讓 MEV 提取額度透明、可預期',
      '🔄 DVT（分散式驗證者技術）持續推進',
      '📋 加密記憶體池（未來防 MEV 搶跑）',
      '📋 抑制流動性質押集中化（Lido / Coinbase 問題）',
    ],
  },
  {
    id: 'verge',
    name: 'The Verge',
    nameZh: '邊緣',
    short: '讓驗證以太坊不再需要大硬碟，手機也能跑節點',
    status: 'future',
    progress: 10,
    goals: [
      '🔄 Verkle Trees（取代 Merkle，大幅縮減儲存需求）進入 Hegotá',
      '📋 無狀態客戶端（不需同步整條鏈即可驗證區塊）',
      '📋 SNARK 驗證區塊（ZK 化 EVM，終極輕量化）',
    ],
  },
  {
    id: 'purge',
    name: 'The Purge',
    nameZh: '精簡',
    short: '清除歷史包袱，讓協議更簡單、更易維護',
    status: 'future',
    progress: 15,
    goals: [
      '✅ EIP-4444：節點不再強制儲存 1 年以上歷史資料',
      '📋 移除過時 OpCode 與複雜性（EOF / EVM 清理）',
      '📋 協議精簡，降低客戶端開發維護成本',
    ],
  },
  {
    id: 'splurge',
    name: 'The Splurge',
    nameZh: '雜項',
    short: '帳戶抽象、隱私、後量子安全等其餘重要改進',
    status: 'future',
    progress: 25,
    goals: [
      '✅ EIP-7702 帳戶抽象（Pectra, 2025/5 已上線）',
      '🔄 原生隱私（隱形地址、ZK 原生支援）',
      '📋 後量子密碼學（抵抗量子電腦攻擊）',
      '📋 EVM 升級（Gas 改革、新 OpCode）',
    ],
  },
];

const getSeverityLabel = (n) => {
  if (n <= 3) return '低';
  if (n <= 6) return '中';
  return '高';
};

const getSeverityColor = (n) => {
  if (n <= 3) return 'bg-emerald-400';
  if (n <= 6) return 'bg-amber-400';
  return 'bg-rose-500';
};

const maturityLabels = {
  Research: '研究階段',
  Draft: '草案',
  Spec: '規格',
  Testnet: '測試網',
  Mainnet: '主網已上線',
};
const confidenceLabels = { low: '不確定性高', medium: '中等', high: '較確定' };

const LAST_UPDATED = '2026-03-01';
const DATA_SOURCES = [
  {
    label: 'Strawmap（EF 官方技術路線圖）',
    desc: '由以太坊基金會 Protocol 團隊維護，專為研究者與開發者設計的技術路線圖。',
    url: 'https://strawmap.org/',
  },
  {
    label: 'Ethereum.org 升級歷史',
    desc: '歷年所有主網升級的詳細記錄，包含每次升級的 EIP 清單與上線時間。',
    url: 'https://ethereum.org/history',
  },
  {
    label: 'EIPs 官方資料庫',
    desc: '所有以太坊改進提案（EIP）的原始文件，想查閱具體規格的可在這裡找。',
    url: 'https://eips.ethereum.org/',
  },
  {
    label: 'Ethereum Foundation 部落格',
    desc: '各次升級發佈前後的官方公告與技術解說，內容最可信的一手資料。',
    url: 'https://blog.ethereum.org/',
  },
];


const RECENT_UPDATES =
  'Pectra 已於 2025/5 上線主網（EIP-7702 帳戶抽象、Blob 空間加倍）；Glamsterdam 現正 Devnet 測試中，預計 2026 上半年主網。';

const roadmapData = [
  {
    id: 'scale',
    title: '費用與速度',
    icon: <Zap className="w-6 h-6" />,
    topics: [
      {
        id: 'scale_l1',
        title: 'L1 手續費與吞吐',
        description: '主網 Gas 貴、容量有限，使用者被迫頻繁使用 L2 或忍受高成本。',
        severity: 5,
        items: [
          {
            id: 'p1',
            question: 'L1 手續費還是太貴了，但我又不想頻繁跨鏈到 L2，覺得好麻煩？',
            riskSummary:
              '高額手續費會排擠小額交易與新用戶，並讓 DeFi 操作成本不穩定，影響使用意願。',
            severity: 5,
            impact: 8,
            difficulty: 6,
            solution:
              '已有重大進展！2024 年 3 月的 Dencun 升級（EIP-4844）引入 Blob 資料，讓 L2 Rollup 費用瞬間降低了 10～100 倍。2025 年 5 月的 Pectra 升級再把 Blob 空間加倍（PeerDAS）。正在測試中的 Glamsterdam（預計 2026 上半年）將引入區塊級別訪問列表（EIP-7928）與 ePBS（EIP-7732），預計讓 L1 執行效率再大幅提升，Gas 費用進一步下降。',
            techTerms: ['EIP-4844 (Proto-Danksharding)', 'PeerDAS / EIP-7594', 'Block Access Lists (EIP-7928)', 'ePBS (EIP-7732)'],
            eta: 'Dencun ✅ 已完成 (2024/3)、Pectra ✅ 已完成 (2025/5)、Glamsterdam 🔄 預計 2026 上半年',
            maturity: 'Mainnet',
            confidence: 'high',
            links: [],
          },
        ],
      },
      {
        id: 'scale_l2',
        title: 'L2 碎片化與跨鏈麻煩',
        description: '多條 L2 造成資金割裂，橋接繁瑣、RPC 不同、Gas token 各異，體驗極差。',
        severity: 8,
        items: [
          {
            id: 'p6',
            question: '跨 L2 要橋接好麻煩，手續費搞不清楚，資產還常常被鎖在不同鏈上動彈不得？',
            riskSummary:
              '橋接合約是駭客重點攻擊目標，歷史上多次橋接被黑損失鉅大。跨鏈體驗差也讓新用戶卻步、流動性分散在各 L2 之間。',
            severity: 8,
            impact: 8,
            difficulty: 8,
            breakingNews: {
              date: '2026 年 1 月',
              summary: 'Vitalik 公開宣告：以 L2 為中心的路線圖已經「過時」。隨著 L1 自身快速擴容，L2 的主要賣點「便宜」將不再成立。L2 必須找到「擴容以外」的獨特定位，否則應該大方承認自己是獨立 L1。',
              links: [
                { label: '閱讀深入分析', url: 'https://www.blocktrend.today/p/758' },
                { label: 'Vitalik 原文', url: 'https://x.com/VitalikButerin/status/2018711006394843585' },
              ],
            },
            solution:
              '短期內，跨鏈架構依然在推進：ERC-7683 跨鏈訂單標準讓你只需說「我要把 A 鏈的 USDC 換到 B 鏈」，背後自動完成。Superchain、AggLayer 也讓旗下各 L2 免橋接溝通。但長期來看，如果 L1 的 gas fee 夠便宜，多數人根本不需要離開 L1。',
            techTerms: ['ERC-7683 (跨鏈訂單標準)', 'Intent-Based 架構', 'Superchain / AggLayer', '原生互通性 (Native Interop)'],
            eta: '生態層方案（Superchain、AggLayer）部分已上線；協議層原生互通性 2026-2027；長期：L1 擴容可能直接取代 L2 的角色',
            maturity: 'Testnet',
            confidence: 'medium',
            links: [],
          },

          {
            id: 'p7',
            question: '每換一條 L2 就要加新 RPC、用不同的 Gas 幣、甚至還要買原生代幣，根本沒辦法用？',
            riskSummary:
              '多鏈碎片化讓上手門檻極高，新用戶一旦搞錯鏈發錯幣基本就找不回來；也讓開發者難以設計跨鏈的無縫體驗。',
            severity: 7,
            impact: 7,
            difficulty: 7,
            solution:
              'EIP-7702（Pectra，2025/5 已上線）讓帳戶抽象成為可能——你可以用穩定幣（如 USDC）或任何代幣付 Gas，不需要持有各鏈的原生代幣。跨鏈地址標準化（跨鏈統一地址格式）和一鍵多鏈部署也在推進中，目標是讓切換 L2 像切換 Wi-Fi 一樣無感。',
            techTerms: ['EIP-7702 (帳戶抽象 / Paymaster)', '跨鏈統一地址', 'ERC-7683', '穩定幣付 Gas'],
            eta: 'Paymaster（穩定幣付 Gas）✅ Pectra 已上線；跨鏈地址統一 2026-2027',
            maturity: 'Mainnet',
            confidence: 'high',
            links: [],
          },
        ],
      },
    ],
  },
  {
    id: 'ux',
    title: '帳號與操作',
    icon: <Wallet className="w-6 h-6" />,
    topics: [
      {
        id: 'ux_onboard',
        title: '新手入門門檻',
        description: '從買幣到第一次用 DApp，每個步驟都可能讓新手放棄。',
        severity: 8,
        items: [
          {
            id: 'p8',
            question: '我是完全的新手，光是搞懂要用哪個 L2、怎麼買 ETH、怎麼付 Gas 就已經放棄了？',
            riskSummary:
              '每新增一個操作步驟都會流失大量用戶，複雜的入門流程讓以太坊生態系的成長速度遠低於應有水準，也讓非技術背景人士幾乎無法參與。',
            severity: 8,
            impact: 9,
            difficulty: 7,
            solution:
              '帳戶抽象（EIP-7702，Pectra 已上線）是最大的改變：你不需要持有 ETH 也能付 Gas（可用 USDC 等穩定幣），甚至 DApp 可以幫你代付手續費。未來的 Glamsterdam 和 Hegotá 將進一步讓錢包支援社交登入、Email 恢復，以及跨鏈一鍵操作，讓整體體驗更接近 Web2 App。',
            techTerms: ['帳戶抽象 / EIP-7702', 'Paymaster（代付 Gas）', '社交登入錢包', 'Smart Account'],
            eta: '✅ Paymaster 已在 Pectra (2025/5) 上線；社交登入錢包 2026-2027',
            maturity: 'Mainnet',
            confidence: 'high',
            links: [],
          },
        ],
      },
      {
        id: 'ux_recovery',
        title: '助記詞與帳戶恢復',
        description: '私鑰/助記詞一旦遺失，資產無法找回，門檻與心理負擔高。',
        severity: 6,
        items: [
          {
            id: 'p2',
            question: '記助記詞太反人類了！弄丟私鑰資產就歸零，不能像 Web2 一樣重設密碼嗎？',
            riskSummary:
              '遺失助記詞等於永久失去資產；無恢復機制也讓釣魚、盜竊一旦得手就無法挽回。',
            severity: 6,
            impact: 9,
            difficulty: 5,
            solution:
              '已解決！2025 年 5 月上線的 Pectra 升級核心之一 EIP-7702 讓你的現有錢包（EOA）可以暫時委託給智慧合約行事，不需要建立新帳戶就能享有多簽保護、社群恢復、用其他代幣付 Gas 等功能。Safe、Argent 等主流錢包已開始支援。接下來的 Glamsterdam 將進一步原生化帳戶抽象機制。',
            techTerms: [
              '帳戶抽象 (Account Abstraction)',
              'EIP-7702 (EOA 委託)',
              '多簽、社群恢復',
              'Safe / Argent 錢包支援',
            ],
            eta: '✅ 主網已上線（Pectra, 2025 年 5 月）',
            maturity: 'Mainnet',
            confidence: 'high',
            links: [],
          },
          {
            id: 'p9',
            question: '我要管好多條鏈的錢包，每個鏈地址都不一樣，根本記不住也管不來？',
            riskSummary:
              '多鏈環境讓用戶平均需要維護 3–5 個不同地址，資產分散導致容易誤轉，也增加私鑰管理的風險面。',
            severity: 6,
            impact: 7,
            difficulty: 6,
            solution:
              '有幾個方向正在推進。短期：EIP-7702 讓你用同一個帳號邏輯跨 L2 操作，Paymaster 讓各鏈都能用同一種代幣付費。長期：跨鏈統一地址格式（如 CAIP-10 標準）和帳戶抽象讓整個多鏈體驗可以統一到一個智慧帳戶管理，你只需要一個「錢包應用程式」就夠。',
            techTerms: ['CAIP-10 (跨鏈地址標準)', 'EIP-7702', 'Smart Account', 'Intent Framework'],
            eta: 'EIP-7702 ✅ 已上線；統一多鏈帳戶體驗 2026-2027',
            maturity: 'Draft',
            confidence: 'medium',
            links: [],
          },
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: '隱私與資安',
    icon: <ShieldAlert className="w-6 h-6" />,
    topics: [
      {
        id: 'privacy_approve',
        title: '智慧合約授權風險',
        description: '一個「Approve」按鈕可能讓惡意合約掏空整個錢包，用戶難以辨識風險。',
        severity: 9,
        items: [
          {
            id: 'p10',
            question: '我只是點了一個「授權」按鈕，結果整個錢包被清空，這是怎麼回事？',
            riskSummary:
              '傳統的無限制 Approve 授權讓恡意合約可以在任何時間提走你授權的所有代幣。釣魚網站、山寨 DApp 大量利用這個機制，已造成數十億美元損失。',
            severity: 9,
            impact: 10,
            difficulty: 5,
            solution:
              'Pectra 上線的 EIP-7702 讓帳戶抽象成真，智慧錢包可以實作細粒度授權：每筆授權限定金額、限定有效期、限定目標合約。你再也不需要批無限額度給一個 DApp。現在你也可以在 Revoke.cash 等工具手動撤銷舊授權，或改用支援交易模擬的錢包（如 Rabby、MetaMask Snaps）在簽名前就看到資產變動預覽。',
            techTerms: ['EIP-7702 (細粒度授權)', '交易模擬 (Tx Simulation)', 'Revoke.cash', 'ERC-20 Permit (EIP-2612)'],
            eta: '部分工具（Rabby、Revoke.cash）✅ 現已可用；協議層細粒度授權 ✅ EIP-7702 已在 Pectra 上線',
            maturity: 'Mainnet',
            confidence: 'high',
            links: [{ type: 'tool', label: 'Revoke.cash (撤銷授權工具)', url: 'https://revoke.cash' }],
          },
        ],
      },
      {
        id: 'privacy_asset',
        title: '資產持有隱私',
        description:
          '地址一旦被知道，資產規模與持倉結構可能被追蹤，增加被針對的風險。',
        severity: 7,
        items: [
          {
            id: 'p3',
            question: '只要有人知道我的錢包地址，我的餘額和買過什麼幣就全被看光？',
            riskSummary:
              '可能被鎖定成駭客/釣魚對象，或被社交工程攻擊；也會暴露投資策略與資產配置。',
            severity: 8,
            impact: 8,
            difficulty: 7,
            solution:
              '目前仍是以太坊重點研究中的課題。Vitalik 已提出的隱形地址（Stealth Addresses）方案可讓每筆轉帳自動產生一次性地址，讓外界無法把特定轉帳與你的主地址連結。Hegotá 升級（預計 2026 下半年）也預計加入 FOCIL 抗審查機制，並推進隱私保護技術的落地。',
            techTerms: ['隱形地址 (Stealth Addresses)', 'ZK-SNARKs 原生支援', 'FOCIL (抗審查機制)'],
            eta: '研究 & 規劃中 → 預計 Hegotá 開始落地 (2026 下半年)',
            maturity: 'Research',
            confidence: 'low',
            links: [{ type: 'external', label: 'Vitalik：隱形地址概述', url: 'https://vitalik.eth.limo/general/2023/01/20/stealth.html' }],
            termExplainers: [
              { term: '隱形地址', explanation: '每次有人轉幣給你時，自動幫仿產生一個全新的一次性地址來收款；外界只能看到地址，無法确認就是「你」在收。', url: 'https://vitalik.eth.limo/general/2023/01/20/stealth.html' },
              { term: 'Hegotá', explanation: '以太坊預計 2026 下半年的下一大型升級（Heze + Bogotá），預計帶來 Verkle Trees、無狀態節點與隆私改進。', url: 'https://ethereum.org/roadmap' },
              { term: 'FOCIL', explanation: 'Fork-Choice Inclusion List」的縮寫，一種投票機制，讓榜驗證者可以強制要求批向员必須包入某些交易，防止建構者任意審查交易。', url: null },
            ],
          },
          {
            id: 'p11',
            question: '我用 DApp 時，後端 API 伺服器看得到我的 IP 和操作，和 Web2 有什麼根本差別？',
            riskSummary:
              '大多數 DApp 前端仍透過中心化 RPC（如 Infura、Alchemy）來讀取區塊鏈資料，這意味著 RPC 服務商可以記錄你的 IP、錢包地址和操作時間，破壞了「去中心化」的假設。',
            severity: 7,
            impact: 7,
            difficulty: 8,
            solution:
              'Helios 是以太坊基金會支援的輕節點客戶端，讓瀏覽器 / 手機可以直接驗證區塊鏈資料，不需要信任 RPC 服務商。長期路線圖（The Verge / Hegotá）中的無狀態客戶端技術，將讓幾乎任何裝置都能成為輕量節點，從源頭解決 RPC 中心化問題。目前建議：使用私人 RPC（如自架節點或 Chainlist 上的公開替代節點）。',
            techTerms: ['Helios 輕節點', '無狀態客戶端 (Stateless Client)', 'RPC 去中心化', 'Private RPC'],
            eta: 'Helios 🔄 持續開發中；完整無狀態節點 Hegotá+ (2026 下半年以後)',
            maturity: 'Research',
            confidence: 'medium',
            links: [{ type: 'tool', label: 'Helios 輕節點 (GitHub)', url: 'https://github.com/a16z/helios' }],
            termExplainers: [
              { term: 'Helios', explanation: '以太坊基金會支援的輕節點客戶端，讓瀏覽器 / 手機可以直接驗證區塊鏈資料，不需要信任任何中心化 RPC。', url: 'https://github.com/a16z/helios' },
              { term: 'RPC', explanation: '「Remote Procedure Call」。你的錢包 App 讀取區塊鏈資料時通常不是自己計算，而是跳加問 Infura、Alchemy 等中心化伺服器。', url: null },
              { term: '無狀態客戶端', explanation: '不需要儲存整條區塊鏈，仅鬓少數據就能驗證最新區塊的正確性，Hegotá 後預計落地。', url: null },
            ],
          },
        ],
      },
      {
        id: 'privacy_tx',
        title: '交易隱私 / MEV',
        description:
          '交易在 mempool 可被觀察，可能被搶跑/夾擊，導致成交價格惡化或失敗。',
        severity: 7,
        items: [
          {
            id: 'p4',
            question: '在 DEX 買幣，常常因為滑點或被 MEV 機器人「夾擊」而買貴了？',
            riskSummary:
              '大額或時效敏感的交易容易被搶跑、三明治攻擊，造成實際成交價比預期差，甚至交易失敗。',
            severity: 7,
            impact: 7,
            difficulty: 7,
            solution:
              '重大改變即將到來！正在 Devnet 測試中的 Glamsterdam 升級（預計 2026 上半年）核心之一是 ePBS（EIP-7732）—將「負責打包的人」和「負責提議的人」分離並寫入協議，讓 MEV 提取更透明、更可預測，減少搶跑機會。現在也可以用 Flashbots Protect、MEV Blocker 等私人 Mempool 服務繞過搶跑風險。長期目標是加密記憶體池，歸入 Scourge 階段。',
            techTerms: ['ePBS (EIP-7732)', 'Flashbots Protect', 'MEV Blocker', '加密記憶體池 (Encrypted Mempool)'],
            eta: 'ePBS 🔄 Glamsterdam 預計 2026 上半年；Flashbots Protect ✅ 現已可用',
            maturity: 'Testnet',
            confidence: 'medium',
            links: [{ type: 'tool', label: 'MEV Blocker (防搶跑工具)', url: 'https://mevblocker.io' }],
          },
        ],
      },
    ],
  },
  {
    id: 'node',
    title: '節點與去中心化',
    icon: <Server className="w-6 h-6" />,
    topics: [
      {
        id: 'node_barrier',
        title: '節點硬體門檻',
        description: '跑節點需要大容量硬碟與較高規格電腦，一般人難以參與驗證。',
        severity: 6,
        items: [
          {
            id: 'p5',
            question: '我想跑節點支持以太坊，但聽說需要超大硬碟和高等級電腦？',
            riskSummary:
              '節點門檻高會導致驗證者集中化，降低網路去中心化與抗審查能力。',
            severity: 6,
            impact: 7,
            difficulty: 8,
            solution:
              '即將大幅瘦身！預計在 Hegotá 升級（2026 下半年）中引入的 Verkle Trees 將把節點儲存需求大幅削減。長遠來看，無狀態客戶端讓你甚至不需要同步整條鏈就能驗證區塊。此外，以太坊基金會已組建後量子密碼學研究小組，確保節點面對量子電腦威脅時仍安全。',
            techTerms: ['Verkle Trees', '無狀態客戶端 (Stateless Clients)', '後量子密碼學 (Post-Quantum Cryptography)'],
            eta: 'Verkle Trees 🔄 Hegotá 預計 2026 下半年；後量子 2027+ 規劃中',
            maturity: 'Testnet',
            confidence: 'medium',
            links: [],
          },
        ],
      },
      {
        id: 'node_staking',
        title: '質押集中化',
        description: 'Lido、Coinbase 等大型質押者控制大量 ETH，引發中心化疑慮。',
        severity: 7,
        items: [
          {
            id: 'p12',
            question: '聽說 Lido 掌控了以太坊 30% 的質押，這樣和中心化有什麼差別？',
            riskSummary:
              'Lido、Coinbase 等前幾大質押機構合計掌控超過 50% 的質押 ETH，理論上可能協調影響交易排序、甚至審查特定地址。這是當前以太坊去中心化最被質疑的問題。',
            severity: 7,
            impact: 9,
            difficulty: 9,
            solution:
              'Scourge 階段的核心目標之一就是解決這個問題。Lido 本身也推出了 Dual Governance 機制讓 stETH 持有者可以否決治理提案。技術上，DVT（分散式驗證者技術）讓單一質押份額可由多個節點共同驗證，降低單點失敗風險。以太坊基金會也公開表態自己的質押使用少數派客戶端，以身作則推廣多元化。',
            techTerms: ['DVT (分散式驗證者技術)', 'Dual Governance (Lido)', 'Scourge 階段', 'EIP-7251 (最大餘額提升)'],
            eta: 'DVT 🔄 持續推進中；Scourge 完整方案 2027+',
            maturity: 'Research',
            confidence: 'medium',
            links: [],
          },
          {
            id: 'p13',
            question: '我想支持以太坊質押但沒有 32 ETH，又不想把幣交給 Lido，還有選擇嗎？',
            riskSummary:
              '32 ETH 的門檻（約合數萬美元）讓大多數人只能選擇中心化交易所或 Lido，直接推高了質押集中化的程度。',
            severity: 6,
            impact: 7,
            difficulty: 6,
            solution:
              'Pectra 升級的 EIP-7251 已將最大有效餘額從 32 ETH 提升至 2048 ETH，讓現有驗證者可以合併質押、降低運營成本；對小額質押者而言，Rocketpool、SSV Network 等去中心化質押池提供了比 Lido 更去中心化的選擇，且不需要 32 ETH。DVT 技術讓小型質押者也能以較低資金參與節點驗證。',
            techTerms: ['EIP-7251 (最大餘額 2048 ETH)', 'DVT (分散式驗證者)', 'Rocketpool / SSV Network', '去中心化質押池'],
            eta: 'EIP-7251 ✅ Pectra 已上線 (2025/5)；去中心化質押池 ✅ 現已可用',
            maturity: 'Mainnet',
            confidence: 'high',
            links: [{ type: 'tool', label: '質押選項比較 (Ethereum.org)', url: 'https://ethereum.org/staking' }],
          },
        ],
      },
    ],
  },
];


export default function EthereumRoadmapUX() {
  const [activeTab, setActiveTab] = useState(roadmapData[0].id);
  const [activeTopic, setActiveTopic] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const activeCategory = roadmapData.find((c) => c.id === activeTab) ?? roadmapData[0];
  const effectiveTopic =
    activeTopic && activeCategory.topics.some((t) => t.id === activeTopic)
      ? activeTopic
      : activeCategory.topics[0]?.id ?? null;
  const currentTopic = activeCategory.topics.find((t) => t.id === effectiveTopic);
  const items = currentTopic?.items ?? [];

  const handleTabChange = (categoryId) => {
    setActiveTab(categoryId);
    const cat = roadmapData.find((c) => c.id === categoryId);
    setActiveTopic(cat?.topics[0]?.id ?? null);
    setExpandedCard(null);
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // 關閉 sidebar 時鎖定 body scroll
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans relative overflow-hidden transition-colors duration-300`}>

      {/* ── Background Glows (Option C) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {darkMode ? (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[120px]" />
          </>
        )}
      </div>


      {/* ── Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Panel ── */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white'} shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className={`flex items-center justify-between px-6 py-5 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <span className={`font-semibold text-lg ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>路線圖全貌</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`transition-colors p-1 rounded-full ${darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto px-6 py-6 space-y-8 text-sm ${darkMode ? 'text-slate-300' : ''}`}>
          {/* 技術路線圖原貌 */}
          <div>
            <span className={`font-semibold text-xs uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>技術路線圖原貌（六大面向）</span>
            <p className={`mt-1 text-xs italic ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>長期研究主題，不是單次升級，而是並行推進的六個方向。同一個升級（如 ePBS）可能同時推進不同面向。</p>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {officialRoadmapPhases.map((phase) => (
                <div
                  key={phase.id}
                  className={`rounded-xl border p-3 ${phase.status === 'completed'
                    ? 'bg-emerald-50 border-emerald-200'
                    : phase.status === 'in_progress'
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'bg-white border-slate-200'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {phase.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : phase.status === 'in_progress' ? (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0 ml-0.5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0 ml-0.5" />
                      )}
                      <span className="font-semibold text-slate-800 text-sm">
                        {phase.name}
                        <span className="text-slate-500 font-normal ml-1 text-xs">({phase.nameZh})</span>
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 flex-shrink-0">{phase.progress}%</span>
                  </div>
                  {/* 進度條 */}
                  <div className="ml-6 mb-2">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${phase.status === 'completed' ? 'bg-emerald-500'
                          : phase.status === 'in_progress' ? 'bg-indigo-500'
                            : 'bg-slate-300'
                          }`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 ml-6 mb-1.5 italic">{phase.short}</p>
                  <ul className="ml-6 space-y-0.5">
                    {phase.goals.map((g, i) => (
                      <li key={i} className="text-xs text-slate-600 leading-relaxed">{g}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <a
              href="https://ethereum.org/roadmap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-indigo-600 hover:text-indigo-800 text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              Ethereum.org 路線圖（原始來源）
            </a>
          </div>

          {/* 資料來源 */}
          <div>
            <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">資料來源</span>
            <div className="mt-2 space-y-2">
              {DATA_SOURCES.map((s, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 font-medium text-sm"
                  >
                    {s.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </aside>

      {/* ── Header ── */}
      <header className={`${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50/80 border-slate-200'} backdrop-blur-md border-b sticky top-0 z-10 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-4xl font-bold mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              以太坊升級地圖
            </h1>

            <p className={`hidden md:block leading-relaxed max-w-2xl mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              以太坊升級到哪了？未來還有哪些改進？能解決我的問題嗎？
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'}`}
              title={darkMode ? '切換淺色模式' : '切換深色模式'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* Ethereum Diamond progress button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex-shrink-0 flex flex-col items-center gap-1 group"
              title="路線圖全貌"
            >
              {/* Ethereum Diamond with water-fill progress */}
              {(() => {
                const progress = 42; // 主觀進度百分比；可隨路線圖變動調整
                const fillY = 100 - progress; // SVG 座標：0=頂部, 100=底部
                return (
                  <div className="relative w-14 h-14 md:w-16 md:h-16">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <defs>
                        {/* Ethereum diamond shape as clip path */}
                        <clipPath id="eth-diamond">
                          <path d="M50 5 L85 50 L50 95 L15 50 Z" />
                        </clipPath>
                        {/* Animated water gradient */}
                        <linearGradient id="water-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset={`${fillY}%`} stopColor="transparent" />
                          <stop offset={`${fillY}%`} stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        {/* Subtle wave pattern */}
                        <linearGradient id="wave-sheen" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                          <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                      </defs>
                      {/* Background diamond outline */}
                      <path d="M50 5 L85 50 L50 95 L15 50 Z" fill="none" stroke="#cbd5e1" strokeWidth="2"
                        className="group-hover:stroke-indigo-300 transition-colors" />
                      {/* Filled water area */}
                      <g clipPath="url(#eth-diamond)">
                        <rect x="0" y="0" width="100" height="100" fill="url(#water-fill)" />
                        {/* Sheen overlay */}
                        <rect x="0" y={fillY} width="100" height={100 - fillY} fill="url(#wave-sheen)" opacity="0.6" />
                        {/* Water surface wave line */}
                        <path d={`M10 ${fillY} Q30 ${fillY - 3} 50 ${fillY} Q70 ${fillY + 3} 90 ${fillY}`}
                          fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
                          className="animate-pulse" />
                      </g>
                      {/* Inner diamond cross lines (Ethereum logo detail) */}
                      <g clipPath="url(#eth-diamond)" opacity="0.15">
                        <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="1" />
                        <line x1="15" y1="50" x2="85" y2="50" stroke="white" strokeWidth="0.8" />
                      </g>
                    </svg>
                  </div>
                );
              })()}
              <span className="text-xs font-bold text-indigo-600 tabular-nums">42%</span>
              <span className="text-[10px] text-slate-400 -mt-0.5">路線圖進度</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-5 md:py-8">
        <VisualRoadmap roadmapData={roadmapData} darkMode={darkMode} />
      </main>

      {/* ── Footer ── */}
      <footer className={`relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 mt-8 text-center border-t transition-colors duration-300 ${darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
        <p className="text-sm leading-relaxed mb-3">
          這是一個開放協作的開源專案。歡迎大家一起幫忙更新與完善！
        </p>
        <a
          href="https://github.com/ASTROHSU/Ethereum-roadmap"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          前往 GitHub
        </a>
      </footer>
    </div>
  );
}

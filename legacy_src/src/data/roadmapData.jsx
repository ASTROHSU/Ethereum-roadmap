import React from "react";
import { Zap, Wallet, ShieldAlert, Server } from "lucide-react";

export const roadmapDataZh = [
  {
    id: "scale",
    title: "費用與速度",
    icon: <Zap className="w-6 h-6" />,
    topics: [
      {
        id: "scale_l1",
        title: "L1 手續費與吞吐",
        description:
          "主網 Gas 貴、容量有限，使用者被迫頻繁使用 L2 或忍受高成本。",
        severity: 5,
        items: [
          {
            id: "p1",
            question:
              "L1 手續費還是太貴了，但我又不想頻繁跨鏈到 L2，覺得好麻煩？",
            riskSummary:
              "高額手續費會排擠小額交易與新用戶，並讓 DeFi 操作成本不穩定，影響使用意願。",
            severity: 5,
            impact: 8,
            difficulty: 6,
            solution:
              "已有重大進展！2024 年 3 月的 Dencun 升級（EIP-4844）引入 Blob 資料，讓 L2 Rollup 費用瞬間降低了 10～100 倍。2025 年 5 月的 Pectra 升級再把 Blob 空間加倍（PeerDAS）。正在測試中的 Glamsterdam（預計 2026 上半年）將引入區塊級別訪問列表（EIP-7928）與 ePBS（EIP-7732），預計讓 L1 執行效率再大幅提升，Gas 費用進一步下降。",
            techTerms: [
              "EIP-4844 (Proto-Danksharding)",
              "PeerDAS / EIP-7594",
              "Block Access Lists (EIP-7928)",
              "ePBS (EIP-7732)",
            ],
            eta: "Dencun ✅ 已完成 (2024/3)、Pectra ✅ 已完成 (2025/5)、Glamsterdam 🔄 預計 2026 上半年",
            maturity: "Mainnet",
            confidence: "high",
            links: [],
          },
        ],
      },
      {
        id: "scale_l2",
        title: "L2 碎片化與跨鏈麻煩",
        description:
          "多條 L2 造成資金割裂，橋接繁瑣、RPC 不同、Gas token 各異，體驗極差。",
        severity: 8,
        items: [
          {
            id: "p6",
            question:
              "跨 L2 要橋接好麻煩，手續費搞不清楚，資產還常常被鎖在不同鏈上動彈不得？",
            riskSummary:
              "橋接合約是駭客重點攻擊目標，歷史上多次橋接被黑損失鉅大。跨鏈體驗差也讓新用戶卻步、流動性分散在各 L2 之間。",
            severity: 8,
            impact: 8,
            difficulty: 8,
            breakingNews: {
              date: "2026 年 1 月",
              summary:
                "Vitalik 公開宣告：以 L2 為中心的路線圖已經「過時」。隨著 L1 自身快速擴容，L2 的主要賣點「便宜」將不再成立。L2 必須找到「擴容以外」的獨特定位，否則應該大方承認自己是獨立 L1。",
              links: [
                {
                  label: "閱讀深入分析",
                  url: "https://www.blocktrend.today/p/758",
                },
                {
                  label: "Vitalik 原文",
                  url: "https://x.com/VitalikButerin/status/2018711006394843585",
                },
              ],
            },
            solution:
              "短期內，跨鏈架構依然在推進：ERC-7683 跨鏈訂單標準讓你只需說「我要把 A 鏈的 USDC 換到 B 鏈」，背後自動完成。Superchain、AggLayer 也讓旗下各 L2 免橋接溝通。但長期來看，如果 L1 的 gas fee 夠便宜，多數人根本不需要離開 L1。",
            techTerms: [
              "ERC-7683 (跨鏈訂單標準)",
              "Intent-Based 架構",
              "Superchain / AggLayer",
              "原生互通性 (Native Interop)",
            ],
            eta: "生態層方案（Superchain、AggLayer）部分已上線；協議層原生互通性 2026-2027；長期：L1 擴容可能直接取代 L2 的角色",
            maturity: "Testnet",
            confidence: "medium",
            links: [],
          },
          {
            id: "p7",
            question:
              "每換一條 L2 就要加新 RPC、用不同的 Gas 幣、甚至還要買原生代幣，根本沒辦法用？",
            riskSummary:
              "多鏈碎片化讓上手門檻極高，新用戶一旦搞錯鏈發錯幣基本就找不回來；也讓開發者難以設計跨鏈的無縫體驗。",
            severity: 7,
            impact: 7,
            difficulty: 7,
            solution:
              "EIP-7702（Pectra，2025/5 已上線）讓帳戶抽象成為可能——你可以用穩定幣（如 USDC）或任何代幣付 Gas，不需要持有各鏈的原生代幣。跨鏈地址標準化（跨鏈統一地址格式）和一鍵多鏈部署也在推進中，目標是讓切換 L2 像切換 Wi-Fi 一樣無感。",
            techTerms: [
              "EIP-7702 (帳戶抽象 / Paymaster)",
              "跨鏈統一地址",
              "ERC-7683",
              "穩定幣付 Gas",
            ],
            eta: "Paymaster（穩定幣付 Gas）✅ Pectra 已上線；跨鏈地址統一 2026-2027",
            maturity: "Mainnet",
            confidence: "high",
            links: [],
          },
        ],
      },
    ],
  },
  {
    id: "ux",
    title: "帳號與操作",
    icon: <Wallet className="w-6 h-6" />,
    topics: [
      {
        id: "ux_onboard",
        title: "新手入門門檻",
        description: "從買幣到第一次用 DApp，每個步驟都可能讓新手放棄。",
        severity: 8,
        items: [
          {
            id: "p8",
            question:
              "我是完全的新手，光是搞懂要用哪個 L2、怎麼買 ETH、怎麼付 Gas 就已經放棄了？",
            riskSummary:
              "每新增一個操作步驟都會流失大量用戶，複雜的入門流程讓以太坊生態系的成長速度遠低於應有水準，也讓非技術背景人士幾乎無法參與。",
            severity: 8,
            impact: 9,
            difficulty: 7,
            solution:
              "帳戶抽象（EIP-7702，Pectra 已上線）是最大的改變：你不需要持有 ETH 也能付 Gas（可用 USDC 等穩定幣），甚至 DApp 可以幫你代付手續費。未來的 Glamsterdam 和 Hegotá 將進一步讓錢包支援社交登入、Email 恢復，以及跨鏈一鍵操作，讓整體體驗更接近 Web2 App。",
            techTerms: [
              "帳戶抽象 / EIP-7702",
              "Paymaster（代付 Gas）",
              "社交登入錢包",
              "Smart Account",
            ],
            eta: "✅ Paymaster 已在 Pectra (2025/5) 上線；社交登入錢包 2026-2027",
            maturity: "Mainnet",
            confidence: "high",
            links: [],
          },
        ],
      },
      {
        id: "ux_recovery",
        title: "助記詞與帳戶恢復",
        description: "私鑰/助記詞一旦遺失，資產無法找回，門檻與心理負擔高。",
        severity: 6,
        items: [
          {
            id: "p2",
            question:
              "記助記詞太反人類了！弄丟私鑰資產就歸零，不能像 Web2 一樣重設密碼嗎？",
            riskSummary:
              "遺失助記詞等於永久失去資產；無恢復機制也讓釣魚、盜竊一旦得手就無法挽回。",
            severity: 6,
            impact: 9,
            difficulty: 5,
            solution:
              "已解決！2025 年 5 月上線的 Pectra 升級核心之一 EIP-7702 讓你的現有錢包（EOA）可以暫時委託給智慧合約行事，不需要建立新帳戶就能享有多簽保護、社群恢復、用其他代幣付 Gas 等功能。Safe、Argent 等主流錢包已開始支援。接下來的 Glamsterdam 將進一步原生化帳戶抽象機制。",
            techTerms: [
              "帳戶抽象 (Account Abstraction)",
              "EIP-7702 (EOA 委託)",
              "多簽、社群恢復",
              "Safe / Argent 錢包支援",
            ],
            eta: "✅ 主網已上線（Pectra, 2025 年 5 月）",
            maturity: "Mainnet",
            confidence: "high",
            links: [],
          },
          {
            id: "p9",
            question:
              "我要管好多條鏈的錢包，每個鏈地址都不一樣，根本記不住也管不來？",
            riskSummary:
              "多鏈環境讓用戶平均需要維護 3–5 個不同地址，資產分散導致容易誤轉，也增加私鑰管理的風險面。",
            severity: 6,
            impact: 7,
            difficulty: 6,
            solution:
              "有幾個方向正在推進。短期：EIP-7702 讓你用同一個帳號邏輯跨 L2 操作，Paymaster 讓各鏈都能用同一種代幣付費。長期：跨鏈統一地址格式（如 CAIP-10 標準）和帳戶抽象讓整個多鏈體驗可以統一到一個智慧帳戶管理，你只需要一個「錢包應用程式」就夠。",
            techTerms: [
              "CAIP-10 (跨鏈地址標準)",
              "EIP-7702",
              "Smart Account",
              "Intent Framework",
            ],
            eta: "EIP-7702 ✅ 已上線；統一多鏈帳戶體驗 2026-2027",
            maturity: "Draft",
            confidence: "medium",
            links: [],
          },
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "隱私與資安",
    icon: <ShieldAlert className="w-6 h-6" />,
    topics: [
      {
        id: "privacy_approve",
        title: "智慧合約授權風險",
        description:
          "一個「Approve」按鈕可能讓惡意合約掏空整個錢包，用戶難以辨識風險。",
        severity: 9,
        items: [
          {
            id: "p10",
            question:
              "我只是點了一個「授權」按鈕，結果整個錢包被清空，這是怎麼回事？",
            riskSummary:
              "傳統的無限制 Approve 授權讓惡意合約可以在任何時間提走你授權的所有代幣。釣魚網站、山寨 DApp 大量利用這個機制，已造成數十億美元損失。",
            severity: 9,
            impact: 10,
            difficulty: 5,
            solution:
              "Pectra 上線的 EIP-7702 讓帳戶抽象成真，智慧錢包可以實作細粒度授權：每筆授權限定金額、限定有效期、限定目標合約。你再也不需要批無限額度給一個 DApp。現在你也可以在 Revoke.cash 等工具手動撤銷舊授權，或改用支援交易模擬的錢包（如 Rabby、MetaMask Snaps）在簽名前就看到資產變動預覽。",
            techTerms: [
              "EIP-7702 (細粒度授權)",
              "交易模擬 (Tx Simulation)",
              "Revoke.cash",
              "ERC-20 Permit (EIP-2612)",
            ],
            eta: "部分工具（Rabby、Revoke.cash）✅ 現已可用；協議層細粒度授權 ✅ EIP-7702 已在 Pectra 上線",
            maturity: "Mainnet",
            confidence: "high",
            links: [
              {
                type: "tool",
                label: "Revoke.cash (撤銷授權工具)",
                url: "https://revoke.cash",
              },
            ],
          },
        ],
      },
      {
        id: "privacy_asset",
        title: "資產持有隱私",
        description:
          "地址一旦被知道，資產規模與持倉結構可能被追蹤，增加被針對的風險。",
        severity: 7,
        items: [
          {
            id: "p3",
            question:
              "只要有人知道我的錢包地址，我的餘額和買過什麼幣就全被看光？",
            riskSummary:
              "可能被鎖定成駭客/釣魚對象，或被社交工程攻擊；也會暴露投資策略與資產配置。",
            severity: 8,
            impact: 8,
            difficulty: 7,
            solution:
              "目前仍是以太坊重點研究中的課題。Vitalik 已提出的隱形地址（Stealth Addresses）方案可讓每筆轉帳自動產生一次性地址，讓外界無法把特定轉帳與你的主地址連結。Hegotá 升級（預計 2026 下半年）也預計加入 FOCIL 抗審查機制，並推進隱私保護技術的落地。",
            techTerms: [
              "隱形地址 (Stealth Addresses)",
              "ZK-SNARKs 原生支援",
              "FOCIL (抗審查機制)",
            ],
            eta: "研究 & 規劃中 → 預計 Hegotá 開始落地 (2026 下半年)",
            maturity: "Research",
            confidence: "low",
            links: [
              {
                type: "external",
                label: "Vitalik：隱形地址概述",
                url: "https://vitalik.eth.limo/general/2023/01/20/stealth.html",
              },
            ],
            termExplainers: [
              {
                term: "隱形地址",
                explanation:
                  "每次有人轉幣給你時，自動幫你產生一個全新的一次性地址來收款；外界只能看到地址，無法確知就是「你」在收。",
                url: "https://vitalik.eth.limo/general/2023/01/20/stealth.html",
              },
              {
                term: "Hegotá",
                explanation:
                  "以太坊預計 2026 下半年的下一大型升級（Heze + Bogotá），預計帶來 Verkle Trees、無狀態節點與隱私改進。",
                url: "https://ethereum.org/roadmap",
              },
              {
                term: "FOCIL",
                explanation:
                  "Fork-Choice Inclusion List 的縮寫，一種投票機制，讓多數驗證者可以強制要求打包者必須包入某些交易，防止建構者任意審查交易。",
                url: null,
              },
            ],
          },
          {
            id: "p11",
            question:
              "我用 DApp 時，後端 API 伺服器看得到我的 IP 和操作，和 Web2 有什麼根本差別？",
            riskSummary:
              "大多數 DApp 前端仍透過中心化 RPC（如 Infura、Alchemy）來讀取區塊鏈資料，這意味著 RPC 服務商可以記錄你的 IP、錢包地址和操作時間，破壞了「去中心化」的假設。",
            severity: 7,
            impact: 7,
            difficulty: 8,
            solution:
              "Helios 是以太坊基金會支援的輕節點客戶端，讓瀏覽器 / 手機可以直接驗證區塊鏈資料，不需要信任 RPC 服務商。長期路線圖（The Verge / Hegotá）中的無狀態客戶端技術，將讓幾乎任何裝置都能成為輕量節點，從源頭解決 RPC 中心化問題。目前建議：使用私人 RPC（如自架節點或 Chainlist 上的公開替代節點）。",
            techTerms: [
              "Helios 輕節點",
              "無狀態客戶端 (Stateless Client)",
              "RPC 去中心化",
              "Private RPC",
            ],
            eta: "Helios 🔄 持續開發中；完整無狀態節點 Hegotá+ (2026 下半年以後)",
            maturity: "Research",
            confidence: "medium",
            links: [
              {
                type: "tool",
                label: "Helios 輕節點 (GitHub)",
                url: "https://github.com/a16z/helios",
              },
            ],
            termExplainers: [
              {
                term: "Helios",
                explanation:
                  "以太坊基金會支援的輕節點客戶端，讓瀏覽器 / 手機可以直接驗證區塊鏈資料，不需要信任任何中心化 RPC。",
                url: "https://github.com/a16z/helios",
              },
              {
                term: "RPC",
                explanation:
                  "「Remote Procedure Call」。你的錢包 App 讀取區塊鏈資料時通常不是自己計算，而是發請求問 Infura、Alchemy 等中心化伺服器。",
                url: null,
              },
              {
                term: "無狀態客戶端",
                explanation:
                  "不需要儲存整條區塊鏈，僅靠少量數據就能驗證最新區塊的正確性，Hegotá 後預計落地。",
                url: null,
              },
            ],
          },
        ],
      },
      {
        id: "privacy_tx",
        title: "交易隱私 / MEV",
        description:
          "交易在 mempool 可被觀察，可能被搶跑/夾擊，導致成交價格惡化或失敗。",
        severity: 7,
        items: [
          {
            id: "p4",
            question:
              "在 DEX 買幣，常常因為滑點或被 MEV 機器人「夾擊」而買貴了？",
            riskSummary:
              "大額或時效敏感的交易容易被搶跑、三明治攻擊，造成實際成交價比預期差，甚至交易失敗。",
            severity: 7,
            impact: 7,
            difficulty: 7,
            solution:
              "重大改變即將到來！正在 Devnet 測試中的 Glamsterdam 升級（預計 2026 上半年）核心之一是 ePBS（EIP-7732）—將「負責打包的人」和「負責提議的人」分離並寫入協議，讓 MEV 提取更透明、更可預測，減少搶跑機會。現在也可以用 Flashbots Protect、MEV Blocker 等私人 Mempool 服務繞過搶跑風險。長期目標是加密記憶體池，歸入 Scourge 階段。",
            techTerms: [
              "ePBS (EIP-7732)",
              "Flashbots Protect",
              "MEV Blocker",
              "加密記憶體池 (Encrypted Mempool)",
            ],
            eta: "ePBS 🔄 Glamsterdam 預計 2026 上半年；Flashbots Protect ✅ 現已可用",
            maturity: "Testnet",
            confidence: "medium",
            links: [
              {
                type: "tool",
                label: "MEV Blocker (防搶跑工具)",
                url: "https://mevblocker.io",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "node",
    title: "節點與去中心化",
    icon: <Server className="w-6 h-6" />,
    topics: [
      {
        id: "node_barrier",
        title: "節點硬體門檻",
        description: "跑節點需要大容量硬碟與較高規格電腦，一般人難以參與驗證。",
        severity: 6,
        items: [
          {
            id: "p5",
            question: "我想跑節點支持以太坊，但聽說需要超大硬碟和高等級電腦？",
            riskSummary:
              "節點門檻高會導致驗證者集中化，降低網路去中心化與抗審查能力。",
            severity: 6,
            impact: 7,
            difficulty: 8,
            solution:
              "即將大幅瘦身！預計在 Hegotá 升級（2026 下半年）中引入的 Verkle Trees 將把節點儲存需求大幅削減。長遠來看，無狀態客戶端讓你甚至不需要同步整條鏈就能驗證區塊。此外，以太坊基金會已組建後量子密碼學研究小組，確保節點面對量子電腦威脅時仍安全。",
            techTerms: [
              "Verkle Trees",
              "無狀態客戶端 (Stateless Clients)",
              "後量子密碼學 (Post-Quantum Cryptography)",
            ],
            eta: "Verkle Trees 🔄 Hegotá 預計 2026 下半年；後量子 2027+ 規劃中",
            maturity: "Testnet",
            confidence: "medium",
            links: [],
          },
        ],
      },
      {
        id: "node_staking",
        title: "質押集中化",
        description:
          "Lido、Coinbase 等大型質押者控制大量 ETH，引發中心化疑慮。",
        severity: 7,
        items: [
          {
            id: "p12",
            question:
              "聽說 Lido 掌控了以太坊 30% 的質押，這樣和中心化有什麼差別？",
            riskSummary:
              "Lido、Coinbase 等前幾大質押機構合計掌控超過 50% 的質押 ETH，理論上可能協調影響交易排序、甚至審查特定地址。這是當前以太坊去中心化最被質疑的問題。",
            severity: 7,
            impact: 9,
            difficulty: 9,
            solution:
              "Scourge 階段的核心目標之一就是解決這個問題。Lido 本身也推出了 Dual Governance 機制讓 stETH 持有者可以否決治理提案。技術上，DVT（分散式驗證者技術）讓單一質押份額可由多個節點共同驗證，降低單點失敗風險。以太坊基金會也公開表態自己的質押使用少數派客戶端，以身作則推廣多元化。",
            techTerms: [
              "DVT (分散式驗證者技術)",
              "Dual Governance (Lido)",
              "Scourge 階段",
              "EIP-7251 (最大餘額提升)",
            ],
            eta: "DVT 🔄 持續推進中；Scourge 完整方案 2027+",
            maturity: "Research",
            confidence: "medium",
            links: [],
          },
          {
            id: "p13",
            question:
              "我想支持以太坊質押但沒有 32 ETH，又不想把幣交給 Lido，還有選擇嗎？",
            riskSummary:
              "32 ETH 的門檻（約合數萬美元）讓大多數人只能選擇中心化交易所或 Lido，直接推高了質押集中化的程度。",
            severity: 6,
            impact: 7,
            difficulty: 6,
            solution:
              "Pectra 升級的 EIP-7251 已將最大有效餘額從 32 ETH 提升至 2048 ETH，讓現有驗證者可以合併質押、降低運營成本；對小額質押者而言，Rocketpool、SSV Network 等去中心化質押池提供了比 Lido 更去中心化的選擇，且不需要 32 ETH。DVT 技術讓小型質押者也能以較低資金參與節點驗證。",
            techTerms: [
              "EIP-7251 (最大餘額 2048 ETH)",
              "DVT (分散式驗證者)",
              "Rocketpool / SSV Network",
              "去中心化質押池",
            ],
            eta: "EIP-7251 ✅ Pectra 已上線 (2025/5)；去中心化質押池 ✅ 現已可用",
            maturity: "Mainnet",
            confidence: "high",
            links: [
              {
                type: "tool",
                label: "質押選項比較 (Ethereum.org)",
                url: "https://ethereum.org/staking",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const roadmapDataEn = [
  {
    id: "scale",
    title: "Fees & Speed",
    icon: <Zap className="w-6 h-6" />,
    topics: [
      {
        id: "scale_l1",
        title: "L1 Fees & Throughput",
        description:
          "Mainnet Gas is expensive and capacity is limited, forcing users to rely on L2s or endure high costs.",
        severity: 5,
        items: [
          {
            id: "p1",
            question:
              "L1 fees are still too expensive, but I hate bridging to L2. Isn't it a hassle?",
            riskSummary:
              "High fees price out small transactions and new users, making DeFi operations unpredictably costly.",
            severity: 5,
            impact: 8,
            difficulty: 6,
            solution:
              "Major progress has been made! The Dencun upgrade (EIP-4844) in March 2024 introduced Blobs, instantly reducing L2 Rollup costs by 10-100x. The Pectra upgrade (May 2025) doubled Blob space via PeerDAS. Glamsterdam (expected H1 2026) will introduce ePBS and Block Access Lists, further boosting L1 execution efficiency and lowering gas fees.",
            techTerms: [
              "EIP-4844 (Proto-Danksharding)",
              "PeerDAS / EIP-7594",
              "Block Access Lists (EIP-7928)",
              "ePBS (EIP-7732)",
            ],
            eta: "Dencun ✅ Done (2024/03), Pectra ✅ Done (2025/05), Glamsterdam 🔄 Expected H1 2026",
            maturity: "Mainnet",
            confidence: "high",
            links: [],
          },
        ],
      },
      {
        id: "scale_l2",
        title: "L2 Fragmentation & Bridging",
        description:
          "Multiple L2s fragment liquidity. Bridging is annoying, and different RPCs and Gas tokens ruin the UX.",
        severity: 8,
        items: [
          {
            id: "p6",
            question:
              "Bridging across L2s is complicated, I can never figure out the fees, and my assets get stranded.",
            riskSummary:
              "Bridge contracts are prime hacker targets. Poor cross-chain UX deters new users and fragments liquidity across different ecosystems.",
            severity: 8,
            impact: 8,
            difficulty: 8,
            breakingNews: {
              date: "Jan 2026",
              summary:
                'Vitalik declared the "L2-centric roadmap" obsolete. As L1 massively scales itself, L2s\' main selling point (cheapness) will fade. L2s must find unique value propositions beyond "scaling" or admit they are just independent L1s.',
              links: [
                {
                  label: "Read In-Depth Analysis",
                  url: "https://www.blocktrend.today/p/758",
                },
                {
                  label: "Vitalik's Post",
                  url: "https://x.com/VitalikButerin/status/2018711006394843585",
                },
              ],
            },
            solution:
              'Short term: ERC-7683 (Cross-Chain Intents) lets you simply say "swap USDC on chain A to chain B," and solvers handle the rest. Superchain and AggLayer also enable brige-less communication between affiliated L2s. Long term: if L1 gets cheap enough, most users might not need to leave L1.',
            techTerms: [
              "ERC-7683 (Cross-chain intents)",
              "Intent-Based Architecture",
              "Superchain / AggLayer",
              "Native Interop",
            ],
            eta: "Ecosystem solutions (Superchain) live; Native Interop 2026-2027; Long term: L1 scaling might replace L2s.",
            maturity: "Testnet",
            confidence: "medium",
            links: [],
          },
          {
            id: "p7",
            question:
              "Every time I switch L2s, I need a new RPC and native token to pay for Gas. It's unusable.",
            riskSummary:
              "Multi-chain fragmentation makes the learning curve brutally steep. Sending tokens to the wrong chain is a common issue.",
            severity: 7,
            impact: 7,
            difficulty: 7,
            solution:
              "EIP-7702 (live in Pectra, May 2025) makes Account Abstraction real. You can pay for Gas with stablecoins (like USDC) without needing native tokens. Cross-chain unified address formats are in the works to make switching L2s as seamless as switching Wi-Fi networks.",
            techTerms: [
              "EIP-7702 (Account Abstraction / Paymaster)",
              "Unified Cross-Chain Address",
              "ERC-7683",
              "Stablecoin for Gas",
            ],
            eta: "Paymaster (stablecoin for Gas) ✅ Live in Pectra; Cross-chain addresses 2026-2027",
            maturity: "Mainnet",
            confidence: "high",
            links: [],
          },
        ],
      },
    ],
  },
  {
    id: "ux",
    title: "Accounts & UX",
    icon: <Wallet className="w-6 h-6" />,
    topics: [
      {
        id: "ux_onboard",
        title: "Onboarding Frictions",
        description:
          "From buying crypto to using your first DApp, every step is a hurdle that makes novices give up.",
        severity: 8,
        items: [
          {
            id: "p8",
            question:
              "I am completely new. Just trying to figure out which L2, how to buy ETH, and how to pay Gas made me quit.",
            riskSummary:
              "Every extra step bleeds users. Complex onboarding makes Ethereum grow far slower than it should.",
            severity: 8,
            impact: 9,
            difficulty: 7,
            solution:
              "Account Abstraction (EIP-7702, live in Pectra) is the game changer. You don't need ETH to pay Gas (use USDC), or DApps can subsidize your Gas fees. Upcoming Glamsterdam and Hegotá will bring native social login, email recovery, and 1-click cross-chain transactions, bringing UX closer to Web2.",
            techTerms: [
              "Account Abstraction / EIP-7702",
              "Paymaster (Sponsored Gas)",
              "Social Login Wallets",
              "Smart Accounts",
            ],
            eta: "✅ Paymaster live in Pectra (2025/05); Social login expected 2026-2027",
            maturity: "Mainnet",
            confidence: "high",
            links: [],
          },
        ],
      },
      {
        id: "ux_recovery",
        title: "Seed Phrases & Recovery",
        description:
          "Losing your seed phrase means permanent loss of funds, creating a massive psychological barrier.",
        severity: 6,
        items: [
          {
            id: "p2",
            question:
              "Remembering a seed phrase is anti-human. Can't I just reset my password like in Web2?",
            riskSummary:
              "Lost seed phrase = lost assets. No recovery mechanism makes phishing catastrophic and irreversible.",
            severity: 6,
            impact: 9,
            difficulty: 5,
            solution:
              "Solved! EIP-7702 in the Pectra upgrade allows your classic wallet (EOA) to temporarily act as a smart contract. You can enjoy multi-sig, social recovery, and stablecoin gas payments without migrating to a new wallet. Wallets like Safe and Argent already support this.",
            techTerms: [
              "Account Abstraction",
              "EIP-7702 (EOA Delegation)",
              "Multisig, Social Recovery",
              "Safe / Argent support",
            ],
            eta: "✅ Live on Mainnet (Pectra, May 2025)",
            maturity: "Mainnet",
            confidence: "high",
            links: [],
          },
          {
            id: "p9",
            question:
              "I have to manage multiple wallets across different chains. I can't keep track of everything.",
            riskSummary:
              "The multi-chain environment forces users to maintain 3-5 addresses. Fragmented assets lead to mistakes and expanded attack surfaces.",
            severity: 6,
            impact: 7,
            difficulty: 6,
            solution:
              'Short term: EIP-7702 unifies your EOA logic across L2s, and Paymasters let you pay fees with any token. Long term: Unified address standards (like CAIP-10) will allow a "Smart Account" to act as a singular multi-chain identity.',
            techTerms: [
              "CAIP-10 (Cross-chain formatting)",
              "EIP-7702",
              "Smart Account",
              "Intent Framework",
            ],
            eta: "EIP-7702 ✅ Live; Unified multichain experience 2026-2027",
            maturity: "Draft",
            confidence: "medium",
            links: [],
          },
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: <ShieldAlert className="w-6 h-6" />,
    topics: [
      {
        id: "privacy_approve",
        title: "Smart Contract Approvals Risk",
        description:
          'Clicking "Approve" once can drain your entire wallet. Users can\'t comprehend the risks.',
        severity: 9,
        items: [
          {
            id: "p10",
            question:
              'I just clicked "Approve" and my entire wallet was drained. What happened?',
            riskSummary:
              'Traditional infinite "Approve" allows a contract to drain your tokens at any time. Phishers drain billions using this.',
            severity: 9,
            impact: 10,
            difficulty: 5,
            solution:
              "Pectra's EIP-7702 makes fine-grained approvals native: limit amount, duration, and target contract for every approval. You no longer need to grant infinite tokens. You can use Revoke.cash to revoke old approvals, and use wallets with Transaction Simulation (like Rabby) to see balance changes before signing.",
            techTerms: [
              "EIP-7702 (Granular Authorization)",
              "Tx Simulation",
              "Revoke.cash",
              "ERC-20 Permit (EIP-2612)",
            ],
            eta: "Tools like Revoke.cash ✅ Live; Protocol-level limits ✅ EIP-7702 live in Pectra",
            maturity: "Mainnet",
            confidence: "high",
            links: [
              {
                type: "tool",
                label: "Revoke.cash",
                url: "https://revoke.cash",
              },
            ],
          },
        ],
      },
      {
        id: "privacy_asset",
        title: "Asset Holding Privacy",
        description:
          "Once your address is known, your entire portfolio can be snooped, leading to targeted attacks.",
        severity: 7,
        items: [
          {
            id: "p3",
            question:
              "If someone knows my address, they can see exactly how much money and which tokens I have?",
            riskSummary:
              "Exposes users to kidnapping, phishing, social engineering, and reveals trading strategies.",
            severity: 8,
            impact: 8,
            difficulty: 7,
            solution:
              'A major research topic. Vitalik\'s "Stealth Addresses" proposal auto-generates a one-time address for every transfer. The Hegotá upgrade (H2 2026) will introduce the FOCIL anti-censorship mechanism, pushing privacy tech into production.',
            techTerms: [
              "Stealth Addresses",
              "ZK-SNARKs Native Support",
              "FOCIL (Censorship Resistance)",
            ],
            eta: "Research & Planning phase → Expected to roll out in Hegotá (H2 2026)",
            maturity: "Research",
            confidence: "low",
            links: [
              {
                type: "external",
                label: "Vitalik on Stealth Addresses",
                url: "https://vitalik.eth.limo/general/2023/01/20/stealth.html",
              },
            ],
            termExplainers: [
              {
                term: "Stealth Address",
                explanation:
                  "Generates a fresh, one-time address for every payment. Senders transact anonymously without tying payouts to your main Identity.",
                url: "https://vitalik.eth.limo/general/2023/01/20/stealth.html",
              },
              {
                term: "Hegotá",
                explanation:
                  "Expected major 2026 upgrade (Heze + Bogotá) featuring Verkle Trees, statelessness, and privacy infra.",
                url: "https://ethereum.org/roadmap",
              },
              {
                term: "FOCIL",
                explanation:
                  "Fork-Choice Inclusion List. Forces block builders to include specific transactions, preventing censorship.",
                url: null,
              },
            ],
          },
          {
            id: "p11",
            question:
              "When I use DApps, the RPC server sees my IP and actions. That's no better than Web2?",
            riskSummary:
              "Because DApps mostly query centralized RPC nodes (like Infura or Alchemy), these servers can log your IP and wallet address, breaking the decentralization promise.",
            severity: 7,
            impact: 7,
            difficulty: 8,
            solution:
              'Helios, backed by the EF, is a light client allowing browsers/phones to verify blockchain data natively without trusting RPCs. The long-term "Verge" goal of Stateless Clients will let any device become a light node. Current advice: use private RPCs.',
            techTerms: [
              "Helios Light Client",
              "Stateless Client",
              "RPC Decentralization",
              "Private RPC",
            ],
            eta: "Helios 🔄 In progress; Full Stateless Nodes Hegotá+ (H2 2026+)",
            maturity: "Research",
            confidence: "medium",
            links: [
              {
                type: "tool",
                label: "Helios Light Node (GitHub)",
                url: "https://github.com/a16z/helios",
              },
            ],
            termExplainers: [
              {
                term: "Helios",
                explanation:
                  "Rust-based light client backed by a16z/EF, verifies data right in your browser.",
                url: "https://github.com/a16z/helios",
              },
              {
                term: "RPC",
                explanation:
                  "Remote Procedure Call. How wallets talk to the blockchain. Usually centralized servers.",
                url: null,
              },
              {
                term: "Stateless Client",
                explanation:
                  "Allows validating new blocks using a tiny footprint instead of downloading the whole state.",
                url: null,
              },
            ],
          },
        ],
      },
      {
        id: "privacy_tx",
        title: "Transaction Privacy / MEV",
        description:
          "Transactions can be seen in the mempool, leading to front-running and worse execution prices.",
        severity: 7,
        items: [
          {
            id: "p4",
            question:
              'When buying tokens on a DEX, I often get front-run or "sandwiched" and buy at awful prices?',
            riskSummary:
              "High-value or time-sensitive transactions get front-run, worsening prices or outright failing them.",
            severity: 7,
            impact: 7,
            difficulty: 7,
            solution:
              'Major changes coming! The Glamsterdam upgrade (H1 2026) aims to embed "ePBS" (EIP-7732) into the protocol. This separates block "proposers" from "builders", making MEV transparent and less predatory. You can also use private mempools like MEV Blocker today.',
            techTerms: [
              "ePBS (EIP-7732)",
              "Flashbots Protect",
              "MEV Blocker",
              "Encrypted Mempool",
            ],
            eta: "ePBS 🔄 Glamsterdam H1 2026; Flashbots Protect ✅ Live Now",
            maturity: "Testnet",
            confidence: "medium",
            links: [
              {
                type: "tool",
                label: "MEV Blocker",
                url: "https://mevblocker.io",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "node",
    title: "Node & Decentralization",
    icon: <Server className="w-6 h-6" />,
    topics: [
      {
        id: "node_barrier",
        title: "Node Hardware Hurdles",
        description:
          "Running a node requires massive SSDs and high specs, locking out everyday users.",
        severity: 6,
        items: [
          {
            id: "p5",
            question:
              "I want to run a node, but I heard you need a massive hard drive and gaming PC specs?",
            riskSummary:
              "High node barriers centralize validation, hurting network censorship resistance.",
            severity: 6,
            impact: 7,
            difficulty: 8,
            solution:
              "Slimming down significantly! Verkle Trees (Hegotá, H2 2026) will massively reduce node storage requirements. Long term, Stateless Clients mean you can verify blocks without syncing the whole chain. EF is also researching Post-Quantum Cryptography.",
            techTerms: [
              "Verkle Trees",
              "Stateless Clients",
              "Post-Quantum Cryptography",
            ],
            eta: "Verkle Trees 🔄 Hegotá H2 2026; Post-Quantum 2027+",
            maturity: "Testnet",
            confidence: "medium",
            links: [],
          },
        ],
      },
      {
        id: "node_staking",
        title: "Staking Centralization",
        description:
          "Lido, Coinbase, etc. hold too much relative staking power, posing centralization risks.",
        severity: 7,
        items: [
          {
            id: "p12",
            question:
              "I heard Lido controls 30% of Ethereum staking. Isn't that literally centralization?",
            riskSummary:
              "Lido, Coinbase, and other giants control >50% of staked ETH. Theoretically, they could collude to censor or reorganize the network.",
            severity: 7,
            impact: 9,
            difficulty: 9,
            solution:
              'This is the main target of "The Scourge". Lido implemented "Dual Governance" letting stETH holders veto proposals. Protocol-wise, DVT (Distributed Validator Tech) allows a single validator key to be split across multiple node operators. EF members commit to using minority clients.',
            techTerms: [
              "DVT",
              "Dual Governance (Lido)",
              "The Scourge Phase",
              "EIP-7251 (Max Balance)",
            ],
            eta: "DVT 🔄 Advancing now; Scourge solutions 2027+",
            maturity: "Research",
            confidence: "medium",
            links: [],
          },
          {
            id: "p13",
            question:
              "I want to stake to help Ethereum but I don't have 32 ETH, and I refuse to use Lido?",
            riskSummary:
              "The 32 ETH barrier (tens of thousands of dollars) forces users to use centralized exchanges or Lido, exacerbating staking monopolies.",
            severity: 6,
            impact: 7,
            difficulty: 6,
            solution:
              "Pectra's EIP-7251 raised the Max Effective Balance from 32 to 2048 ETH, letting huge validators consolidate machines. For small fish: Rocketpool and SSV Network offer decentralized staking pools without needing 32 ETH. DVT ensures small stakers can run a partial node.",
            techTerms: [
              "EIP-7251 (Max Effective Balance)",
              "DVT",
              "Rocketpool / SSV",
              "Decentralized Staking Pools",
            ],
            eta: "EIP-7251 ✅ Live (Pectra May 2025); Decentralized Pools ✅ Live Now",
            maturity: "Mainnet",
            confidence: "high",
            links: [
              {
                type: "tool",
                label: "Compare Staking Options (Eth.org)",
                url: "https://ethereum.org/staking",
              },
            ],
          },
        ],
      },
    ],
  },
];

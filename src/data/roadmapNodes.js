export const roadmapNodesZh = [
    {
        id: "frontier", phase: "Frontier", date: "2015年7月", status: "completed",
        title: "創世發佈", description: "以太坊主網正式發佈，當時僅限開發者使用，尚無圖形介面。",
        painPoints: [],
        highlights: [
            { title: '以太坊誕生', desc: '主網正式上線，但僅能透過命令列操作，普通使用者幾乎無法使用。這個階段的重點是驗證「智慧合約平台」的概念是否可行。' }
        ]
    },
    {
        id: "homestead", phase: "Homestead", date: "2016年3月", status: "completed",
        title: "第一個穩定版本", description: "移除早期的安全性免責聲明，以太坊正式宣告進入穩定可用階段。",
        painPoints: [],
        highlights: [
            { title: '穩定性宣告', desc: '官方移除了「這是實驗性軟體」的免責聲明，正式進入生產環境。同年 DAO 被駭事件也促使社群更重視智慧合約安全審計。' }
        ]
    },
    {
        id: "byzantium", phase: "Byzantium", date: "2017年10月", status: "completed",
        title: "ZK 技術埋伏筆", description: "加入了 ZK 密碼學所需的底層運算元件；開始控制通膨。",
        painPoints: [],
        highlights: [
            { title: '隱私技術基礎建立', desc: '加入 ZK-SNARK 所需的預編譯合約（EIP-196、EIP-197），為日後的隱私交易與 ZK Rollup 鋪路。' },
            { title: '通膨開始控制', desc: '區塊獎勵從 5 ETH 降至 3 ETH，首次展現社群對 ETH 經濟模型的主動管理。' }
        ]
    },
    {
        id: "constantinople", phase: "Constantinople", date: "2019年2月", status: "completed",
        title: "效率與經濟模型調整", description: "區塊獎勵從 3 ETH 減至 2 ETH、Gas 優化。",
        painPoints: [],
        highlights: [
            { title: 'Gas 成本初步下降', desc: '引入更便宜的位元操作指令（EIP-1052、EIP-1283），但整體鏈上操作費用依然偏高。' },
            { title: 'ETH 發行量再降', desc: '區塊獎勵從 3 ETH 降至 2 ETH，持續壓低通膨，為後來的「超音速貨幣」敘事埋下伏筆。' }
        ]
    },
    {
        id: "istanbul", phase: "Istanbul", date: "2019年12月", status: "completed",
        title: "為 L2 鋪路", description: "降低 Rollup 相關操作的 Gas 費用，大幅降低未來 L2 的運作成本。",
        painPoints: [],
        highlights: [
            { title: 'L2 擴容的起點', desc: 'EIP-2028 大幅降低 calldata 費用，讓未來的 Rollup 方案（Optimism、Arbitrum 等）可以用更低成本在 L1 上提交資料。' },
            { title: '跨鏈互通基礎', desc: '加入 ChainID 操作碼（EIP-1344），讓智慧合約能辨識自己在哪條鏈上，為日後的多鏈生態打下基礎。' }
        ]
    },
    {
        id: "muir-glacier", phase: "Muir Glacier", date: "2020年1月", status: "completed",
        title: "難度炸彈延遲", description: "再次延遲難度炸彈，讓 PoW 挖礦能維持到 The Merge。",
        painPoints: [],
        highlights: [
            { title: '維持網路穩定', desc: '難度炸彈會讓出塊時間越來越長，甚至導致網路癱瘓。延遲它確保了在轉向 PoS 之前，網路能持續正常運作。' }
        ]
    },
    {
        id: "berlin", phase: "Berlin", date: "2021年4月", status: "completed",
        title: "Gas 效率調整", description: "降低讀取儲存資料的操作費用，修復安全漏洞。",
        painPoints: [],
        highlights: [
            { title: 'Gas 計費更合理', desc: 'EIP-2929 讓首次存取新地址的 Gas 較高（防 DoS），但後續存取同一地址變便宜。整體讓合約互動費用更可預期。' },
            { title: '交易類型擴展', desc: 'EIP-2718 引入統一的交易類型封裝，讓未來新增交易功能（如 EIP-1559）更容易，而不需要硬分叉。' }
        ]
    },
    {
        id: "london", phase: "London (EIP-1559)", date: "2021年8月", status: "completed",
        title: "Gas 機制改革", description: "引入基礎費 + 小費，開始銷毀部分 ETH，費用可預期。",
        painPoints: ["L1 手續費與吞吐"],
        highlights: [
            { title: 'Gas 費用終於可預期', desc: '告別了「盲目競價」的舊機制。EIP-1559 讓每個區塊有明確的基礎費，你只需決定小費多寡。錢包可以自動估算費用，大幅降低了「Gas 設太低導致交易卡住」的焦慮。' },
            { title: 'ETH 開始通縮', desc: '每筆交易的基礎費會被銷毀，而非付給礦工。在交易量高時，銷毀的 ETH 甚至可能超過新發行量，讓 ETH 成為「通縮貨幣」。' }
        ]
    },
    {
        id: "merge", phase: "The Merge", date: "2022年9月", status: "completed",
        title: "共識層合併", description: "將挖礦切換為質押，以太坊能耗降低 99.95%。",
        painPoints: ["質押集中化"],
        highlights: [
            { title: '告別挖礦，轉向質押', desc: '以太坊從 PoW（工作量證明）無縫切換至 PoS（權益證明），能源消耗瞬間降低 99.95%。這是加密貨幣史上最大規模的共識機制遷移，過程中零停機。' },
            { title: 'ETH 發行量大降 90%', desc: '不再需要支付高額挖礦獎勵，ETH 新增發行量從每天約 13,000 ETH 降至約 1,600 ETH。搭配 EIP-1559 的銷毀機制，ETH 正式進入「淨通縮」時代。' }
        ]
    },
    {
        id: "shanghai", phase: "Shanghai", date: "2023年4月", status: "completed",
        title: "開放質押提款", description: "質押者終於能提回 ETH，PoS 證明實際可行。",
        painPoints: ["質押集中化"],
        highlights: [
            { title: '質押的 ETH 終於能提出來了', desc: '自 2020 年 12 月信標鏈上線以來，質押者的 ETH 被鎖了整整 2.5 年。Shanghai 升級讓提款成為可能，證明 PoS 不是「進得去出不來」的陷阱，大幅提升市場對質押的信心。' },
            { title: '質押參與率飆升', desc: '提款功能上線後，更多人願意參與質押（因為知道可以退出），驗證者數量從 56 萬增至超過 100 萬，網路安全性大幅提升。' }
        ]
    },
    {
        id: "dencun", phase: "Dencun", date: "2024年3月", status: "completed",
        title: "L2 手續費大降", description: "引入 Blob 空間讓 Rollup 費用降低數十倍。",
        painPoints: ["L1 手續費與吞吐", "L2 碎片化與跨鏈麻煩"],
        highlights: [
            { title: 'Rollup 手續費降低 10～100 倍', desc: '透過 EIP-4844 引入「Blob 資料」，讓 Optimism、Arbitrum、zkSync 等 L2 可以用更低成本把資料送上以太坊。實際效果：Optimism 上的轉帳手續費從幾美元降至幾分錢。' },
            { title: '奠定 L2 規模化基礎', desc: 'Blob 空間是「Proto-Danksharding」的第一步，讓以太坊本身的資料承載量大幅成長，為未來更多 Rollup 上鏈鋪路。' }
        ]
    },
    {
        id: "pectra", phase: "Pectra", date: "2025年5月", status: "completed",
        title: "無 ETH 也能付 Gas", description: "帳戶抽象（EIP-7702）上線主網。",
        painPoints: ["新手入門門檻", "助記詞與帳戶恢復", "智慧合約授權風險"],
        highlights: [
            { title: '用穩定幣付手續費', desc: 'EIP-7702 讓普通錢包暫時取得智慧合約能力，可以用 USDC 等代幣支付 Gas，不再需要先備一點 ETH 才能轉帳。' },
            { title: '錢包更難被盜、更好用', desc: '支援「社群恢復」與批次交易：萬一手機丟失，不再只靠助記詞。一個操作就能完成多步驟的 DeFi 流程，省時省 Gas。' },
            { title: '驗證者體驗升級', desc: '質押上限從 32 ETH 提高至 2048 ETH，讓大型驗證者合併帳戶，整體網路效率提升。' }
        ]
    },
    {
        id: "glamsterdam", phase: "Glamsterdam", date: "預計 2026 上半年", status: "in_progress",
        title: "防夾擊與 L1 降費", description: "將打包與提議者分離，減少被搶跑風險。",
        painPoints: ["交易隱私 / MEV", "L1 手續費與吞吐"],
        highlights: [
            { title: '打包者與提議者分離（ePBS）', desc: '把「選擇哪些交易打包」與「提議區塊」分開由不同角色負責，降低驗證者直接操縱交易排序的誘因，讓一般使用者被夾擊攻擊的機率下降。' },
            { title: 'L1 Gas 費用結構優化', desc: '引入區塊層級的存取清單與其他 Gas 調整，預計讓鏈上合約互動成本進一步下降，有利於 DeFi 用戶直接在 L1 操作。' }
        ]
    },
    {
        id: "hegota", phase: "Hegotá", date: "預計 2026 下半年+", status: "future",
        title: "輕量節點與無縫跨鏈", description: "無縫跨鏈體驗、私有隱形地址、降低節點硬碟門檻。",
        painPoints: ["節點硬體門檻", "質押集中化", "資產持有隱私"],
        highlights: [
            { title: '無狀態節點：硬碟需求大幅下降', desc: '目前跑一個以太坊全節點需要 2TB+ 硬碟。Hegotá 計畫引入歷史資料過期機制，讓普通電腦也能參與驗證，去中心化程度提升。' },
            { title: '隱形地址（Stealth Addresses）', desc: '收款方可以產生一次性地址，讓付款者與外界都無法輕易追蹤資產歸屬，為鏈上隱私提供基礎設施。' }
        ]
    }
];

export const roadmapNodesEn = [
    {
        id: "frontier", phase: "Frontier", date: "July 2015", status: "completed",
        title: "Genesis Release", description: "Ethereum mainnet launched. For developers only, no graphical interface.",
        painPoints: [],
        highlights: [
            { title: 'Birth of Ethereum', desc: 'Mainnet went live but was operated entirely through command line. Focused on proving the viability of a "smart contract platform".' }
        ]
    },
    {
        id: "homestead", phase: "Homestead", date: "March 2016", status: "completed",
        title: "First Stable Release", description: "Early safety warnings removed, entering the stable production phase.",
        painPoints: [],
        highlights: [
            { title: 'Stability Declaration', desc: 'Official removal of the "experimental software" warning. The DAO hack occurred this year, pushing the community to emphasize smart contract audits.' }
        ]
    },
    {
        id: "byzantium", phase: "Byzantium", date: "Oct 2017", status: "completed",
        title: "ZK Tech Foundation", description: "Added base components for ZK cryptography; began controlling inflation.",
        painPoints: [],
        highlights: [
            { title: 'Privacy Tech Foundations', desc: 'Added precompiled contracts for ZK-SNARKs (EIP-196, EIP-197), paving the way for future privacy transactions and ZK Rollups.' },
            { title: 'Inflation Control', desc: 'Block reward reduced from 5 ETH to 3 ETH, demonstrating proactive management of ETH economics.' }
        ]
    },
    {
        id: "constantinople", phase: "Constantinople", date: "Feb 2019", status: "completed",
        title: "Efficiency & Economics", description: "Block reward reduced from 3 ETH to 2 ETH; Gas optimizations.",
        painPoints: [],
        highlights: [
            { title: 'Initial Gas Cost Reduction', desc: 'Introduced cheaper bitwise operation instructions (EIP-1052, EIP-1283), though overall chain costs remained high.' },
            { title: 'ETH Issuance Dropped Again', desc: 'Block reward reduced from 3 ETH to 2 ETH, consistently compressing inflation in preparation for the "ultrasound money" narrative.' }
        ]
    },
    {
        id: "istanbul", phase: "Istanbul", date: "Dec 2019", status: "completed",
        title: "Paving the Way for L2", description: "Lowered Gas fees for Rollup operations, significantly dropping future L2 costs.",
        painPoints: [],
        highlights: [
            { title: 'Starting Point for L2 Scaling', desc: 'EIP-2028 greatly reduced calldata costs, allowing future Rollups (Optimism, Arbitrum, etc.) to post data on L1 much more cheaply.' },
            { title: 'Cross-chain Interop Foundation', desc: 'Added the ChainID Opcode (EIP-1344), letting contracts know which chain they are on, forming the basis for a multichain ecosystem.' }
        ]
    },
    {
        id: "muir-glacier", phase: "Muir Glacier", date: "Jan 2020", status: "completed",
        title: "Difficulty Bomb Delay", description: "Delayed the difficulty bomb to keep PoW mining viable until The Merge.",
        painPoints: [],
        highlights: [
            { title: 'Maintaining Network Stability', desc: 'The difficulty bomb exponentially delays block times. Delaying it ensured the network ran smoothly before transitioning to PoS.' }
        ]
    },
    {
        id: "berlin", phase: "Berlin", date: "April 2021", status: "completed",
        title: "Gas Efficiency Adjustments", description: "Lowered costs of accessing stored data; fixed security vulnerabilities.",
        painPoints: [],
        highlights: [
            { title: 'Logical Gas Billing', desc: 'EIP-2929 increased gas costs for first-time address access (preventing DoS), but made subsequent accesses cheaper, stabilizing contract interaction fees.' },
            { title: 'Expanded Transaction Types', desc: 'EIP-2718 introduced a unified transaction envelope, making it easier to add new transaction types (like EIP-1559) without requiring hard forks.' }
        ]
    },
    {
        id: "london", phase: "London (EIP-1559)", date: "Aug 2021", status: "completed",
        title: "Gas Mechanism Reform", description: "Introduced base fee + priority tip, burning part of ETH, making fees predictable.",
        painPoints: ["L1 Fees & Throughput"],
        highlights: [
            { title: 'Predictable Gas Fees', desc: 'Ended "blind bidding". EIP-1559 gave each block an explicit base fee. Wallets can auto-estimate, reducing "stuck transaction" anxiety.' },
            { title: 'Deflationary ETH', desc: 'Base fees are burned, not given to miners. During high usage, burned ETH exceeded issuance, making ETH a "deflationary asset".' }
        ]
    },
    {
        id: "merge", phase: "The Merge", date: "Sept 2022", status: "completed",
        title: "Consensus Layer Merge", description: "Switched from mining to staking, cutting Ethereum's energy use by 99.95%.",
        painPoints: ["Staking Centralization"],
        highlights: [
            { title: 'Farewell Mining, Hello Staking', desc: 'Seamlessly switched from PoW (Proof of Work) to PoS (Proof of Stake). Zero downtime during the transition. The largest consensus mechanism migration in crypto history.' },
            { title: 'ETH Issuance Dropped by 90%', desc: 'Without needing to pay massive mining rewards, ETH issuance dropped from ~13,000 ETH/day to ~1,600 ETH/day. Paired with EIP-1559, ETH became definitively deflationary.' }
        ]
    },
    {
        id: "shanghai", phase: "Shanghai", date: "April 2023", status: "completed",
        title: "Staking Withdrawals Enabled", description: "Stakers were finally able to withdraw ETH, proving PoS viability.",
        painPoints: ["Staking Centralization"],
        highlights: [
            { title: 'Staked ETH is Finally Liquid', desc: 'Stakers had their ETH locked for 2.5 years since Beacon Chain launch. Shanghai allowed withdrawals, proving PoS isn\'t a trap.' },
            { title: 'Staking Participation Surged', desc: 'After withdrawals went live, validator count ballooned from 560k to over 1M, significantly increasing network security.' }
        ]
    },
    {
        id: "dencun", phase: "Dencun", date: "March 2024", status: "completed",
        title: "Massive L2 Fee Drop", description: "Introduced Blob space, reducing Rollup fees by tens of times.",
        painPoints: ["L1 Fees & Throughput", "L2 Fragmentation & Bridging"],
        highlights: [
            { title: 'Rollup Fees Drop 10–100x', desc: 'EIP-4844 introduced "Blob data", letting L2s post data to Ethereum at a fraction of the previous cost.' },
            { title: 'Foundation for L2 Scale', desc: 'Blob space dramatically increased Ethereum\'s data bandwidth, paving the way for more rollup activity.' }
        ]
    },
    {
        id: "pectra", phase: "Pectra", date: "May 2025", status: "completed",
        title: "Pay Gas Without ETH", description: "Account Abstraction (EIP-7702) launched on Mainnet.",
        painPoints: ["Onboarding Frictions", "Seed Phrases & Recovery", "Smart Contract Approvals Risk"],
        highlights: [
            { title: 'Pay Gas in Stablecoins', desc: 'EIP-7702 lets you pay gas with USDC or other tokens — no need to hold ETH just to transact.' },
            { title: 'Safer, Smarter Wallets', desc: 'Supports social recovery and batch transactions: lose your phone, not your money. Complete DeFi flows in one click.' }
        ]
    },
    {
        id: "glamsterdam", phase: "Glamsterdam", date: "Exp. H1 2026", status: "in_progress",
        title: "Anti-Frontrunning & L1 Fee Cuts", description: "Proposer-Builder Separation helps mitigate front-running and MEV risks.",
        painPoints: ["Transaction Privacy / MEV", "L1 Fees & Throughput"],
        highlights: [
            { title: 'Proposer-Builder Separation (ePBS)', desc: 'Separates "who orders transactions" from "who proposes the block", reducing incentives for validators to front-run users.' },
            { title: 'L1 Gas Structure Improvements', desc: 'Block-level access lists and other gas tweaks are expected to lower on-chain contract interaction costs.' }
        ]
    },
    {
        id: "hegota", phase: "Hegotá", date: "Exp. H2 2026+", status: "future",
        title: "Light Nodes & Seamless Crosschain", description: "Seamless cross-chain, stealth addresses, and lower hardware requirements for nodes.",
        painPoints: ["Node Hardware Requirements", "Staking Centralization", "Asset Holding Privacy"],
        highlights: [
            { title: 'Stateless Nodes: Much Lower Storage', desc: 'Running a full node today needs 2TB+ storage. Hegotá aims to make history expire so ordinary machines can validate.' },
            { title: 'Stealth Addresses', desc: 'Recipients can use one-time addresses so senders and observers cannot easily link payments to an identity.' }
        ]
    }
];

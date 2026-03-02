// Consumer-friendly "Recently Updated EIPs" section
// Shows what's being actively discussed in the next upgrade, in plain language
import { useMemo } from 'react';
import { eipsData } from '../data/eips';
import { ExternalLink, Zap, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

type Language = 'zh' | 'en';

interface ConsumerEIPSectionProps {
    language?: Language;
    darkMode?: boolean;
}

const SECTION_TITLE: Record<Language, string> = {
    zh: '近期 EIP 動態',
    en: 'Recently Updated Proposals',
};

const SECTION_SUBTITLE: Record<Language, string> = {
    zh: '以太坊升級的細節是由許多「改進提案」（EIP）組成的。以下是近期有新進展的提案，用白話說明它在解決什麼問題。',
    en: 'Ethereum upgrades are made up of individual improvement proposals (EIPs). Below are the ones with recent activity, explained in plain language.',
};

const STATUS_PILL: Record<string, { label: Record<Language, string>; color: string; icon: React.ReactNode }> = {
    'Scheduled': {
        label: { zh: '已排入升級', en: 'Scheduled' },
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
        icon: <CheckCircle2 className="w-3 h-3" />,
    },
    'Considered': {
        label: { zh: '審議中', en: 'Under Review' },
        color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
        icon: <Clock className="w-3 h-3" />,
    },
    'Declined': {
        label: { zh: '本次未採納', en: 'Not Included' },
        color: 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
        icon: <XCircle className="w-3 h-3" />,
    },
    'Withdrawn': {
        label: { zh: '提案已撤回', en: 'Withdrawn' },
        color: 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
        icon: <XCircle className="w-3 h-3" />,
    },
    'Included': {
        label: { zh: '已納入', en: 'Included' },
        color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800',
        icon: <Zap className="w-3 h-3" />,
    },
    'CFI': {
        label: { zh: '候選納入', en: 'Candidate' },
        color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
        icon: <AlertCircle className="w-3 h-3" />,
    },
};

const DATE_PREFIX: Record<Language, string> = {
    zh: '最後更新：',
    en: 'Updated: ',
};

const FORK_LABEL: Record<Language, string> = { zh: '關聯升級', en: 'Upgrade' };
const VIEW_MORE: Record<Language, string> = { zh: '查看詳情', en: 'View details' };

// Human-written Chinese summaries for the most common recent EIPs
// Key: eipNumber, value: { zh: "...", en: "..." }
const EIP_CONSUMER_SUMMARY: Record<number, Record<Language, string>> = {
    8105: {
        zh: '讓交易在被打包前先加密，防止被礦工或機器人搶先交易。此提案已改以另一種方式推進。',
        en: 'Encrypts transactions before they\'re packaged to prevent bots from front-running. Replaced by an alternative approach.',
    },
    7805: {
        zh: '讓多個驗證者強制要求特定交易被納入區塊，使網路更難被審查、更公平。',
        en: 'Lets multiple validators mandate that specific transactions get included, making the network more censorship-resistant.',
    },
    7975: {
        zh: '當一個區塊的交易量很大時，把「收據」分批發送，防止節點因資料量過大而無法同步。',
        en: 'Sends block receipts in smaller chunks when they\'re too large, preventing sync failures for nodes.',
    },
    8159: {
        zh: '讓節點之間分享「這個區塊用到了哪些地址與資料」，加快新節點同步速度。',
        en: 'Lets nodes share which accounts and data a block touched, enabling faster syncing and parallel processing.',
    },
    7610: {
        zh: '修補一個邊緣案例：防止在已有資料的地址上重複部署智慧合約，避免資安問題。',
        en: 'Prevents deploying smart contracts on addresses that already contain data, closing an edge-case security gap.',
    },
    7872: {
        zh: '讓節點運營商設定每個區塊最多打包多少 Blob 交易，避免頻寬不足的節點過載。',
        en: 'Lets node operators cap how many blob transactions their builder includes per block, helping bandwidth-limited setups.',
    },
    7949: {
        zh: '統一「創世檔案」的格式，讓不同以太坊客戶端更容易相容，簡化新網路的啟動流程。',
        en: 'Standardizes the genesis file format for smoother compatibility across Ethereum clients.',
    },
};

interface RecentEntry {
    eipNumber: number;
    title: string;
    laymanDescription: string;
    forkName: string;
    status: string;
    date: string;
    discussionLink?: string;
}

export default function ConsumerEIPSection({ language = 'zh', darkMode = false }: ConsumerEIPSectionProps) {
    const recentEIPs: RecentEntry[] = useMemo(() => {
        const entries: RecentEntry[] = [];

        eipsData.forEach((eip) => {
            if (!eip.laymanDescription) return;

            eip.forkRelationships.forEach((fr) => {
                fr.statusHistory.forEach((sh) => {
                    if (sh.date) {
                        entries.push({
                            eipNumber: eip.id,
                            title: eip.title,
                            laymanDescription: eip.laymanDescription!,
                            forkName: fr.forkName,
                            status: sh.status,
                            date: sh.date,
                            discussionLink: eip.discussionLink,
                        });
                    }
                });
            });
        });

        // Deduplicate: keep only the most recent entry per EIP
        const seen = new Set<number>();
        return entries
            .sort((a, b) => (b.date > a.date ? 1 : -1))
            .filter((e) => {
                if (seen.has(e.eipNumber)) return false;
                seen.add(e.eipNumber);
                return true;
            })
            .slice(0, 4);
    }, []);

    if (recentEIPs.length === 0) return null;

    const eipUrl = (n: number) => `/eips/eip-${n}`;

    return (
        <div className="mt-14">
            {/* Section heading */}
            <div className={`mb-5 pb-3 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-1 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    {SECTION_TITLE[language]}
                </h2>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {SECTION_SUBTITLE[language]}
                </p>
            </div>

            {/* EIP grid — 2 columns max, matching Forkcast's layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentEIPs.map((entry) => {
                    const pill = STATUS_PILL[entry.status] ?? STATUS_PILL['Considered'];
                    const label = pill.label[language];

                    // Use our hand-written consumer summary first, then fall back to laymanDescription
                    const consumerSummary = EIP_CONSUMER_SUMMARY[entry.eipNumber]?.[language];
                    const rawDesc = consumerSummary ?? entry.laymanDescription;
                    // Strip markdown links like [text](url) → text
                    const cleanDesc = rawDesc.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
                    const desc = cleanDesc.length > 180 ? cleanDesc.slice(0, 177) + '…' : cleanDesc;

                    const link = entry.discussionLink ?? eipUrl(entry.eipNumber);

                    return (
                        <div
                            key={`${entry.eipNumber}-${entry.forkName}`}
                            className={`rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200
                ${darkMode
                                    ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50'
                                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}`}
                        >
                            {/* Top meta row */}
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* EIP number badge */}
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono
                        ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                                        EIP-{entry.eipNumber}
                                    </span>
                                    {/* Upgrade tag */}
                                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium
                        ${darkMode ? 'bg-indigo-900/30 border-indigo-700/50 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
                                        {FORK_LABEL[language]}: {entry.forkName}
                                    </span>
                                </div>
                                {/* Labeled date */}
                                <span className={`text-[11px] shrink-0 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {DATE_PREFIX[language]}{entry.date}
                                </span>
                            </div>

                            {/* Status pill */}
                            <span className={`self-start inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${pill.color}`}>
                                {pill.icon}{label}
                            </span>

                            {/* Consumer summary — the key value */}
                            <p className={`text-sm leading-relaxed flex-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {desc}
                            </p>

                            {/* Link */}
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={`text-xs inline-flex items-center gap-1 font-medium transition-colors ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                            >
                                {VIEW_MORE[language]} <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

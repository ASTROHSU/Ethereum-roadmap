// Consumer-oriented Upgrade Carousel: zh-first, with pain point tags, full upgrade history
import { useState } from 'react';
import { CheckCircle2, CircleDashed, Circle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { roadmapNodesZh, roadmapNodesEn } from '../data/roadmapNodes';

type Language = 'zh' | 'en';
type NodeStatus = 'completed' | 'in_progress' | 'future';

interface RoadmapNode {
    id: string;
    phase: string;
    date: string;
    status: NodeStatus;
    title: string;
    description: string;
    painPoints: string[];
    highlights?: { title: string; desc: string }[];
}

interface ConsumerUpgradeCarouselProps {
    language?: Language;
    darkMode?: boolean;
}

const STATUS_LABELS: Record<Language, Record<NodeStatus, string>> = {
    zh: { completed: '已完成', in_progress: '進行中', future: '規劃中' },
    en: { completed: 'Live', in_progress: 'Upcoming', future: 'Planning' },
};

const PAIN_POINT_SOLVED_LABEL: Record<Language, string> = {
    zh: '解決的使用者痛點',
    en: 'User Painpoints Addressed',
};

const HIGHLIGHTS_LABEL: Record<Language, string> = {
    zh: '重要里程碑',
    en: 'Key Highlights',
};

const STATUS_COLORS: Record<NodeStatus, string> = {
    completed: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    in_progress: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    future: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
};

export default function ConsumerUpgradeCarousel({
    language = 'zh',
    darkMode = false,
}: ConsumerUpgradeCarouselProps) {
    const nodes: RoadmapNode[] = (language === 'zh' ? roadmapNodesZh : roadmapNodesEn) as RoadmapNode[];

    const visibleCount = 3;
    const maxIndex = Math.max(0, nodes.length - visibleCount);
    const [currentIndex, setCurrentIndex] = useState(maxIndex);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const visibleNodes = nodes.slice(currentIndex, currentIndex + visibleCount);
    const dotCount = Math.max(1, nodes.length - visibleCount + 1);

    const goToPrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
    const goToNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

    const renderStatusDot = (status: NodeStatus) => {
        if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
        if (status === 'in_progress') return <CircleDashed className="w-4 h-4 text-blue-500 flex-shrink-0" />;
        return <Circle className="w-4 h-4 text-purple-400 flex-shrink-0" />;
    };

    const renderCard = (node: RoadmapNode) => {
        const isExpanded = expandedId === node.id;
        const statusLabel = STATUS_LABELS[language][node.status];
        const statusColor = STATUS_COLORS[node.status];
        const hasDetail = (node.highlights && node.highlights.length > 0) || (node.painPoints && node.painPoints.length > 0);

        return (
            <div
                key={node.id}
                className={`flex flex-col rounded-xl border transition-all duration-200 overflow-hidden h-full
          ${darkMode
                        ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}
          ${isExpanded ? (darkMode ? 'border-indigo-500/60 shadow-lg' : 'border-indigo-300 shadow-lg') : ''}
        `}
            >
                <div className="p-5 flex flex-col flex-1">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                            {renderStatusDot(node.status)}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                {statusLabel}
                            </span>
                        </div>
                        <span className={`text-xs shrink-0 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {node.date}
                        </span>
                    </div>

                    {/* Phase name */}
                    <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {node.phase}
                    </h3>

                    {/* Consumer-friendly title */}
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        {node.title}
                    </p>

                    {/* Short description */}
                    <p className={`text-sm leading-relaxed flex-1 mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {node.description}
                    </p>

                    {/* Pain point tags */}
                    {node.painPoints?.length > 0 && (
                        <div className="mb-3">
                            <p className={`text-[10px] uppercase font-bold tracking-wider mb-1.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {PAIN_POINT_SOLVED_LABEL[language]}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {node.painPoints.map((pp, i) => (
                                    <span
                                        key={i}
                                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium border
                      ${darkMode
                                                ? 'bg-rose-900/30 text-rose-300 border-rose-800/50'
                                                : 'bg-rose-50 text-rose-600 border-rose-200'}`}
                                    >
                                        {pp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expand button */}
                    {hasDetail && (
                        <button
                            onClick={() => setExpandedId(isExpanded ? null : node.id)}
                            className={`mt-auto flex items-center gap-1 text-xs font-medium transition-colors
                ${darkMode
                                    ? 'text-slate-400 hover:text-indigo-300'
                                    : 'text-slate-500 hover:text-indigo-600'}`}
                        >
                            {isExpanded
                                ? <><ChevronUp className="w-3.5 h-3.5" />{language === 'zh' ? '收起' : 'Collapse'}</>
                                : <><ChevronDown className="w-3.5 h-3.5" />{language === 'zh' ? '展開亮點' : 'Show Highlights'}</>
                            }
                        </button>
                    )}
                </div>

                {/* Expandable highlights */}
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
                    {node.highlights && node.highlights.length > 0 && (
                        <div className={`px-5 pb-5 space-y-3 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                            <p className={`text-[10px] uppercase font-bold tracking-wider pt-3 mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {HIGHLIGHTS_LABEL[language]}
                            </p>
                            {node.highlights.map((h, i) => (
                                <div
                                    key={i}
                                    className={`rounded-lg p-3 text-sm ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                                >
                                    <p className={`font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{h.title}</p>
                                    <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{h.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderCompactCard = (node: RoadmapNode) => {
        const statusLabel = STATUS_LABELS[language][node.status];
        const statusColor = STATUS_COLORS[node.status];

        return (
            <div
                key={node.id}
                className={`rounded-lg border px-4 py-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
            >
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                        {renderStatusDot(node.status)}
                        <span className={`font-medium text-sm ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{node.phase}</span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${statusColor}`}>{statusLabel}</span>
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{node.date}</span>
                </div>
                <p className={`text-xs font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{node.title}</p>
                {node.painPoints?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {node.painPoints.map((pp, i) => (
                            <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded-full border ${darkMode ? 'bg-rose-900/30 text-rose-300 border-rose-800/50' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>{pp}</span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Desktop carousel */}
            <div className="hidden lg:block">
                <div className="relative">
                    <button
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        aria-label="Previous upgrades"
                        className={`absolute left-0 top-1/3 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 flex items-center justify-center rounded-full border shadow-md transition-all
              ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-lg'}
              ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-3 gap-6 items-start">
                        {visibleNodes.map((node) => (
                            <div key={node.id} className="min-h-[260px]">
                                {renderCard(node)}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={goToNext}
                        disabled={currentIndex >= maxIndex}
                        aria-label="Next upgrades"
                        className={`absolute right-0 top-1/3 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 flex items-center justify-center rounded-full border shadow-md transition-all
              ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-lg'}
              ${currentIndex >= maxIndex ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {nodes.length > visibleCount && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: dotCount }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(Math.min(i, maxIndex))}
                                className={`h-2 rounded-full transition-all duration-200 ${currentIndex === i
                                        ? `${darkMode ? 'bg-slate-200' : 'bg-slate-700'} w-5`
                                        : `${darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-300 hover:bg-slate-400'} w-2`
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile compact list */}
            <div className="lg:hidden space-y-3">
                {[...nodes].reverse().map((node) => renderCompactCard(node))}
            </div>
        </>
    );
}

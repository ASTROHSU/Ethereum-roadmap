// Consumer-oriented Upgrade Carousel
// Native horizontal scroll for trackpad support and simplified logic
import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, CircleDashed, Circle, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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

    const containerRef = useRef<HTMLDivElement>(null);
    const pectraCardRef = useRef<HTMLDivElement>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [scrollPosition, setScrollPosition] = useState(0);

    // 預設捲動到 Pectra，讓畫面一開始就顯示 Pectra、Glamsterdam、Hegotá 三個方塊
    useEffect(() => {
        const scrollToPectra = () => {
            if (containerRef.current && pectraCardRef.current) {
                const scrollTarget = pectraCardRef.current.offsetLeft;
                containerRef.current.scrollLeft = scrollTarget;
                checkScroll();
            }
        };
        const t = setTimeout(scrollToPectra, 150);
        return () => clearTimeout(t);
    }, [nodes]);

    const checkScroll = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
            setScrollPosition(scrollLeft);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            // Initial check after content is rendered
            setTimeout(checkScroll, 100);
            return () => container.removeEventListener('scroll', checkScroll);
        }
    }, [nodes]);

    const scroll = (direction: 'left' | 'right') => {
        if (containerRef.current) {
            const { clientWidth } = containerRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const renderStatusDot = (status: NodeStatus) => {
        if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
        if (status === 'in_progress') return <CircleDashed className="w-4 h-4 text-blue-500 flex-shrink-0" />;
        return <Circle className="w-4 h-4 text-purple-400 flex-shrink-0" />;
    };

    const renderCard = (node: RoadmapNode) => {
        const isExpanded = expandedId === node.id;
        const statusLabel = STATUS_LABELS[language][node.status];
        const statusColor = STATUS_COLORS[node.status];
        const hasHighlights = !!(node.highlights && node.highlights.length > 0);

        return (
            <div
                onClick={() => {
                    if (hasHighlights) {
                        // 只展開點擊的那張，其他保持收合（單一展開）
                        setExpandedId(isExpanded ? null : node.id);
                    }
                }}
                className={`flex flex-col h-full rounded-xl border transition-all duration-300 overflow-hidden
          ${hasHighlights ? 'cursor-pointer active:scale-[0.98]' : ''}
          ${darkMode
                        ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}
          ${isExpanded ? (darkMode ? 'border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30' : 'border-indigo-300 shadow-lg ring-1 ring-indigo-300/30') : ''}
        `}
            >
                <div className="p-5 flex flex-col">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                            {renderStatusDot(node.status)}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                {statusLabel}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] shrink-0 font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {node.date}
                            </span>
                            {hasHighlights && (
                                <span className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                                    <ChevronDown className="w-4 h-4" />
                                </span>
                            )}
                        </div>
                    </div>

                    <h3 className={`text-lg font-bold mb-1 leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {node.phase}
                    </h3>
                    <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {node.title}
                    </p>
                    <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {node.description}
                    </p>

                    {node.painPoints && node.painPoints.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50">
                            <p className={`text-[10px] uppercase font-bold tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {PAIN_POINT_SOLVED_LABEL[language]}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {node.painPoints.map((pp, i) => (
                                    <span key={i} className={`text-[11px] px-2 py-0.5 rounded-full font-medium border
                      ${darkMode ? 'bg-rose-950/40 text-rose-300 border-rose-800/30' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                        {pp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const expandedNode = expandedId ? nodes.find((n) => n.id === expandedId) : null;

    return (
        <div className="relative group/carousel py-6 mt-4">
            {/* Navigation buttons - shown on hover on desktop */}
            <button
                onClick={() => scroll('left')}
                className={`absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center rounded-full border shadow-xl transition-all duration-300 scale-90 hover:scale-100
          ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
          ${canScrollLeft ? 'opacity-0 lg:group-hover/carousel:opacity-100' : 'hidden'}
          active:scale-90`}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <button
                onClick={() => scroll('right')}
                className={`absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center rounded-full border shadow-xl transition-all duration-300 scale-90 hover:scale-100
          ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
          ${canScrollRight ? 'opacity-0 lg:group-hover/carousel:opacity-100' : 'hidden'}
          active:scale-90`}
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={containerRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 -mx-4 pb-4 no-scrollbar scroll-smooth"
                style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}} />
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        ref={node.id === 'pectra' ? pectraCardRef : undefined}
                        className="snap-start shrink-0 w-[85vw] md:w-[45vw] lg:w-[calc(33.333%-16px)]"
                    >
                        {renderCard(node)}
                    </div>
                ))}
            </div>

            {/* Scroll Indicator Dots */}
            <div className="flex justify-center gap-2.5 mt-6">
                {Array.from({ length: Math.ceil(nodes.length / (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1)) }).map((_, i) => {
                    const itemsPerPage = containerRef.current ? (containerRef.current.clientWidth + 24) : 1;
                    const isActive = Math.round(scrollPosition / itemsPerPage) === i;

                    return (
                        <button
                            key={i}
                            onClick={() => {
                                if (containerRef.current) {
                                    containerRef.current.scrollTo({
                                        left: i * itemsPerPage,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className={`h-1.5 rounded-full transition-all duration-500 ${isActive
                                ? `${darkMode ? 'bg-indigo-400 w-8' : 'bg-indigo-600 w-8'}`
                                : `${darkMode ? 'bg-slate-700 w-1.5' : 'bg-slate-200 w-1.5'} hover:bg-slate-300 dark:hover:bg-slate-600`
                                }`}
                        />
                    );
                })}
            </div>

            {/* 展開時：重要里程碑以全寬區塊顯示在下方，善用空間 */}
            {expandedNode?.highlights && expandedNode.highlights.length > 0 && (
                <div className={`mt-6 rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
                    <div className="px-6 py-5">
                        <p className={`text-xs uppercase font-bold tracking-wider mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {expandedNode.phase} · {HIGHLIGHTS_LABEL[language]}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {expandedNode.highlights.map((h, i) => (
                                <div key={i} className={`rounded-xl p-4 text-sm ${darkMode ? 'bg-slate-700/40 border border-slate-600/30' : 'bg-slate-50 border border-slate-100'}`}>
                                    <p className={`font-bold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{h.title}</p>
                                    <p className={`leading-relaxed text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{h.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

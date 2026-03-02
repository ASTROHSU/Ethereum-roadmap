import React, { useRef, useState, useEffect } from "react";
import {
  CheckCircle2,
  CircleDashed,
  Circle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  AlertCircle,
  Clock,
  Code,
} from "lucide-react";
import { roadmapNodesZh, roadmapNodesEn } from "../data/roadmapNodes";

const getSeverityLabel = (n, t) => {
  if (n <= 3) return t.severityLabels.low;
  if (n <= 6) return t.severityLabels.medium;
  return t.severityLabels.high;
};
const getSeverityColor = (n) => {
  if (n <= 3) return "bg-emerald-400";
  if (n <= 6) return "bg-amber-400";
  return "bg-rose-500";
};

export default function VisualRoadmap({
  roadmapData = [],
  darkMode = false,
  language = "zh",
  t,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const roadmapNodes = language === "zh" ? roadmapNodesZh : roadmapNodesEn;
  const [selectedNodeId, setSelectedNodeId] = useState("glamsterdam");
  const [expandedCard, setExpandedCard] = useState(null);

  const selectedNode =
    roadmapNodes.find((n) => n.id === selectedNodeId) || roadmapNodes[0];

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const pectraIndex = roadmapNodes.findIndex((n) => n.id === "pectra");
      const nodeWidth = window.innerWidth > 768 ? 312 : 292;
      const scrollTarget = pectraIndex * nodeWidth;
      setTimeout(() => {
        scrollContainerRef.current.scrollTo({
          left: scrollTarget,
          behavior: "smooth",
        });
      }, 300);
    }
  }, []);

  const scroll = (dir) => {
    if (scrollContainerRef.current) {
      const amount = window.innerWidth > 768 ? 600 : 300;
      scrollContainerRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const handleNodeClick = (node) => {
    if (selectedNodeId !== node.id) {
      setSelectedNodeId(node.id);
      setExpandedCard(null);
    }
  };

  const getMatchedItems = (painPointTitles) => {
    const matched = [];
    for (const category of roadmapData) {
      for (const topic of category.topics) {
        if (painPointTitles.includes(topic.title)) {
          matched.push(
            ...topic.items.map((item) => ({ ...item, topicTitle: topic.title }))
          );
        }
      }
    }
    return matched;
  };

  const hasContent = (node) => {
    return (
      (node.painPoints && node.painPoints.length > 0) ||
      (node.highlights && node.highlights.length > 0)
    );
  };

  return (
    <div>
      {/* Timeline Card */}
      <div
        className={`rounded-3xl p-6 md:p-10 mb-0 border shadow-sm relative overflow-hidden transition-colors duration-300 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
      >
        {/* 滾動按鈕 */}
        <div className="flex justify-end mb-4">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${darkMode ? "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${darkMode ? "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeline Scrollable Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Connector Line */}
            <div
              className={`hidden md:block absolute top-[64px] left-[5%] right-0 w-[4400px] h-1 rounded-full z-0 ${darkMode ? "bg-gradient-to-r from-emerald-500/40 via-indigo-500/40 to-slate-700/40" : "bg-gradient-to-r from-emerald-300/60 via-indigo-300/60 to-slate-200/60"}`}
            />

            <div className="flex gap-4 md:gap-8 relative z-10 w-max px-4">
              {roadmapNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const clickable = hasContent(node);
                return (
                  <div
                    key={node.id}
                    onClick={() => clickable && handleNodeClick(node)}
                    className={`relative flex flex-col items-start md:items-center w-[260px] md:w-[280px] snap-start group shrink-0 transition-all duration-200 ${clickable ? "cursor-pointer" : ""} ${isSelected ? "scale-[1.03]" : ""}`}
                  >
                    {/* Node Dot */}
                    <div
                      className={`relative z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 md:mb-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${darkMode ? "border-slate-900" : "border-white"} ${
                        node.status === "completed"
                          ? "bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_24px_rgba(16,185,129,0.5)]"
                          : node.status === "in_progress"
                            ? "bg-indigo-500 shadow-[0_0_16px_rgba(99,102,241,0.4)] animate-pulse group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)]"
                            : "bg-slate-400 group-hover:bg-slate-500 shadow-sm"
                      } ${isSelected ? `ring-2 ring-offset-2 ${darkMode ? "ring-offset-slate-900" : "ring-offset-white"} ring-indigo-400` : ""}`}
                    >
                      {node.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : node.status === "in_progress" ? (
                        <CircleDashed className="w-5 h-5 text-white animate-spin-slow" />
                      ) : (
                        <Circle className="w-4 h-4 text-white group-hover:text-slate-100 transition-colors" />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`mt-3 md:mt-0 text-left md:text-center w-full transition-all duration-300 transform group-hover:-translate-y-1 p-4 md:p-3 rounded-2xl border ${
                        isSelected
                          ? darkMode
                            ? "bg-indigo-900/40 border-indigo-500/50 shadow-md"
                            : "bg-indigo-50 border-indigo-200 shadow-md"
                          : darkMode
                            ? "bg-slate-800/70 border-slate-700 md:bg-transparent md:border-none shadow-md md:shadow-none"
                            : "bg-white md:bg-transparent border-slate-100 md:border-none shadow-sm md:shadow-none"
                      }`}
                    >
                      <div
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold mb-2 border tracking-wider ${
                          isSelected
                            ? darkMode
                              ? "bg-indigo-800 text-indigo-300 border-indigo-600"
                              : "bg-indigo-100 text-indigo-600 border-indigo-200"
                            : darkMode
                              ? "bg-slate-700 text-slate-400 border-slate-600 group-hover:border-slate-500"
                              : "bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-300"
                        }`}
                      >
                        {node.date}
                      </div>
                      <h3
                        className={`text-lg font-bold mb-1 transition-colors ${
                          node.status === "completed"
                            ? "text-emerald-500 group-hover:text-emerald-400"
                            : node.status === "in_progress"
                              ? "text-indigo-400 group-hover:text-indigo-300"
                              : "text-slate-500 group-hover:text-slate-400"
                        }`}
                      >
                        {node.phase}
                      </h3>
                      <div
                        className={`font-bold text-sm mb-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                      >
                        {node.title}
                      </div>
                      <p
                        className={`text-xs leading-relaxed mb-4 md:px-2 transition-colors ${darkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-600"}`}
                      >
                        {node.description}
                      </p>

                      {/* Pain Point Tags */}
                      {node.painPoints && node.painPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:justify-center mt-auto border-t border-slate-100 pt-3 md:border-none md:pt-0">
                          {node.painPoints.map((pp, i) => (
                            <span
                              key={i}
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                                isSelected
                                  ? "bg-indigo-100 text-indigo-600 border border-indigo-200"
                                  : "bg-rose-50 text-rose-500 border border-rose-200 group-hover:bg-rose-100"
                              }`}
                            >
                              {pp}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Clickable hint */}
                      {clickable && (
                        <span
                          className={`block w-full text-center text-[10px] mt-2 font-medium ${isSelected ? (darkMode ? "text-indigo-400" : "text-indigo-500") : darkMode ? "text-slate-500 group-hover:text-slate-400" : "text-slate-400 group-hover:text-slate-500"}`}
                        >
                          {isSelected ? t.currentlyViewing : t.clickToView}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll Gradients */}
          <div
            className={`pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l ${darkMode ? "from-slate-900/90" : "from-white"} to-transparent z-20`}
          />
          <div
            className={`pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r ${darkMode ? "from-slate-900/90" : "from-white"} to-transparent z-20`}
          />
        </div>
      </div>

      {/* Expandable Detail Panel */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedNode ? "max-h-[5000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}
      >
        {selectedNode && (
          <div
            className={`rounded-2xl border shadow-lg p-6 md:p-8 transition-colors duration-300 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-slate-200"}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    selectedNode.status === "completed"
                      ? "text-emerald-500"
                      : selectedNode.status === "in_progress"
                        ? "text-indigo-500"
                        : "text-slate-500"
                  }`}
                >
                  {selectedNode.date}
                </span>
                <h3
                  className={`text-xl md:text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-slate-800"}`}
                >
                  {selectedNode.phase}：{selectedNode.title}
                </h3>
                <p
                  className={`text-sm mt-1 mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  {selectedNode.description}
                </p>
              </div>
            </div>

            {/* Highlights */}
            {selectedNode.highlights && selectedNode.highlights.length > 0 && (
              <div className="space-y-4 mb-6">
                <h4
                  className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {t.upgradeHighlights}
                </h4>
                {selectedNode.highlights.map((h, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-5 ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"}`}
                  >
                    <h5
                      className={`font-bold mb-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}
                    >
                      {h.title}
                    </h5>
                    <p
                      className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {h.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Full Pain Point Cards */}
            {selectedNode.painPoints &&
              selectedNode.painPoints.length > 0 &&
              (() => {
                const matchedItems = getMatchedItems(selectedNode.painPoints);
                if (matchedItems.length === 0) return null;
                return (
                  <>
                    <h4
                      className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      {t.upgradePainPoints}
                    </h4>
                    <div className="space-y-4">
                      {matchedItems.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                            expandedCard === item.id
                              ? darkMode
                                ? "border-indigo-500 shadow-lg bg-slate-900/50"
                                : "border-indigo-400 shadow-lg bg-white"
                              : darkMode
                                ? "border-slate-700 shadow-sm bg-slate-800 hover:border-indigo-400"
                                : "border-slate-200 shadow-sm bg-white hover:border-indigo-200 hover:shadow-md"
                          }`}
                        >
                          <button
                            onClick={() =>
                              setExpandedCard(
                                expandedCard === item.id ? null : item.id
                              )
                            }
                            className="w-full text-left px-6 py-5 flex items-start justify-between focus:outline-none"
                          >
                            <div className="flex-1 pr-4">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-bold rounded mb-3 ${darkMode ? "bg-rose-900/40 text-rose-300" : "bg-rose-100 text-rose-700"}`}
                              >
                                {item.topicTitle}
                              </span>
                              <h3 className="text-lg md:text-xl font-medium leading-snug">
                                {item.question}
                              </h3>
                            </div>
                            <div
                              className={`flex-shrink-0 mt-2 p-2 rounded-full ${darkMode ? "text-slate-400 bg-slate-700/50" : "text-slate-400 bg-slate-50"}`}
                            >
                              {expandedCard === item.id ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </div>
                          </button>

                          <div
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${expandedCard === item.id ? "max-h-[1800px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                          >
                            <div
                              className={`border-t pt-5 space-y-5 ${darkMode ? "border-slate-700" : "border-slate-100"}`}
                            >
                              {item.breakingNews && (
                                <div
                                  className={`rounded-xl border px-4 py-3.5 ${darkMode ? "bg-amber-900/20 border-amber-800/50" : "bg-amber-50 border-amber-300"}`}
                                >
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span
                                      className={`font-bold text-sm ${darkMode ? "text-amber-500" : "text-amber-600"}`}
                                    >
                                      {t.roadmapMajorShift}
                                    </span>
                                    <span
                                      className={`text-xs ${darkMode ? "text-amber-400" : "text-amber-500"}`}
                                    >
                                      {item.breakingNews.date}
                                    </span>
                                  </div>
                                  <p
                                    className={`text-sm leading-relaxed mb-2.5 ${darkMode ? "text-amber-200/80" : "text-amber-900"}`}
                                  >
                                    {item.breakingNews.summary}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.breakingNews.links.map((l, i) => (
                                      <a
                                        key={i}
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${darkMode ? "bg-amber-900/30 text-amber-300 border-amber-800/50 hover:bg-amber-900/60" : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"}`}
                                      >
                                        {l.label}{" "}
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div
                                className={`grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl p-4 border mb-4 ${darkMode ? "bg-slate-900/40 border-slate-700/50" : "bg-slate-50/50 border-slate-100"}`}
                              >
                                <div>
                                  <div className="flex items-center justify-between text-sm font-medium mb-3">
                                    <div
                                      className={`flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                                    >
                                      <AlertCircle className="w-4 h-4" />{" "}
                                      {t.problemSeverity}
                                    </div>
                                    <span
                                      className={`font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                                    >
                                      {item.severity}/10 ·{" "}
                                      {getSeverityLabel(item.severity, t)}
                                    </span>
                                  </div>
                                  <div
                                    className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                  >
                                    <div
                                      className={`h-full rounded-full transition-all ${getSeverityColor(item.severity)}`}
                                      style={{
                                        width: `${(item.severity / 10) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between text-sm font-medium mb-3">
                                    <div
                                      className={`flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                                    >
                                      {item.maturity === "Mainnet" ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      ) : (
                                        <Clock className="w-4 h-4" />
                                      )}
                                      {t.solutionMaturity}
                                    </div>
                                    <span
                                      className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                                        item.maturity === "Mainnet"
                                          ? darkMode
                                            ? "bg-emerald-900/40 text-emerald-400"
                                            : "bg-emerald-100 text-emerald-700"
                                          : darkMode
                                            ? "bg-slate-800 text-slate-300"
                                            : "bg-slate-200 text-slate-700"
                                      }`}
                                    >
                                      {item.maturity === "Mainnet"
                                        ? t.mainnetLive
                                        : (t.maturityLabels[item.maturity] ??
                                          item.maturity)}
                                    </span>
                                  </div>
                                  <div className="flex gap-1 h-2">
                                    {[
                                      "Research",
                                      "Draft",
                                      "Spec",
                                      "Testnet",
                                      "Mainnet",
                                    ].map((stage, idx) => {
                                      const currentIdx = [
                                        "Research",
                                        "Draft",
                                        "Spec",
                                        "Testnet",
                                        "Mainnet",
                                      ].indexOf(item.maturity);
                                      const isPassed = idx <= currentIdx;
                                      let bgClass = isPassed
                                        ? item.maturity === "Mainnet"
                                          ? darkMode
                                            ? "bg-emerald-500"
                                            : "bg-emerald-400"
                                          : darkMode
                                            ? "bg-indigo-500"
                                            : "bg-indigo-400"
                                        : darkMode
                                          ? "bg-slate-700"
                                          : "bg-slate-200";
                                      return (
                                        <div
                                          title={t.maturityLabels[stage]}
                                          key={stage}
                                          className={`flex-1 rounded-full transition-all ${bgClass} ${isPassed ? "opacity-100" : "opacity-40"}`}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div
                                  className={`text-sm font-medium mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                                >
                                  {t.whereIsTheRisk}
                                </div>
                                <p
                                  className={`leading-relaxed text-sm rounded-lg p-3 border ${darkMode ? "bg-amber-900/10 border-amber-900/30 text-slate-300" : "bg-amber-50/80 border-amber-100 text-slate-600"}`}
                                >
                                  {item.riskSummary}
                                </p>
                              </div>

                              <div className="mt-5">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-bold rounded mb-2 ${darkMode ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}
                                >
                                  {t.ethSolution}
                                </span>
                                <p
                                  className={`leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                                >
                                  {item.solution}
                                </p>
                                {(item.termExplainers?.length ?? 0) > 0 && (
                                  <div className="mt-3 space-y-1.5">
                                    <p
                                      className={`text-xs uppercase tracking-wider font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                                    >
                                      {t.termQuickConcept}
                                    </p>
                                    {item.termExplainers.map((te, i) => (
                                      <div
                                        key={i}
                                        className={`flex items-start gap-2 text-xs border rounded-lg px-3 py-2 ${darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                                      >
                                        <span
                                          className={`font-semibold whitespace-nowrap flex-shrink-0 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}
                                        >
                                          {te.term}
                                        </span>
                                        <span
                                          className={`leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                                        >
                                          {te.explanation}
                                        </span>
                                        {te.url && (
                                          <a
                                            href={te.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`ml-auto flex-shrink-0 hover:text-indigo-500 ${darkMode ? "text-slate-500" : "text-indigo-500"}`}
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div
                                className={`mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl p-4 border ${darkMode ? "bg-slate-900/50 border-slate-700/50" : "bg-slate-50 border-slate-100"}`}
                              >
                                <div>
                                  <div
                                    className={`flex items-center text-sm mb-1 font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                                  >
                                    <Code className="w-4 h-4 mr-1.5" />{" "}
                                    {t.techTermMapping}
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {item.techTerms.map((term, i) => (
                                      <span
                                        key={i}
                                        className={`px-2.5 py-1 text-sm rounded-md font-mono border ${darkMode ? "bg-indigo-900/30 text-indigo-300 border-indigo-800/50" : "bg-indigo-50 text-indigo-700 border-indigo-100"}`}
                                      >
                                        {term}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div
                                    className={`flex items-center text-sm mb-1 font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                                  >
                                    <Clock className="w-4 h-4 mr-1.5" /> {t.eta}
                                  </div>
                                  <div
                                    className={`font-medium mt-2 text-sm leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                                  >
                                    {item.eta}
                                  </div>
                                </div>
                              </div>

                              {item.links?.filter((l) => l.type === "tool")
                                .length > 0 && (
                                <div
                                  className={`mt-5 pt-4 border-t space-y-2 ${darkMode ? "border-slate-700" : "border-slate-100"}`}
                                >
                                  <span
                                    className={`text-xs font-bold uppercase tracking-wider mb-2 block ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                                  >
                                    {t.recommendedTools}
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {item.links
                                      .filter((l) => l.type === "tool")
                                      .map((link, i) => (
                                        <a
                                          key={i}
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border shadow-sm ${darkMode ? "bg-indigo-900/30 hover:bg-indigo-900/60 text-indigo-300 border-indigo-800/50" : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100"}`}
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />{" "}
                                          {link.label}
                                        </a>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
          </div>
        )}
      </div>
    </div>
  );
}

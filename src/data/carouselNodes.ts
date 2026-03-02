/**
 * Carousel 節點：完整時間軸（Frontier → … → Shanghai → … → Hegotá）
 * 來自 roadmapNodes；networkUpgrades 有的升級都需在 roadmapNodes 裡有對應節點。
 */
import { roadmapNodesZh, roadmapNodesEn } from './roadmapNodes';

export type NodeStatus = 'completed' | 'in_progress' | 'future';

export interface CarouselNode {
  id: string;
  phase: string;
  date: string;
  status: NodeStatus;
  title: string;
  description: string;
  painPoints: string[];
  highlights?: { title: string; desc: string }[];
}

type Language = 'zh' | 'en';

/**
 * 回傳完整 carousel 節點（含 Shanghai 之前的歷史：Frontier, Homestead, … Merge, Shanghai, Dencun, … Hegotá）。
 * 順序與內容由 roadmapNodes 決定；程式內有的升級（networkUpgrades）都應在 roadmapNodes 有對應。
 */
export function getOrderedCarouselNodes(lang: Language): CarouselNode[] {
  const list = lang === 'zh' ? roadmapNodesZh : roadmapNodesEn;
  return list as CarouselNode[];
}

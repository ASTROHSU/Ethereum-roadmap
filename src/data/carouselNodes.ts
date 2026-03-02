/**
 * Carousel 節點由 networkUpgrades（程式內升級清單）驅動順序，
 * 內容可從 roadmapNodes overlay 補齊，確保每個升級都會出現且順序不寫死。
 */
import { networkUpgrades } from './upgrades';
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

function mapUpgradeStatusToNodeStatus(
  status: 'Live' | 'Upcoming' | 'Planning' | 'Research'
): NodeStatus {
  if (status === 'Live') return 'completed';
  if (status === 'Upcoming') return 'in_progress';
  return 'future';
}

/** Shapella 對應 overlay 的 shanghai 節點 */
function getOverlayId(upgradeId: string): string {
  return upgradeId === 'shapella' ? 'shanghai' : upgradeId;
}

function buildNode(
  upgrade: (typeof networkUpgrades)[number],
  overlay: CarouselNode | undefined
): CarouselNode {
  const phaseName = upgrade.name.replace(/\s*Upgrade\s*$/i, '');
  return {
    id: upgrade.id,
    phase: overlay?.phase ?? phaseName,
    date: overlay?.date ?? upgrade.activationDate,
    status: mapUpgradeStatusToNodeStatus(upgrade.status),
    title: overlay?.title ?? upgrade.tagline ?? upgrade.highlights ?? phaseName,
    description: overlay?.description ?? upgrade.description,
    painPoints: overlay?.painPoints ?? [],
    highlights: overlay?.highlights,
  };
}

/**
 * 依 networkUpgrades 順序回傳 carousel 節點（不寫死順序），
 * 內容優先使用 roadmapNodes overlay，沒有則用 upgrade 欄位。
 */
export function getOrderedCarouselNodes(lang: Language): CarouselNode[] {
  const overlayList = lang === 'zh' ? roadmapNodesZh : roadmapNodesEn;
  const overlayById = new Map<string, CarouselNode>();
  overlayList.forEach((n) => {
    overlayById.set(n.id, n as CarouselNode);
  });

  return networkUpgrades.map((upgrade) => {
    const overlayId = getOverlayId(upgrade.id);
    const overlay = overlayById.get(overlayId);
    return buildNode(upgrade, overlay);
  });
}

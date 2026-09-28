// Data-driven tool upgrade tiers. A tool's `tier` (0..3) widens the square area
// it affects and is bought in the shop's Tools tab. Add a tier by extending
// these arrays — no new logic. Index 0 is the starting (Basic) tool.
export const TOOL_TIERS = ['Basic', 'Copper', 'Iron', 'Gold'];

// Side length (in tiles) of the square area each tier affects, centered on the
// target tile: Basic 1x1, Copper 3x3, Iron 5x5, Gold 7x7.
export const TOOL_AREA = [1, 3, 5, 7];

// Cost to upgrade INTO a tier (index 0 unused — you start at Basic).
export const TOOL_UPGRADE_COST = [0, 200, 500, 1000];

// Tools that can be upgraded (and that apply an area / cost energy).
export const UPGRADEABLE_TOOLS = ['Hoe', 'Watering Can', 'Scythe'];

export function toolAreaSide(tier) {
    return TOOL_AREA[tier] || 1;
}

// Cost to go from `tier` to the next tier, or undefined if already maxed.
export function nextTierCost(tier) {
    return TOOL_UPGRADE_COST[tier + 1];
}

export function maxTier() {
    return TOOL_TIERS.length - 1;
}

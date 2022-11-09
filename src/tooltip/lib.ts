import type { TooltipInstance } from "@/tooltip/api";

/**
 * Gets the global tooltip instance.
 *
 * Because it may not be initialized yet, access should only happen when needed, not in advance.
 */
export const getTooltipApi: () => TooltipInstance | null = () =>
	window.yugiohDeckToolTooltip ?? null;

export type { TooltipInstance };

import { getLogger } from "@yugioh-deck-tool/core";
import { bindTooltipHandlers } from "./tooltip/bindTooltip";

const logger = getLogger("tooltip");

/**
 * Public interface used to interact with tooltip.
 */
export interface TooltipInstance {
    /**
     * Disable any tooltip from being shown.
     */
    readonly disable: () => void;
    /**
     * Re-enable tooltip after {@link TooltipInstance#disable()} was called.
     */
    readonly enable: () => void;
}

declare global {
    interface Window {
        yugiohDeckToolTooltip?: TooltipInstance;
    }
}

export const bindTooltipApi = (): void => {
    if (window.yugiohDeckToolTooltip == null) {
        logger.debug("Setting up card tooltip.");
        window.yugiohDeckToolTooltip = bindTooltipHandlers(document.body);
    } else {
        // Can happen if both tooltip and application are loaded.
        logger.debug("Tooltip instance exists, skipping setup.");
    }
};

/**
 * Gets the global tooltip instance.
 *
 * Because it may not be initialized yet, access should only happen when needed, not in advance.
 */
export const getTooltipApi: () => TooltipInstance | null = () =>
    window.yugiohDeckToolTooltip ?? null;

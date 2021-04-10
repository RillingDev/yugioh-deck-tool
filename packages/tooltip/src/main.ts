import "reflect-metadata";
import "./styles/tooltip.scss";
import { getLogger } from "@yugioh-deck-tool/core";
import type { TooltipInstance } from "./tooltip/bindTooltip";
import { bindTooltipHandlers } from "./tooltip/bindTooltip";

const logger = getLogger("tooltip");

// We use a window global variable to ensure proper access if the script is ran multiple times from different sources.
declare global {
    interface Window {
        tooltipInstance?: TooltipInstance;
    }
}

document.addEventListener("readystatechange", () => {
    if (window.tooltipInstance == null) {
        logger.debug("Setting up card tooltip.");
        window.tooltipInstance = bindTooltipHandlers(document.body);
    } else {
        logger.debug("Tooltip instance exists, skipping setup.");
    }
});

export const disableTooltip = (): void => window.tooltipInstance?.disable();
export const enableTooltip = (): void => window.tooltipInstance?.enable();

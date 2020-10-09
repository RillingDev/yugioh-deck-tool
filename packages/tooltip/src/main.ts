import "reflect-metadata";
import "./styles/tooltip.scss";
import { getLogger } from "../../core/src/main";
import { bindTooltipHandlers } from "./tooltip/bindTooltip";
import type { Instance } from "tippy.js";

const logger = getLogger("tooltip");

// We use a window global variable to ensure proper access if the script is ran multiple times from different sources.
declare global {
    interface Window {
        tooltipInstance?: Instance;
    }
}

document.addEventListener("readystatechange", () => {
    if (window.tooltipInstance == null) {
        logger.debug("Setting up card tooltip.");
        const context = document.body;
        const tooltipContainerElement = document.createElement("div");
        tooltipContainerElement.id = "cardTooltipContainer";
        context.appendChild(tooltipContainerElement);
        window.tooltipInstance = bindTooltipHandlers(
            context,
            tooltipContainerElement
        );
    }
});

// Only works sometimes, see https://github.com/FelixRilling/yugioh-deck-tool/issues/87
// Promise wrapping probably not needed.
export const hideTooltip = (): Promise<void> =>
    new Promise((resolve) => {
        window.tooltipInstance?.hide();
        requestAnimationFrame(() => resolve());
    });

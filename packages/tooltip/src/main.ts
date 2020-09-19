import "reflect-metadata";
import "./styles/tooltip.scss";
import { getLogger } from "../../core/src/main";
import { bindTooltipHandlers } from "./tooltip/bindTooltip";
import type { Instance } from "tippy.js";

const TOOLTIP_CONTAINER_ID = "cardTooltipContainer";

const logger = getLogger("tooltip");

let instance: Instance;

document.addEventListener("readystatechange", () => {
    if (document.getElementById(TOOLTIP_CONTAINER_ID) == null) {
        logger.debug("Setting up card tooltip.");
        const context = document.body;
        const tooltipContainerElement = document.createElement("div");
        tooltipContainerElement.id = TOOLTIP_CONTAINER_ID;
        context.appendChild(tooltipContainerElement);
        instance = bindTooltipHandlers(context, tooltipContainerElement);
    }
});

// Only works sometimes, see https://github.com/FelixRilling/yugioh-deck-tool/issues/87
// Promise wrapping probably not needed.
export const hideTooltip = (): Promise<void> =>
    new Promise((resolve) => {
        instance.hide();
        requestAnimationFrame(() => resolve());
    });

import "reflect-metadata";
import { bindTooltipHandlers } from "./tooltip/bindTooltip";
import logger, { levels } from "loglevel";
import { DEVELOPMENT_MODE } from "../../core/src/main";
import "./styles/tooltip.scss";

const TOOLTIP_CONTAINER_ID = "cardTooltipContainer";

logger.setLevel(DEVELOPMENT_MODE ? levels.DEBUG : levels.WARN);

document.addEventListener("readystatechange", () => {
    if (document.getElementById(TOOLTIP_CONTAINER_ID) == null) {
        logger.debug("Setting up card tooltip.");
        const context = document.body;
        const tooltipContainerElement = document.createElement("div");
        tooltipContainerElement.id = TOOLTIP_CONTAINER_ID;
        context.appendChild(tooltipContainerElement);
        bindTooltipHandlers(context, tooltipContainerElement);
    }
});

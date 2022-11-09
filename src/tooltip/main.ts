import type { TooltipInstance } from "./api";
import "./styles/tooltip.scss";
import { bindTooltipHandlers } from "@/tooltip/tooltip/bindTooltip";
import { getLogger } from "@/core/logger";

declare global {
	interface Window {
		yugiohDeckToolTooltip?: TooltipInstance;
	}
}

const logger = getLogger("tooltip");
const bindTooltipApi = (): void => {
	if (window.yugiohDeckToolTooltip == null) {
		logger.debug("Setting up card tooltip.");
		window.yugiohDeckToolTooltip = bindTooltipHandlers(document.body);
	} else {
		// Can happen if both tooltip and application are loaded.
		logger.debug("Tooltip instance exists, skipping setup.");
	}
};

document.addEventListener("DOMContentLoaded", () => bindTooltipApi());

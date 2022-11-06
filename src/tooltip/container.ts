import { createBaseModule } from "@/core/lib";
import { TooltipController } from "./controller/TooltipController";
import { HostEnvironmentConfig } from "@/browser-common/lib";
import { createYgoprodeckModule } from "@/ygoprodeck/lib";

export const environmentConfig = new HostEnvironmentConfig();

const { cardDatabase, resourceService, ygoprodeckService } =
	createYgoprodeckModule(environmentConfig);

const { priceService, cardService } = createBaseModule(cardDatabase);

const tooltipController = new TooltipController(cardDatabase);

export {
	// Base
	cardService,
	priceService,
	// Ygoprodeck
	resourceService,
	ygoprodeckService,
	// Tooltip
	tooltipController,
};

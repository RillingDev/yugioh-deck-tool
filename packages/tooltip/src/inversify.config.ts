import type { EnvironmentConfig } from "@yugioh-deck-tool/core";
import { baseModule, TYPES } from "@yugioh-deck-tool/core";
import { Container } from "inversify";
import { TOOLTIP_TYPES } from "./types";
import { TooltipController } from "./controller/TooltipController";
import { HostEnvironmentConfig } from "@yugioh-deck-tool/browser-common";
import { ygoprodeckModule } from "@yugioh-deck-tool/ygoprodeck";

const tooltipContainer = new Container();
tooltipContainer.load(baseModule, ygoprodeckModule);

tooltipContainer
	.rebind<EnvironmentConfig>(TYPES.EnvironmentConfig)
	.to(HostEnvironmentConfig);

tooltipContainer
	.bind<TooltipController>(TOOLTIP_TYPES.TooltipController)
	.to(TooltipController);

export { tooltipContainer };

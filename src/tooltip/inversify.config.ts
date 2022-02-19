import type { EnvironmentConfig } from "@/core/main";
import { baseModule, TYPES } from "@/core/main";
import { Container } from "inversify";
import { TOOLTIP_TYPES } from "./types";
import { TooltipController } from "./controller/TooltipController";
import { HostEnvironmentConfig } from "@/browser-common/main";
import { ygoprodeckModule } from "@/ygoprodeck/main";

const tooltipContainer = new Container();
tooltipContainer.load(baseModule, ygoprodeckModule);

tooltipContainer
	.rebind<EnvironmentConfig>(TYPES.EnvironmentConfig)
	.to(HostEnvironmentConfig);

tooltipContainer
	.bind<TooltipController>(TOOLTIP_TYPES.TooltipController)
	.to(TooltipController);

export { tooltipContainer };

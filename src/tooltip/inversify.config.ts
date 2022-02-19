import type { EnvironmentConfig } from "@/core/lib";
import { baseModule, TYPES } from "@/core/lib";
import { Container } from "inversify";
import { TOOLTIP_TYPES } from "./types";
import { TooltipController } from "./controller/TooltipController";
import { HostEnvironmentConfig } from "@/browser-common/lib";
import { ygoprodeckModule } from "@/ygoprodeck/lib";

const tooltipContainer = new Container({ defaultScope: "Singleton" });

tooltipContainer.load(baseModule, ygoprodeckModule);

tooltipContainer
	.rebind<EnvironmentConfig>(TYPES.EnvironmentConfig)
	.to(HostEnvironmentConfig);

tooltipContainer
	.bind<TooltipController>(TOOLTIP_TYPES.TooltipController)
	.to(TooltipController);

export { tooltipContainer };

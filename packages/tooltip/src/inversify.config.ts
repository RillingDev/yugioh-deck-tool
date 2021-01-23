import type { EnvironmentConfig } from "../../core/src/main";
import { baseModule, TYPES } from "../../core/src/main";
import { Container } from "inversify";
import { TOOLTIP_TYPES } from "./types";
import { TooltipController } from "./controller/TooltipController";
import { HostEnvironmentConfig } from "../../browser-common/src/main";

const tooltipContainer = new Container();
tooltipContainer.load(baseModule);

tooltipContainer
    .rebind<EnvironmentConfig>(TYPES.EnvironmentConfig)
    .to(HostEnvironmentConfig);

tooltipContainer
    .bind<TooltipController>(TOOLTIP_TYPES.TooltipController)
    .to(TooltipController);

export { tooltipContainer };

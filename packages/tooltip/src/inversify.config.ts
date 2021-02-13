import type { EnvironmentConfig } from "../../core/src/main";
import { TYPES, baseModule } from "../../core/src/main";
import { Container } from "inversify";
import { TOOLTIP_TYPES } from "./types";
import { TooltipController } from "./controller/TooltipController";
import { HostEnvironmentConfig } from "../../browser-common/src/main";
import { ygoprodeckModule } from "../../ygoprodeck/src/main";

const tooltipContainer = new Container();
tooltipContainer.load(baseModule, ygoprodeckModule);

tooltipContainer
    .rebind<EnvironmentConfig>(TYPES.EnvironmentConfig)
    .to(HostEnvironmentConfig);

tooltipContainer
    .bind<TooltipController>(TOOLTIP_TYPES.TooltipController)
    .to(TooltipController);

export { tooltipContainer };

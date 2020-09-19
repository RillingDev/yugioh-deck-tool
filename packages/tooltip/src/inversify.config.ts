import { baseModule } from "../../core/src/main";
import { Container } from "inversify";
import { TOOLTIP_TYPES } from "./types";
import { TooltipController } from "./controller/TooltipController";

const tooltipContainer = new Container();
tooltipContainer.load(baseModule);

tooltipContainer
    .bind<TooltipController>(TOOLTIP_TYPES.TooltipController)
    .to(TooltipController);

export { tooltipContainer };

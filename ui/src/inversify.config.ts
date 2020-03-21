import { UI_TYPES } from "./types";
import { PriceController } from "@/lib/controller/PriceController";
import { container } from "../../core/src/main";

const uiContainer = container.createChild();

uiContainer
    .bind<PriceController>(UI_TYPES.PriceController)
    .to(PriceController)
    .inSingletonScope();

export { uiContainer };

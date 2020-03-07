import { UI_TYPES } from "./types";
import { PriceController } from "@/lib/controller/PriceController";
import { container } from "../../core";

const uiContainer = container.createChild();
uiContainer
    .bind<PriceController>(UI_TYPES.PriceController)
    .to(PriceController)
    .inSingletonScope();

export { uiContainer };

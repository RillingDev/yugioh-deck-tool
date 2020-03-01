import { Container } from "inversify";
import { UI_TYPES } from "./types";
import { PriceController } from "@/lib/controller/PriceController";

const uiContainer = new Container();
uiContainer
    .bind<PriceController>(UI_TYPES.PriceController)
    .to(PriceController).inSingletonScope();

export { uiContainer };

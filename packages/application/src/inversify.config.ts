import { APPLICATION_TYPES } from "./types";
import { PriceController } from "@/lib/controller/PriceController";
import { container } from "yugioh-deck-tool-core/src/main";

const applicationContainer = container.createChild();

applicationContainer
    .bind<PriceController>(APPLICATION_TYPES.PriceController)
    .to(PriceController)
    .inSingletonScope();

export { applicationContainer };

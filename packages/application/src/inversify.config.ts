import type { EnvironmentConfig } from "../../core/src/main";
import { baseModule, deckModule, TYPES } from "../../core/src/main";
import { Container } from "inversify";
import { DeckController } from "./controller/DeckController";
import { APPLICATION_TYPES } from "./types";
import { DeckUrlController } from "./controller/DeckUrlController";
import { HostEnvironmentConfig } from "../../browser-common/src/main";
import { YgoprodeckController } from "./controller/YgoprodeckController";
import { ygoprodeckModule } from "../../ygoprodeck/src/main";

const applicationContainer = new Container();
applicationContainer.load(baseModule, deckModule, ygoprodeckModule);

applicationContainer
    .rebind<EnvironmentConfig>(TYPES.EnvironmentConfig)
    .to(HostEnvironmentConfig);

applicationContainer
    .bind<DeckController>(APPLICATION_TYPES.DeckController)
    .to(DeckController);
applicationContainer
    .bind<DeckUrlController>(APPLICATION_TYPES.DeckUrlController)
    .to(DeckUrlController);

applicationContainer
    .bind<YgoprodeckController>(APPLICATION_TYPES.YgoprodeckController)
    .to(YgoprodeckController);

export { applicationContainer };

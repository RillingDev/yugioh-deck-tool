import type { EnvironmentConfig } from "../../core/src/main";
import { baseModule, deckModule, TYPES } from "../../core/src/main";
import { Container } from "inversify";
import { DeckController } from "./controller/DeckController";
import { APPLICATION_TYPES } from "./types";
import { DeckUrlController } from "./controller/DeckUrlController";
import { HostEnvironmentConfig } from "../../browser-common/src/main";
import { FilterController } from "./controller/FilterController";

const applicationContainer = new Container();
applicationContainer.load(baseModule, deckModule);

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
    .bind<FilterController>(APPLICATION_TYPES.FilterController)
    .to(FilterController);

export { applicationContainer };

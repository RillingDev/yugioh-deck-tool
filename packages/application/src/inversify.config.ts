import type { EnvironmentConfig } from "@yugioh-deck-tool/core";
import { baseModule, deckModule, TYPES } from "@yugioh-deck-tool/core";
import { Container } from "inversify";
import { DeckController } from "./controller/DeckController";
import { APPLICATION_TYPES } from "./types";
import { DeckUrlController } from "./controller/DeckUrlController";
import { HostEnvironmentConfig } from "@yugioh-deck-tool/browser-common";
import { YgoprodeckController } from "./controller/YgoprodeckController";
import { ygoprodeckModule } from "@yugioh-deck-tool/ygoprodeck";

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

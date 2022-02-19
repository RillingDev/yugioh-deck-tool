import type { EnvironmentConfig } from "@/core/main";
import { baseModule, deckModule, TYPES } from "@/core/main";
import { Container } from "inversify";
import { DeckController } from "./controller/DeckController";
import { APPLICATION_TYPES } from "./types";
import { DeckUrlController } from "./controller/DeckUrlController";
import { HostEnvironmentConfig } from "@/browser-common/main";
import { YgoprodeckController } from "./controller/YgoprodeckController";
import { ygoprodeckModule } from "@/ygoprodeck/main";

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

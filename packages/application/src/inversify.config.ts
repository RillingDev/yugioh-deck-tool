import { baseModule, deckModule } from "../../core/src/main";
import { Container } from "inversify";

const applicationContainer = new Container();
applicationContainer.load(baseModule, deckModule);

export { applicationContainer };

import { baseModule } from "../../core/src/main";
import { Container } from "inversify";

const tooltipContainer = new Container();
tooltipContainer.load(baseModule);

export { tooltipContainer };

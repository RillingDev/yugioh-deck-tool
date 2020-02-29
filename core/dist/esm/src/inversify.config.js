import { Container } from "inversify";
import { TYPES } from "./types";
import { YgoprodeckApiService } from "./api/YgoprodeckApiService";
import { CompressionService } from "./core/business/CompressionService";
import MemoryCardDatabase from "./core/business/MemoryCardDatabase";
import { CardService } from "./core/business/CardService";
const container = new Container();
container
    .bind(TYPES.DataLoaderService)
    .to(YgoprodeckApiService);
container.bind(TYPES.CardDatabase).to(MemoryCardDatabase);
container.bind(TYPES.CardService).to(CardService);
container
    .bind(TYPES.CompressionService)
    .to(CompressionService);
export { container };
//# sourceMappingURL=inversify.config.js.map
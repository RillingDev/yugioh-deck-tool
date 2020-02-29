import { Container } from "inversify";
import { TYPES } from "./types";
import { DataLoaderClient } from "./core/business/DataLoaderClient";
import { YgoprodeckApiClient } from "./api/YgoprodeckApiClient";
import { CompressionService } from "./core/business/CompressionService";

const container = new Container();
container
    .bind<DataLoaderClient>(TYPES.DataLoaderClient)
    .to(YgoprodeckApiClient);
container
    .bind<CompressionService>(TYPES.CompressionService)
    .to(CompressionService);

export { container };

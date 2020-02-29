import { CompressionService } from "./core/business/CompressionService";

const TYPES = {
    DataLoaderClient: Symbol.for("DataLoaderClient"),
    CompressionService: Symbol.for("CompressionService")
};

export { TYPES };

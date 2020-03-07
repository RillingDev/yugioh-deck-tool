import { CompressionService } from "../../../core";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";

const compressionService = uiContainer.get<CompressionService>(
    UI_TYPES.CompressionService
);

const compressToBase64Legacy = (val: string): string =>
    "OH NO";
const decompressFromBase64Legacy = (val: string): string =>
    compressionService.inflateString(atob(val));

export { compressToBase64Legacy, decompressFromBase64Legacy };

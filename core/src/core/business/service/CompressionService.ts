import { deflate, inflate } from "pako";
import { injectable } from "inversify";

@injectable()
class CompressionService {
    public deflate(arr: Uint8Array | number[]): Uint8Array {
        return deflate(arr);
    }

    public inflate(arr: Uint8Array | number[]): Uint8Array {
        return inflate(arr);
    }

    /**
     * @deprecated Only kept for {@link DeckUriEncodingService#fromLegacyUrlQueryParamValue}.
     */
    public inflateString(str: string): string {
        return inflate(str, {
            to: "string",
        });
    }
}

export { CompressionService };

import { injectable } from "inversify";
import { fromByteArray, toByteArray } from "base64-js";

@injectable()
class EncodingService {
    private readonly textEncoder: TextEncoder;
    private readonly textDecoder: TextDecoder;

    constructor() {
        this.textEncoder = new TextEncoder();
        this.textDecoder = new TextDecoder();
    }

    public encodeString(str: string): Uint8Array {
        return this.textEncoder.encode(str);
    }

    public decodeString(arr: Uint8Array): string {
        return this.textDecoder.decode(arr);
    }

    public encodeUriSafeBase64String(arr: Uint8Array): string {
        return fromByteArray(arr)
            .replace(/=/g, "~")
            .replace(/\+/g, "_")
            .replace(/\//g, "-");
    }

    public decodeUriSafeBase64String(str: string): Uint8Array {
        return toByteArray(
            str.replace(/~/g, "=").replace(/_/g, "+").replace(/-/g, "/")
        );
    }
}

export { EncodingService };

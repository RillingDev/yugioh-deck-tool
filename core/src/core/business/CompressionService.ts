import { deflate, inflate } from "pako";

class CompressionService {
    deflateString(val: string): string {
        return deflate(val, {
            to: "string"
        });
    }

    inflateString(val: string): string {
        return inflate(val, {
            to: "string"
        });
    }
}

export { CompressionService };

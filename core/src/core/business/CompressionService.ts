import { deflate, inflate } from "pako";
import { injectable } from "inversify";

@injectable()
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

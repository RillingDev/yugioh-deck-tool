import { deflate, inflate } from "pako";
class CompressionService {
    deflateString(val) {
        return deflate(val, {
            to: "string"
        });
    }
    inflateString(val) {
        return inflate(val, {
            to: "string"
        });
    }
}
export { CompressionService };
//# sourceMappingURL=CompressionService.js.map
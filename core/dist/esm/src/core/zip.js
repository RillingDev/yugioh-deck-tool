import { deflate, inflate } from "pako";
const deflateString = (val) => deflate(val, {
    to: "string"
});
const inflateString = (val) => inflate(val, {
    to: "string"
});
export { deflateString, inflateString };
//# sourceMappingURL=zip.js.map
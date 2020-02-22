import { deflate, inflate } from "pako";

const deflateString = (val: string): string =>
    deflate(val, {
        to: "string"
    });
const inflateString = (val: string): string =>
    inflate(val, {
        to: "string"
    });

export { deflateString, inflateString };

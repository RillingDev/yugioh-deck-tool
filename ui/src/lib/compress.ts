import { deflateString, inflateString } from "../../../core";

const compress = val => btoa(deflateString(val));
const decompress = val => inflateString(atob(val));

export { compress, decompress };

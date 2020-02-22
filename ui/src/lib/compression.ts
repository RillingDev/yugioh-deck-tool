import { deflateString, inflateString } from "../../../core";

const compressToBase64Legacy = val => btoa(deflateString(val));
const decompressFromBase64Legacy = val => inflateString(atob(val));

export { compressToBase64Legacy, decompressFromBase64Legacy };

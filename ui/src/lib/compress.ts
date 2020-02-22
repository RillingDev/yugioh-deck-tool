import pako from "pako";

const deflate = val =>
    pako.deflate(val, {
        to: "string"
    });
const inflate = val =>
    pako.inflate(val, {
        to: "string"
    });

const compress = val => btoa(deflate(val));
const decompress = val => inflate(atob(val));

export { deflate, inflate, compress, decompress };

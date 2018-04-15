import pako from "pako";

const PAKO_OPTIONS = {
    to: "string"
};

const deflate = val => pako.deflate(val, PAKO_OPTIONS);
const inflate = val => pako.inflate(val, PAKO_OPTIONS);

const compress = val => btoa(deflate(val));
const decompress = val => inflate(atob(val));

export {
    deflate,
    inflate,
    compress,
    decompress
};

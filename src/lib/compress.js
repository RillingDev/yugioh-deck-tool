import pako from "pako";

const pakoOptions = {
    to: "string"
};

const deflate = val => pako.deflate(val, pakoOptions);
const inflate = val => pako.inflate(val, pakoOptions);

const compress = val => btoa(deflate(val));
const decompress = val => inflate(atob(val));

export { deflate, inflate, compress, decompress };

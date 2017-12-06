import pako from "pako";

const pakoOptions = {
    to: "string"
};

const compress = val => btoa(pako.deflate(val, pakoOptions));

const decompress = val => pako.inflate(atob(val), pakoOptions);

export { compress, decompress };

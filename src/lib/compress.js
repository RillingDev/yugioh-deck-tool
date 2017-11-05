import pako from "pako";

const pakoOptions = {
    to: "string"
};

const compress = val => btoa(pako.deflate(JSON.stringify(val), pakoOptions));

const decompress = val => JSON.parse(pako.inflate(atob(val), pakoOptions));

export {
    compress,
    decompress
};

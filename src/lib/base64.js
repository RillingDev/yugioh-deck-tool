const encodeBase64 = val => btoa(JSON.stringify(val));

const decodeBase64 = val => JSON.parse(atob(val));

export {
    encodeBase64,
    decodeBase64
};

import { isArray } from "lightdash";

const deepFreeze = obj =>
    isArray(obj) ? obj.map(deepFreeze) : Object.freeze(obj);

export default deepFreeze;

import { forEach, isObject } from "lodash";

/**
 * Recursively freezes objects. Useful for constants.
 *
 * @param target Object to recursively freeze.
 */
export const deepFreeze = (target: any): void => {
    if (isObject(target)) {
        forEach(target, (val) => deepFreeze(val));
        Object.freeze(target);
    }
};

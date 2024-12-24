import { markRaw } from "vue";

/**
 * constant objects in need to be frozen, as otherwise Vue deep proxies get injected which break business logic.
 */
export function asConstant<T extends object>(value: T): Readonly<T> {
	return markRaw(value);
}

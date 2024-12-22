/**
 * constant objects in need to be frozen, as otherwise Vue deep proxies get injected which break business logic.
 */
export function asConstant<T>(value: T): Readonly<T> {
	return Object.freeze(value);
}

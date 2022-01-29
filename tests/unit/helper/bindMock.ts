import type { Container } from "inversify";
import { instance, mock } from "ts-mockito";

type Class<T> = new (...args: never[]) => T;

export const bindMock = <T>(
	container: Container,
	identifier: symbol,
	clazz: Class<T>
): T => {
	const clazzMock = mock<T>(clazz);
	container.rebind(identifier).toConstantValue(instance(clazzMock));
	return clazzMock;
};

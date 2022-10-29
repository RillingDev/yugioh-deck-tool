import type { Container } from "inversify";
import { instance, mock } from "ts-mockito";

type Class<T> = new (...args: never[]) => T;

export const bindMock = <T>(
	container: Container,
	identifier: symbol,
	clazz: Class<T>
): T => {
	const clazzMock = mock<T>(clazz);
	const mockInstance = instance(clazzMock);
	if (container.isBound(identifier)) {
		container.rebind(identifier).toConstantValue(mockInstance);
	} else {
		container.bind(identifier).toConstantValue(mockInstance);
	}
	return clazzMock;
};

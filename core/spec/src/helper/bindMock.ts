import { Container } from "inversify";
import { instance, mock } from "ts-mockito";

interface Class<T> {
    new (...args: any[]): T;
}

export const bindMock = <T>(
    container: Container,
    identifier: symbol,
    clazz: Class<T>
): T => {
    const clazzMock = mock(clazz);
    container.unbind(identifier);
    container.bind(identifier).toConstantValue(instance(clazzMock));
    return clazzMock;
};

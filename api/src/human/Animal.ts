import { AnimalSpecies } from "./AnimalSpecies";

/**
 * Base interface for animal implementations.
 *
 * @private
 */
interface Animal {
    readonly species: AnimalSpecies;
    readonly age: number;
}

export { Animal };

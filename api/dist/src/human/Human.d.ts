import { AnimalSpecies } from "./AnimalSpecies";
import { Animal } from "./Animal";
/**
 * Human implementation of {@link Animal}.
 */
declare class Human implements Animal {
    readonly species: AnimalSpecies.HUMAN;
    readonly age: number;
    private readonly name;
    /**
     * Creates a new {@link Human}
     *
     * @param name Name of the human
     * @param age Age of the human.
     */
    constructor(name: string, age?: number);
    /**
     * Creates a string for this human saying something.
     *
     * @param msg Message to say, defaults to "Hello!".
     * @returns String this human is saying.
     */
    say(msg?: string): string;
}
export { Human };

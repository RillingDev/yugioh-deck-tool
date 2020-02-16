import { AnimalSpecies } from "./AnimalSpecies";
import { Animal } from "./Animal";

/**
 * Human implementation of {@link Animal}.
 */
class Human implements Animal {
    public readonly species: AnimalSpecies.HUMAN;
    public readonly age: number;
    private readonly name: string;

    /**
     * Creates a new {@link Human}
     *
     * @param name Name of the human
     * @param age Age of the human.
     */
    public constructor(name: string, age = 0) {
        this.species = AnimalSpecies.HUMAN;
        this.age = age;
        this.name = name;
    }

    /**
     * Creates a string for this human saying something.
     *
     * @param msg Message to say, defaults to "Hello!".
     * @returns String this human is saying.
     */
    public say(msg = "Hello!"): string {
        return `${this.name}(${this.age}): ${msg}`;
    }
}

export { Human };

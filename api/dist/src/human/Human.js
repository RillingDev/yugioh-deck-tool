import { AnimalSpecies } from "./AnimalSpecies";
/**
 * Human implementation of {@link Animal}.
 */
class Human {
    /**
     * Creates a new {@link Human}
     *
     * @param name Name of the human
     * @param age Age of the human.
     */
    constructor(name, age = 0) {
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
    say(msg = "Hello!") {
        return `${this.name}(${this.age}): ${msg}`;
    }
}
export { Human };

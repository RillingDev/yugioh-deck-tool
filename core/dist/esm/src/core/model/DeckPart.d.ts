import { Card } from "./Card";
interface DeckPart {
    readonly id: string;
    readonly name: string;
    readonly indicator: string;
    readonly min: number;
    readonly max: number;
    readonly allowsCard: (card: Card) => boolean;
}
export { DeckPart };

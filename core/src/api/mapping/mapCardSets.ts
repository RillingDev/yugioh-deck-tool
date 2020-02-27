// https://jvilk.com/MakeTypes/
import { CardSet } from "../../core/model/CardSet";

interface RawCardSet {
    set_name: string;
    set_code: string;
    num_of_cards: number;
    tcg_date?: string | null;
}

const mapCardSets = (data: RawCardSet[]): CardSet[] =>
    data.map(rawCardSet => {
        return {
            name: rawCardSet.set_name,
            code: rawCardSet.set_code,
            cardCount: rawCardSet.num_of_cards,
            release: {
                tcg: rawCardSet.tcg_date ?? null,
                ocg: null // Not exposed yet
            }
        };
    });

export { mapCardSets, RawCardSet };

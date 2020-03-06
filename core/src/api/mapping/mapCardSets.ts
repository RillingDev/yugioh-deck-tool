// https://jvilk.com/MakeTypes/
import { CardSet } from "../../core/model/CardSet";
import { Format } from "../../core/model/Format";

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
                [Format.TCG]: rawCardSet.tcg_date ?? null,
                [Format.OCG]: null // Not exposed
            }
        };
    });

export { mapCardSets, RawCardSet };

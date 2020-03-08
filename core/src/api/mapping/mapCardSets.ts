// https://jvilk.com/MakeTypes/
import { CardSet } from "../../core/model/CardSet";

interface RawCardSet {
    set_name: string;
    set_code: string;
    num_of_cards: number;
    tcg_date: string;
}

const mapCardSets = (data: RawCardSet[]): CardSet[] =>
    data.map(rawCardSet => {
        return {
            name: rawCardSet.set_name,
            code: rawCardSet.set_code
        };
    });

export { mapCardSets, RawCardSet };

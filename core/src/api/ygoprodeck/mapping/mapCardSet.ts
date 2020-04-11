// https://jvilk.com/MakeTypes/
import { CardSet } from "../../../core/model/ygo/CardSet";

interface RawCardSet {
    set_name: string;
    set_code: string;
    num_of_cards: number;
    tcg_date: string;
}

const mapCardSet = (rawCardSet: RawCardSet): CardSet => {
    return {
        name: rawCardSet.set_name,
        code: rawCardSet.set_code,
    };
};

export { mapCardSet, RawCardSet };

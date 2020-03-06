import { Format } from "../../core/model/Format";
const mapCardSets = (data) => data.map(rawCardSet => {
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
export { mapCardSets };

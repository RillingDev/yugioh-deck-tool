import { CardSet } from "../model/CardSet";
interface RawCardSet {
    set_name: string;
    set_code: string;
    num_of_cards: number;
    tcg_date?: string | null;
}
declare const mapCardSets: (data: RawCardSet[]) => CardSet[];
export { mapCardSets };

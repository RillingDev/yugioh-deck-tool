import { injectable } from "inversify";
import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { Format } from "../model/Format";
import { CardType } from "../model/CardType";
import { intersection, isEmpty } from "lodash";

interface CardFilter {
    name: string | null;
    type: CardType | null;

    attribute: string | null;
    race: string | null;
    level: number | null;
    linkMarker: string | null;

    sets: CardSet[] | null;
    format: Format | null;
}

@injectable()
class FilterService {
    public filter(cards: Card[], filter: CardFilter): Card[] {
        return cards.filter(card => {
            if (
                filter.name != null &&
                !card.name.toLowerCase().includes(filter.name.toLowerCase())
            ) {
                return false;
            }

            if (filter.type != null && card.type != filter.type) {
                return false;
            }
            if (filter.race != null && card.attribute != filter.race) {
                return false;
            }
            if (
                filter.attribute != null &&
                card.attribute != filter.attribute
            ) {
                return false;
            }
            if (
                filter.attribute != null &&
                card.attribute != filter.attribute
            ) {
                return false;
            }

            if (
                filter.linkMarker != null &&
                card.linkMarkers != null &&
                !card.linkMarkers.includes(filter.linkMarker)
            ) {
                return false;
            }

            if (
                filter.sets != null &&
                isEmpty(intersection(card.sets, filter.sets))
            ) {
                return false;
            }

            return true;
        });
    }
}

export { FilterService, CardFilter };

import { inject, injectable } from "inversify";
import { Card } from "../../model/ygo/Card";
import { CardSet } from "../../model/ygo/CardSet";
import { Format } from "../../model/ygo/Format";
import { CardType } from "../../model/ygo/CardType";
import { intersection, isEmpty } from "lodash";
import { BanState } from "../../model/ygo/BanState";
import { CardService } from "./CardService";
import { TYPES } from "../../../types";
import { CardTypeGroup } from "../../model/ygo/CardTypeGroup";

interface CardFilter {
    name: string | null;

    typeGroup: CardTypeGroup | null;
    type: CardType | null;

    race: string | null;
    attribute: string | null;
    level: number | null;
    linkMarker: string | null;
    archetype: string | null;

    format: Format | null;
    banState: BanState | null;

    sets: CardSet[];
}

@injectable()
class FilterService {
    private readonly cardService: CardService;

    constructor(@inject(TYPES.CardService) cardService: CardService) {
        this.cardService = cardService;
    }

    /**
     * Filters a list of cards by a filter.
     *
     * @param cards Cards to filter.
     * @param filter Filter to apply. Generally null or empty array properties mean a check should be skipped.
     * @return Filtered cards.
     */
    public filter(cards: Card[], filter: CardFilter): Card[] {
        return cards.filter((card) => {
            if (
                filter.name != null &&
                filter.name !== "" &&
                !this.cardService
                    .getAllNames(card)
                    .every((name) =>
                        name.toLowerCase().includes(filter.name!.toLowerCase())
                    )
            ) {
                return false;
            }

            if (
                filter.typeGroup != null &&
                card.type.group != filter.typeGroup
            ) {
                return false;
            }
            if (filter.type != null && card.type != filter.type) {
                return false;
            }

            if (filter.race != null && card.race != filter.race) {
                return false;
            }
            if (filter.level != null && card.level != filter.level) {
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
                (card.linkMarkers == null ||
                    !card.linkMarkers.includes(filter.linkMarker))
            ) {
                return false;
            }
            if (
                filter.archetype != null &&
                card.archetype !== filter.archetype
            ) {
                return false;
            }

            if (
                filter.format != null &&
                !card.formats.includes(filter.format)
            ) {
                return false;
            }
            if (
                filter.banState != null &&
                filter.format != null &&
                this.cardService.getBanStateByFormat(card, filter.format) !==
                    filter.banState
            ) {
                return false;
            }

            if (
                filter.sets.length > 0 &&
                isEmpty(intersection(card.sets, filter.sets))
            ) {
                return false;
            }

            return true;
        });
    }
}

export { FilterService, CardFilter };

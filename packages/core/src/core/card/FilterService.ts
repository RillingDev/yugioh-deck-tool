import { inject, injectable } from "inversify";
import { Card } from "./Card";
import { CardSet } from "./set/CardSet";
import { Format } from "./format/Format";
import { CardType } from "./type/CardType";
import { intersection, isEmpty } from "lodash";
import { BanState } from "./banlist/BanState";
import { CardService } from "./CardService";
import { TYPES } from "../../types";
import { CardTypeGroup } from "./type/CardTypeGroup";
import { BanlistService } from "./banlist/BanlistService";

interface CardFilter {
    name?: string | null;

    typeGroup?: CardTypeGroup | null;
    type?: CardType | null;
    subType?: string | null;

    attribute?: string | null;
    level?: number | null;
    linkMarker?: string[];

    archetype?: string | null;
    format?: Format | null;
    banState?: BanState | null;

    sets?: CardSet[];
}

/**
 * @public
 */
@injectable()
class FilterService {
    private readonly cardService: CardService;
    private readonly banlistService: BanlistService;

    constructor(
        @inject(TYPES.CardService) cardService: CardService,
        @inject(TYPES.BanlistService) banlistService: BanlistService
    ) {
        this.cardService = cardService;
        this.banlistService = banlistService;
    }

    /**
     * Filters a list of cards by a filter.
     *
     * @param cards Cards to filter.
     * @param filter Filter to apply. Generally null or empty array properties mean a check should be skipped.
     * @return Filtered cards.
     */
    public filter(
        cards: ReadonlyArray<Card>,
        filter: Partial<CardFilter>
    ): Card[] {
        return cards.filter((card) => {
            if (
                filter.name != null &&
                filter.name !== "" &&
                !this.cardService
                    .getAllNames(card)
                    .some((name) =>
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

            if (filter.subType != null && card.subType != filter.subType) {
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
                filter.linkMarker.length > 0 &&
                (card.linkMarkers == null ||
                    filter.linkMarker.some(
                        (linkMarker) => !card.linkMarkers!.includes(linkMarker)
                    ))
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
                this.banlistService.getBanStateByFormat(card, filter.format) !==
                    filter.banState
            ) {
                return false;
            }

            if (
                filter.sets != null &&
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

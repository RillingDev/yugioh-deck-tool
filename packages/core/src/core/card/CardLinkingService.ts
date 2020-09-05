import { injectable } from "inversify";
import type { CardSetAppearance, UnlinkedCard } from "./UnlinkedCard";
import type { CardSet } from "./set/CardSet";
import type { CardType } from "./type/CardType";
import type { Card } from "./Card";
import { getLogger } from "../../logger";

/**
 * @private
 */
@injectable()
class CardLinkingService {
    private static readonly logger = getLogger(CardLinkingService);

    /**
     * Links an unlinked card.
     *
     * @param unlinkedCard Unlinked card.
     * @param setMap Set data to link against.
     * @param typeMap Type data to link against.
     * @return linked card.
     */
    public linkCard(
        unlinkedCard: UnlinkedCard,
        setMap: Map<string, CardSet>,
        typeMap: Map<string, CardType>
    ): Card {
        return {
            ...unlinkedCard,
            type: this.linkType(unlinkedCard.type, typeMap),
            sets: this.linkSets(unlinkedCard.sets, setMap),
        };
    }

    private linkSets(
        setAppearances: CardSetAppearance[],
        setCache: Map<string, CardSet>
    ): CardSet[] {
        return setAppearances
            .map((setAppearance) => {
                if (!setCache.has(setAppearance.name)) {
                    CardLinkingService.logger.warn(
                        `Could not find set '${setAppearance.name}'.`
                    );
                    return null;
                }
                const matchingSet = setCache.get(setAppearance.name)!;
                CardLinkingService.logger.trace(
                    `Matched set ${setAppearance.name} to ${matchingSet.name}.`
                );
                return matchingSet;
            })
            .filter((set) => set != null) as CardSet[];
    }

    private linkType(
        typeName: string,
        typeCache: Map<string, CardType>
    ): CardType {
        if (!typeCache.has(typeName)) {
            throw new TypeError(`Could not find type '${typeName}'.`);
        }
        const matchingType = typeCache.get(typeName)!;
        CardLinkingService.logger.trace(
            `Matched type ${typeName} to ${matchingType.name}.`
        );
        return matchingType;
    }
}

export { CardLinkingService };

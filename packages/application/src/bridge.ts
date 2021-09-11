import type { Card, Deck } from "@yugioh-deck-tool/core";
import { DeckPart, getLogger } from "@yugioh-deck-tool/core";
import type { ApplicationInstance, ExternalCard, ExternalDeck } from "./api";
import { useStore } from "./store/store";

const logger = getLogger("tooltip");

/**
 * Creates implementation of {@link ApplicationInstance} which is bridged to Vue.
 */
export const createApplicationBridge = (): ApplicationInstance => {
    const store = useStore();
    return {
        getDeck() {
            logger.debug("Exporting current deck state...");
            return createExternalDeck(store.state.deck.active);
        },
    };
};

const createExternalDeck = ({ name, parts }: Deck): ExternalDeck => {
    return {
        name,
        parts: {
            main: parts[DeckPart.MAIN].map(createExternalCard),
            extra: parts[DeckPart.EXTRA].map(createExternalCard),
            side: parts[DeckPart.SIDE].map(createExternalCard),
        },
    };
};

const createExternalCard = ({ passcode, name }: Card): ExternalCard => {
    return { passcode, name };
};

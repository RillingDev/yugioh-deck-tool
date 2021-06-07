import type { ComputedRef } from "@vue/composition-api";
import { computed } from "@vue/composition-api";
import { applicationContainer } from "../../inversify.config";
import type { DeckService } from "@yugioh-deck-tool/core";
import { TYPES } from "@yugioh-deck-tool/core";
import { useStore } from "../../store/store";

const deckService = applicationContainer.get<DeckService>(TYPES.DeckService);

export const useDeckEmpty = (): ComputedRef<boolean> =>
    computed<boolean>(
        () => deckService.getAllCards(useStore().state.deck.active).length === 0
    );

import type { ComputedRef, SetupContext } from "@vue/composition-api";
import { computed } from "@vue/composition-api";
import { useAppStore } from "./useAppStore";
import { applicationContainer } from "../../inversify.config";
import type { DeckService } from "@yugioh-deck-tool/core";
import { TYPES } from "@yugioh-deck-tool/core";

const deckService = applicationContainer.get<DeckService>(TYPES.DeckService);

export const useDeckEmpty = (context: SetupContext): ComputedRef<boolean> =>
    computed<boolean>(
        () =>
            deckService.getAllCards(useAppStore(context).state.deck.active)
                .length === 0
    );

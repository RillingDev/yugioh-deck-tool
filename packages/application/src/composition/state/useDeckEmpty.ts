import type { ComputedRef, SetupContext } from "@vue/composition-api";
import { computed } from "@vue/composition-api";
import { useAppStore } from "./useAppStore";
import { applicationContainer } from "../../inversify.config";
import type { DeckService } from "../../../../core/src/main";
import { TYPES } from "../../../../core/src/main";

const deckService = applicationContainer.get<DeckService>(TYPES.DeckService);

export const useDeckEmpty = (context: SetupContext): ComputedRef<boolean> =>
    computed<boolean>(
        () =>
            deckService.getAllCards(useAppStore(context).state.deck.active)
                .length === 0
    );

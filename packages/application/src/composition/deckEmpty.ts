import { computed, ComputedRef, SetupContext } from "@vue/composition-api";
import { appStore } from "./appStore";
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";
import { DeckService } from "../../../core/src/main";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export const deckEmpty = (context: SetupContext): ComputedRef<boolean> =>
    computed<boolean>(
        () =>
            deckService.getAllCards(appStore(context).state.deck.active)
                .length === 0
    );

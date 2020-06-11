<template>
    <a
        :disabled="isDeckEmpty"
        :class="{ disabled: isDeckEmpty }"
        :href="buyLink"
        class="btn btn-primary btn-sm"
        target="_blank"
    >
        Open Buy Page
    </a>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { DeckExportService, DeckService } from "../../../../core/src/main";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import { appStore } from "../../composition/appStore";

const deckExportService = applicationContainer.get<DeckExportService>(
    APPLICATION_TYPES.DeckExportService
);
const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);
export default defineComponent({
    components: {},
    props: {},
    setup: function (props, context) {
        const isDeckEmpty = computed<boolean>(
            () =>
                deckService.getAllCards(appStore(context).state.deck.active)
                    .length === 0
        );

        const buyLink = computed<string>(() =>
            deckExportService
                .toBuyLink(appStore(context).state.deck.active)
                .toString()
        );

        return { isDeckEmpty, buyLink };
    },
});
</script>

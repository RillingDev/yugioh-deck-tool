<template>
    <BDropdownGroup>
        <BDropdownItemButton
            :disabled="!essentialDataLoaded"
            @click="() => randomize()"
        >
            <span class="fas fa-magic fas-in-button" aria-hidden="true"></span>
            Randomize
        </BDropdownItemButton>
        <BDropdownItemButton
            v-b-modal.randomizerSettings
            :disabled="!essentialDataLoaded"
        >
            <span class="fas fa-cogs fas-in-button" aria-hidden="true"></span>
            Randomizer Settings
            <BModal
                id="randomizerSettings"
                hide-footer
                modal-class="deck-tool__portal"
                title="Randomizer Settings"
            >
                <div class="form-group">
                    <VSelect
                        v-model="strategy"
                        :options="strategies"
                        :clearable="false"
                        title="Randomization Strategy"
                    />
                </div>
                <div class="form-group">
                    <YgoFilter v-model="filter" :show-only="['sets']" />
                </div>
            </BModal>
        </BDropdownItemButton>
    </BDropdownGroup>
</template>

<script lang="ts">
import type {
    CardFilter,
    DeckRandomizationService,
    Format,
} from "@yugioh-deck-tool/core";
import { RandomizationStrategy, TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownGroup, BDropdownItemButton, BModal } from "bootstrap-vue";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { computed, defineComponent, readonly, ref } from "@vue/composition-api";
import YgoFilter from "../../YgoFilter.vue";
import VSelect from "vue-select";
import { useStore } from "../../../store/store";

const deckRandomizationService =
    applicationContainer.get<DeckRandomizationService>(
        TYPES.DeckRandomizationService
    );

export default defineComponent({
    components: {
        YgoFilter,
        VSelect,
        BModal,
        BDropdownItemButton,
        BDropdownGroup,
    },
    props: {},
    emits: [],
    setup() {
        const strategies = readonly<RandomizationStrategy[]>(
            Object.values(RandomizationStrategy)
        );

        const strategy = ref<RandomizationStrategy>(
            RandomizationStrategy.ARCHETYPE_2
        );
        const filter = ref<CardFilter>({
            sets: [],
        });

        const store = useStore();

        const format = computed<Format | null>(() => store.state.format.active);

        const randomize = (): void => {
            const randomizedDeck = deckRandomizationService.randomize(
                strategy.value,
                {
                    ...filter.value,
                    format: format.value,
                }
            );
            store.commit(DECK_REPLACE, { deck: randomizedDeck });
        };

        const essentialDataLoaded = computed<boolean>(
            () => store.state.data.essentialDataLoaded
        );

        return {
            strategy,
            strategies,
            filter,

            essentialDataLoaded,

            randomize,
        };
    },
});
</script>

<style lang="scss">
@import "~@yugioh-deck-tool/browser-common/src/styles/variables";
@import "~@yugioh-deck-tool/browser-common/src/styles/mixins";

.deck-tool__portal {
    .randomizer__btn-group {
        justify-content: space-between;
    }
}
</style>

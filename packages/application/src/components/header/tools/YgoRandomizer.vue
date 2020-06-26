<template>
    <div>
        <BDropdownDivider />
        <BDropdownItem @click="() => randomize()" :disabled="!loaded">
            Randomize
        </BDropdownItem>
        <BDropdownItem v-b-modal.randomizerSettings :disabled="!loaded">
            Randomizer Settings
            <BModal
                id="randomizerSettings"
                hide-footer
                modal-class="deck-tool__portal"
                title="Randomizer Settings"
            >
                <div class="form-group">
                    <VSelect
                        :options="strategies"
                        v-model="strategy"
                        :clearable="false"
                        title="Randomization Strategy"
                    />
                </div>
                <hr />
                <div class="form-group">
                    <YgoFilter v-model="filter" :show-only="['sets']" />
                </div>
            </BModal>
        </BDropdownItem>
    </div>
</template>

<script lang="ts">
import {
    CardFilter,
    DeckRandomizationService,
    Format,
    RandomizationStrategy,
} from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownDivider, BDropdownItem, BModal } from "bootstrap-vue";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { computed, defineComponent, ref } from "@vue/composition-api";
import YgoFilter from "../../YgoFilter.vue";
import VSelect from "vue-select";
import { appStore } from "../../../composition/appStore";
import { dataLoaded } from "../../../composition/dataLoaded";

const deckRandomizationService = applicationContainer.get<
    DeckRandomizationService
>(APPLICATION_TYPES.DeckRandomizationService);

export default defineComponent({
    components: {
        YgoFilter,
        VSelect,
        BModal,
        BDropdownItem,
        BDropdownDivider,
    },
    props: {},
    setup(props, context) {
        const strategies = Object.values(RandomizationStrategy);

        const strategy = ref<RandomizationStrategy>(
            RandomizationStrategy.ARCHETYPE_2
        );
        const filter = ref<CardFilter>({
            sets: [],
        });

        const format = computed<Format>(
            () => appStore(context).state.format.active
        );

        const randomize = (): void => {
            const randomizedDeck = deckRandomizationService.randomize(
                strategy.value,
                {
                    ...filter.value,
                    format: format.value,
                }
            );
            appStore(context).commit(DECK_REPLACE, { deck: randomizedDeck });
        };

        const loaded = dataLoaded(context);

        return {
            strategy,
            strategies,
            filter,

            loaded,

            randomize,
        };
    },
});
</script>

<style lang="scss">
@import "../../../../../ui/src/styles/variables";
@import "../../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__portal {
    .randomizer__btn-group {
        justify-content: space-between;
    }
}
</style>

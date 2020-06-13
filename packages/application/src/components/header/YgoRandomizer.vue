<template>
    <div class="randomizer btn-group" role="group">
        <button
            class="btn btn-primary btn-sm"
            @click="() => randomize()"
            :disabled="!loaded"
        >
            Randomize
        </button>
        <button
            class="btn btn-primary btn-sm"
            title="Configure Randomizer"
            @click="() => showModal()"
            :disabled="!loaded"
        >
            <span class="fas fa-cog" aria-hidden="true"></span>
        </button>
        <BModal
            hide-footer
            modal-class="deck-tool__portal"
            ref="modal"
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
    </div>
</template>

<script lang="ts">
import {
    CardFilter,
    DeckRandomizationService,
    RandomizationStrategy,
    Format,
} from "../../../../core/src/main";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import { BModal } from "bootstrap-vue";
import { DECK_REPLACE } from "../../store/modules/deck";
import { computed, defineComponent, ref } from "@vue/composition-api";
import YgoFilter from "../YgoFilter.vue";
import VSelect from "vue-select";
import { appStore } from "../../composition/appStore";
import { dataLoaded } from "../../composition/dataLoaded";

const deckRandomizationService = applicationContainer.get<
    DeckRandomizationService
>(APPLICATION_TYPES.DeckRandomizationService);

export default defineComponent({
    components: {
        YgoFilter,
        VSelect,
        BModal,
    },
    props: {},
    setup(props, context) {
        const strategies = Object.values(RandomizationStrategy);

        const strategy = ref<RandomizationStrategy>(
            RandomizationStrategy.ARCHETYPE_2
        );
        const filter = ref<CardFilter>({
            name: null,

            typeGroup: null,
            type: null,

            subType: null,
            attribute: null,
            level: null,
            linkMarker: null,
            archetype: null,

            format: null,
            banState: null,

            sets: [],
        });
        const modal = ref<BModal>();

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

        const showModal = (): void => {
            modal.value?.show();
        };

        const loaded = dataLoaded(context);

        return {
            strategy,
            strategies,
            filter,
            modal,

            loaded,

            showModal,
            randomize,
        };
    },
});
</script>
<style lang="scss">
/*.randomizer .btn {*/
/*    margin-right: 0;*/
/*}*/
</style>

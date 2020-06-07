<template>
    <div class="randomizer btn-group" role="group">
        <button
            class="btn btn-primary btn-sm"
            title="Randomize Deck"
            @click="() => randomize()"
        >
            Randomize
        </button>
        <button
            class="btn btn-primary btn-sm"
            title="Configure Randomizer"
            @click="() => showModal()"
        >
            <span class="fas fa-cog" aria-hidden="true"></span>
        </button>
        <BModal
            hide-footer
            modal-class="deck-tool__modal"
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
} from "../../../../core/src/main";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import { BModal } from "bootstrap-vue";
import { DECK_REPLACE } from "../../store/modules/deck";
import { defineComponent, ref } from "@vue/composition-api";
import YgoFilter from "../YgoFilter.vue";
import VSelect from "vue-select";

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
        const modal = ref<BModal>(null);

        const randomize = () => {
            const randomizedDeck = deckRandomizationService.randomize(
                strategy.value,
                filter.value
            );
            context.root.$store.commit(DECK_REPLACE, { deck: randomizedDeck });
        };

        const showModal = () => {
            modal.value.show();
        };

        return { strategy, strategies, filter, modal, showModal, randomize };
    },
});
</script>
<style lang="scss">
/*.randomizer .btn {*/
/*    margin-right: 0;*/
/*}*/
</style>

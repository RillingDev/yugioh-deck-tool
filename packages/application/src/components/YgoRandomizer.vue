<template>
    <div class="randomizer btn-group" role="group">
        <button
            class="btn btn-primary btn-sm"
            title="Randomize Deck"
            v-on:click="randomize"
        >
            Randomize
        </button>
        <button
            class="btn btn-primary btn-sm"
            title="Configure Randomizer"
            v-on:click="showModal"
        >
            <span class="fas fa-cog"></span>
        </button>
        <BModal
            hide-footer
            id="modalRandomizerSettings"
            modal-class="deck-tool__modal"
            ref="modalRandomizerSettings"
            size="lg"
            title="Randomizer Settings"
        >
            <div class="form-group">
                <label>Mode:</label>
                <AdvancedSelect
                    :initial-options="strategies"
                    :initial-value="strategy"
                    :no-selection-allowed="false"
                    v-on:input="(newStrategy) => (strategy = newStrategy)"
                ></AdvancedSelect>
            </div>
            <hr />
            <div class="form-group">
                <YgoFilter
                    :initial-filter="filter"
                    :show-advanced="false"
                    v-on:filter-change="(newFilter) => (filter = newFilter)"
                ></YgoFilter>
            </div>
        </BModal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    CardFilter,
    DeckRandomizationService,
    Format,
    RandomizationStrategy,
} from "yugioh-deck-tool-core/src/main";
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";
import Component from "vue-class-component";
import { BModal } from "bootstrap-vue";
import AdvancedSelect from "@/components/AdvancedSelect.vue";
import YgoFilter from "@/components/YgoFilter.vue";
import { DECK_REPLACE } from "@/store/modules/deck";

@Component({ components: { AdvancedSelect, YgoFilter, BModal } })
export default class YgoRandomizer extends Vue {
    strategy: RandomizationStrategy;
    strategies: RandomizationStrategy[];

    filter: CardFilter;

    private readonly deckRandomizationService = applicationContainer.get<
        DeckRandomizationService
    >(APPLICATION_TYPES.DeckRandomizationService);

    data() {
        return {
            strategy: RandomizationStrategy.ARCHETYPE_2,
            strategies: Object.values(RandomizationStrategy),
            filter: {
                name: null,

                typeGroup: null,
                type: null,

                subType: null,
                attribute: null,
                level: null,
                linkMarker: null,
                archetype: null,

                format: Format.TCG,
                banState: null,

                sets: [],
            },
        };
    }

    randomize() {
        const randomizedDeck = this.deckRandomizationService.randomize(
            this.strategy,
            this.filter
        );
        this.$store.commit(DECK_REPLACE, { deck: randomizedDeck });
    }

    showModal() {
        (this.$refs.modalRandomizerSettings as BModal).show();
    }
}
</script>
<style lang="scss">
.randomizer .btn {
    margin-right: 0;
}
</style>

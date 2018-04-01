<template>
    <div
        class="randomizer btn-group"
        role="group"
    >
        <button
            class="btn btn-primary btn-sm"
            title="Randomize Deck"
            @click="randomize"
        >Randomize</button>
        <button
            class="btn btn-primary btn-sm"
            title="Configure Randomizer"
            @click="showModal"
        >
            <span class="fas fa-cog">
                <!---->
            </span>
        </button>
        <b-modal
            id="modalRandomizerSettings"
            ref="modalRandomizerSettings"
            size="lg"
            hide-footer
            title="Randomizer Settings"
        >
            <div class="form-group">
                <label>Mode:</label>
                <select
                    v-model="mode.selected"
                    class="form-control"
                    @change="updateMode"
                >
                    <option
                        v-for="modeCurrent in mode.available"
                        :key="modeCurrent.name"
                        :value="modeCurrent"
                    >{{ modeCurrent.name }}</option>
                </select>
            </div>
            <template v-if="showCustom">
                <h3>Ratios:</h3>
                <div class="form-group d-flex">
                    <div>
                        <label>Monster:</label>
                        <input
                            v-model="ratios.monster"
                            type="number"
                            class="form-control"
                            min="0"
                            max="1"
                            step="0.1"
                        >
                    </div>
                    <div>
                        <label>Spell:</label>
                        <input
                            v-model="ratios.spell"
                            type="number"
                            class="form-control"
                            min="0"
                            max="1"
                            step="0.1"
                        >
                    </div>
                    <div>
                        <label>Trap:</label>
                        <input
                            v-model="ratios.trap"
                            type="number"
                            class="form-control"
                            min="0"
                            max="1"
                            step="0.1"
                        >
                    </div>
                </div>
                <h3>Filter:</h3>
                <div class="form-group">
                    <ygo-filter
                        :pairs-arr="cardDb.pairsArrUniq"
                        :hide-sort="true"
                        @change="handleFilterUpdate"
                    />
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import CardDatabase from "../lib/classes/cardDatabase";
import { randomizeDeck } from "../lib/randomize";
import { archetypePoolFactory, getRandomArchetypes } from "../lib/archetype";
import {
    CHANCE_ARCHETYPE_1_EXTRA,
    CHANCE_ARCHETYPE_2_EXTRA,
    CHANCE_ARCHETYPE_3_EXTRA,
    getDefaultRatios
} from "../lib/data/randomizer";
import bModal from "bootstrap-vue/es/components/modal/modal";
import YgoFilter from "./ygoFilter.vue";

export default {
    components: { bModal, YgoFilter },
    props: {
        cardDb: {
            type: CardDatabase,
            required: true
        }
    },
    data: function() {
        return {
            pairsArrFiltered: null,
            ratios: getDefaultRatios(),
            showCustom: false,
            mode: {
                selected: null,
                available: [
                    {
                        name: "Fully Random",
                        getPools: pairsArrUniq => {
                            return {
                                main: pairsArrUniq,
                                required: [],
                                ratios: getDefaultRatios()
                            };
                        }
                    },
                    {
                        name: "Custom",
                        getPools: () => {
                            return {
                                main: this.pairsArrFiltered,
                                required: [],
                                ratios: this.ratios
                            };
                        }
                    },
                    {
                        name: "One Archetype",
                        getPools: pairsArrUniq =>
                            archetypePoolFactory(
                                pairsArrUniq,
                                getRandomArchetypes(1),
                                CHANCE_ARCHETYPE_1_EXTRA
                            )
                    },
                    {
                        name: "Two Archetypes",
                        getPools: pairsArrUniq =>
                            archetypePoolFactory(
                                pairsArrUniq,
                                getRandomArchetypes(2),
                                CHANCE_ARCHETYPE_2_EXTRA
                            )
                    },
                    {
                        name: "Three Archetypes",
                        getPools: pairsArrUniq =>
                            archetypePoolFactory(
                                pairsArrUniq,
                                getRandomArchetypes(3),
                                CHANCE_ARCHETYPE_3_EXTRA
                            )
                    }
                ]
            }
        };
    },
    mounted() {
        this.mode.selected = this.mode.available[0];
    },
    methods: {
        showModal() {
            this.$refs.modalRandomizerSettings.show();
        },
        handleFilterUpdate(pairsArrFiltered) {
            this.pairsArrFiltered = pairsArrFiltered;
        },
        updateMode() {
            if (this.mode.selected === this.mode.available[1]) {
                this.showCustom = true;

                //Manually set pairsArrFiltered if no change event was fired yet
                if (this.pairsArrFiltered === null) {
                    this.pairsArrFiltered = this.cardDb.pairsArrUniq;
                }
            } else {
                this.showCustom = false;
            }
        },
        randomize() {
            const result = randomizeDeck(
                this.cardDb,
                this.mode.selected.getPools
            );

            this.$emit("randomize", result);
        }
    }
};
</script>

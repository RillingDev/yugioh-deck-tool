<template>
    <div class="builder">
        <span
            >Showing {{ filteredCards.length }} of
            {{ formatCards.length }} Cards</span
        >

        <ygo-filter
            :initial-filter="filter"
            :initial-sorting-order="sortingOrder"
            :initial-sorting-strategy="sortingStrategy"
            v-on:filter-change="(newFilter) => (filter = newFilter)"
            v-on:sorting-change="
                ({ strategy, order }) => {
                    sortingStrategy = strategy;
                    sortingOrder = order;
                }
            "
        />

        <!-- builder-list -->
        <template v-if="filteredCards.length">
            <ul class="builder-list">
                <li :key="card.id" v-for="card in filteredCards">
                    <div class="builder-card">
                        <!-- Has to be an anchor tag because of how ygoprodeck.com's tooltip script works -->
                        <a :data-name="card.name" class="builder-card-name">{{
                            card.name
                        }}</a>
                        <div class="builder-card-action">
                            <button
                                :class="`builder-add-${deckPart.id}`"
                                :disabled="
                                    !canAdd(deckPart, card, filter.format)
                                "
                                :key="deckPart.id"
                                :title="`Add Card to ${deckPart.name} Deck`"
                                @click="(e) => onAddCard(e, deckPart, card)"
                                class="builder-add btn"
                                v-for="deckPart in deckParts"
                            >
                                <span class="fas fa-plus">
                                    <!---->
                                </span>
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </template>
        <template v-else>
            <p class="builder-noresults">
                No Results Found
            </p>
        </template>
    </div>
</template>

<script lang="ts">
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {
    Card,
    CardDatabase,
    CardFilter,
    CardService,
    DeckPart,
    DEFAULT_DECK_PART_ARR,
    FilterService,
    Format,
    SortingOrder,
    SortingService,
    SortingStrategy,
} from "yugioh-deck-tool-core/src/main";
import YgoFilter from "@/components/YgoFilter.vue";

@Component({
    components: { YgoFilter },
})
export default class YgoBuilder extends Vue {
    @Prop({ required: true })
    canAdd: (deckPart: DeckPart, card: Card, format: Format) => boolean;
    deckParts = DEFAULT_DECK_PART_ARR;
    sortingStrategy = SortingStrategy.NAME;
    sortingOrder = SortingOrder.DESC;
    filter: CardFilter = {
        name: null,

        typeGroup: null,
        type: null,

        race: null,
        attribute: null,
        level: null,
        linkMarker: null,
        archetype: null,

        format: null,
        banState: null,

        sets: [],
    };
    private readonly cardDatabase = uiContainer.get<CardDatabase>(
        UI_TYPES.CardDatabase
    );
    private readonly sortingService = uiContainer.get<SortingService>(
        UI_TYPES.SortingService
    );
    private readonly filterService = uiContainer.get<FilterService>(
        UI_TYPES.FilterService
    );
    private readonly cardService = uiContainer.get<CardService>(
        UI_TYPES.CardService
    );

    get cards() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardService.getUniqueByName(this.cardDatabase.getCards());
    }

    get filteredCards(): Card[] {
        if (this.cardDatabase == null) {
            return [];
        }
        const filtered = this.filterService.filter(this.cards, this.filter);
        const sorted = this.sortingService.sort(
            filtered,
            this.sortingStrategy,
            this.sortingOrder
        );
        return sorted.slice(0, 100);
    }

    get formatCards(): Card[] {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.filterService.filter(this.cards, {
            name: null,

            typeGroup: null,
            type: null,

            race: null,
            attribute: null,
            level: null,
            linkMarker: null,
            archetype: null,

            format: this.filter.format,
            banState: null,

            sets: [],
        });
    }

    onAddCard(e: any, deckPart: DeckPart, card: Card) {
        this.$emit("deck-card-add", e, { deckPart, card });
    }
}
</script>

<style lang="scss">
@import "../styles/variables.custom";
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../../../ui/src/styles/mixin/screen";

.decktool {
    .builder-list {
        overflow-x: auto;
        overflow-y: scroll;
        width: 100%;
        max-height: 250px;
        padding: 0;
        list-style: none;
        resize: vertical;
        border: 1px solid $gray-400;
        @include screen(min, md) {
            max-height: 60vh;
        }
    }

    .builder-list li {
        border-top: 1px solid $gray-400;

        &:first-child {
            border-top: 0;
        }
    }

    .builder-card {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 10px;
    }

    .builder-card-name {
        &,
        &:hover {
            width: 100%;
            padding: 10px 0;
            color: $black;
            text-decoration: none;
        }
    }

    .builder-card-action {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-evenly;
        width: 80px;
    }

    .btn.builder-add {
        font-size: 1.2em;
        width: 34px;
        padding: 0;
        cursor: pointer;
        opacity: 0.8;
        background-color: transparent;

        &:active {
            opacity: 1;
        }

        &[disabled] {
            opacity: 0.4;
        }

        &-main .fas {
            color: $color-deckpart-main;
        }

        &-extra .fas {
            color: $color-deckpart-extra;
        }

        &-side .fas {
            color: $color-deckpart-side;
        }
    }

    .builder-noresults {
        padding: 0.5rem 0;
        text-align: center;
        color: $gray-600;
    }
}
</style>

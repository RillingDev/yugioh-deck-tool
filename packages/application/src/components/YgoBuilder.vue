<template>
    <div class="builder">
        <span
            >Showing {{ filteredCards.length }} of
            {{ formatCards.length }} Cards</span
        >

        <ygo-filter :show-advanced="true" v-model="filter" />
        <ygo-sorting-options v-model="sortingOptions" />

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
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {
    Card,
    CardDatabase,
    CardFilter,
    CardService,
    DeckPart,
    DeckService,
    DEFAULT_DECK_PART_ARR,
    FilterService,
    Format,
    SortingOptions,
    SortingOrder,
    SortingService,
    SortingStrategy,
} from "yugioh-deck-tool-core/src/main";
import YgoFilter from "@/components/YgoFilter.vue";
import { DECK_CARD_ADD } from "@/store/modules/deck";
import YgoSortingOptions from "@/components/YgoSortingOptions.vue";

@Component({
    components: { YgoFilter, YgoSortingOptions },
})
export default class YgoBuilder extends Vue {
    deckParts = DEFAULT_DECK_PART_ARR;
    sortingOptions: SortingOptions = {
        strategy: SortingStrategy.NAME,
        order: SortingOrder.DESC,
    };
    filter: CardFilter = {
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
    };
    private readonly cardDatabase = applicationContainer.get<CardDatabase>(
        APPLICATION_TYPES.CardDatabase
    );
    private readonly sortingService = applicationContainer.get<SortingService>(
        APPLICATION_TYPES.SortingService
    );
    private readonly filterService = applicationContainer.get<FilterService>(
        APPLICATION_TYPES.FilterService
    );
    private readonly cardService = applicationContainer.get<CardService>(
        APPLICATION_TYPES.CardService
    );
    private readonly deckService = applicationContainer.get<DeckService>(
        APPLICATION_TYPES.DeckService
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
        const sorted = this.sortingService.sort(filtered, this.sortingOptions);
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

            subType: null,
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
        this.$store.commit(DECK_CARD_ADD, { card, deckPart });
    }

    canAdd(deckPart: DeckPart, card: Card, format: Format) {
        return this.deckService.canAdd(
            this.$store.state.deck.active,
            deckPart,
            format,
            card
        );
    }
}
</script>

<style lang="scss">
@import "~yugioh-deck-tool-ui/src/styles/variables";
@import "~yugioh-deck-tool-ui/src/styles/mixin/screen";

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
            text-decoration: none;
            color: $black;
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
            color: $color-deck-part-main;
        }

        &-extra .fas {
            color: $color-deck-part-extra;
        }

        &-side .fas {
            color: $color-deck-part-side;
        }
    }

    .builder-noresults {
        padding: 0.5rem 0;
        text-align: center;
        color: $gray-600;
    }
}
</style>

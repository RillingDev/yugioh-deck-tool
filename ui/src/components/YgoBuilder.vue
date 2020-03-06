<template>
    <div class="builder">
        <span
            >Showing {{ pairsArrFilteredPrepared.length }} of
            {{ pairsArr.length }} Cards</span
        >

        <ygo-filter
            :pairs-arr="pairsArr"
            :sets="sets"
            :show-advanced-filters="true"
            @change="handleFilterUpdate"
        />

        <!-- builder-list -->
        <template v-if="pairsArrFilteredPrepared.length">
            <ul class="builder-list">
                <li :key="pair[0]" v-for="pair in pairsArrFilteredPrepared">
                    <span class="builder-card">
                        <!-- Has to be an anchor tag because of how ygoprodeck.com's tooltip script works -->
                        <a :data-name="pair[0]" class="builder-card-name">{{
                            pair[1]
                        }}</a>
                        <div class="builder-card-action">
                            <button
                                :class="`builder-add-${deckPart.id}`"
                                :disabled="
                                    !deckCardCanAdd(deckPart, pair[0], banlist)
                                "
                                :key="deckPart.id"
                                :title="`Add Card to ${deckPart.name} Deck`"
                                @click="
                                    e =>
                                        clickEvent(
                                            e,
                                            deckPart,
                                            pair[0],
                                            banlist
                                        )
                                "
                                class="builder-add btn"
                                v-for="deckPart in deckParts"
                            >
                                <span class="fas fa-plus">
                                    <!---->
                                </span>
                            </button>
                        </div>
                    </span>
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
import { BANLISTS } from "../lib/data/banlist";
import YgoFilter from "./YgoFilter.vue";
import { CardDatabase, container, TYPES, DECKPARTS } from "../../../core";

export default {
    components: { YgoFilter },
    props: {
        deckCardCanAdd: {
            type: Function,
            required: false,
            default: () => true
        }
    },
    data: () => {
        const cardDatabase = container.get<CardDatabase>(TYPES.CardDatabase);
        return {
            deckParts: DECKPARTS,
            pairsArrFiltered: [],
            banlist: BANLISTS[0],
            pairsArr: cardDatabase.getCards(),
            sets: cardDatabase.getSets()
        };
    },
    computed: {
        pairsArrFilteredPrepared() {
            return this.pairsArrFiltered
                .slice(0, 100)
                .map(pair => [pair[0], pair[1].name]);
        }
    },
    methods: {
        clickEvent(e, deckPart, cardId, banlist) {
            this.$emit("deckcardadd", deckPart, cardId, banlist, e);
        },
        handleFilterUpdate(pairsArrFiltered) {
            this.pairsArrFiltered = pairsArrFiltered;
        }
    }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/mixins/screen";
@import "../styles/variables.custom";

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
    width: 100%;
    padding: 10px 0;
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
</style>

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
                <li v-for="pair in pairsArrFilteredPrepared" :key="pair[0]">
                    <span class="builder-card">
                        <!-- Has to be an anchor tag because of how ygoprodeck.com's tooltip script works -->
                        <a class="builder-card-name" :data-name="pair[1]">{{
                            pair[1]
                        }}</a>
                        <div class="builder-card-action">
                            <button
                                v-for="deckPart in deckParts"
                                :key="deckPart.id"
                                :class="`builder-add-${deckPart.id}`"
                                :title="`Add Card to ${deckPart.name} Deck`"
                                :disabled="
                                    !deckCardCanAdd(deckPart, pair[0], banlist)
                                "
                                class="builder-add btn"
                                @click="
                                    e =>
                                        clickEvent(
                                            e,
                                            deckPart,
                                            pair[0],
                                            banlist
                                        )
                                "
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

<script>
import { DECKPARTS } from "../lib/data/deck";
import { BANLISTS } from "../lib/data/banlist";
import YgoFilter from "./ygoFilter.vue";

export default {
    components: { YgoFilter },
    props: {
        pairsArr: {
            type: Array,
            required: true
        },
        sets: {
            type: Array,
            required: true
        },
        deckCardCanAdd: {
            type: Function,
            required: false,
            default: () => true
        }
    },
    data: () => {
        return {
            deckParts: DECKPARTS,
            pairsArrFiltered: [],
            banlist: BANLISTS[0]
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
    max-height: 250px;
    width: 100%;
    overflow-x: auto;
    overflow-y: scroll;
    list-style: none;
    padding: 0;
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
    padding: 10px 0;
    width: 100%;
}

.builder-card-action {
    width: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}

.btn.builder-add {
    width: 34px;
    opacity: 0.8;
    font-size: 1.2em;
    cursor: pointer;
    padding: 0;
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
    text-align: center;
    padding: 0.5rem 0;
    color: $gray-600;
}
</style>

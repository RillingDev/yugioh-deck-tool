<template>
    <div class="builder">
        <span>Showing {{ pairsFiltered.length }} of {{ pairs.length }} Cards</span>
        <input
            class="form-control builder-search"
            type="search"
            v-model="filter"
            title="Search"
            placeholder="Search"
        >
        <ul
            class="builder-list"
            v-if="pairsFiltered.length"
        >
            <li
                class="builder-card-wrapper"
                v-for="pair in pairsFiltered"
                :key="pair[0]"
            >
                <a
                    class="builder-card"
                    :data-name="pair[1]"
                >
                    <div class="builder-card-name">{{ pair[1] }}</div>
                    <div class="builder-card-action">
                        <span
                            class="fa fa-plus builder-add"
                            v-for="deckPart in deckParts"
                            :key="deckPart.id"
                            @click="deckCardAdd(deckPart,pair[0])"
                            :class="`builder-add-${deckPart.id}`"
                            :title="`Add Card to ${deckPart.name} Deck`"
                        ><!----></span>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { arrFrom } from "lightdash";

export default {
    props: {
        cardsPairs: {
            type: Map,
            required: true,
            default: () => new Map()
        },
        deckParts: {
            type: Array,
            required: true,
            default: () => []
        },
        deckCardAdd: {
            type: Function,
            default: () => {}
        }
    },
    data: () => {
        return {
            filter: ""
        };
    },
    computed: {
        pairs() {
            return arrFrom(this.cardsPairs.entries());
        },
        pairsFiltered() {
            return this.pairs
                .filter(pair =>
                    pair[1].toLowerCase().includes(this.filter.toLowerCase())
                )
                .slice(0, 100);
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "../styles/variables";
@import "../styles/variables.app";

.builder-search {
    margin-bottom: 1rem;
}

.builder-list {
    max-height: 60vh;
    width: 100%;
    overflow-x: auto;
    overflow-y: scroll;
    list-style: none;
    padding: 0;
    resize: vertical;
    border: 1px solid $gray-400;
}

.builder-card-wrapper {
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
}
.builder-card-action {
    width: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}
.builder-add {
    width: 34px;
    text-align: center;
    opacity: 0.8;
    font-size: 1.2em;
    cursor: pointer;
    &:active {
        opacity: 1;
    }
    &-main {
        color: $color-deckpart-main;
    }
    &-extra {
        color: $color-deckpart-extra;
    }
    &-side {
        color: $color-deckpart-side;
    }
}

.builder-card-name {
    width: calc(100% - 108px);
}
</style>

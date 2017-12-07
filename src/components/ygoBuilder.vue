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
        <div class="form-group">
            <label>Sort:</label>
            <select
                class="form-control"
                v-model="sort.active"
                title="Active Sorting"
            >
                <option
                    v-for="(mode, index) in sort.modes"
                    :key="mode.name"
                    :value="index"
                >{{ mode.name }}</option>
            </select>
        </div>
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
                            @click="deckCardAdd(deckPart, pair[0])"
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
        cardDb: {
            type: Object,
            required: true,
            default: () => {
                return {};
            }
        },
        deckParts: {
            type: Array,
            required: true,
            default: () => []
        },
        deckCardAdd: {
            type: Function,
            required: true,
            default: () => {}
        }
    },
    data: () => {
        return {
            filter: "",
            sort: {
                active: 0,
                modes: [
                    {
                        name: "Alphabetical (A-Z)",
                        fn: (a, b) => a[0].localeCompare(b[0])
                    },
                    {
                        name: "Alphabetical (Z-A)",
                        fn: (a, b) => b[0].localeCompare(a[0])
                    },

                    {
                        name: "ATK",
                        fn: (a, b) => Number(b[4]) - Number(a[4])
                    },
                    {
                        name: "DEF",
                        fn: (a, b) => Number(b[5]) - Number(a[5])
                    },
                    {
                        name: "Level",
                        fn: (a, b) => Number(b[6]) - Number(a[6])
                    },
                    {
                        name: "Upvotes",
                        fn: (a, b) => Number(b[11]) - Number(a[11])
                    },
                    {
                        name: "Downvotes",
                        fn: (a, b) => Number(b[12]) - Number(a[12])
                    },
                    {
                        name: "Views",
                        fn: (a, b) => Number(b[10]) - Number(a[10])
                    }
                ]
            }
        };
    },
    computed: {
        pairs() {
            return arrFrom(this.cardDb.getAll().entries());
        },
        pairsFiltered() {
            const sortFn = this.sort.modes[this.sort.active].fn;
            const filterFnPrimary = entry =>
                entry[1][0].toLowerCase().includes(this.filter.toLowerCase());
            const filterFnSecondary = entry => {
                const name = entry[1];

                if (nameCache.has(name)) {
                    return false;
                } else {
                    nameCache.add(name);

                    return true;
                }
            };

            const nameCache = new Set();

            return this.pairs
                .filter(filterFnPrimary) // Filter Text search
                .sort((a, b) => sortFn(a[1], b[1])) // Apply sorting
                .map(entry => [entry[0], entry[1][0]]) // Drop everything but name and id
                .filter(filterFnSecondary) // Drop duplicates
                .slice(0, 100); // Take 100 first results
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

<template>
    <div class="builder">
        <span>Showing {{ pairsFiltered.length }} of {{ pairsArr.length }} Cards</span>
        <div class="form-group">
            <input
                class="form-control builder-search"
                type="search"
                v-model="filter.name"
                title="Search"
                placeholder="Search"
            >
        </div>
        <div class="form-group builder-select">
            <label>Type:</label>
            <select
                class="form-control"
                v-model="filter.type.active"
                title="Types"
            >
                <option
                    v-for="option in filter.type.options"
                    :key="option"
                    :value="option"
                >{{ option }}</option>
            </select>
        </div>
        <div class="form-group builder-select">
            <label>Sort:</label>
            <select
                class="form-control"
                v-model="sort.active"
                title="Active Sorting"
            >
                <option
                    v-for="(option, index) in sort.options"
                    :key="option.name"
                    :value="index"
                >{{ option.name }}</option>
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
import searchCard from "../lib/searchCard";

export default {
    props: {
        pairsArr: {
            type: Array,
            required: true,
            default: () => []
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
            filter: {
                name: "",
                type: {
                    active: "Any",
                    options: [
                        "Any",
                        "Normal Monster",
                        "Effect Monster",
                        "Toon Monster",
                        "Fusion Monster",
                        "Ritual Monster",
                        "Ritual Effect Monster",
                        "Synchro Monster",
                        "Synchro Tuner Monster",
                        "Synchro Pendulum Effect Monster",
                        "XYZ Monster",
                        "XYZ Pendulum Effect Monster",
                        "Pendulum Normal Monster",
                        "Pendulum Effect Monster",
                        "Pendulum Tuner Effect Monster",
                        "Pendulum Effect Fusion Monster",
                        "Link Monster",
                        "Spell Card",
                        "Trap Card"
                    ]
                }
            },
            sort: {
                active: 0,
                options: [
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
                    },
                    {
                        name: "Latest",
                        fn: (a, b) => Number(b[13]) - Number(a[13])
                    }
                ]
            }
        };
    },
    computed: {
        pairsFiltered() {
            const sortFn = this.sort.options[this.sort.active].fn;

            return searchCard(this.pairsArr, this.filter, sortFn);
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "../styles/variables";
@import "../styles/variables.app";

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

.builder-select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    label {
        padding-right: 0.5rem;
        margin-bottom: 0;
    }
}
</style>

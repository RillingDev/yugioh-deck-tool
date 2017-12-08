<template>
    <div class="builder">
        <span>Showing {{ pairsFiltered.length }} of {{ pairsArr.length }} Cards</span>

        <!-- builder-name -->
        <div class="form-group">
            <input
                class="form-control builder-search"
                type="search"
                v-model="filter.name"
                title="Search"
                placeholder="Search"
            >
        </div>

        <!-- builder-sort -->
        <div class="form-group form-group-select">
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

        <!-- builder-type -->
        <div class="form-group form-group-select">
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

        <!-- builder-expanded -->
        <div
            class="builder-filter-expanded"
            v-if="isTypeFilterExpanded"
        >
            <!-- builder-attribute -->
            <div class="form-group form-group-select">
                <label>Attribute:</label>
                <select
                    class="form-control"
                    v-model="filter.attribute.active"
                    title="Attributes"
                >
                    <option
                        v-for="option in filter.attribute.options"
                        :key="option"
                        :value="option"
                    >{{ option }}</option>
                </select>
            </div>

            <!-- builder-type -->
            <div class="form-group form-group-select">
                <label>Race:</label>
                <select
                    class="form-control"
                    v-model="filter.race.active"
                    title="Races"
                >
                    <option
                        v-for="option in filter.race.options"
                        :key="option"
                        :value="option"
                    >{{ option }}</option>
                </select>
            </div>

            <!-- builder-level -->
            <div class="form-group form-group-select">
                <label>Level:</label>
                <select
                    class="form-control"
                    v-model="filter.level.active"
                    title="Levels"
                >
                    <option
                        v-for="option in filter.level.options"
                        :key="option"
                        :value="option"
                    >{{ option }}</option>
                </select>
            </div>
        </div>

        <!-- builder-list -->
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
                        <button
                            class="builder-add btn"
                            v-for="deckPart in deckParts"
                            :key="deckPart.id"
                            @click="deckCardAdd(deckPart, pair[0])"
                            :class="`builder-add-${deckPart.id}`"
                            :title="`Add Card to ${deckPart.name} Deck`"
                            :disabled.boolean="!deckCardCanAdd(deckPart, pair[0])"
                        >
                            <span class="fa fa-plus"><!----></span>
                        </button>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import searchCard from "../lib/searchCard";
import {
    CARD_TYPE,
    CARD_RACE,
    CARD_ATTRIBUTE,
    CARD_LEVEL,
    CARD_SORTERS
} from "../lib/data/filters";

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
        },
        deckCardCanAdd: {
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
                    options: CARD_TYPE
                },
                race: {
                    active: "Any",
                    options: CARD_RACE
                },
                attribute: {
                    active: "Any",
                    options: CARD_ATTRIBUTE
                },
                level: {
                    active: "Any",
                    options: CARD_LEVEL
                }
            },
            sort: {
                active: 0,
                options: CARD_SORTERS
            }
        };
    },
    computed: {
        isTypeFilterEnabled() {
            return this.filter.type.active !== "Any";
        },
        isTypeFilterExpanded() {
            return !["Any", "Spell Card", "Trap Card"].includes(
                this.filter.type.active
            );
        },
        pairsFiltered() {
            const sortFn = this.sort.options[this.sort.active].fn;

            return searchCard(
                this.pairsArr,
                this.filter,
                this.isTypeFilterExpanded,
                sortFn
            );
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "../styles/variables";
@import "../styles/variables.app";

.form-group-select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    label {
        padding-right: 0.5rem;
        margin-bottom: 0;
    }
    select {
        max-width: 80%;
    }
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

<template>
    <div class="builder">
        <span>Showing {{ pairsFiltered.length }} of {{ pairsArr.length }} Cards</span>

        <!-- builder-name -->
        <div class="form-group">
            <input
                class="form-control"
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
        <ygo-select
            title="Type"
            v-model="filter.type.active"
            :options="filter.type.options"
        />

        <!-- builder-expanded -->
        <template v-if="isMonster">
            <!-- builder-attribute -->
            <ygo-select
                title="Attribute"
                v-model="filter.attribute.active"
                :options="filter.attribute.options"
            />

            <!-- builder-type -->
            <ygo-select
                title="Race"
                v-model="filter.race.active"
                :options="filter.race.options"
            />

            <!-- builder-level -->
            <ygo-select
                title="Level"
                v-model="filter.level.active"
                :options="filter.level.options"
            />

            <template v-if="isMonsterLink">
                <!-- builder-linkarrow -->
                <ygo-select
                    title="Link Arrows"
                    v-model="filter.linkarrows.active"
                    :options="filter.linkarrows.options"
                />
            </template>
        </template>

        <template v-if="isSpell">
            <ygo-select
                title="Subtype"
                v-model="filter.spelltype.active"
                :options="filter.spelltype.options"
            />
        </template>

        <template v-if="isTrap">
            <ygo-select
                title="Subtype"
                v-model="filter.traptype.active"
                :options="filter.traptype.options"
            />
        </template>

        <!-- builder-list -->
        <ul
            class="builder-list"
            v-if="pairsFiltered.length"
        >
            <li
                v-for="pair in pairsFiltered"
                :key="pair[0]"
            >
                <!-- Has to be an anchor tag because of how ygoprodeck.com's tooltip script works -->
                <a
                    class="builder-card"
                    :data-name="pair[1]"
                >
                    <span class="builder-card-name">{{ pair[1] }}</span>
                    <div class="builder-card-action">
                        <span
                            class="builder-add btn"
                            v-for="deckPart in deckParts"
                            @click="(e) => clickEvent(e, deckPart, pair[0])"
                            :key="deckPart.id"
                            :class="`builder-add-${deckPart.id}`"
                            :title="`Add Card to ${deckPart.name} Deck`"
                            :disabled="!deckCardCanAdd(deckPart, pair[0])"
                        >
                            <span class="fa fa-plus">
                                <!---->
                            </span>
                            </span>
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
    CARD_LINKARROWS,
    CARD_SPELL_TYPE,
    CARD_TRAP_TYPE,
    CARD_SORTERS
} from "../lib/data/filters";
import { DECKPARTS } from "../lib/data/deck";
import ygoSelect from "./ygoSelect.vue";

export default {
    components: { ygoSelect },
    props: {
        pairsArr: {
            type: Array,
            required: true
        },
        deckCardCanAdd: {
            type: Function,
            required: true
        }
    },
    data: () => {
        return {
            deckParts: DECKPARTS,
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
                },
                linkarrows: {
                    active: "Any",
                    options: CARD_LINKARROWS
                },
                spelltype: {
                    active: "Any",
                    options: CARD_SPELL_TYPE
                },
                traptype: {
                    active: "Any",
                    options: CARD_TRAP_TYPE
                }
            },
            sort: {
                active: 0,
                options: CARD_SORTERS
            }
        };
    },
    computed: {
        isMonster() {
            return !["Any", "Spell Card", "Trap Card"].includes(
                this.filter.type.active
            );
        },
        isMonsterLink() {
            return this.filter.type.active === "Link Monster";
        },
        isSpell() {
            return this.filter.type.active === "Spell Card";
        },
        isTrap() {
            return this.filter.type.active === "Trap Card";
        },
        pairsFiltered() {
            const sortFn = this.sort.options[this.sort.active].fn;

            return searchCard(
                this.pairsArr,
                this.filter,
                {
                    monster: this.isMonster,
                    monsterLink: this.isMonsterLink,
                    spell: this.isSpell,
                    trap: this.isTrap
                },
                sortFn
            );
        }
    },
    methods: {
        clickEvent(e, deckPart, cardId) {
            this.$emit("deckcardadd", deckPart, cardId, e);
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/mixins";
@import "node_modules/bootstrap/scss/variables";

@import "../styles/mixins/screen";
@import "../styles/variables.custom";

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
    &-main .fa {
        color: $color-deckpart-main;
    }
    &-extra .fa {
        color: $color-deckpart-extra;
    }
    &-side .fa {
        color: $color-deckpart-side;
    }
}
</style>

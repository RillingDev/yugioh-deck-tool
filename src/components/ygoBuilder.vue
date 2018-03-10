<template>
    <div class="builder">
        <span>Showing {{ pairsFiltered.length }} of {{ pairsArr.length }} Cards</span>

        <!-- builder-name -->
        <div class="form-group">
            <input
                v-model="filter.name"
                class="form-control"
                type="search"
                title="Search"
                placeholder="Search"
            >
        </div>

        <!-- builder-sort -->
        <div class="form-group form-group-builder">
            <label>Sort:</label>
            <select
                v-model="sort.active"
                class="form-control"
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
        <div class="form-group form-group-builder">
            <label>Type:</label>
            <select
                v-model="filter.type.active"
                class="form-control"
                title="Active Type"
            >
                <option
                    v-for="option in filter.type.options"
                    :key="option"
                    :value="option"
                >{{ option }}</option>
                    </select>
        </div>

        <div class="form-group">
            <div class="row">
                <!-- builder-type -->
                <div class="col-xs-12 col-sm-6">
                    <div class=" form-group-builder">
                        <label>Format:</label>
                        <select
                            v-model="filter.format.active"
                            class="form-control"
                            title="Active Format"
                        >
                            <option
                                v-for="(option, index) in filter.format.options"
                                :key="option.name"
                                :value="index"
                            >{{ option.name }}</option>
                                </select>
                    </div>
                </div>

                <!-- builder-banlist -->
                <div class="col-xs-12 col-sm-6">
                    <div class=" form-group-builder">
                        <label>Banlist:</label>
                        <select
                            v-model="filter.banlist.active"
                            class="form-control"
                            title="Active Banlist"
                        >
                            <option
                                v-for="(option, index) in filter.banlist.options"
                                :key="option.name"
                                :value="index"
                            >{{ option.name }}</option>
                                </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- builder-expanded -->
        <template v-if="isMonster">
            <div class="form-group">
                <div class="row">
                    <!-- builder-type -->
                    <div class="col-xs-12 col-sm-6">
                        <!-- builder-attribute -->
                        <div class="form-group-builder">
                            <label>Attribute:</label>
                            <select
                                v-model="filter.attribute.active"
                                class="form-control"
                                title="Active Attribute"
                            >
                                <option
                                    v-for="option in filter.attribute.options"
                                    :key="option"
                                    :value="option"
                                >{{ option }}</option>
                                    </select>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-6">
                        <!-- builder-attribute -->
                        <div class="form-group-builder">
                            <!-- builder-race -->
                            <label>Race:</label>
                            <select
                                v-model="filter.race.active"
                                class="form-control"
                                title="Active Race"
                            >
                                <option
                                    v-for="option in filter.race.options"
                                    :key="option"
                                    :value="option"
                                >{{ option }}</option>
                                    </select>
                        </div>
                    </div>

                </div>
            </div>
            <!-- builder-level -->
            <div class="form-group form-group-builder">
                <label>Level:</label>
                <select
                    v-model="filter.level.active"
                    class="form-control"
                    title="Active Level"
                >
                    <option
                        v-for="option in filter.level.options"
                        :key="option"
                        :value="option"
                    >{{ option }}</option>
                        </select>
            </div>

            <template v-if="isMonsterLink">
                <!-- builder-linkarrow -->
                <div class="form-group form-group-builder">
                    <label>Link Arrows:</label>
                    <select
                        v-model="filter.linkarrows.active"
                        class="form-control"
                        title="Active Link Arrows"
                    >
                        <option
                            v-for="option in filter.linkarrows.options"
                            :key="option"
                            :value="option"
                        >{{ option }}</option>
                            </select>
                </div>
            </template>
        </template>

        <template v-if="isSpell">
            <!-- builder-spelltype -->
            <div class="form-group form-group-builder">
                <label>Spell Type:</label>
                <select
                    v-model="filter.spelltype.active"
                    class="form-control"
                    title="Active Spell Type"
                >
                    <option
                        v-for="option in filter.spelltype.options"
                        :key="option"
                        :value="option"
                    >{{ option }}</option>
                        </select>
            </div>
        </template>

        <template v-if="isTrap">
            <!-- builder-traptype -->
            <div class="form-group form-group-builder">
                <label>Trap Type:</label>
                <select
                    v-model="filter.traptype.active"
                    class="form-control"
                    title="Active Trap Type"
                >
                    <option
                        v-for="option in filter.traptype.options"
                        :key="option"
                        :value="option"
                    >{{ option }}</option>
                        </select>
            </div>
        </template>

        <!-- builder-list -->
        <ul
            v-if="pairsFiltered.length"
            class="builder-list"
        >
            <li
                v-for="pair in pairsFiltered"
                :key="pair[0]"
            >
                <!-- Has to be an anchor tag because of how ygoprodeck.com's tooltip script works -->
                <a
                    :data-name="pair[1]"
                    class="builder-card"
                >
                    <span class="builder-card-name">{{ pair[1] }}</span>
                    <div class="builder-card-action">
                        <button
                            v-for="deckPart in deckParts"
                            :key="deckPart.id"
                            :class="`builder-add-${deckPart.id}`"
                            :title="`Add Card to ${deckPart.name} Deck`"
                            :disabled="!deckCardCanAdd(deckPart, pair[0])"
                            class="builder-add btn"
                            @click="(e) => clickEvent(e, deckPart, pair[0])"
                        >
                            <span class="fa fa-plus">
                                <!---->
                            </span>
                            </button>
                    </div>
                    </a>
                    </li>
                    </ul>
    </div>
</template>

<script>
import searchCard from "../lib/searchCard";
import { SORTERS } from "../lib/data/sort";
import { DECKPARTS } from "../lib/data/deck";
import { FORMATS } from "../lib/data/format";
import { BANLISTS } from "../lib/data/banlist";
import {
    CARD_TYPE,
    CARD_RACE,
    CARD_ATTRIBUTE,
    CARD_LEVEL,
    CARD_LINKARROWS,
    CARD_SPELL_TYPE,
    CARD_TRAP_TYPE
} from "../lib/data/cards";

export default {
    components: {},
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
                },
                format: {
                    active: 0,
                    options: FORMATS
                },
                banlist: {
                    active: 0,
                    options: BANLISTS
                }
            },
            sort: {
                active: 0,
                options: SORTERS
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
            ).slice(0, 100); // Take 100 first results;
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

.form-group-builder {
    display: flex;
    justify-content: space-between;
    align-items: center;
    label {
        padding-right: 0.75rem;
        margin-bottom: 0;
        width: 40%;
        &:not(:first-child) {
            margin-left: 1rem;
        }
    }
    input,
    select {
        width: 60%;
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

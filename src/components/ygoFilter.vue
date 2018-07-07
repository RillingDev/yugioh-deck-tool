<template>
    <div>
        <!-- builder-name -->
        <template v-if="showAdvancedFilters">
            <div class="form-group">
                <input
                    v-model="filter.name"
                    class="form-control"
                    type="search"
                    title="Search"
                    placeholder="Search"
                    @input="filterCards"
                >
            </div>
        </template>

        <!-- builder-sort -->
        <template v-if="showAdvancedFilters">
            <div class="form-group form-group-builder">
                <label>Sort:</label>
                <select
                    v-model="sort.active"
                    class="form-control"
                    title="Active Sorting"
                    @change="filterCards"
                >
                    <option
                        v-for="option in sort.options"
                        :key="option.name"
                        :value="option"
                    >{{ option.name }}</option>
                </select>
            </div>
        </template>

        <!-- builder-type -->
        <template v-if="showAdvancedFilters">
            <div class="form-group form-group-builder">
                <label>Type:</label>
                <multiselect
                    v-model="filter.type.active"
                    :options="filter.type.options"
                    :show-labels="false"
                    :show-no-results="false"
                    @input="filterCards"
                />
            </div>
        </template>

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
                            @change="filterCards"
                        >
                            <option
                                v-for="option in filter.format.options"
                                :key="option.name"
                                :value="option"
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
                            @change="filterCards"
                        >
                            <option
                                v-for="option in filter.banlist.options"
                                :key="option.name"
                                :value="option"
                            >{{ option.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- builder-set -->
        <div class="form-group form-group-builder">
            <label>Set:</label>
            <multiselect
                v-model="filter.sets.active"
                :options="filter.sets.options"
                :multiple="true"
                :show-labels="false"
                :show-no-results="false"
                placeholder="All Sets"
                @input="filterCards"
            />
        </div>

        <!-- builder-expanded -->
        <template v-if="isMonster && showAdvancedFilters">
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
                                @change="filterCards"
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
                                @change="filterCards"
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
                    @change="filterCards"
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
                        @change="filterCards"
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

        <template v-if="isSpell && showAdvancedFilters">
            <!-- builder-spelltype -->
            <div class="form-group form-group-builder">
                <label>Spell Type:</label>
                <select
                    v-model="filter.spelltype.active"
                    class="form-control"
                    title="Active Spell Type"
                    @change="filterCards"
                >
                    <option
                        v-for="option in filter.spelltype.options"
                        :key="option"
                        :value="option"
                    >{{ option }}</option>
                </select>
            </div>
        </template>

        <template v-if="isTrap && showAdvancedFilters">
            <!-- builder-traptype -->
            <div class="form-group form-group-builder">
                <label>Trap Type:</label>
                <select
                    v-model="filter.traptype.active"
                    class="form-control"
                    title="Active Trap Type"
                    @change="filterCards"
                >
                    <option
                        v-for="option in filter.traptype.options"
                        :key="option"
                        :value="option"
                        @change="filterCards"
                    >{{ option }}</option>
                </select>
            </div>
        </template>
    </div>
</template>

<script>
import { SORTERS } from "../lib/data/sort";
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
import search from "../lib/cardDb/search";
import Multiselect from "vue-multiselect";

export default {
    components: { Multiselect },
    props: {
        pairsArr: {
            type: Array,
            required: true
        },
        sets: {
            type: Array,
            required: true
        },
        showAdvancedFilters: {
            type: Boolean,
            required: false,
            default: true
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
                    active: FORMATS[0],
                    options: FORMATS
                },
                banlist: {
                    active: BANLISTS[0],
                    options: BANLISTS
                },
                sets: {
                    active: null,
                    options: []
                }
            },
            sort: {
                active: SORTERS[0],
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
        }
    },
    mounted() {
        this.filter.sets.options = this.sets;
        this.filterCards();
    },
    methods: {
        filterCards() {
            const pairsArrFiltered = search(
                this.pairsArr,
                this.filter,
                {
                    monster: this.isMonster,
                    monsterLink: this.isMonsterLink,
                    spell: this.isSpell,
                    trap: this.isTrap
                },
                this.sort.active.fn
            );

            this.$emit("change", pairsArrFiltered, this.filter);
        }
    }
};
</script>

<style lang="scss" src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/mixins/screen";
@import "../styles/variables.custom";

.form-group-builder {
    display: flex;
    justify-content: space-between;
    align-items: center;
    label {
        padding-right: 0.75rem;
        width: 40%;
        &:not(:first-child) {
            margin-left: 1rem;
        }
    }
}

/**
* Multiselect
*/
.decktool {
    .multiselect__tags {
        border: 1px solid #ced4da;
        border-radius: 0;
    }
    .multiselect__tag {
        border-radius: 0;
        background: $primary;
    }
    .multiselect__tag-icon:after {
        color: $white;
    }
    .multiselect__tag-icon:focus,
    .multiselect__tag-icon:hover {
        background: lighten($primary, 10%);
    }

    .multiselect__option--highlight,
    .multiselect__option--highlight:after {
        background: $primary;
    }

    .multiselect__option--selected.multiselect__option--highlight,
    .multiselect__option--selected.multiselect__option--highlight:after,
    .multiselect__option--group-selected.multiselect__option--highlight,
    .multiselect__option--group-selected.multiselect__option--highlight:after {
        background: $danger;
    }

    .multiselect,
    .multiselect__tags,
    .multiselect__current,
    .multiselect__option {
        min-height: 38px;
    }
    .multiselect__option:after {
        line-height: 38px;
    }
    .multiselect,
    .multiselect__input,
    .multiselect__single {
        font-size: 1rem;
    }
    .multiselect input[type="text"].multiselect__input,
    .multiselect input[type="text"].multiselect__input:focus {
        padding: 0 0 0 5px;
        margin: inherit;
    }
    .multiselect__tags,
    .multiselect__tag-icon:after,
    .multiselect__option:after {
        font-size: 0.85em;
    }
    .multiselect__select {
        display: none;
    }
}
</style>

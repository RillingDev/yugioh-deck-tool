<template>
    <div>
        <!-- builder-name -->
        <template v-if="showAdvancedFilters">
            <div class="form-group">
                <input
                    class="form-control"
                    placeholder="Search"
                    title="Search"
                    type="search"
                    v-model="filter.name"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>

        <!-- builder-sort -->
        <template v-if="showAdvancedFilters">
            <div class="form-group form-group-builder">
                <label>Sort:</label>
                <AdvancedSelect
                    :initial-options="sortingStrategies"
                    :no-selection-allowed="false"
                    class="form-control"
                    title="Active Sorting"
                    v-model="sorting"
                    v-on:input="onSortingChange"
                />
            </div>
        </template>

        <!-- builder-type -->
        <template v-if="showAdvancedFilters">
            <div class="form-group form-group-builder">
                <label>Type:</label>
                <AdvancedSelect
                    :initial-options="types"
                    :label="type => type.name"
                    :no-selection-allowed="true"
                    :track-by="type => type.name"
                    class="form-control"
                    title="Active Type"
                    v-model="filter.type"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>

        <div class="form-group">
            <div class="row">
                <!-- builder-type -->
                <div class="col-xs-12 col-sm-6">
                    <div class=" form-group-builder">
                        <label>Format:</label>
                        <AdvancedSelect
                            :initial-options="formats"
                            :no-selection-allowed="true"
                            class="form-control"
                            title="Active Format"
                            v-model="filter.format"
                            v-on:input="onFilterChange"
                        />
                    </div>
                </div>

                <!-- builder-banlist -->
                <div class="col-xs-12 col-sm-6" v-if="filter.format != null">
                    <div class=" form-group-builder">
                        <label>Ban:</label>

                        <AdvancedSelect
                            :initial-options="banStates"
                            :label="banState => banState.name"
                            :no-selection-allowed="true"
                            :track-by="banState => banState.name"
                            class="form-control"
                            title="Active Ban State"
                            v-model="filter.banState"
                            v-on:input="onFilterChange"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- builder-set -->
        <div class="form-group form-group-builder">
            <label>Set:</label>
            <MultiSelect
                :multiple="true"
                :options="sets"
                :show-labels="false"
                :show-no-results="false"
                label="name"
                placeholder="All Sets"
                track-by="name"
                v-model="filter.sets"
                v-on:input="onFilterChange"
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
                            <AdvancedSelect
                                :initial-options="monsterAttributes"
                                :no-selection-allowed="true"
                                class="form-control"
                                title="Active Attribute"
                                v-model="filter.attribute"
                                v-on:input="onFilterChange"
                            />
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-6">
                        <!-- builder-attribute -->
                        <div class="form-group-builder">
                            <!-- builder-race -->
                            <label>Race:</label>
                            <AdvancedSelect
                                :initial-options="monsterRaces"
                                :no-selection-allowed="true"
                                class="form-control"
                                title="Active Race"
                                v-model="filter.race"
                                v-on:input="onFilterChange"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <!-- builder-level -->
            <div class="form-group form-group-builder">
                <label>Level:</label>
                <AdvancedSelect
                    :initial-options="monsterLevels"
                    :no-selection-allowed="true"
                    class="form-control"
                    title="Active Level"
                    v-model="filter.level"
                    v-on:input="onFilterChange"
                />
            </div>
            <!-- builder-linkmarkers -->
            <div class="form-group form-group-builder" v-if="isLinkMonster">
                <label>Link Markers:</label>
                <AdvancedSelect
                    :initial-options="monsterLinkMarkers"
                    :no-selection-allowed="true"
                    class="form-control"
                    title="Active Link Markers"
                    v-model="filter.linkMarker"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>

        <template v-if="isSpell && showAdvancedFilters">
            <!-- builder-spelltype -->
            <div class="form-group form-group-builder">
                <label>Spell Type:</label>
                <AdvancedSelect
                    :initial-options="spellRaces"
                    :no-selection-allowed="true"
                    class="form-control"
                    title="Active Spell Type"
                    v-model="filter.race"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>

        <template v-if="isTrap && showAdvancedFilters">
            <!-- builder-traptype -->
            <div class="form-group form-group-builder">
                <label>Trap Type:</label>
                <AdvancedSelect
                    :initial-options="trapRaces"
                    :no-selection-allowed="true"
                    class="form-control"
                    title="Active Trap Type"
                    v-model="filter.race"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>

        <template v-if="isSkill && showAdvancedFilters">
            <!-- builder-traptype -->
            <div class="form-group form-group-builder">
                <label>Skill Type:</label>
                <AdvancedSelect
                    :initial-options="skillRaces"
                    :no-selection-allowed="true"
                    class="form-control"
                    title="Active Skill Type"
                    v-model="filter.race"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import Component from "vue-class-component";
import MultiSelect from "vue-multiselect";
import {
    BanState,
    CardDatabase,
    CardFilter,
    CardTypeGroup,
    Format,
    SortingStrategy,
    DefaultBanState
} from "../../../core/src/main";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import AdvancedSelect from "@/components/AdvancedSelect.vue";

@Component({
    components: {
        MultiSelect,
        AdvancedSelect
    }
})
export default class YgoFilter extends Vue {
    @Prop({ required: false, default: () => true })
    showAdvancedFilters: boolean;

    @Prop({ required: true })
    initialFilter: CardFilter;

    @Prop({ required: true, type: String })
    initialSorting: SortingStrategy;

    filter: CardFilter;

    sorting: SortingStrategy;

    sortingStrategies: SortingStrategy[];

    formats: Format[];

    banStates: BanState[];

    private readonly cardDatabase = uiContainer.get<CardDatabase>(
        UI_TYPES.CardDatabase
    );

    get types() {
        return [];
    }

    get sets() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardDatabase.getSets();
    }

    get monsterAttributes() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardDatabase.getMonsterAttributes();
    }

    get monsterLevels() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardDatabase.getMonsterLevels();
    }

    get monsterLinkMarkers() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardDatabase.getMonsterLinkMarkers();
    }

    get monsterRaces() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardDatabase.getRaces(CardTypeGroup.MONSTER);
    }

    get spellRaces() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardDatabase.getRaces(CardTypeGroup.SPELL);
    }

    get trapRaces() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardDatabase.getRaces(CardTypeGroup.TRAP);
    }

    get skillRaces() {
        if (this.cardDatabase == null) {
            return [];
        }
        return this.cardDatabase.getRaces(CardTypeGroup.SKILL);
    }

    get isMonster() {
        return this.filter.type?.group === CardTypeGroup.MONSTER;
    }

    get isLinkMonster() {
        return this.isMonster && this.filter.type?.name.includes("Link");
    }

    get isSpell() {
        return this.filter.type?.group === CardTypeGroup.SPELL;
    }

    get isTrap() {
        return this.filter.type?.group === CardTypeGroup.TRAP;
    }

    get isSkill() {
        return this.filter.type?.group === CardTypeGroup.SKILL;
    }

    data() {
        return {
            filter: this.initialFilter,
            sorting: this.initialSorting,
            sortingStrategies: [
                SortingStrategy.NAME,
                SortingStrategy.NAME_REVERSE,
                SortingStrategy.ATK,
                SortingStrategy.DEF,
                SortingStrategy.LEVEL,
                SortingStrategy.VIEWS
            ],
            banStates: [
                DefaultBanState.UNLIMITED,
                DefaultBanState.SEMI_LIMITED,
                DefaultBanState.LIMITED,
                DefaultBanState.BANNED
            ],
            formats: Object.values(Format)
        };
    }

    onFilterChange() {
        this.$emit("filter-change", this.filter);
    }

    onSortingChange() {
        this.$emit("sorting-change", this.sorting);
    }
}
</script>

<!--<style lang="scss" src="vue-multiselect/dist/vue-multiselect.min.css"></style>-->

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "../styles/mixins/screen";
@import "../styles/variables.custom";

.form-group-builder {
    display: flex;
    align-items: center;
    justify-content: space-between;

    label {
        width: 40%;
        padding-right: 0.75rem;

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
        margin: inherit;
        padding: 0 0 0 5px;
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

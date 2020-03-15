<template>
    <div>
        <!-- builder-name -->
        <template>
            <div class="form-group">
                <input
                    class="form-control"
                    placeholder="Search"
                    type="search"
                    v-model="filter.name"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>

        <!-- builder-sort -->
        <template>
            <div class="form-group form-group-builder">
                <label>Sorting:</label>
                <AdvancedSelect
                    :initial-options="sortingStrategies"
                    :no-selection-allowed="false"
                    class="form-control"
                    v-model="sorting"
                    v-on:input="onSortingChange"
                />
            </div>
        </template>
        <hr />

        <!-- builder-type -->
        <template>
            <div class="form-group form-group-builder">
                <label>Type:</label>
                <AdvancedSelect
                    :initial-options="cardTypeGroups"
                    :no-selection-allowed="true"
                    class="form-control"
                    v-model="filter.typeGroup"
                    v-on:input="onFilterChange"
                />
                <AdvancedSelect
                    :initial-options="types"
                    :label="type => type.name.replace('Monster', '')"
                    :no-selection-allowed="true"
                    :track-by="type => type.name"
                    class="form-control"
                    v-if="types.length > 1"
                    v-model="filter.type"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>

        <template v-if="filter.typeGroup != null">
            <div class="form-group form-group-builder">
                <label>{{ isMonster ? "Race" : "Subtype" }}:</label>
                <AdvancedSelect
                    :initial-options="races"
                    :no-selection-allowed="true"
                    class="form-control"
                    v-model="filter.race"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>

        <template v-if="isMonster">
            <div class="form-group form-group-builder">
                <label>Attribute:</label>
                <AdvancedSelect
                    :initial-options="monsterAttributes"
                    :no-selection-allowed="true"
                    class="form-control"
                    v-model="filter.attribute"
                    v-on:input="onFilterChange"
                />
            </div>

            <div class="form-group form-group-builder">
                <label>Level:</label>
                <AdvancedSelect
                    :initial-options="monsterLevels"
                    :no-selection-allowed="true"
                    class="form-control"
                    v-model="filter.level"
                    v-on:input="onFilterChange"
                />
            </div>

            <div class="form-group form-group-builder" v-if="isLinkMonster">
                <label>Link Markers:</label>
                <AdvancedSelect
                    :initial-options="monsterLinkMarkers"
                    :no-selection-allowed="true"
                    class="form-control"
                    v-model="filter.linkMarker"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>
        <hr />

        <template>
            <div class="form-group form-group-builder">
                <label>Format:</label>
                <AdvancedSelect
                    :initial-options="formats"
                    :no-selection-allowed="true"
                    class="form-control"
                    v-model="filter.format"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>
        <template v-if="filter.format != null">
            <div class="form-group form-group-builder">
                <label>Ban State:</label>

                <AdvancedSelect
                    :initial-options="banStates"
                    :label="banState => banState.name"
                    :no-selection-allowed="true"
                    :track-by="banState => banState.name"
                    class="form-control"
                    v-model="filter.banState"
                    v-on:input="onFilterChange"
                />
            </div>
        </template>
        <hr />

        <template>
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
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import MultiSelect from "vue-multiselect";
import {
    BanState,
    CardDatabase,
    CardFilter,
    CardSet,
    CardTypeGroup,
    DefaultBanState,
    Format,
    SortingStrategy
} from "../../../core/src/main";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import AdvancedSelect from "@/components/AdvancedSelect.vue";
import { clone } from "lodash";

@Component({
    components: {
        MultiSelect,
        AdvancedSelect
    }
})
export default class YgoFilter extends Vue {
    @Prop({ required: true })
    initialFilter: CardFilter;

    @Prop({ required: true, type: String })
    initialSorting: SortingStrategy;

    filter: CardFilter;

    sorting: SortingStrategy;

    sortingStrategies: SortingStrategy[];

    formats: Format[];

    banStates: BanState[];

    cardTypeGroups: CardTypeGroup[];

    private readonly cardDatabase = uiContainer.get<CardDatabase>(
        UI_TYPES.CardDatabase
    );

    get types() {
        if (this.filter.typeGroup == null) {
            return [];
        }
        return this.loadArrFromCardDatabase(cardDatabase =>
            cardDatabase.getTypes(this.filter.typeGroup)
        );
    }

    get sets() {
        return this.loadArrFromCardDatabase<CardSet>(cardDatabase =>
            cardDatabase.getSets()
        );
    }

    get monsterAttributes() {
        return this.loadArrFromCardDatabase<string>(cardDatabase =>
            cardDatabase.getMonsterAttributes()
        );
    }

    get monsterLevels() {
        return this.loadArrFromCardDatabase<number>(cardDatabase =>
            cardDatabase.getMonsterLevels()
        );
    }

    get monsterLinkMarkers() {
        return this.loadArrFromCardDatabase<string>(cardDatabase =>
            cardDatabase.getMonsterLinkMarkers()
        );
    }

    get isMonster() {
        return this.filter.typeGroup === CardTypeGroup.MONSTER;
    }

    get isLinkMonster() {
        return this.isMonster && this.filter.type?.name.includes("Link");
    }

    get races() {
        if (this.filter.typeGroup == null) {
            return [];
        }
        return this.loadArrFromCardDatabase(cardDatabase =>
            cardDatabase.getRaces(this.filter.typeGroup)
        );
    }

    data() {
        return {
            filter: clone(this.initialFilter),
            sorting: this.initialSorting,
            cardTypeGroup: null,
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
            formats: Object.values(Format),
            cardTypeGroups: Object.values(CardTypeGroup)
        };
    }

    @Watch("filter.type")
    typeWatcher() {
        this.filter.linkMarker = null;
    }

    @Watch("filter.typeGroup")
    typeGroupWatcher() {
        this.filter.type = null;
        this.filter.race = null;
        this.filter.attribute = null;
        this.filter.linkMarker = null;
        this.filter.level = null;
        this.typeWatcher();
    }

    onFilterChange() {
        this.$emit("filter-change", this.filter);
    }

    onSortingChange() {
        this.$emit("sorting-change", this.sorting);
    }

    private loadArrFromCardDatabase<T>(
        accessor: (cardDatabase: CardDatabase) => T[]
    ): T[] {
        if (this.cardDatabase == null) {
            return [];
        }
        return accessor(this.cardDatabase);
    }
}
</script>

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

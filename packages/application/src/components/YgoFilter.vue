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
        <hr />

        <!-- builder-sort -->
        <template v-if="showAdvanced">
            <div class="form-group form-group-builder">
                <label>Sorting:</label>
                <AdvancedSelect
                    :initial-options="sortingStrategies"
                    :no-selection-allowed="false"
                    class="form-control"
                    v-model="sortingStrategy"
                    v-on:input="onSortingChange"
                />
                <AdvancedSelect
                    :initial-options="sortingOrders"
                    :no-selection-allowed="false"
                    class="form-control"
                    v-model="sortingOrder"
                    v-on:input="onSortingChange"
                />
            </div>
            <hr />
        </template>

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
            <template v-if="filter.format != null">
                <div class="form-group form-group-builder">
                    <label>Limit:</label>

                    <AdvancedSelect
                        :initial-options="banStates"
                        :label="(banState) => banState.name"
                        :no-selection-allowed="true"
                        :track-by="(banState) => banState.name"
                        class="form-control"
                        v-model="filter.banState"
                        v-on:input="onFilterChange"
                    />
                </div>
            </template>
            <hr />
        </template>

        <!-- builder-type -->
        <template v-if="showAdvanced">
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
                    :label="(type) => type.name.replace('Monster', '')"
                    :no-selection-allowed="true"
                    :track-by="(type) => type.name"
                    class="form-control"
                    v-if="types.length > 1"
                    v-model="filter.type"
                    v-on:input="onFilterChange"
                />
            </div>

            <template v-if="filter.typeGroup != null">
                <div class="form-group form-group-builder">
                    <label>{{ filter.typeGroup }} Type:</label>
                    <AdvancedSelect
                        :initial-options="subTypes"
                        :no-selection-allowed="true"
                        class="form-control"
                        v-model="filter.subType"
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
                    <label>Level/Rank:</label>
                    <AdvancedSelect
                        :initial-options="monsterLevels"
                        :no-selection-allowed="true"
                        class="form-control"
                        v-model="filter.level"
                        v-on:input="onFilterChange"
                    />
                </div>

                <div
                    class="form-group form-group-builder"
                    v-if="isLinkMonster && showAdvanced"
                >
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

            <div class="form-group form-group-builder">
                <label>Archetype:</label>
                <AdvancedSelect
                    :initial-options="archetypes"
                    :no-selection-allowed="true"
                    class="form-control"
                    v-model="filter.archetype"
                    v-on:input="onFilterChange"
                />
            </div>
            <hr />
        </template>

        <template>
            <div class="form-group form-group-builder">
                <label>Set:</label>
                <AdvancedSelect
                    :initial-options="sets"
                    :initial-value="null"
                    :label="(cardSet) => cardSet.name"
                    :no-selection-allowed="true"
                    :track-by="(cardSet) => cardSet.name"
                    class="form-control"
                    v-on:input="
                        (cardSet) => {
                            filter.sets = cardSet == null ? [] : [cardSet];
                            onFilterChange();
                        }
                    "
                />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import {
    BanState,
    CardDatabase,
    CardFilter,
    CardSet,
    CardTypeGroup,
    DefaultBanState,
    Format,
    SortingOrder,
    SortingStrategy,
} from "yugioh-deck-tool-core/src/main";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";
import AdvancedSelect from "@/components/AdvancedSelect.vue";
import { clone } from "lodash";

@Component({
    components: {
        AdvancedSelect,
    },
})
export default class YgoFilter extends Vue {
    @Prop({ required: true })
    initialFilter: CardFilter;

    @Prop({ required: false, type: Boolean, default: () => true })
    showAdvanced: boolean;

    @Prop({
        required: false,
        type: String,
        default: () => SortingStrategy.NAME,
    })
    initialSortingStrategy: SortingStrategy;

    @Prop({ required: false, type: String, default: () => SortingOrder.DESC })
    initialSortingOrder: SortingOrder;

    filter: CardFilter;

    formats: Format[];

    banStates: BanState[];

    cardTypeGroups: CardTypeGroup[];

    sortingStrategy: SortingStrategy;
    sortingOrder: SortingOrder;

    sortingStrategies: SortingStrategy[];
    sortingOrders: SortingOrder[];

    private readonly cardDatabase = uiContainer.get<CardDatabase>(
        UI_TYPES.CardDatabase
    );

    get types() {
        if (this.filter.typeGroup == null) {
            return [];
        }
        return this.loadArrFromCardDatabase((cardDatabase) =>
            cardDatabase.getTypes(this.filter.typeGroup)
        );
    }

    get sets() {
        return this.loadArrFromCardDatabase<CardSet>((cardDatabase) =>
            cardDatabase.getSets()
        );
    }

    get archetypes() {
        return this.loadArrFromCardDatabase<string>((cardDatabase) =>
            cardDatabase.getArchetypes()
        );
    }

    get monsterAttributes() {
        return this.loadArrFromCardDatabase<string>((cardDatabase) =>
            cardDatabase.getMonsterAttributes()
        );
    }

    get monsterLevels() {
        return this.loadArrFromCardDatabase<number>((cardDatabase) =>
            cardDatabase.getMonsterLevels()
        );
    }

    get monsterLinkMarkers() {
        return this.loadArrFromCardDatabase<string>((cardDatabase) =>
            cardDatabase.getMonsterLinkMarkers()
        );
    }

    get isMonster() {
        return this.filter.typeGroup === CardTypeGroup.MONSTER;
    }

    get isLinkMonster() {
        return (
            this.isMonster &&
            this.filter.type != null &&
            this.filter.type.name.includes("Link")
        );
    }

    get subTypes() {
        if (this.filter.typeGroup == null) {
            return [];
        }
        return this.loadArrFromCardDatabase((cardDatabase) =>
            cardDatabase.getSubTypes(this.filter.typeGroup)
        );
    }

    data() {
        return {
            filter: clone(this.initialFilter),
            sortingStrategy: this.initialSortingStrategy,
            sortingOrder: this.initialSortingOrder,
            cardTypeGroup: null,
            sortingStrategies: [
                SortingStrategy.NAME,
                SortingStrategy.ATK,
                SortingStrategy.DEF,
                SortingStrategy.LEVEL,
                SortingStrategy.VIEWS,
                SortingStrategy.RELEASE_DATE,
            ],
            sortingOrders: [SortingOrder.ASC, SortingOrder.DESC],
            banStates: [
                DefaultBanState.UNLIMITED,
                DefaultBanState.SEMI_LIMITED,
                DefaultBanState.LIMITED,
                DefaultBanState.BANNED,
            ],
            formats: Object.values(Format),
            cardTypeGroups: Object.values(CardTypeGroup),
        };
    }

    @Watch("filter.type")
    typeWatcher() {
        this.filter.linkMarker = null;
    }

    @Watch("filter.typeGroup")
    typeGroupWatcher() {
        this.filter.type = null;
        this.filter.subType = null;
        this.filter.attribute = null;
        this.filter.linkMarker = null;
        this.filter.level = null;
        this.typeWatcher();
    }

    onFilterChange() {
        this.$emit("filter-change", this.filter);
    }

    onSortingChange() {
        this.$emit("sorting-change", {
            strategy: this.sortingStrategy,
            order: this.sortingOrder,
        });
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
@import "../styles/variables.custom";
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";

@import "~yugioh-deck-tool-ui/src/styles/mixin/screen";

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

    select {
        max-width: 85%;
    }
}
</style>

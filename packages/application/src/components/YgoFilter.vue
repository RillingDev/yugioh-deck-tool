<template>
    <form>
        <div class="form-group row">
            <label for="filterName" class="col-sm-2 col-form-label">
                Search
            </label>
            <div class="col-sm-10">
                <input
                    id="filterName"
                    class="form-control"
                    type="search"
                    v-model="reactiveFilter.name"
                    @input="filterChanged"
                />
            </div>
        </div>

        <div class="form-group row">
            <label for="filterLimit" class="col-sm-2 col-form-label">
                Limit
            </label>
            <div class="col-sm-10">
                <VSelect
                    id="filterLimit"
                    :options="banStates"
                    v-model="reactiveFilter.banState"
                    @input="filterChanged"
                    :getOptionLabel="(banState) => banState.name"
                    :getOptionKey="(banState) => banState.name"
                />
            </div>
        </div>

        <div class="form-group row">
            <label for="filterSet" class="col-sm-2 col-form-label">
                Set
            </label>
            <div class="col-sm-10">
                <VSelect
                    id="filterSet"
                    :options="sets"
                    v-model="reactiveFilter.sets"
                    @input="filterChanged"
                    :multiple="true"
                    :getOptionLabel="(set) => set.name"
                    :getOptionKey="(set) => set.name"
                />
            </div>
        </div>

        <div class="form-group row">
            <label for="filterArchetype" class="col-sm-2 col-form-label">
                Archetype
            </label>
            <div class="col-sm-10">
                <VSelect
                    id="filterArchetype"
                    :options="archetypes"
                    v-model="reactiveFilter.archetype"
                    @input="filterChanged"
                />
            </div>
        </div>

        <div class="form-group row">
            <label for="filterTypeGroup" class="col-sm-2 col-form-label">
                Type
            </label>
            <div class="col-sm-4">
                <VSelect
                    id="filterTypeGroup"
                    :options="typeGroups"
                    v-model="reactiveFilter.typeGroup"
                    @input="filterChanged"
                />
            </div>
            <div class="col-sm-6">
                <VSelect
                    :options="types"
                    v-model="reactiveFilter.type"
                    @input="filterChanged"
                    :getOptionLabel="(type) => type.name"
                    :getOptionKey="(type) => type.name"
                />
            </div>
        </div>

        <div class="form-group row">
            <label for="filterSubType" class="col-sm-2 col-form-label">
                {{ reactiveFilter.typeGroup }} Type
            </label>
            <div class="col-sm-10">
                <VSelect
                    id="filterSubType"
                    :options="subTypes"
                    v-model="reactiveFilter.subType"
                    @input="filterChanged"
                />
            </div>
        </div>

        <div class="form-group row">
            <label for="filterMonsterAttribute" class="col-sm-2 col-form-label">
                Attribute
            </label>
            <div class="col-sm-10">
                <VSelect
                    id="filterMonsterAttribute"
                    :options="attributes"
                    v-model="reactiveFilter.attribute"
                    @input="filterChanged"
                />
            </div>
        </div>

        <div class="form-group row">
            <label for="filterMonsterLevel" class="col-sm-2 col-form-label">
                Level/Rank
            </label>
            <div class="col-sm-10">
                <VSelect
                    id="filterMonsterLevel"
                    :options="levels"
                    v-model="reactiveFilter.level"
                    @input="filterChanged"
                />
            </div>
        </div>

        <div class="form-group row">
            <label
                for="filterMonsterLinkMarkers"
                class="col-sm-2 col-form-label"
            >
                Link Markers
            </label>
            <div class="col-sm-10">
                <VSelect
                    id="filterMonsterLinkMarkers"
                    :options="linkMarkers"
                    v-model="reactiveFilter.linkMarker"
                    @input="filterChanged"
                />
            </div>
        </div>
    </form>
    <!--    <div>-->
    <!--        &lt;!&ndash; builder-name &ndash;&gt;-->
    <!--        <template>-->
    <!--            <div class="form-group">-->
    <!--                <input-->
    <!--                    class="form-control"-->
    <!--                    placeholder="Search"-->
    <!--                    type="search"-->
    <!--                    v-model="filter.name"-->
    <!--                    v-on:input="onFilterChange"-->
    <!--                />-->
    <!--            </div>-->
    <!--        </template>-->
    <!--        <hr />-->

    <!--        &lt;!&ndash; builder-sort &ndash;&gt;-->
    <!--        <template v-if="showAdvanced">-->
    <!--            <div class="form-group form-group-builder">-->
    <!--                <label>Sorting:</label>-->
    <!--                <AdvancedSelect-->
    <!--                    :initial-options="sortingStrategies"-->
    <!--                    :no-selection-allowed="false"-->
    <!--                    class="form-control"-->
    <!--                    v-model="sortingStrategy"-->
    <!--                    v-on:input="onSortingChange"-->
    <!--                />-->
    <!--                <AdvancedSelect-->
    <!--                    :initial-options="sortingOrders"-->
    <!--                    :no-selection-allowed="false"-->
    <!--                    class="form-control"-->
    <!--                    v-model="sortingOrder"-->
    <!--                    v-on:input="onSortingChange"-->
    <!--                />-->
    <!--            </div>-->
    <!--            <hr />-->
    <!--        </template>-->

    <!--        <template>-->
    <!--            <div class="form-group form-group-builder">-->
    <!--                <label>Format:</label>-->
    <!--                <AdvancedSelect-->
    <!--                    :initial-options="formats"-->
    <!--                    :no-selection-allowed="true"-->
    <!--                    class="form-control"-->
    <!--                    v-model="filter.format"-->
    <!--                    v-on:input="onFilterChange"-->
    <!--                />-->
    <!--            </div>-->
    <!--            <template v-if="filter.format != null">-->
    <!--                <div class="form-group form-group-builder">-->
    <!--                    <label>Limit:</label>-->

    <!--                    <AdvancedSelect-->
    <!--                        :initial-options="banStates"-->
    <!--                        :label="(banState) => banState.name"-->
    <!--                        :no-selection-allowed="true"-->
    <!--                        :track-by="(banState) => banState.name"-->
    <!--                        class="form-control"-->
    <!--                        v-model="filter.banState"-->
    <!--                        v-on:input="onFilterChange"-->
    <!--                    />-->
    <!--                </div>-->
    <!--            </template>-->
    <!--            <hr />-->
    <!--        </template>-->

    <!--        &lt;!&ndash; builder-type &ndash;&gt;-->
    <!--        <template v-if="showAdvanced">-->
    <!--            <div class="form-group form-group-builder">-->
    <!--                <label>Type:</label>-->
    <!--                <AdvancedSelect-->
    <!--                    :initial-options="cardTypeGroups"-->
    <!--                    :no-selection-allowed="true"-->
    <!--                    class="form-control"-->
    <!--                    v-model="filter.typeGroup"-->
    <!--                    v-on:input="onFilterChange"-->
    <!--                />-->
    <!--                <AdvancedSelect-->
    <!--                    :initial-options="types"-->
    <!--                    :label="(type) => type.name.replace('Monster', '')"-->
    <!--                    :no-selection-allowed="true"-->
    <!--                    :track-by="(type) => type.name"-->
    <!--                    class="form-control"-->
    <!--                    v-if="types.length > 1"-->
    <!--                    v-model="filter.type"-->
    <!--                    v-on:input="onFilterChange"-->
    <!--                />-->
    <!--            </div>-->

    <!--            <template v-if="filter.typeGroup != null">-->
    <!--                <div class="form-group form-group-builder">-->
    <!--                    <label>{{ filter.typeGroup }} Type:</label>-->
    <!--                    <AdvancedSelect-->
    <!--                        :initial-options="subTypes"-->
    <!--                        :no-selection-allowed="true"-->
    <!--                        class="form-control"-->
    <!--                        v-model="filter.subType"-->
    <!--                        v-on:input="onFilterChange"-->
    <!--                    />-->
    <!--                </div>-->
    <!--            </template>-->
    <!--            <template v-if="isMonster">-->
    <!--                <div class="form-group form-group-builder">-->
    <!--                    <label>Attribute:</label>-->
    <!--                    <AdvancedSelect-->
    <!--                        :initial-options="monsterAttributes"-->
    <!--                        :no-selection-allowed="true"-->
    <!--                        class="form-control"-->
    <!--                        v-model="filter.attribute"-->
    <!--                        v-on:input="onFilterChange"-->
    <!--                    />-->
    <!--                </div>-->

    <!--                <div class="form-group form-group-builder">-->
    <!--                    <label>Level/Rank:</label>-->
    <!--                    <AdvancedSelect-->
    <!--                        :initial-options="monsterLevels"-->
    <!--                        :no-selection-allowed="true"-->
    <!--                        class="form-control"-->
    <!--                        v-model="filter.level"-->
    <!--                        v-on:input="onFilterChange"-->
    <!--                    />-->
    <!--                </div>-->

    <!--                <div-->
    <!--                    class="form-group form-group-builder"-->
    <!--                    v-if="isLinkMonster && showAdvanced"-->
    <!--                >-->
    <!--                    <label>Link Markers:</label>-->
    <!--                    <AdvancedSelect-->
    <!--                        :initial-options="monsterLinkMarkers"-->
    <!--                        :no-selection-allowed="true"-->
    <!--                        class="form-control"-->
    <!--                        v-model="filter.linkMarker"-->
    <!--                        v-on:input="onFilterChange"-->
    <!--                    />-->
    <!--                </div>-->
    <!--            </template>-->

    <!--            <div class="form-group form-group-builder">-->
    <!--                <label>Archetype:</label>-->
    <!--                <AdvancedSelect-->
    <!--                    :initial-options="archetypes"-->
    <!--                    :no-selection-allowed="true"-->
    <!--                    class="form-control"-->
    <!--                    v-model="filter.archetype"-->
    <!--                    v-on:input="onFilterChange"-->
    <!--                />-->
    <!--            </div>-->
    <!--            <hr />-->
    <!--        </template>-->

    <!--        <template>-->
    <!--            <div class="form-group form-group-builder">-->
    <!--                <label>Set:</label>-->
    <!--                <AdvancedSelect-->
    <!--                    :initial-options="sets"-->
    <!--                    :initial-value="null"-->
    <!--                    :label="(cardSet) => cardSet.name"-->
    <!--                    :no-selection-allowed="true"-->
    <!--                    :track-by="(cardSet) => cardSet.name"-->
    <!--                    class="form-control"-->
    <!--                    v-on:input="-->
    <!--                        (cardSet) => {-->
    <!--                            filter.sets = cardSet == null ? [] : [cardSet];-->
    <!--                            onFilterChange();-->
    <!--                        }-->
    <!--                    "-->
    <!--                />-->
    <!--            </div>-->
    <!--        </template>-->
    <!--    </div>-->
</template>

<script lang="ts">
import { PropType } from "vue";
import {
    CardDatabase,
    CardFilter,
    CardSet,
    CardTypeGroup,
    DEFAULT_BAN_STATE_ARR,
    CardType,
    Format,
} from "yugioh-deck-tool-core/src/main";
import { cloneDeep } from "lodash";
import {
    computed,
    defineComponent,
    reactive,
    watch,
} from "@vue/composition-api";

import vSelect from "vue-select";
import { applicationContainer } from "@/inversify.config";
import { APPLICATION_TYPES } from "@/types";

const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);

export default defineComponent({
    props: {
        filter: {
            required: true,
            type: Object as PropType<CardFilter>,
        },
        showAdvanced: {
            required: true,
            type: Boolean,
        },
    },
    components: {
        VSelect: vSelect,
    },
    model: {
        prop: "filter",
        event: "change",
    },
    setup(props, context) {
        const reactiveFilter = reactive<CardFilter>(cloneDeep(props.filter));

        const banStates = DEFAULT_BAN_STATE_ARR;
        const typeGroups = Object.values(CardTypeGroup);
        const sets = computed<CardSet[]>(() => cardDatabase.getSets());
        const archetypes = computed<string[]>(() =>
            cardDatabase.getArchetypes()
        );
        const types = computed<CardType[]>(() =>
            cardDatabase.getTypes(reactiveFilter.typeGroup)
        );
        const subTypes = computed<string[]>(() =>
            cardDatabase.getSubTypes(reactiveFilter.typeGroup)
        );
        const attributes = computed<string[]>(() =>
            cardDatabase.getAttributes()
        );
        const levels = computed<number[]>(() => cardDatabase.getLevels());
        const linkMarkers = computed<string[]>(() =>
            cardDatabase.getLinkMarkers()
        );
        const format = computed<Format>(
            () => context.root.$store.state.format.active
        );

        const isMonster = computed<boolean>(
            () => reactiveFilter.typeGroup === CardTypeGroup.MONSTER
        );

        const filterChanged = () => context.emit("change", reactiveFilter);

        watch(
            () => reactiveFilter.typeGroup,
            () => {
                reactiveFilter.type = null;
                reactiveFilter.subType = null;
                reactiveFilter.attribute = null;
                reactiveFilter.level = null;
                reactiveFilter.linkMarker = null;
            }
        );

        return {
            banStates,
            sets,
            archetypes,
            typeGroups,
            types,
            subTypes,
            attributes,
            levels,
            linkMarkers,
            isMonster,
            reactiveFilter,
            filterChanged,
        };
    },
});
// @Component({
//     components: {
//         AdvancedSelect,
//     },
// })
// export default class YgoFilter extends Vue {
//     @Prop({ required: true })
//     initialFilter: CardFilter;
//
//     @Prop({ required: false, type: Boolean, default: () => true })
//     showAdvanced: boolean;
//
//     @Prop({
//         required: false,
//         type: String,
//         default: () => SortingStrategy.NAME,
//     })
//     initialSortingStrategy: SortingStrategy;
//
//     @Prop({ required: false, type: String, default: () => SortingOrder.DESC })
//     initialSortingOrder: SortingOrder;
//
//     filter: CardFilter;
//
//     formats: Format[];
//
//     banStates: BanState[];
//
//     cardTypeGroups: CardTypeGroup[];
//
//     sortingStrategy: SortingStrategy;
//     sortingOrder: SortingOrder;
//
//     sortingStrategies: SortingStrategy[];
//     sortingOrders: SortingOrder[];
//
//     private readonly cardDatabase = applicationContainer.get<CardDatabase>(
//         APPLICATION_TYPES.CardDatabase
//     );
//
//     get types() {
//         if (this.filter.typeGroup == null) {
//             return [];
//         }
//         return this.loadArrFromCardDatabase((cardDatabase) =>
//             cardDatabase.getTypes(this.filter.typeGroup)
//         );
//     }
//
//     get sets() {
//         return this.loadArrFromCardDatabase<CardSet>((cardDatabase) =>
//             cardDatabase.getSets()
//         );
//     }
//
//     get archetypes() {
//         return this.loadArrFromCardDatabase<string>((cardDatabase) =>
//             cardDatabase.getArchetypes()
//         );
//     }
//
//     get monsterAttributes() {
//         return this.loadArrFromCardDatabase<string>((cardDatabase) =>
//             cardDatabase.getMonsterAttributes()
//         );
//     }
//
//     get monsterLevels() {
//         return this.loadArrFromCardDatabase<number>((cardDatabase) =>
//             cardDatabase.getMonsterLevels()
//         );
//     }
//
//     get monsterLinkMarkers() {
//         return this.loadArrFromCardDatabase<string>((cardDatabase) =>
//             cardDatabase.getMonsterLinkMarkers()
//         );
//     }
//
//     get isMonster() {
//         return this.filter.typeGroup === CardTypeGroup.MONSTER;
//     }
//
//     get isLinkMonster() {
//         return (
//             this.isMonster &&
//             this.filter.type != null &&
//             this.filter.type.name.includes("Link")
//         );
//     }
//
//     get subTypes() {
//         if (this.filter.typeGroup == null) {
//             return [];
//         }
//         return this.loadArrFromCardDatabase((cardDatabase) =>
//             cardDatabase.getSubTypes(this.filter.typeGroup)
//         );
//     }
//
//     data() {
//         return {
//             filter: clone(this.initialFilter),
//             sortingStrategy: this.initialSortingStrategy,
//             sortingOrder: this.initialSortingOrder,
//             cardTypeGroup: null,
//             sortingStrategies: [
//                 SortingStrategy.NAME,
//                 SortingStrategy.ATK,
//                 SortingStrategy.DEF,
//                 SortingStrategy.LEVEL,
//                 SortingStrategy.VIEWS,
//                 SortingStrategy.RELEASE_DATE,
//             ],
//             sortingOrders: [SortingOrder.ASC, SortingOrder.DESC],
//             banStates: [
//                 DefaultBanState.UNLIMITED,
//                 DefaultBanState.SEMI_LIMITED,
//                 DefaultBanState.LIMITED,
//                 DefaultBanState.BANNED,
//             ],
//             formats: Object.values(Format),
//             cardTypeGroups: Object.values(CardTypeGroup),
//         };
//     }
//
//     @Watch("filter.type")
//     typeWatcher() {
//         this.filter.linkMarker = null;
//     }
//
//     @Watch("filter.typeGroup")
//     typeGroupWatcher() {
//         this.filter.type = null;
//         this.filter.subType = null;
//         this.filter.attribute = null;
//         this.filter.linkMarker = null;
//         this.filter.level = null;
//         this.typeWatcher();
//     }
//
//     onFilterChange() {
//         this.$emit("filter-change", this.filter);
//     }
//
//     onSortingChange() {
//         this.$emit("sorting-change", {
//             strategy: this.sortingStrategy,
//             order: this.sortingOrder,
//         });
//     }
//
//     private loadArrFromCardDatabase<T>(
//         accessor: (cardDatabase: CardDatabase) => T[]
//     ): T[] {
//         if (this.cardDatabase == null) {
//             return [];
//         }
//         return accessor(this.cardDatabase);
//     }
// }
</script>

<style lang="scss" scoped>
@import "~yugioh-deck-tool-ui/src/styles/variables";
@import "~yugioh-deck-tool-ui/src/styles/mixin/screen";

.form-group-builder {
}
</style>

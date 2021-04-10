<template>
    <form @submit.prevent="() => {}">
        <div class="form-group" v-if="isFieldVisible('search')">
            <input
                @input="() => onFilterChanged()"
                class="form-control"
                placeholder="Search"
                title="Search"
                type="search"
                v-model="internalFilter.name"
            />
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('banState')"
            v-show="hasBanStates"
        >
            <VSelect
                :get-option-key="(banState) => banState.name"
                :get-option-label="(banState) => banState.name"
                :options="banStates"
                :searchable="false"
                title="Limit"
                placeholder="Limit"
                @input="() => onFilterChanged()"
                v-model="internalFilter.banState"
            />
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('sets') && essentialDataLoaded"
        >
            <VSelect
                :get-option-key="(set) => set.name"
                :get-option-label="(set) => set.name"
                multiple
                :options="sets"
                title="Set"
                placeholder="Set"
                @input="() => onFilterChanged()"
                v-model="internalFilter.sets"
            />
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('archetype') && essentialDataLoaded"
        >
            <VSelect
                title="Archetype"
                placeholder="Archetype"
                :options="archetypes"
                @input="() => onFilterChanged()"
                v-model="internalFilter.archetype"
            />
        </div>

        <div class="form-group" v-if="isFieldVisible('typeCategory')">
            <VSelect
                title="Type"
                placeholder="Type"
                :options="cardTypeCategories"
                :searchable="false"
                @input="() => onFilterChanged()"
                v-model="internalFilter.typeCategory"
            />
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('type') && essentialDataLoaded"
            v-show="isMonster"
        >
            <VSelect
                title="Monster Type"
                placeholder="Monster Type"
                :get-option-key="(type) => type.name"
                :get-option-label="(type) => type.name.replace(' Monster', '')"
                :options="types"
                @input="() => onFilterChanged()"
                v-model="internalFilter.type"
            />
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('subType') && essentialDataLoaded"
            v-show="internalFilter.typeCategory != null"
        >
            <VSelect
                :title="`${internalFilter.typeCategory} Subtype`"
                :placeholder="`${internalFilter.typeCategory} Subtype`"
                :options="subTypes"
                @input="() => onFilterChanged()"
                v-model="internalFilter.subType"
            />
        </div>

        <div
            class="form-group"
            v-show="isMonster"
            v-if="isFieldVisible('attribute') && essentialDataLoaded"
        >
            <VSelect
                title="Attribute"
                placeholder="Attribute"
                :options="attributes"
                @input="() => onFilterChanged()"
                v-model="internalFilter.attribute"
            />
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('level') && essentialDataLoaded"
            v-show="isMonster"
        >
            <VSelect
                title="Level/Rank"
                placeholder="Level/Rank"
                :options="levels"
                :searchable="false"
                @input="() => onFilterChanged()"
                v-model="internalFilter.level"
            />
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('linkMarkers') && essentialDataLoaded"
            v-show="isMonster"
        >
            <VSelect
                title="Link Markers"
                placeholder="Link Markers"
                multiple
                :options="linkMarkers"
                @input="() => onFilterChanged()"
                v-model="internalFilter.linkMarkers"
            />
        </div>

        <template v-if="showCollectionFilter && isFieldVisible('collection')">
            <hr />
            <YgoCollectionFilter @change="() => onCollectionFilterChange()" />
        </template>

        <template v-if="isFieldVisible('reset')">
            <hr />
            <button class="btn btn-danger" @click="() => resetFilter()">
                <span
                    class="fas fas-in-button fa-trash"
                    aria-hidden="true"
                ></span>
                Reset Filter
            </button>
        </template>
    </form>
</template>

<script lang="ts">
import type {
    BanlistService,
    BanState,
    CardCountFunction,
    CardDatabase,
    CardFilter,
    CardPredicate,
    CardPredicateService,
    CardSet,
    CardType,
    EnvironmentConfig,
    FilterService,
} from "@yugioh-deck-tool/core";
import {
    CardTypeCategory,
    DEFAULT_BAN_STATE_ARR,
    Environment,
    TYPES,
} from "@yugioh-deck-tool/core";
import type { PropType } from "@vue/composition-api";
import {
    computed,
    defineComponent,
    reactive,
    readonly,
    watch,
} from "@vue/composition-api";

import VSelect from "vue-select";
import { applicationContainer } from "../inversify.config";
import { useAppStore } from "../composition/state/useAppStore";
import YgoCollectionFilter from "./yugiohprodeck/YgoCollectionFilter.vue";
import type { YgoprodeckController } from "../controller/YgoprodeckController";
import { APPLICATION_TYPES } from "../types";
import { SET_CARD_COUNT_FUNCTION } from "../store/modules/collection";
import { useEssentialDataLoaded } from "../composition/loading";

const cardPredicateService = applicationContainer.get<CardPredicateService>(
    TYPES.CardPredicateService
);
const cardDatabase = applicationContainer.get<CardDatabase>(TYPES.CardDatabase);
const banlistService = applicationContainer.get<BanlistService>(
    TYPES.BanlistService
);
const filterService = applicationContainer.get<FilterService>(
    TYPES.FilterService
);
const environmentConfig = applicationContainer.get<EnvironmentConfig>(
    TYPES.EnvironmentConfig
);
const ygoprodeckController = applicationContainer.get<YgoprodeckController>(
    APPLICATION_TYPES.YgoprodeckController
);

export default defineComponent({
    props: {
        filter: {
            required: true,
            type: Object as PropType<CardFilter>,
        },
        showOnly: {
            required: false,
            type: Array as PropType<string[] | null>,
            default: null,
        },
    },
    emits: ["change"],
    model: {
        prop: "filter",
        event: "change",
    },
    components: {
        VSelect,
        YgoCollectionFilter,
    },
    setup: function (props, context) {
        const essentialDataLoaded = useEssentialDataLoaded(context);

        const banStates = readonly<BanState[]>(DEFAULT_BAN_STATE_ARR);
        const cardTypeCategories = readonly<CardTypeCategory[]>(
            Object.values(CardTypeCategory)
        );

        const internalFilter = reactive<CardFilter>(props.filter);

        const sets = computed<CardSet[]>(() => cardDatabase.getSets());
        const archetypes = computed<string[]>(() =>
            cardDatabase.getArchetypes()
        );
        const types = computed<CardType[]>(() =>
            internalFilter.typeCategory != null
                ? cardDatabase.getTypes(internalFilter.typeCategory)
                : []
        );
        const subTypes = computed<string[]>(() =>
            internalFilter.typeCategory != null
                ? cardDatabase.getSubTypes(internalFilter.typeCategory)
                : []
        );
        const attributes = computed<string[]>(() =>
            cardDatabase.getAttributes()
        );
        const levels = computed<number[]>(() => cardDatabase.getLevels());
        const linkMarkers = computed<string[]>(() =>
            cardDatabase.getLinkMarkers()
        );

        const hasBanStates = computed<boolean>(() => {
            const format = useAppStore(context).state.format.active;
            if (format == null) {
                return false;
            }
            return banlistService.hasBanlist(format);
        });
        const isMonster = computed<boolean>(
            () => internalFilter.typeCategory === CardTypeCategory.MONSTER
        );
        const showCollectionFilter = computed<boolean>(
            () =>
                environmentConfig.getEnvironment() == Environment.YGOPRODECK &&
                ygoprodeckController.hasCredentials()
        );

        const cardCountFunction = computed<CardCountFunction | null>({
            get: () => useAppStore(context).state.collection.cardCountFunction,
            set: (value) =>
                useAppStore(context).commit(SET_CARD_COUNT_FUNCTION, {
                    cardCountFunction: value,
                }),
        });
        const collectionPredicate = computed<CardPredicate | null>(() => {
            return cardCountFunction.value == null
                ? null
                : cardPredicateService.createAtLeastOneAvailablePredicate(
                      cardCountFunction.value
                  );
        });

        const resetFilter = (): void => {
            cardCountFunction.value = null;
            Object.assign(internalFilter, filterService.createDefaultFilter());
        };

        const isFieldVisible = (fieldName: string): boolean =>
            props.showOnly == null || props.showOnly.includes(fieldName);

        const onFilterChanged = (): void =>
            context.emit("change", internalFilter);

        const onCollectionFilterChange = (): void => {
            // TODO use composition API instead of manual event handling + assignment
            if (collectionPredicate.value != null) {
                internalFilter.customPredicates = [collectionPredicate.value];
            } else {
                internalFilter.customPredicates = [];
            }
            onFilterChanged();
        };

        watch(
            () => internalFilter.typeCategory,
            () => {
                internalFilter.type = null;
                internalFilter.subType = null;
                internalFilter.attribute = null;
                internalFilter.level = null;
                internalFilter.linkMarkers = [];
            }
        );
        watch(
            () => hasBanStates.value,
            () => {
                internalFilter.banState = null;
            }
        );

        return {
            banStates,
            sets,
            archetypes,
            cardTypeCategories,
            types,
            subTypes,
            attributes,
            levels,
            linkMarkers,

            internalFilter,

            essentialDataLoaded,
            hasBanStates,
            showCollectionFilter,
            isMonster,
            resetFilter,
            onCollectionFilterChange,
            onFilterChanged,
            isFieldVisible,
        };
    },
});
</script>

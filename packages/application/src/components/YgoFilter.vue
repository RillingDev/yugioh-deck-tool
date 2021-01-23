<template>
    <form>
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

        <div class="form-group" v-if="isFieldVisible('sets')">
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

        <div class="form-group" v-if="isFieldVisible('archetype')">
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
            v-if="isFieldVisible('type')"
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
            v-if="isFieldVisible('subType')"
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
            v-if="isFieldVisible('attribute')"
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
            v-if="isFieldVisible('level')"
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
            v-if="isFieldVisible('linkMarkers')"
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
    </form>
</template>

<script lang="ts">
import type {
    BanlistService,
    CardDatabase,
    CardFilter,
    CardSet,
    CardType,
} from "../../../core/src/main";
import {
    CardTypeCategory,
    DEFAULT_BAN_STATE_ARR,
    TYPES,
} from "../../../core/src/main";
import type { PropType } from "@vue/composition-api";
import {
    computed,
    defineComponent,
    reactive,
    watch,
} from "@vue/composition-api";

import VSelect from "vue-select";
import { applicationContainer } from "../inversify.config";
import { appStore } from "../composition/state/appStore";

const cardDatabase = applicationContainer.get<CardDatabase>(TYPES.CardDatabase);
const banlistService = applicationContainer.get<BanlistService>(
    TYPES.BanlistService
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
    components: {
        VSelect,
    },
    model: {
        prop: "filter",
        event: "change",
    },
    setup: function (props, context) {
        const banStates = DEFAULT_BAN_STATE_ARR;
        const cardTypeCategories = Object.values(CardTypeCategory);

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
            const format = appStore(context).state.format.active;
            if (format == null) {
                return false;
            }
            return banlistService.hasBanlist(format);
        });
        const isMonster = computed<boolean>(
            () => internalFilter.typeCategory === CardTypeCategory.MONSTER
        );

        const isFieldVisible = (fieldName: string): boolean =>
            props.showOnly == null || props.showOnly.includes(fieldName);

        const onFilterChanged = (): void =>
            context.emit("change", internalFilter);

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

            hasBanStates,
            isMonster,

            onFilterChanged,
            isFieldVisible,
        };
    },
});
</script>

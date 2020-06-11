<template>
    <form>
        <div class="form-group" v-if="isFieldVisible('search')">
            <input
                @input="onFilterChanged"
                class="form-control"
                title="Search"
                placeholder="Search"
                type="search"
                v-model="reactiveFilter.name"
            />
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('banState') && hasBanStates"
        >
            <VSelect
                :get-option-key="(banState) => banState.name"
                :get-option-label="(banState) => banState.name"
                :options="banStates"
                title="Limit"
                placeholder="Limit"
                @input="onFilterChanged"
                v-model="reactiveFilter.banState"
            />
        </div>

        <div class="form-group" v-if="isFieldVisible('sets')">
            <VSelect
                :get-option-key="(set) => set.name"
                :get-option-label="(set) => set.name"
                :multiple="true"
                :options="sets"
                title="Set"
                placeholder="Set"
                @input="onFilterChanged"
                v-model="reactiveFilter.sets"
            />
        </div>

        <div class="form-group" v-if="isFieldVisible('archetype')">
            <VSelect
                title="Archetype"
                placeholder="Archetype"
                :options="archetypes"
                @input="onFilterChanged"
                v-model="reactiveFilter.archetype"
            />
        </div>

        <div
            class="form-group row"
            v-if="isFieldVisible('typeGroup') || isFieldVisible('type')"
        >
            <div class="col-sm-5" v-if="isFieldVisible('typeGroup')">
                <VSelect
                    title="Type Group"
                    placeholder="Type Group"
                    :options="typeGroups"
                    @input="onFilterChanged"
                    v-model="reactiveFilter.typeGroup"
                />
            </div>
            <div class="col-sm-7" v-if="isFieldVisible('type')">
                <VSelect
                    title="Type"
                    placeholder="Type"
                    :disabled="!isMonster"
                    :get-option-key="(type) => type.name"
                    :get-option-label="
                        (type) => type.name.replace(' Monster', '')
                    "
                    :options="types"
                    @input="onFilterChanged"
                    v-model="reactiveFilter.type"
                />
            </div>
        </div>

        <div
            class="form-group"
            v-if="isFieldVisible('subType') && reactiveFilter.typeGroup != null"
        >
            <VSelect
                :title="`${reactiveFilter.typeGroup} Type`"
                :placeholder="`${reactiveFilter.typeGroup} Type`"
                :options="subTypes"
                @input="onFilterChanged"
                v-model="reactiveFilter.subType"
            />
        </div>

        <template v-if="isMonster">
            <div class="form-group" v-if="isFieldVisible('attribute')">
                <VSelect
                    title="Attribute"
                    placeholder="Attribute"
                    :options="attributes"
                    @input="onFilterChanged"
                    v-model="reactiveFilter.attribute"
                />
            </div>

            <div class="form-group" v-if="isFieldVisible('level')">
                <VSelect
                    title="Level/Rank"
                    placeholder="Level/Rank"
                    :options="levels"
                    @input="onFilterChanged"
                    v-model="reactiveFilter.level"
                />
            </div>

            <div class="form-group" v-if="isFieldVisible('linkMarker')">
                <VSelect
                    title="Link Markers"
                    placeholder="Link Markers"
                    :multiple="true"
                    :options="linkMarkers"
                    @input="onFilterChanged"
                    v-model="reactiveFilter.linkMarker"
                />
            </div>
        </template>
    </form>
</template>

<script lang="ts">
import {
    BanlistService,
    CardDatabase,
    CardFilter,
    CardSet,
    CardType,
    CardTypeGroup,
    DEFAULT_BAN_STATE_ARR,
} from "../../../core/src/main";
import { cloneDeep } from "lodash";
import {
    computed,
    defineComponent,
    PropType,
    reactive,
    watch,
} from "@vue/composition-api";

import VSelect from "vue-select";
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";
import { appStore } from "../composition/appStore";

const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);
const banlistService = applicationContainer.get<BanlistService>(
    APPLICATION_TYPES.BanlistService
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
    setup(props, context) {
        const banStates = DEFAULT_BAN_STATE_ARR;
        const typeGroups = Object.values(CardTypeGroup);

        const reactiveFilter = reactive<CardFilter>(cloneDeep(props.filter));

        const sets = computed<CardSet[]>(() => cardDatabase.getSets());
        const archetypes = computed<string[]>(() =>
            cardDatabase.getArchetypes()
        );
        const types = computed<CardType[]>(() =>
            reactiveFilter.typeGroup != null
                ? cardDatabase.getTypes(reactiveFilter.typeGroup)
                : []
        );
        const subTypes = computed<string[]>(() =>
            reactiveFilter.typeGroup != null
                ? cardDatabase.getSubTypes(reactiveFilter.typeGroup)
                : []
        );
        const attributes = computed<string[]>(() =>
            cardDatabase.getAttributes()
        );
        const levels = computed<number[]>(() => cardDatabase.getLevels());
        const linkMarkers = computed<string[]>(() =>
            cardDatabase.getLinkMarkers()
        );
        const hasBanStates = computed<boolean>(() =>
            banlistService.hasFormatBanlist(
                appStore(context).state.format.active
            )
        );
        const isMonster = computed<boolean>(
            () => reactiveFilter.typeGroup === CardTypeGroup.MONSTER
        );

        const isFieldVisible = (fieldName: string): boolean =>
            props.showOnly == null || props.showOnly.includes(fieldName);

        const onFilterChanged = (): void =>
            context.emit("change", reactiveFilter);

        watch(
            () => reactiveFilter.typeGroup,
            () => {
                reactiveFilter.type = undefined;
                reactiveFilter.subType = undefined;
                reactiveFilter.attribute = undefined;
                reactiveFilter.level = undefined;
                reactiveFilter.linkMarker = undefined;
            }
        );
        watch(
            () => hasBanStates.value,
            () => {
                reactiveFilter.banState = undefined;
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

            reactiveFilter,

            hasBanStates,
            isMonster,

            onFilterChanged,
            isFieldVisible,
        };
    },
});
</script>

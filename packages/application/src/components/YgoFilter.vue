<template>
    <form>
        <div class="form-group" v-if="isFieldVisible('search')">
            <input
                @input="filterChanged"
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
                @input="filterChanged"
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
                @input="filterChanged"
                v-model="reactiveFilter.sets"
            />
        </div>

        <div class="form-group" v-if="isFieldVisible('archetype')">
            <VSelect
                title="Archetype"
                placeholder="Archetype"
                :options="archetypes"
                @input="filterChanged"
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
                    @input="filterChanged"
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
                    @input="filterChanged"
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
                @input="filterChanged"
                v-model="reactiveFilter.subType"
            />
        </div>

        <template v-if="isMonster">
            <div class="form-group" v-if="isFieldVisible('attribute')">
                <VSelect
                    title="Attribute"
                    placeholder="Attribute"
                    :options="attributes"
                    @input="filterChanged"
                    v-model="reactiveFilter.attribute"
                />
            </div>

            <div class="form-group" v-if="isFieldVisible('level')">
                <VSelect
                    title="Level/Rank"
                    placeholder="Level/Rank"
                    :options="levels"
                    @input="filterChanged"
                    v-model="reactiveFilter.level"
                />
            </div>

            <div class="form-group" v-if="isFieldVisible('linkMarker')">
                <VSelect
                    title="Link Markers"
                    placeholder="Link Markers"
                    :multiple="true"
                    :options="linkMarkers"
                    @input="filterChanged"
                    v-model="reactiveFilter.linkMarker"
                />
            </div>
        </template>
    </form>
</template>

<script lang="ts">
import { PropType } from "vue";
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
    reactive,
    watch,
} from "@vue/composition-api";

import VSelect from "vue-select";
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";

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
        const hasBanStates = computed<boolean>(() =>
            banlistService.hasFormatBanlist(
                context.root.$store.state.format.active
            )
        );
        const isMonster = computed<boolean>(
            () => reactiveFilter.typeGroup === CardTypeGroup.MONSTER
        );

        const isFieldVisible = (fieldName: string) =>
            props.showOnly == null || props.showOnly.includes(fieldName);

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
        watch(
            () => hasBanStates.value,
            () => {
                reactiveFilter.banState = null;
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
            hasBanStates,
            isMonster,
            reactiveFilter,
            filterChanged,
            isFieldVisible,
        };
    },
});
</script>

<template>
    <form>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="filterName">
                Search
            </label>
            <div class="col-sm-10">
                <input
                    @input="filterChanged"
                    class="form-control"
                    id="filterName"
                    type="search"
                    v-model="reactiveFilter.name"
                />
            </div>
        </div>

        <div class="form-group row" v-if="hasBanStates">
            <label class="col-sm-2 col-form-label" for="filterLimit">
                Limit
            </label>
            <div class="col-sm-10">
                <VSelect
                    :getOptionKey="(banState) => banState.name"
                    :getOptionLabel="(banState) => banState.name"
                    :options="banStates"
                    @input="filterChanged"
                    id="filterLimit"
                    v-model="reactiveFilter.banState"
                />
            </div>
        </div>

        <div class="form-group row">
            <label class="col-sm-2 col-form-label" for="filterSet">
                Set
            </label>
            <div class="col-sm-10">
                <VSelect
                    :getOptionKey="(set) => set.name"
                    :getOptionLabel="(set) => set.name"
                    :multiple="true"
                    :options="sets"
                    @input="filterChanged"
                    id="filterSet"
                    v-model="reactiveFilter.sets"
                />
            </div>
        </div>

        <template v-if="showAdvanced">
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="filterArchetype">
                    Archetype
                </label>
                <div class="col-sm-10">
                    <VSelect
                        :options="archetypes"
                        @input="filterChanged"
                        id="filterArchetype"
                        v-model="reactiveFilter.archetype"
                    />
                </div>
            </div>

            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="filterTypeGroup">
                    Type
                </label>
                <div class="col-sm-4">
                    <VSelect
                        :options="typeGroups"
                        @input="filterChanged"
                        id="filterTypeGroup"
                        v-model="reactiveFilter.typeGroup"
                    />
                </div>
                <div class="col-sm-6">
                    <VSelect
                        :disabled="!isMonster"
                        :getOptionKey="(type) => type.name"
                        :getOptionLabel="(type) => type.name"
                        :options="types"
                        @input="filterChanged"
                        v-model="reactiveFilter.type"
                    />
                </div>
            </div>

            <div class="form-group row" v-if="reactiveFilter.typeGroup != null">
                <label class="col-sm-2 col-form-label" for="filterSubType">
                    {{ reactiveFilter.typeGroup }} Type
                </label>
                <div class="col-sm-10">
                    <VSelect
                        :options="subTypes"
                        @input="filterChanged"
                        id="filterSubType"
                        v-model="reactiveFilter.subType"
                    />
                </div>
            </div>

            <template v-if="isMonster">
                <div class="form-group row">
                    <label
                        class="col-sm-2 col-form-label"
                        for="filterMonsterAttribute"
                    >
                        Attribute
                    </label>
                    <div class="col-sm-10">
                        <VSelect
                            :options="attributes"
                            @input="filterChanged"
                            id="filterMonsterAttribute"
                            v-model="reactiveFilter.attribute"
                        />
                    </div>
                </div>

                <div class="form-group row">
                    <label
                        class="col-sm-2 col-form-label"
                        for="filterMonsterLevel"
                    >
                        Level/Rank
                    </label>
                    <div class="col-sm-10">
                        <VSelect
                            :options="levels"
                            @input="filterChanged"
                            id="filterMonsterLevel"
                            v-model="reactiveFilter.level"
                        />
                    </div>
                </div>

                <div class="form-group row">
                    <label
                        class="col-sm-2 col-form-label"
                        for="filterMonsterLinkMarkers"
                    >
                        Link Markers
                    </label>
                    <div class="col-sm-10">
                        <VSelect
                            :multiple="true"
                            :options="linkMarkers"
                            @input="filterChanged"
                            id="filterMonsterLinkMarkers"
                            v-model="reactiveFilter.linkMarker"
                        />
                    </div>
                </div>
            </template>
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
} from "yugioh-deck-tool-core/src/main";
import { cloneDeep } from "lodash";
import {
    computed,
    defineComponent,
    reactive,
    watch,
} from "@vue/composition-api";

import vSelect from "vue-select";
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

        const hasBanStates = computed<boolean>(() =>
            banlistService.hasFormatBanlist(
                context.root.$store.state.format.active
            )
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
        };
    },
});
</script>

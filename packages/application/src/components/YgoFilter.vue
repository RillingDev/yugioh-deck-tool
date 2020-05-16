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

        <div class="form-group row" v-if="hasBanStates">
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

        <template v-if="showAdvanced">
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
                        :disabled="!isMonster"
                        :options="types"
                        v-model="reactiveFilter.type"
                        @input="filterChanged"
                        :getOptionLabel="(type) => type.name"
                        :getOptionKey="(type) => type.name"
                    />
                </div>
            </div>

            <div class="form-group row" v-if="reactiveFilter.typeGroup != null">
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

            <template v-if="isMonster">
                <div class="form-group row">
                    <label
                        for="filterMonsterAttribute"
                        class="col-sm-2 col-form-label"
                    >
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
                    <label
                        for="filterMonsterLevel"
                        class="col-sm-2 col-form-label"
                    >
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
                            :multiple="true"
                            id="filterMonsterLinkMarkers"
                            :options="linkMarkers"
                            v-model="reactiveFilter.linkMarker"
                            @input="filterChanged"
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
    CardDatabase,
    CardFilter,
    CardSet,
    CardTypeGroup,
    DEFAULT_BAN_STATE_ARR,
    CardType,
    BanlistService,
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

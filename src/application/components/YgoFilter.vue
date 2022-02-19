<template>
	<form @submit.prevent="() => {}">
		<div v-if="isFieldVisible('search')" class="form-group">
			<input
				v-model="internalFilter.name"
				class="form-control"
				placeholder="Card Name"
				title="Name"
				type="search"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div v-if="isFieldVisible('description')" class="form-group">
			<input
				v-model="internalFilter.description"
				class="form-control"
				placeholder="Card Description/Effect"
				title="Description/Effect"
				type="search"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div
			v-if="isFieldVisible('banState')"
			v-show="hasBanStates"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.banState"
				:get-option-key="(banState) => banState.name"
				:get-option-label="(banState) => banState.name"
				:options="banStates"
				:searchable="false"
				title="Limit"
				placeholder="Limit"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div
			v-if="isFieldVisible('sets') && essentialDataLoaded"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.sets"
				:get-option-key="(set) => set.name"
				:get-option-label="(set) => set.name"
				multiple
				:options="sets"
				title="Set"
				placeholder="Set"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div
			v-if="isFieldVisible('archetype') && essentialDataLoaded"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.archetype"
				title="Archetype"
				placeholder="Archetype"
				:options="archetypes"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div v-if="isFieldVisible('typeCategory')" class="form-group">
			<VSelect
				v-model="internalFilter.typeCategory"
				title="Type"
				placeholder="Type"
				:options="cardTypeCategories"
				:searchable="false"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div
			v-if="isFieldVisible('type') && essentialDataLoaded"
			v-show="isMonster"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.type"
				title="Monster Type"
				placeholder="Monster Type"
				:get-option-key="(type) => type.name"
				:get-option-label="(type) => type.name.replace(' Monster', '')"
				:options="types"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div
			v-if="isFieldVisible('subType') && essentialDataLoaded"
			v-show="internalFilter.typeCategory != null"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.subType"
				:title="`${internalFilter.typeCategory} Subtype`"
				:placeholder="`${internalFilter.typeCategory} Subtype`"
				:options="subTypes"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div
			v-show="isMonster"
			v-if="isFieldVisible('attribute') && essentialDataLoaded"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.attribute"
				title="Attribute"
				placeholder="Attribute"
				:options="attributes"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div
			v-if="isFieldVisible('level') && essentialDataLoaded"
			v-show="isMonster"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.level"
				title="Level/Rank"
				placeholder="Level/Rank"
				:options="levels"
				:searchable="false"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div
			v-if="isFieldVisible('linkMarkers') && essentialDataLoaded"
			v-show="isMonster"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.linkMarkers"
				title="Link Markers"
				placeholder="Link Markers"
				multiple
				:options="linkMarkers"
				@input="() => onFilterChanged()"
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
} from "@/core/main";
import {
	CardTypeCategory,
	DEFAULT_BAN_STATE_ARR,
	Environment,
	TYPES,
} from "@/core/main";
import type { PropType } from "@vue/composition-api";
import {
	computed,
	defineComponent,
	reactive,
	readonly,
	watch,
} from "@vue/composition-api";
import { clone } from "lodash";

import VSelect from "vue-select";
import { applicationContainer } from "../inversify.config";
import YgoCollectionFilter from "./yugiohprodeck/YgoCollectionFilter.vue";
import type { YgoprodeckController } from "../controller/YgoprodeckController";
import { APPLICATION_TYPES } from "../types";
import { SET_CARD_COUNT_FUNCTION } from "../store/modules/collection";
import { useStore } from "../store/store";

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
	components: {
		VSelect,
		YgoCollectionFilter,
	},
	model: {
		prop: "filter",
		event: "change",
	},
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
	setup: function (props, context) {
		const store = useStore();

		const essentialDataLoaded = computed<boolean>(
			() => store.state.data.essentialDataLoaded
		);

		const banStates = readonly<BanState[]>(DEFAULT_BAN_STATE_ARR);
		const cardTypeCategories = readonly<CardTypeCategory[]>(
			Object.values(CardTypeCategory)
		);

		const internalFilter = reactive<CardFilter>(clone(props.filter));

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
			const format = store.state.format.active;
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
			get: () => store.state.collection.cardCountFunction,
			set: (value) =>
				store.commit(SET_CARD_COUNT_FUNCTION, {
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
			onFilterChanged();
		};

		const isFieldVisible = (fieldName: string): boolean =>
			props.showOnly == null || props.showOnly.includes(fieldName);

		const onFilterChanged = (): void =>
			context.emit("change", clone(internalFilter));

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

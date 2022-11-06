<template>
	<form @submit.prevent="() => {}">
		<div v-if="isFieldVisible('search')" class="form-group">
			<label :for="nameId">Name</label>
			<input
				:id="nameId"
				v-model="internalFilter.name"
				class="form-control"
				type="search"
				@input="() => onFilterChanged()"
			/>
		</div>

		<div v-if="isFieldVisible('description')" class="form-group">
			<label :for="descriptionId">Description/Effect</label>
			<input
				:id="descriptionId"
				v-model="internalFilter.description"
				class="form-control"
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
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>Limit</label>
				</template>
			</VSelect>
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
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>Sets</label>
				</template>
			</VSelect>
		</div>

		<div
			v-if="isFieldVisible('archetype') && essentialDataLoaded"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.archetype"
				:options="archetypes"
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>Archetype</label>
				</template>
			</VSelect>
		</div>

		<div v-if="isFieldVisible('typeCategory')" class="form-group">
			<VSelect
				v-model="internalFilter.typeCategory"
				:options="cardTypeCategories"
				:searchable="false"
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>Type</label>
				</template>
			</VSelect>
		</div>

		<div
			v-if="isFieldVisible('type') && essentialDataLoaded"
			v-show="isMonster"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.type"
				:get-option-key="(type) => type.name"
				:get-option-label="(type) => type.name.replace(' Monster', '')"
				:options="types"
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>Monster Type</label>
				</template>
			</VSelect>
		</div>

		<div
			v-if="isFieldVisible('subType') && essentialDataLoaded"
			v-show="internalFilter.typeCategory != null"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.subType"
				:options="subTypes"
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>{{ internalFilter.typeCategory }} Subtype</label>
				</template>
			</VSelect>
		</div>

		<div
			v-show="isMonster"
			v-if="isFieldVisible('attribute') && essentialDataLoaded"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.attribute"
				:options="attributes"
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>Attribute</label>
				</template>
			</VSelect>
		</div>

		<div
			v-if="isFieldVisible('level') && essentialDataLoaded"
			v-show="isMonster"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.level"
				:options="levels"
				:searchable="false"
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>Level/Rank</label>
				</template>
			</VSelect>
		</div>

		<div
			v-if="isFieldVisible('linkMarkers') && essentialDataLoaded"
			v-show="isMonster"
			class="form-group"
		>
			<VSelect
				v-model="internalFilter.linkMarkers"
				multiple
				:options="linkMarkers"
				@input="() => onFilterChanged()"
			>
				<template #header>
					<label>Link Markers</label>
				</template>
			</VSelect>
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
	BanState,
	CardFilter,
	CardPredicate,
	CardSet,
	CardType,
} from "@/core/lib";
import {
	CardTypeCategory,
	DEFAULT_BAN_STATE_ARR,
	Environment,
} from "@/core/lib";
import type { PropType } from "vue";
import { computed, defineComponent, reactive, readonly, watch } from "vue";
import { clone } from "lodash";

import VSelect from "vue-select";
import YgoCollectionFilter from "./yugiohprodeck/YgoCollectionFilter.vue";
import { useId } from "@/application/composition/id";
import { useDataStore } from "@/application/store/data";
import { useFormatStore } from "@/application/store/format";
import { useCollectionStore } from "@/application/store/collection";
import { storeToRefs } from "pinia";
import {
	banlistService,
	cardDatabase,
	cardPredicateService,
	environmentConfig,
	filterService,
	ygoprodeckController,
} from "@/application/container";

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
		const { format } = storeToRefs(useFormatStore());

		const { essentialDataLoaded } = storeToRefs(useDataStore());

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
			if (format.value == null) {
				return false;
			}
			return banlistService.hasBanlist(format.value);
		});
		const isMonster = computed<boolean>(
			() => internalFilter.typeCategory === CardTypeCategory.MONSTER
		);
		const showCollectionFilter = computed<boolean>(
			() =>
				environmentConfig.getEnvironment() == Environment.YGOPRODECK &&
				ygoprodeckController.hasCredentials()
		);

		const { cardCountFunction } = storeToRefs(useCollectionStore());
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
			nameId: useId(),
			descriptionId: useId(),

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

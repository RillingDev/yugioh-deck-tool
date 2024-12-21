<template>
	<VForm @submit.prevent>
		<VTextField
			v-if="isFieldVisible('search')"
			v-model="internalFilter.name"
			label="Name"
			type="search"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VTextField
			v-if="isFieldVisible('description')"
			v-model="internalFilter.description"
			label="Description/Effect"
			type="search"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VSelect
			v-if="isFieldVisible('banState')"
			v-model="internalFilter.banState"
			:disabled="!hasBanStates"
			:items="banStates"
			:item-title="getBanStateName"
			:item-key="getBanStateName"
			label="Limit"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VCombobox
			v-if="isFieldVisible('sets') && essentialDataLoaded"
			v-model="internalFilter.sets"
			:items="sets"
			:item-title="getSetName"
			:item-key="getSetName"
			label="Sets"
			clearable
			multiple
			@update:model-value="onFilterChanged"
		/>

		<VSelect
			v-if="isFieldVisible('archetype') && essentialDataLoaded"
			v-model="internalFilter.archetype"
			:items="archetypes"
			label="Archetype"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VSelect
			v-if="isFieldVisible('typeCategory') && essentialDataLoaded"
			v-model="internalFilter.typeCategory"
			:items="cardTypeCategories"
			label="Type"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VSelect
			v-if="isFieldVisible('type') && essentialDataLoaded"
			v-show="isMonster"
			v-model="internalFilter.type"
			:items="types"
			:item-title="getTypeLabel"
			:item-key="getTypeName"
			label="Monster Type"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VSelect
			v-if="isFieldVisible('subType') && essentialDataLoaded"
			v-show="internalFilter.typeCategory != null"
			v-model="internalFilter.subType"
			:items="subTypes"
			:label="`${internalFilter.typeCategory} Subtype`"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VSelect
			v-if="isFieldVisible('attribute') && essentialDataLoaded"
			v-show="isMonster"
			v-model="internalFilter.attribute"
			:items="attributes"
			label="Attribute"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VSelect
			v-if="isFieldVisible('level') && essentialDataLoaded"
			v-show="isMonster"
			v-model="internalFilter.level"
			:items="levels"
			label="Level/Rank"
			clearable
			@update:model-value="onFilterChanged"
		/>

		<VSelect
			v-if="isFieldVisible('level') && essentialDataLoaded"
			v-show="isMonster"
			v-model="internalFilter.linkMarkers"
			:items="linkMarkers"
			label="Link Markers"
			clearable
			multiple
			@update:model-value="onFilterChanged"
		/>

		<template v-if="showCollectionFilter && isFieldVisible('collection')">
			<hr />
			<YgoCollectionFilter @change="onCollectionFilterChange" />
		</template>

		<template v-if="isFieldVisible('reset')">
			<VBtn
				prepend-icon="fas fa-trash"
				color="error"
				@click="resetFilter"
			>
				Reset Filter
			</VBtn>
		</template>
	</VForm>
</template>

<script setup lang="ts">
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
import { computed, reactive, watch } from "vue";
import { clone } from "lodash";
import YgoCollectionFilter from "./yugiohprodeck/YgoCollectionFilter.vue";
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
} from "@/application/ctx";
import { VForm } from "vuetify/components/VForm";
import { VTextField } from "vuetify/components/VTextField";
import { VSelect } from "vuetify/components/VSelect";
import { VCombobox } from "vuetify/components/VCombobox";
import { VBtn } from "vuetify/components/VBtn";

const model = defineModel({
	required: true,
	type: Object as PropType<CardFilter>,
});

const props = defineProps({
	showOnly: {
		required: false,
		type: Array as PropType<string[] | null>,
		default: null,
	},
});

const { format } = storeToRefs(useFormatStore());

const { essentialDataLoaded } = storeToRefs(useDataStore());

const { cardCountFunction } = storeToRefs(useCollectionStore());

const internalFilter = reactive(clone(model.value));

const banStates = DEFAULT_BAN_STATE_ARR;
const hasBanStates = computed(() => {
	if (format.value == null) {
		return false;
	}
	return banlistService.hasBanlist(format.value);
});
function getBanStateName(banState: BanState) {
	return banState.name;
}

const sets = computed(() => cardDatabase.getSets());
function getSetName(set: CardSet) {
	return set.name;
}

const archetypes = computed(() => cardDatabase.getArchetypes());

const cardTypeCategories = Object.values(CardTypeCategory);

const types = computed(() =>
	internalFilter.typeCategory != null
		? cardDatabase.getTypes(internalFilter.typeCategory)
		: [],
);
function getTypeName(type: CardType) {
	return type.name;
}
function getTypeLabel(type: CardType) {
	return type.name.replace(" Monster", "");
}

const subTypes = computed(() =>
	internalFilter.typeCategory != null
		? cardDatabase.getSubTypes(internalFilter.typeCategory)
		: [],
);

const attributes = computed(() => cardDatabase.getAttributes());

const levels = computed(() => cardDatabase.getLevels());

const linkMarkers = computed(() => cardDatabase.getLinkMarkers());

const isMonster = computed(
	() => internalFilter.typeCategory === CardTypeCategory.MONSTER,
);
const showCollectionFilter = computed(
	() =>
		environmentConfig.getEnvironment() == Environment.YGOPRODECK &&
		ygoprodeckController.hasCredentials(),
);

const collectionPredicate = computed<CardPredicate | null>(() => {
	return cardCountFunction.value == null
		? null
		: cardPredicateService.createAtLeastOneAvailablePredicate(
				cardCountFunction.value,
			);
});

function resetFilter() {
	cardCountFunction.value = null;
	Object.assign(internalFilter, filterService.createDefaultFilter());
	onFilterChanged();
}

function isFieldVisible(fieldName: string) {
	return props.showOnly == null || props.showOnly.includes(fieldName);
}

function onFilterChanged() {
	model.value = clone(internalFilter);
}

function onCollectionFilterChange() {
	// TODO use composition API instead of manual event handling + assignment
	if (collectionPredicate.value != null) {
		internalFilter.customPredicates = [collectionPredicate.value];
	} else {
		internalFilter.customPredicates = [];
	}
	onFilterChanged();
}

watch(
	() => internalFilter.typeCategory,
	() => {
		internalFilter.type = null;
		internalFilter.subType = null;
		internalFilter.attribute = null;
		internalFilter.level = null;
		internalFilter.linkMarkers = [];
	},
);
watch(
	() => hasBanStates.value,
	() => {
		internalFilter.banState = null;
	},
);
</script>

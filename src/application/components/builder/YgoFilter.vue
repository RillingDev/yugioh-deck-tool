<template>
	<VForm @submit.prevent>
		<VTextField
			v-if="name !== undefined"
			v-model="name"
			label="Name"
			type="search"
			clearable
		/>

		<VTextField
			v-if="description !== undefined"
			v-model="description"
			label="Description/Effect"
			type="search"
			clearable
		/>

		<VSelect
			v-if="banState !== undefined"
			v-model="banState"
			:disabled="!hasBanStates"
			:items="allBanStates"
			:item-title="getBanStateName"
			:item-value="getBanStateName"
			return-object
			label="Limit"
			clearable
		/>

		<VCombobox
			v-if="sets !== undefined && essentialDataLoaded"
			v-model="sets"
			:items="allSets"
			:item-title="getSetName"
			:item-value="getSetName"
			return-object
			label="Sets"
			clearable
			multiple
		/>

		<VSelect
			v-if="archetype !== undefined && essentialDataLoaded"
			v-model="archetype"
			:items="allArchetypes"
			label="Archetype"
			clearable
		/>

		<VSelect
			v-if="typeCategory !== undefined && essentialDataLoaded"
			v-model="typeCategory"
			:items="allCardTypeCategories"
			label="Type"
			clearable
		/>

		<VSelect
			v-if="type !== undefined && essentialDataLoaded"
			v-show="isMonster"
			v-model="type"
			:items="allTypes"
			:item-title="getTypeLabel"
			:item-value="getTypeName"
			return-object
			label="Monster Type"
			clearable
		/>

		<VSelect
			v-if="subType !== undefined && essentialDataLoaded"
			v-show="typeCategory != null"
			v-model="subType"
			:items="allSubTypes"
			:label="`${typeCategory} Subtype`"
			clearable
		/>

		<VSelect
			v-if="attribute !== undefined && essentialDataLoaded"
			v-show="isMonster"
			v-model="attribute"
			:items="allAttributes"
			label="Attribute"
			clearable
		/>

		<VSelect
			v-if="level !== undefined && essentialDataLoaded"
			v-show="isMonster"
			v-model="level"
			:items="allLevels"
			label="Level/Rank"
			clearable
		/>

		<VSelect
			v-if="level !== undefined && essentialDataLoaded"
			v-show="isMonster"
			v-model="linkMarkers"
			:items="allLinkMarkers"
			label="Link Markers"
			clearable
			multiple
		/>

		<template v-if="showCollectionFilter">
			<hr />
			<YgoCollectionFilter @change="onCollectionFilterChange" />
		</template>

		<VBtn prepend-icon="fas fa-trash" color="error" @click="resetFilter">
			Reset Filter
		</VBtn>
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
import { computed, ref, watch } from "vue";
import YgoCollectionFilter from "../yugiohprodeck/YgoCollectionFilter.vue";
import { useDataStore } from "@/application/store/data";
import { useFormatStore } from "@/application/store/format";
import { useCollectionStore } from "@/application/store/collection";
import { storeToRefs } from "pinia";
import {
	banlistService,
	cardDatabase,
	cardPredicateService,
	environmentConfig,
	ygoprodeckController,
} from "@/application/ctx";
import { VForm } from "vuetify/components/VForm";
import { VTextField } from "vuetify/components/VTextField";
import { VSelect } from "vuetify/components/VSelect";
import { VCombobox } from "vuetify/components/VCombobox";
import { VBtn } from "vuetify/components/VBtn";

const name = defineModel<CardFilter["name"]>("name");
const description = defineModel<CardFilter["description"]>("description");
const typeCategory = defineModel<CardFilter["typeCategory"]>("typeCategory");
const type = defineModel<CardFilter["type"]>("type");
const subType = defineModel<CardFilter["subType"]>("subType");
const attribute = defineModel<CardFilter["attribute"]>("attribute");
const level = defineModel<CardFilter["level"]>("level");
const linkMarkers = defineModel<CardFilter["linkMarkers"]>("linkMarkers");
const archetype = defineModel<CardFilter["archetype"]>("archetype");
const banState = defineModel<CardFilter["banState"]>("banState");
const sets = defineModel<CardFilter["sets"]>("sets");

const { format } = storeToRefs(useFormatStore());

const { essentialDataLoaded } = storeToRefs(useDataStore());

const { cardCountFunction } = storeToRefs(useCollectionStore());

const allBanStates = DEFAULT_BAN_STATE_ARR;
const hasBanStates = computed(() => {
	if (format.value == null) {
		return false;
	}
	return banlistService.hasBanlist(format.value);
});
function getBanStateName(banState: BanState) {
	return banState.name;
}

const allSets = computed(() => cardDatabase.getSets());
function getSetName(set: CardSet) {
	return set.name;
}

const allArchetypes = computed(() => cardDatabase.getArchetypes());

const allCardTypeCategories = Object.values(CardTypeCategory);

const allTypes = computed(() =>
	typeCategory.value != null ? cardDatabase.getTypes(typeCategory.value) : [],
);
function getTypeName(type: CardType) {
	return type.name;
}
function getTypeLabel(type: CardType) {
	return type.name.replace(" Monster", "");
}

const allSubTypes = computed(() =>
	typeCategory.value != null
		? cardDatabase.getSubTypes(typeCategory.value)
		: [],
);

const allAttributes = computed(() => cardDatabase.getAttributes());

const allLevels = computed(() => cardDatabase.getLevels());

const allLinkMarkers = computed(() => cardDatabase.getLinkMarkers());

const isMonster = computed(
	() => typeCategory.value === CardTypeCategory.MONSTER,
);
const showCollectionFilter = computed(
	() =>
		environmentConfig.getEnvironment() == Environment.YGOPRODECK &&
		ygoprodeckController.hasCredentials(),
);

//TODO
const collectionPredicate = computed(() => {
	return cardCountFunction.value == null
		? null
		: cardPredicateService.createAtLeastOneAvailablePredicate(
				cardCountFunction.value,
			);
});
const customPredicates = ref<CardPredicate[]>([]);
function onCollectionFilterChange() {
	// TODO use composition API instead of manual event handling + assignment
	if (collectionPredicate.value != null) {
		customPredicates.value = [collectionPredicate.value];
	} else {
		customPredicates.value = [];
	}
}

function resetFilter() {
	cardCountFunction.value = null;
	name.value = null;
	description.value = null;
	typeCategory.value = null;
	type.value = null;
	subType.value = null;
	attribute.value = null;
	level.value = null;
	linkMarkers.value = [];
	archetype.value = null;
	banState.value = null;
	sets.value = [];
}

watch(
	() => typeCategory,
	() => {
		type.value = null;
		subType.value = null;
		attribute.value = null;
		level.value = null;
		linkMarkers.value = [];
	},
);
watch(
	() => hasBanStates.value,
	() => {
		banState.value = null;
	},
);
</script>

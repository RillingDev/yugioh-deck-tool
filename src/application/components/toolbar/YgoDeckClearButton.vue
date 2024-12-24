<template>
	<VDialog max-width="500">
		<template #activator="{ props: activatorProps }">
			<VBtn
				v-bind="activatorProps"
				:disabled="deckEmpty"
				prepend-icon="fas fa-trash"
				color="primary"
				variant="outlined"
			>
				Clear
			</VBtn>
		</template>

		<template #default="{ isActive }">
			<VCard title="Clear Deck">
				<VCardText>Are you sure you want to clear the deck?</VCardText>
				<VCardActions>
					<VBtn
						color="error"
						prepend-icon="fas fa-trash"
						variant="outlined"
						@click="
							clear();
							isActive.value = false;
						"
					>
						Clear Deck
					</VBtn>
					<VBtn @click="isActive.value = false">Close Dialog</VBtn>
				</VCardActions>
			</VCard>
		</template>
	</VDialog>
</template>

<script setup lang="ts">
import { useDeckStore } from "@/application/store/deck";
import { computed } from "vue";
import { VBtn } from "vuetify/components/VBtn";
import { VCard, VCardActions, VCardText } from "vuetify/components/VCard";
import { VDialog } from "vuetify/components/VDialog";

const deckStore = useDeckStore();

const deckEmpty = computed(() => deckStore.deckEmpty);

function clear() {
	deckStore.clear();
}
</script>

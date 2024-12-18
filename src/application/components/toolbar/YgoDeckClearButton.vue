<template>
	<VDialog max-width="500">
		<template #activator="{ props: activatorProps }">
			<VBtn
				v-bind="activatorProps"
				prepend-icon="fas fa-trash"
				:disabled="deckEmpty"
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
import { computed } from "vue";
import { VDialog } from "vuetify/components/VDialog";
import { VBtn } from "vuetify/components/VBtn";
import { VCardActions, VCard, VCardText } from "vuetify/components/VCard";
import { useDeckStore } from "@/application/store/deck";

const deckStore = useDeckStore();

const deckEmpty = computed(() => deckStore.deckEmpty);

function clear() {
	deckStore.clear();
}
</script>

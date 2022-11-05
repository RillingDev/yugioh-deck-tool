<template>
	<BDropdownItemButton :disabled="deckEmpty" @click="() => sort()">
		<span class="fas fa-sort fas-in-button" aria-hidden="true"></span>
		Sort
	</BDropdownItemButton>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { BDropdownItemButton } from "bootstrap-vue";
import { useDeckStore } from "@/application/store/deck";

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const deckStore = useDeckStore();

		const deckEmpty = computed(() => deckStore.isDeckEmpty);

		const sort = (): void => deckStore.sort();

		return { deckEmpty, sort };
	},
});
</script>

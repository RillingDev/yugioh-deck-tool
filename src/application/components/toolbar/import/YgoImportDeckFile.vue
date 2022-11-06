<template>
	<BDropdownItemButton @click="() => openFileDialog()">
		<span class="fas fa-file fas-in-button" aria-hidden="true"></span>
		From .ydk Deck File
	</BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ImportResult } from "@/core/lib";
import { getLogger } from "@/core/lib";
import { BDropdownItemButton } from "bootstrap-vue";
import { readFile } from "../../../composition/io/readFile";
import { uploadFile } from "../../../composition/io/uploadFile";
import {
	showError,
	showSuccess,
	showWarning,
	useToast,
} from "../../../composition/feedback";
import { useDeckStore } from "@/application/store/deck";
import { deckFileService } from "@/application/container";

const logger = getLogger("YgoImportDeckFile");

export default defineComponent({
	components: { BDropdownItemButton },
	props: {},
	emits: [],
	setup() {
		const deckStore = useDeckStore();

		const toast = useToast();

		const importDeckFile = async (file: File): Promise<ImportResult> => {
			const fileContent = await readFile(file);
			const result = deckFileService.fromFile({
				fileContent,
				fileName: file.name,
			});
			deckStore.replace({
				deck: result.deck,
			});

			return result;
		};

		const processUpload = (file: File): void => {
			importDeckFile(file)
				.then((result: ImportResult) => {
					if (result.missing.length > 0) {
						showWarning(
							toast,
							`${result.missing.length} cards could not be imported!`,
							"deck-tool__portal"
						);
					} else {
						showSuccess(
							toast,
							"Successfully imported deck file.",
							"deck-tool__portal"
						);
					}
				})
				.catch((e) => {
					logger.error("Could not read deck file!", e);
					showError(
						toast,
						"Could not read deck file.",
						"deck-tool__portal"
					);
				});
		};

		const openFileDialog = (): void =>
			uploadFile(
				".ydk",
				(files) => {
					if (files != null && files.length > 0) {
						processUpload(files[0]);
					}
				},
				document
			);

		return { openFileDialog };
	},
});
</script>

<template>
	<VDialog max-width="1100">
		<template #activator="{ props: activatorProps }">
			<VBtn
				v-bind="activatorProps"
				:disabled="!essentialDataLoaded"
				prepend-icon="fas fa-file-import"
				color="primary"
				variant="outlined"
			>
				Import
			</VBtn>
		</template>

		<template #default="{ isActive }">
			<VCard
				title="Import Deck"
				subtitle="Import an existing deck from various sources"
			>
				<VCardText>
					<VContainer class="p0">
						<VRow>
							<VCol cols="12" md="6">
								<VCard density="compact">
									<VCardTitle>From a Deck File</VCardTitle>
									<VCardText>
										<p class="mb-3">
											Upload a .ydk deck file created by a
											tool such as EDOPro.
										</p>
										<VFileInput
											label="Deck File"
											accept=".ydk"
											:clearable="false"
											@update:model-value="onYdkFileInput"
										/>
									</VCardText>
								</VCard>
							</VCol>
							<VCol cols="12" md="6">
								<VCard>
									<VCardTitle>From a YDKe URI</VCardTitle>
									<VCardText>
										<p class="mb-3">
											Paste a YDKe URI created by a tool
											such as EDOPro.
										</p>
										<VTextField
											label="YDKe URI"
											@update:model-value="onYdkeUriInput"
										/>
									</VCardText>
								</VCard>
							</VCol>
							<VCol cols="12">
								<VAlert
									v-if="importResultState === 'error'"
									type="error"
								>
									Failed to import the deck. Please check the
									developer console for details.
								</VAlert>
								<VAlert
									v-else-if="
										importResultState === 'missingCards'
									"
									type="warning"
								>
									Not all cards could be imported. Please
									check the imported deck.
								</VAlert>
								<VAlert
									v-else-if="importResultState === 'success'"
									type="success"
								>
									The deck was imported successfully.
								</VAlert>
							</VCol>
						</VRow>
					</VContainer>
				</VCardText>

				<VCardActions>
					<VBtn @click="isActive.value = false">Close Dialog</VBtn>
				</VCardActions>
			</VCard>
		</template>
	</VDialog>
</template>

<script setup lang="ts">
import { VBtn } from "vuetify/components/VBtn";
import { VDialog } from "vuetify/components/VDialog";
import {
	VCard,
	VCardText,
	VCardActions,
	VCardTitle,
} from "vuetify/components/VCard";
import { VFileInput } from "vuetify/components/VFileInput";
import { VTextField } from "vuetify/components/VTextField";
import { VContainer, VRow, VCol } from "vuetify/components/VGrid";
import { VAlert } from "vuetify/components/VAlert";
import type { ImportResult } from "@/core/lib";
import { getLogger } from "@/core/lib";
import { useDeckStore } from "@/application/store/deck";
import { deckFileService } from "@/application/ctx";
import { deckUriEncodingService } from "@/application/ctx";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useDataStore } from "@/application/store/data";

const logger = getLogger("YgoImport");

const { essentialDataLoaded } = storeToRefs(useDataStore());
const deckStore = useDeckStore();

const importResultState = ref<undefined | "success" | "missingCards" | "error">(
	undefined,
);

function handleImport(importResult: Promise<ImportResult>) {
	importResult
		.then((result) => {
			deckStore.replace({
				deck: result.deck,
			});
			if (result.missing.length > 0) {
				importResultState.value = "missingCards";
			} else {
				importResultState.value = "success";
			}
		})
		.catch((e) => {
			logger.error("Could not read deck!", e);
			importResultState.value = "error";
		});
}

function onYdkFileInput(input: File | File[] | undefined) {
	if (input == null) {
		return;
	}
	const file = Array.isArray(input) ? input[0] : input;
	handleImport(
		file.text().then((fileContent) =>
			deckFileService.fromFile({
				fileContent,
				fileName: file.name,
			}),
		),
	);
}

function onYdkeUriInput(text: string) {
	handleImport(
		new Promise((resolve) => {
			resolve({
				deck: deckUriEncodingService.fromUri(text),
				missing: [],
			});
		}),
	);
}
</script>

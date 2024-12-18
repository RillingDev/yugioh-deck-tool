<template>
	<VDialog max-width="1100">
		<template #activator="{ props: activatorProps }">
			<VBtn
				v-bind="activatorProps"
				prepend-icon="fas fa-file-export"
				:disabled="!essentialDataLoaded || deckEmpty"
			>
				Export
			</VBtn>
		</template>

		<template #default="{ isActive }">
			<VCard
				title="Export Deck"
				subtitle="Export the current deck for usage in other tools"
			>
				<VCardText>
					<VContainer class="p0">
						<VRow>
							<VCol cols="12">
								<VCard density="compact">
									<VCardTitle>Deck List</VCardTitle>
									<VCardText>
										<p class="mb-3">
											This text can be shared in chats and
											similar.
										</p>
										<VTextarea
											v-model="deckList"
											label="Deck List"
											:readonly="true"
										/>
									</VCardText>
								</VCard>
							</VCol>

							<VCol cols="12" md="6">
								<VCard density="compact">
									<VCardTitle>Shareable Link</VCardTitle>
									<VCardText>
										<p class="mb-3">
											This link contains the deck and can
											be copied and shared.
										</p>
										<VTextField
											v-model="shareLink"
											label="Shareable Link"
											:readonly="true"
										/>
									</VCardText>
								</VCard>
							</VCol>

							<VCol cols="12" md="6">
								<VCard density="compact">
									<VCardTitle>YDKe URL</VCardTitle>
									<VCardText>
										<p class="mb-3">
											This URI contains the deck and can
											be imported in a tool such as
											EDOPro.
										</p>
										<VTextField
											v-model="ydkeUri"
											label="YDKe Link"
											:readonly="true"
										/>
									</VCardText>
								</VCard>
							</VCol>

							<VCol cols="12" md="6">
								<VCard density="compact">
									<VCardTitle>Deck File</VCardTitle>
									<VCardText>
										<p class="mb-3">
											Download the deck as a file which
											can be imported in a tool such as
											EDOPro.
										</p>
										<VBtn
											color="primary"
											prepend-icon="fas fa-download"
											:href="deckFileHref"
											download
										>
											Download Deck File
										</VBtn>
									</VCardText>
								</VCard>
							</VCol>

							<VCol cols="12" md="6">
								<VCard density="compact">
									<VCardTitle>Screenshot</VCardTitle>
									<VCardText>
										<p class="mb-3">
											Create a screenshot of the deck that
											will look roughly like in the deck
											tool.
										</p>
										<VAlert
											v-if="screenshotState === 'error'"
											type="error"
											class="mb-3"
										>
											Failed to create a screenshot.
											Please check the developer console
											for details.
										</VAlert>
										<VAlert
											v-else-if="
												screenshotState === 'inProgress'
											"
											type="info"
											class="mb-3"
										>
											Please wait while the screenshot is
											being created.
										</VAlert>
										<VBtn
											color="primary"
											prepend-icon="fas fa-image"
											@click="onScreenshot"
										>
											Screenshot Deck
										</VBtn>
									</VCardText>
								</VCard>
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
import { VTextField } from "vuetify/components/VTextField";
import { VContainer, VRow, VCol } from "vuetify/components/VGrid";
import { VTextarea } from "vuetify/components/VTextarea";
import { VAlert } from "vuetify/components/VAlert";
import { DeckFileService, getLogger } from "@/core/lib";
import { useDeckStore } from "@/application/store/deck";
import { deckFileService } from "@/application/ctx";
import { deckUriEncodingService } from "@/application/ctx";
import { computed, ref } from "vue";
import { deckUrlController } from "@/application/ctx";
import { storeToRefs } from "pinia";
import { deckExportService } from "@/application/ctx";
import { createScreenshot } from "@/application/composition/io/createScreenshot";
import { useObjectUrl } from "@vueuse/core";
import { useDataStore } from "@/application/store/data";

const logger = getLogger("YgoExport");

const { deckEmpty } = storeToRefs(useDeckStore());
const { essentialDataLoaded } = storeToRefs(useDataStore());

const { deck } = storeToRefs(useDeckStore());

const deckList = computed(() => deckExportService.toShareableText(deck.value));

const shareLink = computed(() => deckUrlController.getShareLink(deck.value));
const ydkeUri = computed(() => deckUriEncodingService.toUri(deck.value));

const deckFile = computed(() => {
	const { fileContent, fileName } = deckFileService.toFile(deck.value);
	return new File([fileContent], fileName, {
		type: DeckFileService.DECK_FILE_MIME_TYPE,
	});
});
const deckFileHref = useObjectUrl(deckFile);

const screenshotState = ref<undefined | "inProgress" | "error">(undefined);
function onScreenshot(): void {
	const deckEl = document.getElementById("deckToolDeck");
	if (deckEl == null) {
		throw new TypeError("Could not get deck element!");
	}

	//window.scrollTo(0, 0); // Reset scroll position as this may affect the screenshot rendering.
	// TODO verify
	screenshotState.value = "inProgress";
	createScreenshot(deckEl, deck.value.name ?? "Deck Screenshot", {
		//scale: 2,
		//onclone: (doc) => {
		//	doc.body.classList.add("deck-tool__screenshot-context");
		//},
		useCORS: true, // Image resources are hosted on separate origin.
	})
		.then((file) => {
			screenshotState.value = undefined;
			// Cleanup is probably not needed, as usually only a few calls are being made to this
			window.open(URL.createObjectURL(file), "_blank");
		})
		.catch((err) => {
			logger.error("Could not create screenshot!", err);
		});
}
</script>

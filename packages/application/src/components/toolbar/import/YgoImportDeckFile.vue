<template>
    <BDropdownItemButton @click="() => openFileDialog()">
        <span class="fas fa-file fas-in-button" aria-hidden="true"></span>
        From .ydk Deck File
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import type { DeckFileService, ImportResult } from "@yugioh-deck-tool/core";
import { getLogger, TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../../../inversify.config";
import { BDropdownItemButton } from "bootstrap-vue";
import { readFile, uploadFile } from "@yugioh-deck-tool/browser-common";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { useAppStore } from "../../../composition/state/useAppStore";
import {
    showError,
    showSuccess,
    showWarning,
} from "../../../composition/feedback";

const deckFileService = applicationContainer.get<DeckFileService>(
    TYPES.DeckFileService
);

const logger = getLogger("YgoImportDeckFile");

export default defineComponent({
    props: {},
    emits: [],
    components: { BDropdownItemButton },
    setup(props, context) {
        const importDeckFile = async (file: File): Promise<ImportResult> => {
            const fileContent = await readFile(file);
            const result = deckFileService.fromFile({
                fileContent,
                fileName: file.name,
            });
            useAppStore(context).commit(DECK_REPLACE, {
                deck: result.deck,
            });

            return result;
        };

        const processUpload = (file: File): void => {
            importDeckFile(file)
                .then((result: ImportResult) => {
                    if (result.missing.length > 0) {
                        showWarning(
                            context,
                            `${result.missing.length} cards could not be imported!`,
                            "deck-tool__portal"
                        );
                    } else {
                        showSuccess(
                            context,
                            "Successfully imported deck file.",
                            "deck-tool__portal"
                        );
                    }
                })
                .catch((e) => {
                    logger.error("Could not read deck file!", e);
                    showError(
                        context,
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

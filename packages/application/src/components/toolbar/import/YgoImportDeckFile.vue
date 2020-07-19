<template>
    <BDropdownItemButton @click="() => openFileDialog()">
        <span class="fas fa-file fas-in-button" aria-hidden="true"></span>
        From .ydk Deck File
    </BDropdownItemButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
    DeckFileService,
    getLogger,
    ImportResult,
} from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItemButton } from "bootstrap-vue";
import { readFile, uploadFile } from "../../../../../ui/src/main";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { appStore } from "../../../composition/state/appStore";
import {
    showError,
    showSuccess,
    showWarning,
} from "../../../composition/feedback";

const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);

const logger = getLogger("YgoImportDeckFile");

export default defineComponent({
    components: { BDropdownItemButton },
    props: {},
    setup: (props, context) => {
        const importDeckFile = async (file: File): Promise<ImportResult> => {
            const fileContent = await readFile(file);
            const result = deckFileService.fromFile({
                fileContent,
                fileName: file.name,
            });
            appStore(context).commit(DECK_REPLACE, {
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

        const openFileDialog = (): void => {
            uploadFile(
                ".ydk",
                (files) => {
                    if (files != null && files.length > 0) {
                        processUpload(files[0]);
                    }
                },
                document
            );
        };

        return { openFileDialog };
    },
});
</script>

<template>
    <div>
        <BDropdownItem @click="() => onUploadClick()">
            From .ydk Deck File
        </BDropdownItem>
    </div>
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
import { BDropdownItem } from "bootstrap-vue";
import { readFile, uploadFile } from "../../../../../ui/src/main";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { appStore } from "../../../composition/appStore";

const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);

const logger = getLogger("YgoImportDeckFile");

export default defineComponent({
    components: { BDropdownItem },
    props: {},
    setup: function (props, context) {
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
                        context.root.$bvToast.toast(
                            `${result.missing.length} cards could not be imported!`,
                            {
                                variant: "warning",
                                noCloseButton: true,
                                toastClass: "deck-tool__portal",
                            }
                        );
                    } else {
                        context.root.$bvToast.toast(
                            "Successfully imported deck file!",
                            {
                                variant: "success",
                                noCloseButton: true,
                                toastClass: "deck-tool__portal",
                            }
                        );
                    }
                })
                .catch((err) => logger.error("Could not read file!", err));
        };

        const onUploadClick = (): void => {
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

        return { onUploadClick };
    },
});
</script>

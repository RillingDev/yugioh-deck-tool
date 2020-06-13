<template>
    <div>
        <BDropdownItem @click="() => openModal()">
            From .ydk Deck File
        </BDropdownItem>
        <BModal
            ref="modal"
            modal-class="deck-tool__portal"
            title="Import Deck From .ydk Deck File"
            hide-footer
        >
            <div class="form-group">
                <input
                    type="file"
                    class="form-control-file"
                    title="Deck File Upload"
                    accept=".ydk"
                    @input="(e) => onFileUpload(e)"
                />
            </div>
        </BModal>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { DeckFileService, getLogger } from "../../../../../core/src/main";
import { applicationContainer } from "../../../inversify.config";
import { APPLICATION_TYPES } from "../../../types";
import { BDropdownItem, BModal } from "bootstrap-vue";
import { readFile } from "../../../../../ui/src/main";
import { DECK_REPLACE } from "../../../store/modules/deck";
import { appStore } from "../../../composition/appStore";

const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);

const logger = getLogger("YgoImportDeckFile");

export default defineComponent({
    components: { BDropdownItem, BModal },
    props: {},
    setup: function (props, context) {
        const modal = ref<BModal>();

        const openModal = (): void => modal.value?.show();

        const readDeckFile = async (file: File) => {
            const fileContent = await readFile(file);
            const result = deckFileService.fromFile({
                fileContent,
                fileName: file.name,
            });
            appStore(context).commit(DECK_REPLACE, {
                deck: result.deck,
            });
        };
        const onFileUpload = (e: Event): void => {
            const files = (e.target as HTMLInputElement).files;
            if (files != null && files.length > 0) {
                readDeckFile(files[0])
                    .then(() => modal.value?.hide())
                    .catch((err) => logger.error("Could not read file!", err));
            }
        };

        return { modal, openModal, onFileUpload };
    },
});
</script>

<template>
    <div>
        <BDropdownItem @click="() => openModal()">
            From .ydk Deck File
        </BDropdownItem>
        <BModal
            ref="modal"
            modal-class="deck-tool__modal"
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

const deckFileService = applicationContainer.get<DeckFileService>(
    APPLICATION_TYPES.DeckFileService
);

const logger = getLogger("YgoImportDeckFile");

export default defineComponent({
    components: { BDropdownItem, BModal },
    props: {},
    setup: function (props, context) {
        const modal = ref<BModal>();

        const openModal = () => modal.value.show();

        const onFileUpload = (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if (files.length > 0) {
                const file = files[0];

                readFile(file)
                    .then((fileContent) => {
                        const result = deckFileService.fromFile({
                            fileContent,
                            fileName: file.name,
                        });
                        context.root.$store.commit(DECK_REPLACE, {
                            deck: result.deck,
                        });
                        modal.value.hide();
                    })
                    .catch((err) => logger.error("Could not read file!", err));
            }
        };

        return { modal, openModal, onFileUpload };
    },
});
</script>

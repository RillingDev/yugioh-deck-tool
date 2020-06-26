<template>
    <div class="toolbar form-group">
        <div role="group" class="toolbar__items">
            <BDropdown
                variant="primary"
                text="Import"
                id="deckImport"
                :disabled="!loaded"
            >
                <YgoImportFile />
                <YgoImportYdkeUrl />
            </BDropdown>

            <BDropdown
                variant="primary"
                text="Export"
                id="deckExport"
                :disabled="!loaded"
            >
                <YgoExportDeckFile />
                <YgoExportDeckYdkeUrl />
                <YgoExportDeckList />
                <YgoExportShareLink />
            </BDropdown>

            <BDropdown
                variant="primary"
                text="Edit"
                id="deckEdit"
                :disabled="!loaded"
            >
                <YgoDeckSortButton />
                <YgoDeckShuffleButton />
                <YgoDeckClearButton />
            </BDropdown>
            <BDropdown
                variant="primary"
                text="Tools"
                id="deckTools"
                :disabled="!loaded"
            >
                <YgoDrawSim />
                <YgoRandomizer />
            </BDropdown>
            <YgoBuyLink />
        </div>

        <div class="toolbar__items">
            <YgoDeckName />
            <YgoFormat />
            <YgoCurrency />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { BDropdown, BDropdownItem } from "bootstrap-vue";
import YgoFormat from "./YgoFormat.vue";
import YgoDeckName from "./YgoDeckName.vue";
import YgoCurrency from "./YgoCurrency.vue";
import YgoBuyLink from "./YgoBuyLink.vue";
import YgoRandomizer from "./tools/YgoRandomizer.vue";
import YgoDrawSim from "./tools/YgoDrawSim.vue";
import YgoDeckSortButton from "./edit/YgoDeckSortButton.vue";
import YgoDeckShuffleButton from "./edit/YgoDeckShuffleButton.vue";
import YgoDeckClearButton from "./edit/YgoDeckClearButton.vue";
import YgoImportFile from "./import/YgoImportDeckFile.vue";
import YgoImportYdkeUrl from "./import/YgoImportYdkeUrl.vue";
import YgoExportDeckFile from "./export/YgoExportDeckFile.vue";
import YgoExportDeckYdkeUrl from "./export/YgoExportDeckYdkeUrl.vue";
import YgoExportDeckList from "./export/YgoExportDeckList.vue";
import YgoExportShareLink from "./export/YgoExportShareLink.vue";
import { dataLoaded } from "../../composition/dataLoaded";

export default defineComponent({
    components: {
        YgoFormat,
        YgoDeckName,
        YgoCurrency,
        YgoBuyLink,
        YgoRandomizer,
        YgoDrawSim,
        BDropdown,
        BDropdownItem,
        YgoDeckSortButton,
        YgoDeckShuffleButton,
        YgoDeckClearButton,
        YgoImportFile,
        YgoImportYdkeUrl,
        YgoExportDeckFile,
        YgoExportDeckYdkeUrl,
        YgoExportDeckList,
        YgoExportShareLink,
    },
    props: {},
    setup(props, context) {
        const loaded = dataLoaded(context);

        return { loaded };
    },
});
</script>

<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__portal {
    .toolbar__items {
        display: flex;
        flex-direction: column;

        @include screen(min, lg) {
            flex-direction: row;
        }

        > * {
            width: 100% !important;
            margin-bottom: 0.5rem;

            @include screen(min, lg) {
                width: auto;
                &:not(:first-child) {
                    margin-left: 0.25rem;
                }
                &:not(:last-child) {
                    margin-right: 0.25rem;
                }
            }
        }
    }
}
</style>

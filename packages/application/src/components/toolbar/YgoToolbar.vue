<template>
    <div class="toolbar form-group">
        <div role="group" class="toolbar__items">
            <BDropdown
                id="deckImport"
                :disabled="!essentialDataLoaded"
                variant="primary"
            >
                <template v-slot:button-content>
                    <span
                        class="fas fas-in-button fa-file-import"
                        aria-hidden="true"
                    ></span>
                    Import
                </template>
                <YgoImportFile />
                <YgoImportYdkeUrl />
            </BDropdown>
            <BDropdown
                variant="primary"
                id="deckExport"
                :disabled="!essentialDataLoaded || empty"
            >
                <template v-slot:button-content>
                    <span
                        class="fas fas-in-button fa-file-export"
                        aria-hidden="true"
                    ></span>
                    Export
                </template>
                <YgoExportDeckFile />
                <YgoExportDeckYdkeUrl />
                <YgoExportDeckList />
                <YgoExportShareLink />
                <YgoExportScreenshot />
            </BDropdown>
            <BDropdown
                variant="primary"
                id="deckEdit"
                :disabled="!essentialDataLoaded || empty"
            >
                <template v-slot:button-content>
                    <span
                        class="fas fas-in-button fa-edit"
                        aria-hidden="true"
                    ></span>
                    Edit
                </template>
                <YgoDeckSortButton />
                <YgoDeckShuffleButton />
                <YgoDeckClearButton />
            </BDropdown>
            <BDropdown
                id="deckTools"
                :disabled="!essentialDataLoaded"
                variant="primary"
            >
                <template v-slot:button-content>
                    <span
                        class="fas fas-in-button fa-magic"
                        aria-hidden="true"
                    ></span>
                    Tools
                </template>
                <YgoDrawSim />
                <BDropdownDivider />
                <YgoRandomizer />
            </BDropdown>
            <YgoBuyLink />
        </div>

        <div class="toolbar__items" role="group">
            <YgoDeckName class="w-100" />
            <YgoFormat class="w-100" />
            <YgoCurrency class="w-100" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { BDropdown, BDropdownDivider } from "bootstrap-vue";
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
import YgoExportScreenshot from "./export/YgoExportScreenshot.vue";
import { useDeckEmpty } from "../../composition/state/useDeckEmpty";
import { useEssentialDataLoaded } from "../../composition/loading";

export default defineComponent({
    props: {},
    emits: [],
    components: {
        YgoFormat,
        YgoDeckName,
        YgoCurrency,
        YgoBuyLink,
        YgoRandomizer,
        YgoDrawSim,
        BDropdown,
        BDropdownDivider,
        YgoDeckSortButton,
        YgoDeckShuffleButton,
        YgoDeckClearButton,
        YgoImportFile,
        YgoImportYdkeUrl,
        YgoExportDeckFile,
        YgoExportDeckYdkeUrl,
        YgoExportDeckList,
        YgoExportShareLink,
        YgoExportScreenshot,
    },
    setup(props, context) {
        const essentialDataLoaded = useEssentialDataLoaded(context);
        const empty = useDeckEmpty(context);

        return { essentialDataLoaded, empty };
    },
});
</script>

<style lang="scss">
@import "../../../../browser-common/src/styles/variables";
@import "../../../../browser-common/src/styles/mixins";

.deck-tool {
    .toolbar__items {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        gap: $margin-md;

        margin-bottom: $margin-md;

        @include screen-min-width(lg) {
            flex-direction: row;
        }
    }
}
</style>

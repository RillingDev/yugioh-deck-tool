<template>
    <div class="toolbar form-group">
        <ul role="group" class="toolbar__items">
            <li>
                <BDropdown
                    variant="primary"
                    id="deckImport"
                    :disabled="!loaded"
                    block
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
            </li>
            <li>
                <BDropdown
                    variant="primary"
                    id="deckExport"
                    :disabled="!loaded"
                    block
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
            </li>
            <li>
                <BDropdown
                    variant="primary"
                    id="deckEdit"
                    :disabled="!loaded"
                    block
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
            </li>
            <li>
                <BDropdown
                    variant="primary"
                    id="deckTools"
                    :disabled="!loaded"
                    block
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
            </li>
            <li>
                <YgoBuyLink class="btn-block" />
            </li>
        </ul>

        <ul class="toolbar__items toolbar__items--lg" role="group">
            <li>
                <YgoDeckName />
            </li>
            <li>
                <YgoFormat />
            </li>
            <li>
                <YgoCurrency />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { BDropdown, BDropdownDivider, BDropdownItem } from "bootstrap-vue";
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
import YgoExportScreenshot from "./export/YgoExportScreenshot.vue";

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
    props: {},
    setup(props, context) {
        const loaded = dataLoaded(context);

        return { loaded };
    },
});
</script>

<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../styles/bootstrap/variables";
@import "../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__portal {
    .toolbar__items {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        list-style: none;
        padding: 0;
        margin: 0;

        @include screen(min, lg) {
            flex-direction: row;
        }

        > * {
            width: 100%;
            margin-bottom: $form-group-margin-bottom/2;
            @include screen(min, lg) {
                &:not(:first-child) {
                    margin-left: $form-grid-gutter-width/2;
                }
                &:not(:last-child) {
                    margin-right: $form-grid-gutter-width/2;
                }
            }
        }

        &:not(.toolbar__items--lg) > * {
            @include screen(min, lg) {
                width: auto;
            }
        }
    }
}
</style>

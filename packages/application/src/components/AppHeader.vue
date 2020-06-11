<template>
    <div class="row">
        <div class="col-md-12 col-lg-4">
            <div class="form-group">
                <YgoDeckName />
            </div>
            <div class="form-group">
                <YgoFormat />
            </div>
            <hr />
            <BDropdown text="Import Deck" id="deckImport" :disabled="!loaded">
                <YgoImportFile />
                <BDropdownItem>From YDKe URL</BDropdownItem>
            </BDropdown>

            <BDropdown text="Export Deck" id="deckExport" :disabled="!loaded">
                <BDropdownItem>To .ydk Deck File</BDropdownItem>
                <BDropdownItem>To YDKe URL in Clipboard</BDropdownItem>
                <BDropdownItem>To Deck List in Clipboard</BDropdownItem>
                <BDropdownItem
                    >To Deck Tool Shareable Link in Clipboard
                </BDropdownItem>
            </BDropdown>
        </div>
        <div class="col-md-6 col-lg-4">
            <YgoDeckSortButton />
            <YgoDeckShuffleButton />
            <YgoDeckClearButton />
        </div>
        <div class="col-md-6 col-lg-4">
            <YgoDrawSim />
            <YgoRandomizer />
            <hr />
            <YgoCurrency />
            <YgoBuyLink />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { DECK_SHUFFLE, DECK_SORT } from "../store/modules/deck";
import YgoDrawSim from "./header/YgoDrawSim.vue";
import YgoRandomizer from "./header/YgoRandomizer.vue";
import { BDropdown, BDropdownItem } from "bootstrap-vue";
import YgoFormat from "./header/YgoFormat.vue";
import YgoDeckName from "./header/YgoDeckName.vue";
import YgoCurrency from "./header/YgoCurrency.vue";
import YgoBuyLink from "./header/YgoBuyLink.vue";
import YgoImportFile from "./header/import/YgoImportDeckFile.vue";
import { appStore } from "../composition/appStore";
import { dataLoaded } from "../composition/dataLoaded";
import YgoDeckSortButton from "./header/YgoDeckSortButton.vue";
import YgoDeckShuffleButton from "./header/YgoDeckShuffleButton.vue";
import YgoDeckClearButton from "./header/YgoDeckClearButton.vue";

export default defineComponent({
    components: {
        YgoImportFile,
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
    },
    props: {},
    setup: (props, context) => {
        const loaded = dataLoaded(context);

        return {
            loaded,
        };
    },
});
</script>

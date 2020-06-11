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
            <BDropdown text="Import Deck" id="deckImport">
                <YgoImportFile />
                <BDropdownItem>From YDKe URL</BDropdownItem>
            </BDropdown>

            <BDropdown text="Export Deck" id="deckExport">
                <BDropdownItem>To .ydk Deck File</BDropdownItem>
                <BDropdownItem>To YDKe URL in Clipboard</BDropdownItem>
                <BDropdownItem>To Deck List in Clipboard</BDropdownItem>
                <BDropdownItem
                    >To Deck Tool Shareable Link in Clipboard
                </BDropdownItem>
            </BDropdown>
        </div>
        <div class="col-md-6 col-lg-4">
            <button
                class="btn btn-primary btn-sm"
                title="Sort Deck"
                @click="() => sort()"
            >
                Sort
            </button>
            <button
                class="btn btn-primary btn-sm"
                title="Shuffle Deck"
                @click="() => shuffle()"
            >
                Shuffle
            </button>
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
    },
    props: {},
    setup: function (props, context) {
        const sort = () => appStore(context).commit(DECK_SORT);
        const shuffle = () => appStore(context).commit(DECK_SHUFFLE);

        return {
            sort,
            shuffle,
        };
    },
});
</script>

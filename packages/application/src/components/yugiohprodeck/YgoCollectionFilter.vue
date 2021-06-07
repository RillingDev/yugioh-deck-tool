<template>
    <div class="form-group collection-filter">
        <BFormCheckbox v-model="checked" @input="() => reload()"
            >Use User Collection
        </BFormCheckbox>
        <button
            class="btn btn-primary btn-sm"
            title="Reload the User Collection contents"
            :disabled="!checked"
            @click="() => reload()"
        >
            <span class="fas fa-sync fas-in-button" aria-hidden="true"></span>
            Reload
        </button>
    </div>
</template>

<script lang="ts">
import type { CardCountFunction } from "@yugioh-deck-tool/core";
import { getLogger } from "@yugioh-deck-tool/core";
import { computed, defineComponent, ref, watch } from "@vue/composition-api";
import { applicationContainer } from "../../inversify.config";
import { BFormCheckbox } from "bootstrap-vue";
import { showError } from "../../composition/feedback";
import { APPLICATION_TYPES } from "../../types";
import type { YgoprodeckController } from "../../controller/YgoprodeckController";
import type { YgoprodeckService } from "../../../../ygoprodeck/src/main";
import { YGOPRODECK_TYPES } from "../../../../ygoprodeck/src/main";
import { SET_CARD_COUNT_FUNCTION } from "../../store/modules/collection";
import { startLoading, stopLoading } from "../../composition/state/loading";
import { useStore } from "../../store/store";

const ygoprodeckService = applicationContainer.get<YgoprodeckService>(
    YGOPRODECK_TYPES.YgoprodeckService
);
const ygoprodeckController = applicationContainer.get<YgoprodeckController>(
    APPLICATION_TYPES.YgoprodeckController
);

const logger = getLogger("YgoCollectionFilter");

/**
 * Should only be mounted if running in ygoprodeck env and having credentials available.
 */
export default defineComponent({
    components: { BFormCheckbox },
    props: {},
    emits: ["change"],
    setup(props, context) {
        const cardCountFunction = computed<CardCountFunction | null>({
            get: () => useStore().state.collection.cardCountFunction,
            set: (newCardCountFunction) =>
                useStore().commit(SET_CARD_COUNT_FUNCTION, {
                    cardCountFunction: newCardCountFunction,
                }),
        });

        const checked = ref<boolean>(cardCountFunction.value != null);

        // TODO find a way to link ref with vuex state without watch
        watch(
            () => cardCountFunction.value,
            () => {
                checked.value = cardCountFunction.value != null;
            }
        );

        const loadCollection = async (): Promise<CardCountFunction | null> => {
            if (!checked.value) {
                return null;
            }
            return ygoprodeckService.getCollectionCardCountFunction(
                ygoprodeckController.getCredentials()
            );
        };
        const reload = (): void => {
            startLoading()
                .then(() => loadCollection())
                .then((loadedCollectionCardCountFunction) => {
                    cardCountFunction.value = loadedCollectionCardCountFunction;
                })
                .then(() => context.emit("change"))
                .catch((err) => {
                    logger.error("Could load user collection!", err);
                    showError(
                        context,
                        "Could load user collection!",
                        "deck-tool__portal"
                    );
                })
                .finally(() => stopLoading());
        };

        return { checked, reload };
    },
});
</script>

<style lang="scss">
@import "~@yugioh-deck-tool/browser-common/src/styles/variables";
@import "~@yugioh-deck-tool/browser-common/src/styles/mixins";

.deck-tool {
    .collection-filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>

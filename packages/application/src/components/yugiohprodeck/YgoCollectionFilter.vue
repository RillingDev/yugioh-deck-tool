<template>
    <div class="form-group collection-filter">
        <BFormCheckbox v-model="checked" @input="() => reload()"
            >Use User Collection
        </BFormCheckbox>
        <button
            @click="() => reload()"
            class="btn btn-primary btn-sm"
            title="Reload the User Collection contents"
            :disabled="!checked"
        >
            <span class="fas fa-sync fas-in-button" aria-hidden="true"></span>
            Reload
        </button>
    </div>
</template>

<script lang="ts">
import type {
    CardPredicate,
    CardPredicateService,
} from "../../../../core/src/main";
import { getLogger, TYPES } from "../../../../core/src/main";
import { defineComponent, ref } from "@vue/composition-api";
import { applicationContainer } from "../../inversify.config";
import { BFormCheckbox } from "bootstrap-vue";
import { showError } from "../../composition/feedback";
import { APPLICATION_TYPES } from "../../types";
import type { YgoprodeckController } from "../../controller/YgoprodeckController";
import type { YgoprodeckService } from "../../../../ygoprodeck/src/main";
import { YGOPRODECK_TYPES } from "../../../../ygoprodeck/src/main";

const ygoprodeckService = applicationContainer.get<YgoprodeckService>(
    YGOPRODECK_TYPES.YgoprodeckService
);
const cardPredicateService = applicationContainer.get<CardPredicateService>(
    TYPES.CardPredicateService
);
const ygoprodeckController = applicationContainer.get<YgoprodeckController>(
    APPLICATION_TYPES.YgoprodeckController
);

const logger = getLogger("YgoCollectionFilter");

/**
 * Should only be mounted if running in ygoprodeck env and having credentials available.
 */
export default defineComponent({
    props: {},
    components: { BFormCheckbox },
    setup(props, context) {
        const checked = ref<boolean>(false);

        const createPredicate = async (): Promise<CardPredicate> => {
            if (!checked.value) {
                return () => true;
            }
            const collectionCardCountFunction = await ygoprodeckService.getCollectionCardCountFunction(
                ygoprodeckController.getCredentials()
            );
            return cardPredicateService.createAtLeastOneAvailablePredicate(
                collectionCardCountFunction
            );
        };
        const reload = (): void => {
            createPredicate()
                .then((predicate) => context.emit("change", predicate))
                .catch((err) => {
                    logger.error("Could load user collection!", err);
                    showError(
                        context,
                        "Could load user collection!",
                        "deck-tool__portal"
                    );
                });
        };

        return { checked, reload };
    },
});
</script>

<style lang="scss">
@import "../../../../browser-common/src/styles/variables";
@import "../../../../browser-common/src/styles/mixins";

.deck-tool {
    .collection-filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>

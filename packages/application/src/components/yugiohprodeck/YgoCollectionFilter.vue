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
    EnvironmentConfig,
    YgoprodeckService,
} from "../../../../core/src/main";
import {
    Environment,
    getLogger,
    TYPES,
    YGOPRODECK_TYPES,
} from "../../../../core/src/main";
import { defineComponent, ref } from "@vue/composition-api";
import { applicationContainer } from "../../inversify.config";
import { BFormCheckbox } from "bootstrap-vue";
import { showError } from "../../composition/feedback";
import type { FilterController } from "../../controller/FilterController";
import { APPLICATION_TYPES } from "../../types";

const ygoprodeckService = applicationContainer.get<YgoprodeckService>(
    YGOPRODECK_TYPES.YgoprodeckService
);
const environmentConfig = applicationContainer.get<EnvironmentConfig>(
    TYPES.EnvironmentConfig
);
const filterController = applicationContainer.get<FilterController>(
    APPLICATION_TYPES.FilterController
);

const logger = getLogger("YgoCollectionFilter");

export default defineComponent({
    props: {},
    components: { BFormCheckbox },
    setup(props, context) {
        if (environmentConfig.getEnvironment() != Environment.YGOPRODECK) {
            throw new Error(
                "Component cannot be used outside of YGOPRODECK environment."
            );
        }

        const checked = ref<boolean>(false);

        const createPredicate = async (): Promise<CardPredicate> => {
            if (!checked.value) {
                return () => true;
            }
            const cards = await ygoprodeckService.getCardCollectionPasscodes(
                "foo",
                "bar"
            );
            return filterController.createPassCodePredicate(cards);
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

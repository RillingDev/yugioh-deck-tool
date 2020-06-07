<template>
    <VSelect
        :options="currencies"
        :get-option-key="(currency) => currency.name"
        :get-option-label="(currency) => currency.name"
        v-model="currency"
        :clearable="false"
        title="Active Currency"
    ></VSelect>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";

import VSelect from "vue-select";
import { Currency, DEFAULT_CURRENCY_ARR } from "yugioh-deck-tool-core/src/main";
import { CURRENCY_UPDATE } from "@/store/modules/currency";

export default defineComponent({
    components: { VSelect },
    props: {},
    setup: function (props, context) {
        const currencies = Object.values(DEFAULT_CURRENCY_ARR);
        const currency = computed<Currency>({
            get() {
                return context.root.$store.state.currency.active;
            },
            set(newCurrency) {
                context.root.$store.commit(CURRENCY_UPDATE, {
                    currency: newCurrency,
                });
            },
        });

        return { currencies, currency };
    },
});
</script>

<template>
    <VSelect
        :options="currencies"
        :get-option-key="(currency) => currency.name"
        :get-option-label="(currency) => currency.name"
        v-model="currency"
        :clearable="false"
        :searchable="false"
        title="Active Currency"
    ></VSelect>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";

import VSelect from "vue-select";
import type { Currency } from "../../../../core/src/main";
import { DEFAULT_CURRENCY_ARR } from "../../../../core/src/main";
import { CURRENCY_UPDATE } from "../../store/modules/currency";
import { appStore } from "../../composition/state/appStore";

export default defineComponent({
    components: { VSelect },
    props: {},
    setup: (props, context) => {
        const currencies = Object.values(DEFAULT_CURRENCY_ARR);
        const currency = computed<Currency>({
            get() {
                return appStore(context).state.currency.active;
            },
            set(newCurrency) {
                appStore(context).commit(CURRENCY_UPDATE, {
                    currency: newCurrency,
                });
            },
        });

        return { currencies, currency };
    },
});
</script>

<template>
    <VSelect
        :options="currencies"
        :get-option-key="(currentCurrency) => currentCurrency.name"
        :get-option-label="(currentCurrency) => currentCurrency.name"
        v-model="currency"
        :clearable="false"
        :searchable="false"
        title="Active Currency"
    ></VSelect>
</template>

<script lang="ts">
import { computed, defineComponent, readonly } from "@vue/composition-api";

import VSelect from "vue-select";
import type { Currency } from "@yugioh-deck-tool/core";
import { DEFAULT_CURRENCY_ARR } from "@yugioh-deck-tool/core";
import { CURRENCY_UPDATE } from "../../store/modules/currency";
import { useAppStore } from "../../composition/state/useAppStore";

export default defineComponent({
    props: {},
    emits: [],
    components: { VSelect },
    setup(props, context) {
        const currencies = readonly<Currency[]>(
            Object.values(DEFAULT_CURRENCY_ARR)
        );
        const currency = computed<Currency>({
            get: () => useAppStore(context).state.currency.active,
            set: (newCurrency) =>
                useAppStore(context).commit(CURRENCY_UPDATE, {
                    currency: newCurrency,
                }),
        });

        return { currencies, currency };
    },
});
</script>

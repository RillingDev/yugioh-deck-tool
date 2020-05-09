import {
    Currency,
    DEFAULT_CURRENCY_ARR,
} from "../../../../core/src/core/model/price/Currency";
import { Module } from "vuex";

export const CURRENCY_UPDATE = "CURRENCY_UPDATE";

export interface CurrencyState {
    active: Currency;
}

export const currencyModule: Module<CurrencyState, CurrencyState> = {
    state: () => {
        return {
            active: DEFAULT_CURRENCY_ARR[0],
        };
    },
    mutations: {
        [CURRENCY_UPDATE](state, payload: { currency: Currency }) {
            state.active = payload.currency;
        },
    },
};

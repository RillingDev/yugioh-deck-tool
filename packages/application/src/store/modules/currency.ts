import type { Currency } from "@yugioh-deck-tool/core";
import { DEFAULT_CURRENCY_ARR } from "@yugioh-deck-tool/core";
import type { Module } from "vuex";
import type { AppState } from "../AppState";

export const CURRENCY_UPDATE = "CURRENCY_UPDATE";

export interface CurrencyState {
	active: Currency;
}

export const currencyModule: Module<CurrencyState, AppState> = {
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

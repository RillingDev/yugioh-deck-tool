import type { ComputedRef } from "@vue/composition-api";
import { computed } from "@vue/composition-api";
import { SET_LOADING } from "../../store/modules/data";
import { useStore } from "../../store/store";

export const useEssentialDataLoaded = (): ComputedRef<boolean> =>
    computed<boolean>(() => useStore().state.data.essentialDataLoaded);

export const startLoading = (): Promise<void> =>
    Promise.resolve().then(() =>
        useStore().commit(SET_LOADING, { loading: true })
    );

export const stopLoading = (): void =>
    useStore().commit(SET_LOADING, { loading: false });

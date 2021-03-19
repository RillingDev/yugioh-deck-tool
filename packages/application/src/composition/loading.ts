import type { ComputedRef, SetupContext } from "@vue/composition-api";
import { computed } from "@vue/composition-api";
import { useAppStore } from "./state/useAppStore";
import { SET_LOADING } from "../store/modules/data";

export const useEssentialDataLoaded = (
    context: SetupContext
): ComputedRef<boolean> =>
    computed<boolean>(
        () => useAppStore(context).state.data.essentialDataLoaded
    );

export const startLoading = (context: SetupContext): Promise<void> =>
    Promise.resolve().then(() =>
        useAppStore(context).commit(SET_LOADING, { loading: true })
    );

export const stopLoading = (context: SetupContext): void =>
    useAppStore(context).commit(SET_LOADING, { loading: false });

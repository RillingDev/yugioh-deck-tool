import type { SetupContext } from "@vue/composition-api";
import { useAppStore } from "./state/useAppStore";
import { SET_DATA_LOADED } from "../store/modules/data";

export const startLoading = (context: SetupContext): Promise<void> =>
    Promise.resolve().then(() =>
        useAppStore(context).commit(SET_DATA_LOADED, { loaded: false })
    );

export const stopLoading = (context: SetupContext): void =>
    useAppStore(context).commit(SET_DATA_LOADED, { loaded: true });

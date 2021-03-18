import type { ComputedRef, SetupContext } from "@vue/composition-api";
import { computed } from "@vue/composition-api";
import { useAppStore } from "./useAppStore";

export const useDataLoaded = (context: SetupContext): ComputedRef<boolean> =>
    computed<boolean>(() => useAppStore(context).state.data.loaded);

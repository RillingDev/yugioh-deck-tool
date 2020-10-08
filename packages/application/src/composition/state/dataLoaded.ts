import type { ComputedRef, SetupContext } from "@vue/composition-api";
import { computed } from "@vue/composition-api";
import { appStore } from "./appStore";

export const dataLoaded = (context: SetupContext): ComputedRef<boolean> =>
    computed<boolean>(() => appStore(context).state.data.loaded);

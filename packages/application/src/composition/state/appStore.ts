import { SetupContext } from "@vue/composition-api";
import store from "../../store/store";

type AppStore = typeof store;

export const appStore = (context: SetupContext): AppStore =>
    context.root.$store as AppStore;

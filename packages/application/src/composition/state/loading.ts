import { SET_LOADING } from "../../store/modules/data";
import { useStore } from "../../store/store";

export const startLoading = (): Promise<void> =>
    Promise.resolve().then(() =>
        useStore().commit(SET_LOADING, { loading: true })
    );

export const stopLoading = (): void =>
    useStore().commit(SET_LOADING, { loading: false });

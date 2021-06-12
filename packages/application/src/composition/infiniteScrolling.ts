import { debounce } from "lodash";
import type { Ref } from "@vue/composition-api";
import { ref } from "@vue/composition-api";

const SCROLL_DEBOUNCE_TIMEOUT = 100;

/**
 * Primitive infinite scroll utility.
 * Provides a reactive limit that is increased once a scroll event is triggered that moves is nearing the bottom end of the target element.
 * Consumer should use limit to dynamically render more items upon it being increased.
 * A callback to reset the limit is provided if the consumer wishes to reset the limit e.g. after available list items change.
 */
export const useInfiniteScrolling = (
    initialLimit: number,
    increment: number,
    maxLimitSupplier: () => number
): {
    limitRef: Ref<number>;
    scrollHandler: (e: Event) => void;
    resetLimit: () => void;
} => {
    const limitRef = ref<number>(initialLimit);

    const scrollHandler = debounce((e: Event) => {
        const target = e.target as HTMLElement;

        const distanceToBottomTrigger = target.clientHeight / 2;
        const distanceToBottom =
            target.scrollHeight - (target.scrollTop + target.clientHeight);

        if (
            distanceToBottom < distanceToBottomTrigger &&
            limitRef.value < maxLimitSupplier()
        ) {
            limitRef.value = limitRef.value + increment;
        }
    }, SCROLL_DEBOUNCE_TIMEOUT);

    const resetLimit = (): void => {
        limitRef.value = initialLimit;
    };

    return { limitRef, scrollHandler, resetLimit };
};

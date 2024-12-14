import { throttle } from "lodash-es";
import type { Ref } from "vue";
import { computed, ref, watch } from "vue";

const SCROLL_THROTTLE_TIMEOUT = 100;

/**
 * Primitive infinite scroll utility.
 * Provides a reactive limited list that grows larger once a scroll event is triggered
 * that moves is nearing the bottom end of the target element.
 *
 * Scroll event must be bound to the container hosting the list.
 * Consumer should use limited array return value to dynamically render more items upon it being increased.
 */
export const useInfiniteScrolling = <T>(
	fullArr: Ref<ReadonlyArray<T>>,
	initialLimit: number,
	increment: number,
): {
	scrollHandler: (e: Event) => void;
	limitedArr: Readonly<Ref<ReadonlyArray<T>>>;
} => {
	const limitRef = ref<number>(initialLimit);

	const limitedArr = computed<ReadonlyArray<T>>(() =>
		fullArr.value.slice(0, limitRef.value),
	);

	const scrollHandler = throttle((e: Event) => {
		const target = e.target as HTMLElement;

		const distanceToBottomTrigger = target.clientHeight / 2;
		const distanceToBottom =
			target.scrollHeight - (target.scrollTop + target.clientHeight);

		if (distanceToBottom < distanceToBottomTrigger) {
			limitRef.value = Math.min(
				limitRef.value + increment,
				fullArr.value.length,
			);
		}
	}, SCROLL_THROTTLE_TIMEOUT);

	watch(
		() => fullArr.value,
		() => {
			limitRef.value = initialLimit;
		},
	);

	return { scrollHandler, limitedArr };
};

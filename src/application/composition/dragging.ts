import type { Card } from "@/core/lib";
import type { Ref } from "vue";
import {
	useDraggable,
	type DraggableEvent,
	type RefOrElement,
	type UseDraggableOptions,
	type UseDraggableReturn,
} from "vue-draggable-plus";
import { useTooltip } from "./tooltip";
import type { GroupOptions } from "sortablejs";

const dragGroup = "GLOBAL_CARD_DRAG_GROUP";

export function useCardDraggable(
	el: RefOrElement,
	list: Ref<Card[]>,
	options: Omit<
		UseDraggableOptions<Card>,
		"group" | "clone" | "onStart" | "onEnd" | "onMove"
	> & {
		pull: GroupOptions["pull"];
		put: GroupOptions["put"];
	},
	onMove: (evt: DraggableEvent<Card>, originalEvent: Event) => boolean,
): UseDraggableReturn {
	const { disableTooltip, enableTooltip } = useTooltip();
	return useDraggable(el, list, {
		group: { name: dragGroup, pull: options.pull, put: options.put },
		// We never actually need new instances of cards, we just reference the old one in a new place
		clone: (a) => a,
		onStart: disableTooltip,
		onEnd: enableTooltip,
		onMove: (evt, originalEvent) =>
			onMove(
				// Because vue-draggable-plus extends the parameter with its custom type, which isn't visible in the typing declarations
				// https://github.com/Alfred-Skyblue/vue-draggable-plus/issues/166
				evt as unknown as DraggableEvent<Card>,
				originalEvent,
			),
		...options,
	});
}

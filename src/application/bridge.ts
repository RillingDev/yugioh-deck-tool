import type { Card, Deck } from "@/core/lib";
import { DeckPart, getLogger } from "@/core/lib";
import { getExistingElseThrow } from "lightdash";
import type {
	ApplicationInstance,
	Callback,
	ExternalCard,
	ExternalDeck,
} from "./api";
import {
	DECK_CLEAR,
	DECK_NAME_UPDATE,
	DECK_PART_CARDS_ADD,
	DECK_PART_CARDS_REMOVE,
	DECK_PART_CARDS_REORDER,
	DECK_REPLACE,
	DECK_SHUFFLE,
	DECK_SORT,
} from "./store/modules/deck";
import { useStore } from "./store/store";

const logger = getLogger("bridge");

/**
 * Minimal event emitter.
 */
class EventEmitter {
	#eventCallbacks: Map<string, Callback[]>;

	constructor(events: Set<string>) {
		this.#eventCallbacks = new Map(
			Array.from(events.values()).map((event) => [event, []])
		);
	}

	on(event: string, callback: () => void): void {
		getExistingElseThrow(this.#eventCallbacks, event).push(callback);
	}

	emit(event: string): void {
		getExistingElseThrow(this.#eventCallbacks, event).forEach((callback) =>
			callback()
		);
	}
}

const CHANGE_EVENT_MUTATIONS = new Set([
	DECK_NAME_UPDATE,
	DECK_REPLACE,
	DECK_SORT,
	DECK_SHUFFLE,
	DECK_CLEAR,
	DECK_PART_CARDS_ADD,
	DECK_PART_CARDS_REMOVE,
	DECK_PART_CARDS_REORDER,
]);

/**
 * Creates implementation of {@link ApplicationInstance} which is bridged to Vue.
 */
export const createApplicationBridge = (): ApplicationInstance => {
	const store = useStore();

	const eventEmitter = new EventEmitter(new Set<string>(["change"]));

	store.subscribe((mutation) => {
		if (CHANGE_EVENT_MUTATIONS.has(mutation.type)) {
			logger.trace("Emitting 'change' event.");
			eventEmitter.emit("change");
		}
	});

	return {
		getDeck: () => {
			logger.debug("Exporting current deck state...");
			return createExternalDeck(store.state.deck.active);
		},
		on(event: string, callback: Callback): void {
			logger.debug(
				`Registering event subscription for event '${event}'...`
			);
			eventEmitter.on(event, callback);
		},
	};
};

const createExternalDeck = ({ name, parts }: Deck): ExternalDeck => {
	return {
		name,
		parts: {
			main: parts[DeckPart.MAIN].map(createExternalCard),
			extra: parts[DeckPart.EXTRA].map(createExternalCard),
			side: parts[DeckPart.SIDE].map(createExternalCard),
		},
	};
};

const createExternalCard = ({ passcode, name }: Card): ExternalCard => {
	return { passcode, name };
};

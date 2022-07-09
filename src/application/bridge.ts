import type { Card, CardDatabase, Deck } from "@/core/lib";
import { DeckPart, FindCardBy, getLogger, TYPES } from "@/core/lib";
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
import { applicationContainer } from "@/application/inversify.config";
import { ESSENTIAL_DATA_LOADED } from "@/application/store/modules/data";
import type { ApplicationEvent } from "./api";

const logger = getLogger("bridge");

const cardDatabase = applicationContainer.get<CardDatabase>(TYPES.CardDatabase);

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
		logger.trace(`Registering '${event}' event.`);
		getExistingElseThrow(this.#eventCallbacks, event).push(callback);
	}

	emit(event: string): void {
		logger.trace(`Emitting '${event}' event.`);
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

	const eventEmitter = new EventEmitter(
		new Set<ApplicationEvent>(["change", "ready"])
	);

	store.subscribe((mutation) => {
		if (mutation.type == ESSENTIAL_DATA_LOADED) {
			eventEmitter.emit("ready");
		} else if (CHANGE_EVENT_MUTATIONS.has(mutation.type)) {
			eventEmitter.emit("change");
		}
	});

	return {
		getDeck: () => {
			logger.debug("Exporting current deck state...");
			return toExternalDeck(store.state.deck.active);
		},
		setDeck: (newDeck: ExternalDeck): void => {
			logger.debug("Replacing current deck state...");
			store.commit(DECK_REPLACE, { deck: fromExternalDeck(newDeck) });
		},
		shuffleDeck: (): void => {
			store.commit(DECK_SHUFFLE);
		},
		sortDeck: (): void => {
			store.commit(DECK_SORT);
		},
		clearDeck: (): void => {
			store.commit(DECK_CLEAR);
		},
		on(event: string, callback: Callback): void {
			logger.debug(
				`Registering event subscription for event '${event}'...`
			);
			eventEmitter.on(event, callback);
		},
	};
};

const toExternalDeck = ({ name, parts }: Deck): ExternalDeck => {
	return {
		name,
		parts: {
			main: parts[DeckPart.MAIN].map(toExternalCard),
			extra: parts[DeckPart.EXTRA].map(toExternalCard),
			side: parts[DeckPart.SIDE].map(toExternalCard),
		},
	};
};

const toExternalCard = ({ passcode, name }: Card): ExternalCard => {
	return { passcode, name };
};

const fromExternalDeck = ({ name, parts }: ExternalDeck): Deck => {
	return {
		name,
		parts: {
			[DeckPart.MAIN]: parts.main.map(fromExternalCard),
			[DeckPart.EXTRA]: parts.extra.map(fromExternalCard),
			[DeckPart.SIDE]: parts.side.map(fromExternalCard),
		},
	};
};

const fromExternalCard = ({ passcode }: ExternalCard): Card => {
	if (!cardDatabase.hasCard(passcode, FindCardBy.PASSCODE)) {
		throw new TypeError(`Card with passcode '${passcode}' not found.`);
	}
	return cardDatabase.getCard(passcode, FindCardBy.PASSCODE)!;
};

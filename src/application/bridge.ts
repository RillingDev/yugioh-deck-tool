import type { Card, CardDatabase, Deck } from "@/core/lib";
import { DeckPart, FindCardBy, getLogger, TYPES } from "@/core/lib";
import type {
	ApplicationEvent,
	Application,
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
import { getExistingElseThrow } from "lightdash";

const logger = getLogger("bridge");

const cardDatabase = applicationContainer.get<CardDatabase>(TYPES.CardDatabase);

/**
 * Minimal event emitter.
 */
class EventEmitter<TEvent> {
	#logger = getLogger(EventEmitter);

	#eventCallbacks: Map<TEvent, Callback[]>;

	constructor(events: Set<TEvent>) {
		this.#eventCallbacks = new Map(
			Array.from(events.values()).map((event) => [event, []])
		);
	}

	on(event: TEvent, callback: () => void): void {
		this.#logger.trace(`Registering '${event}' event.`);
		getExistingElseThrow(this.#eventCallbacks, event).push(callback);
	}

	emit(event: TEvent): void {
		this.#logger.trace(`Emitting '${event}' event.`);
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
 * Creates implementation of {@link Application} which is bridged to Vue.
 */
export const createApplicationBridge = (): Application => {
	const store = useStore();

	const eventEmitter = new EventEmitter<ApplicationEvent>(
		new Set(["change", "ready"])
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
		on(event: ApplicationEvent, callback: Callback): void {
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

const toExternalCard = (card: Card): ExternalCard => card.passcode;

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

const fromExternalCard = (externalCard: ExternalCard): Card => {
	if (!cardDatabase.hasCard(externalCard, FindCardBy.PASSCODE)) {
		throw new TypeError(`Card with passcode '${externalCard}' not found.`);
	}
	return cardDatabase.getCard(externalCard, FindCardBy.PASSCODE)!;
};

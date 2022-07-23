import type { Card, CardDatabase, Deck } from "@/core/lib";
import { DeckPart, FindCardBy, getLogger, TYPES } from "@/core/lib";
import type {
	ApplicationApi,
	ApplicationEvent,
	Callback,
	ExternalCard,
	ExternalDeck,
	SlimExternalCard,
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
import type { Store } from "vuex";
import type { AppState } from "@/application/store/AppState";

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

class ApplicationApiBridge implements ApplicationApi {
	static readonly #CHANGE_EVENT_MUTATIONS = new Set([
		DECK_NAME_UPDATE,
		DECK_REPLACE,
		DECK_SORT,
		DECK_SHUFFLE,
		DECK_CLEAR,
		DECK_PART_CARDS_ADD,
		DECK_PART_CARDS_REMOVE,
		DECK_PART_CARDS_REORDER,
	]);

	readonly #eventEmitter = new EventEmitter<ApplicationEvent>(
		new Set(["change", "ready"])
	);
	readonly #store: Store<AppState>;

	constructor(store: Store<AppState>) {
		this.#store = store;
		this.#store.subscribe((mutation) => {
			if (mutation.type == ESSENTIAL_DATA_LOADED) {
				this.#eventEmitter.emit("ready");
			} else if (
				ApplicationApiBridge.#CHANGE_EVENT_MUTATIONS.has(mutation.type)
			) {
				this.#eventEmitter.emit("change");
			}
		});
	}

	getDeck(): ExternalDeck<ExternalCard> {
		logger.debug("Exporting current deck state...");
		return this.#toExternalDeck(this.#store.state.deck.active);
	}
	setDeck(newDeck: ExternalDeck<SlimExternalCard>): void {
		logger.debug("Replacing current deck state...");
		this.#store.commit(DECK_REPLACE, {
			deck: this.#fromExternalDeck(newDeck),
		});
	}
	shuffleDeck(): void {
		this.#store.commit(DECK_SHUFFLE);
	}
	sortDeck(): void {
		this.#store.commit(DECK_SORT);
	}
	clearDeck(): void {
		this.#store.commit(DECK_CLEAR);
	}
	on(event: ApplicationEvent, callback: Callback): void {
		logger.debug(`Registering event subscription for event '${event}'...`);
		this.#eventEmitter.on(event, callback);
	}

	#toExternalDeck({ name, parts }: Deck): ExternalDeck<ExternalCard> {
		return {
			name,
			parts: {
				main: parts[DeckPart.MAIN].map(this.#toExternalCard),
				extra: parts[DeckPart.EXTRA].map(this.#toExternalCard),
				side: parts[DeckPart.SIDE].map(this.#toExternalCard),
			},
		};
	}

	#toExternalCard({ passcode, name }: Card): ExternalCard {
		return { passcode, name };
	}

	#fromExternalDeck({ name, parts }: ExternalDeck<SlimExternalCard>): Deck {
		return {
			name,
			parts: {
				[DeckPart.MAIN]: parts.main.map(this.#fromExternalCard),
				[DeckPart.EXTRA]: parts.extra.map(this.#fromExternalCard),
				[DeckPart.SIDE]: parts.side.map(this.#fromExternalCard),
			},
		};
	}

	#fromExternalCard({ passcode }: SlimExternalCard): Card {
		if (!cardDatabase.hasCard(passcode, FindCardBy.PASSCODE)) {
			throw new TypeError(`Card with passcode '${passcode}' not found.`);
		}
		return cardDatabase.getCard(passcode, FindCardBy.PASSCODE)!;
	}
}

/**
 * Creates implementation of {@link ApplicationApi} which is bridged to Vue.
 */
export const createApplicationBridge = (): ApplicationApi =>
	new ApplicationApiBridge(useStore());

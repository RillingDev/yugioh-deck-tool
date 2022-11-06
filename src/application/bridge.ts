import type { Card, Deck } from "@/core/lib";
import { DeckPart, FindCardBy, getLogger } from "@/core/lib";
import type {
	ApplicationApi,
	ApplicationEvent,
	Callback,
	ExternalCard,
	ExternalDeck,
	SlimExternalCard,
} from "./api";
import { useDataStore } from "@/application/store/data";
import { useDeckStore } from "@/application/store/deck";
import { getExistingElseThrow } from "lightdash";
import { cardDatabase } from "@/application/container";

const logger = getLogger("bridge");

const toExternalDeck = ({ name, parts }: Deck): ExternalDeck<ExternalCard> => {
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

const fromExternalDeck = ({
	name,
	parts,
}: ExternalDeck<SlimExternalCard>): Deck => {
	return {
		name,
		parts: {
			[DeckPart.MAIN]: parts.main.map(fromExternalCard),
			[DeckPart.EXTRA]: parts.extra.map(fromExternalCard),
			[DeckPart.SIDE]: parts.side.map(fromExternalCard),
		},
	};
};

const fromExternalCard = ({ passcode }: SlimExternalCard): Card => {
	if (!cardDatabase.hasCard(passcode, FindCardBy.PASSCODE)) {
		throw new TypeError(`Card with passcode '${passcode}' not found.`);
	}
	return cardDatabase.getCard(passcode, FindCardBy.PASSCODE)!;
};

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

/**
 * Creates implementation of {@link ApplicationApi} which is bridged to Vue.
 */
export const useBridge = (): ApplicationApi => {
	const eventEmitter = new EventEmitter<ApplicationEvent>(
		new Set(["change", "ready"])
	);

	const dataStore = useDataStore();
	let ready = false;
	dataStore.$subscribe(() => {
		if (!ready) {
			eventEmitter.emit("ready");
			ready = true;
		}
	});

	const deckStore = useDeckStore();
	deckStore.$subscribe(() => eventEmitter.emit("change"));

	return {
		getDeck(): ExternalDeck<ExternalCard> {
			logger.debug("Exporting current deck state...");
			return toExternalDeck(deckStore.deck);
		},
		setDeck(newDeck: ExternalDeck<SlimExternalCard>): void {
			logger.debug("Replacing current deck state...");
			deckStore.replace({
				deck: fromExternalDeck(newDeck),
			});
		},
		shuffleDeck(): void {
			deckStore.shuffle();
		},
		sortDeck(): void {
			deckStore.sort();
		},
		clearDeck(): void {
			deckStore.clear();
		},
		on(event: ApplicationEvent, callback: Callback): void {
			logger.debug(
				`Registering event subscription for event '${event}'...`
			);
			eventEmitter.on(event, callback);
		},
	};
};

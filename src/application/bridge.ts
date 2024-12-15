import type { Card, Deck, ImportResult } from "@/core/lib";
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
import { cardDatabase } from "@/application/ctx";

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
}: ExternalDeck<SlimExternalCard>): ImportResult => {
	const missing: string[] = [];

	const fromExternalCards = (
		externalCards: readonly SlimExternalCard[],
	): Card[] => {
		return externalCards
			.filter(({ passcode }) => {
				if (cardDatabase.hasCard(passcode, FindCardBy.PASSCODE)) {
					return true;
				}
				missing.push(passcode);
				return false;
			})
			.map(
				({ passcode }) =>
					cardDatabase.getCard(passcode, FindCardBy.PASSCODE)!,
			);
	};

	return {
		deck: {
			name,
			parts: {
				[DeckPart.MAIN]: fromExternalCards(parts.main),
				[DeckPart.EXTRA]: fromExternalCards(parts.extra),
				[DeckPart.SIDE]: fromExternalCards(parts.side),
			},
		},
		missing,
	};
};

/**
 * Minimal event emitter.
 */
class EventEmitter<TEvent> {
	#logger = getLogger(EventEmitter);

	#eventCallbacks: Map<TEvent, Callback[]>;

	constructor(events: Set<TEvent>) {
		this.#eventCallbacks = new Map(
			Array.from(events.values()).map((event) => [event, []]),
		);
	}

	on(event: TEvent, callback: () => void): void {
		this.#logger.trace(`Registering '${event}' event.`);
		getExistingElseThrow(this.#eventCallbacks, event).push(callback);
	}

	emit(event: TEvent): void {
		this.#logger.trace(`Emitting '${event}' event.`);
		getExistingElseThrow(this.#eventCallbacks, event).forEach((callback) =>
			callback(),
		);
	}
}

/**
 * Creates implementation of {@link ApplicationApi} which is bridged to Vue.
 */
export const useBridge = (): ApplicationApi => {
	const eventEmitter = new EventEmitter<ApplicationEvent>(
		new Set(["change", "ready"]),
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
		setDeck(newDeck: ExternalDeck<SlimExternalCard>) {
			logger.debug("Replacing current deck state...");
			const { deck, missing } = fromExternalDeck(newDeck);
			deckStore.replace({
				deck,
			});
			return { deck: toExternalDeck(deck), missing };
		},
		shuffleDeck() {
			deckStore.shuffle();
		},
		sortDeck() {
			deckStore.sort();
		},
		clearDeck() {
			deckStore.clear();
		},
		on(event: ApplicationEvent, callback: Callback) {
			logger.debug(
				`Registering event subscription for event '${event}'...`,
			);
			eventEmitter.on(event, callback);
		},
	};
};

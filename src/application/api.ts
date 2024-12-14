export type ApplicationEvent = "ready" | "change";

/**
 * Public interface used to interact with application.
 */
export interface ApplicationApi {
	/**
	 * Get a copy of the current deck.
	 */
	readonly getDeck: () => ExternalDeck<ExternalCard>;

	/**
	 * Replaces the currently loaded deck.
	 *
	 * May only be called after `ready` event was emitted.
	 */
	readonly setDeck: (
		newDeck: ExternalDeck<SlimExternalCard>,
	) => SetDeckResult;

	/**
	 * Shuffles the current deck.
	 */
	readonly shuffleDeck: () => void;
	/**
	 * Sorts the current deck.
	 */
	readonly sortDeck: () => void;
	/**
	 * Clears the current deck.
	 */
	readonly clearDeck: () => void;

	/**
	 * Registers an event handler.
	 *
	 * Supported events:
	 * - `ready` - Fired when the application has loaded all required data.
	 * - `change` - Fired when the current deck changes in any way.
	 */
	readonly on: (event: ApplicationEvent, callback: Callback) => void;
}

/**
 * Version of {@link Deck} modified to only export required data with a stable interface.
 */
export interface ExternalDeck<TCard> {
	readonly name: string | null;
	readonly parts: {
		readonly main: ReadonlyArray<TCard>;
		readonly extra: ReadonlyArray<TCard>;
		readonly side: ReadonlyArray<TCard>;
	};
}

/**
 * Version of {@link Card} modified to only export required data with a stable interface.
 */
export interface ExternalCard {
	readonly passcode: string;
	readonly name: string;
}

/**
 * Simplified {@link ExternalCard} used during imports.
 */
export type SlimExternalCard = Pick<ExternalCard, "passcode">;

export type Callback = () => void;

export interface SetDeckResult {
	readonly deck: ExternalDeck<ExternalCard>;
	/**
	 * Missing passcodes.
	 */
	readonly missing: ReadonlyArray<string>;
}

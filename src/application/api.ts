import { getLogger } from "@/core/main";
import { createApplicationBridge } from "./bridge";

const logger = getLogger("tooltip");

/**
 * Public interface used to interact with application.
 */
export interface ApplicationInstance {
	/**
	 * Get a copy of the current deck.
	 */
	readonly getDeck: () => ExternalDeck;

	/**
	 * Registers an event handler.
	 *
	 * Supported events:
	 * - `change` - Fired if the current deck changes in any way.
	 */
	readonly on: (event: string, callback: Callback) => void;
}

/**
 * Version of {@link Deck} modified to only export required data with a stable interface.
 */
export interface ExternalDeck {
	readonly name: string | null;
	readonly parts: {
		readonly main: ReadonlyArray<ExternalCard>;
		readonly extra: ReadonlyArray<ExternalCard>;
		readonly side: ReadonlyArray<ExternalCard>;
	};
}

/**
 * Version of {@link Card} modified to only export required data with a stable interface.
 */
export interface ExternalCard {
	readonly passcode: string;
	readonly name: string;
}

export type Callback = () => void;

declare global {
	interface Window {
		yugiohDeckToolApplication?: ApplicationInstance;
	}
}

export const bindApplicationApi = (): void => {
	if (window.yugiohDeckToolApplication != null) {
		throw new TypeError("Application already exists.");
	}
	logger.debug("Setting up application.");
	window.yugiohDeckToolApplication = createApplicationBridge();
};

import { inject, injectable } from "inversify";
import type { Credentials } from "@/ygoprodeck/lib";
import { YgoprodeckService, YGOPRODECK_TYPES } from "@/ygoprodeck/lib";

declare global {
	interface Window {
		ygoprodeckUsername?: string;
		ygoprodeckToken?: string;
	}
}

@injectable()
export class YgoprodeckController {
	readonly #ygoprodeckService: YgoprodeckService;

	constructor(
		@inject(YGOPRODECK_TYPES.YgoprodeckService)
		ygoprodeckService: YgoprodeckService
	) {
		this.#ygoprodeckService = ygoprodeckService;
	}

	/**
	 * Checks if ygoprodeck.com credentials are available.
	 */
	hasCredentials(): boolean {
		this.#ygoprodeckService.validateEnv();
		return (
			window.ygoprodeckUsername != null && window.ygoprodeckToken != null
		);
	}

	/**
	 * Retrieves ygoprodeck.com credentials.
	 */
	getCredentials(): Credentials {
		this.#ygoprodeckService.validateEnv();
		if (!this.hasCredentials()) {
			throw new TypeError("Insufficient credentials available.");
		}
		return {
			username: window.ygoprodeckUsername!,
			token: window.ygoprodeckToken!,
		};
	}
}

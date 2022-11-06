import type { Deck } from "./Deck";
import type { CardDatabase } from "../card/CardDatabase";
import { FindCardBy } from "../card/CardDatabase";

import type { DeckService } from "./DeckService";
import { DECK_PART_ARR } from "./DeckPart";
import { DefaultDeckPartConfig } from "./DeckPartConfig";

export interface ImportResult {
	readonly deck: Deck;
	readonly missing: string[];
}

interface DeckFile {
	readonly fileName: string;
	readonly fileContent: string;
}

export class DeckFileService {
	readonly #cardDatabase: CardDatabase;
	readonly #deckService: DeckService;

	public static readonly DECK_FILE_MIME_TYPE = "text/ydk";

	constructor(cardDatabase: CardDatabase, deckService: DeckService) {
		this.#deckService = deckService;
		this.#cardDatabase = cardDatabase;
	}

	/**
	 * Loads a deck from a remote .ydk file URL. The name is inferred from the URL.
	 *
	 * @param currentUrl The current URL to ensure same-site loading will take place.
	 * @param remoteUrl URL to load from, MUST be the same origin as currentOrigin.
	 * @throws Error if origins do not match.
	 * @return Loaded deck.
	 * @deprecated
	 */
	async fromRemoteFile(
		currentUrl: URL,
		remoteUrl: URL
	): Promise<ImportResult> {
		if (currentUrl.origin !== remoteUrl.origin) {
			throw new Error("Decks can only be loaded from the same origin.");
		}

		const fileName = this.#getFileNameFromUrl(remoteUrl);
		const fileContent = await fetch(remoteUrl, {
			method: "GET",
		}).then((res) => {
			if (res.status != 200) {
				throw new Error(`Unexpected status code: ${res.status}`);
			}
			return res.text();
		});
		return this.fromFile({
			fileName,
			fileContent,
		});
	}

	/**
	 * Gets the file name of a request to a file, or an empty is string if none is found.
	 *
	 * @param url URL to check.
	 * @return File name or empty string.
	 */
	#getFileNameFromUrl(url: URL): string {
		const pathname = url.pathname;
		if (!pathname.includes("/")) {
			return "";
		}
		return pathname.substring(pathname.lastIndexOf("/") + 1);
	}

	/**
	 * Loads deck from a.ydk file.
	 *
	 * @param deckFile File to load.
	 * @return Deck.
	 */
	fromFile(deckFile: DeckFile): ImportResult {
		const missing: string[] = [];
		const deck = this.#deckService.createEmptyDeck();

		const lines = deckFile.fileContent
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0);
		let currentDeckPart = null;
		for (const line of lines) {
			const foundDeckPart = DECK_PART_ARR.find(
				(part) => DefaultDeckPartConfig[part].indicator === line
			);
			if (foundDeckPart != null) {
				currentDeckPart = foundDeckPart;
				continue;
			}

			// Only start processing once a deck part indicator was found. This allows for arbitrary file metadata
			// as "head" of the file.
			if (currentDeckPart != null) {
				const passcode = line.replace(/^0+/, ""); // Some applications pad the start with zeros, remove those.
				if (
					!this.#cardDatabase.hasCard(passcode, FindCardBy.PASSCODE)
				) {
					missing.push(passcode);
				} else {
					const card = this.#cardDatabase.getCard(
						passcode,
						FindCardBy.PASSCODE
					)!;
					deck.parts[currentDeckPart].push(card);
				}
			}
		}
		deck.name = deckFile.fileName.replace(".ydk", "");
		return {
			deck,
			missing,
		};
	}

	/**
	 * Creates a .ydk deck file for a deck.
	 *
	 * @param deck Deck to create a file for.
	 * @return Deck file.
	 */
	toFile(deck: Deck): DeckFile {
		const fileLines: string[] = [];

		for (const deckPart of DECK_PART_ARR) {
			const deckPartCards = deck.parts[deckPart];
			fileLines.push(DefaultDeckPartConfig[deckPart].indicator);
			fileLines.push(...deckPartCards.map((card) => card.passcode));
			fileLines.push("");
		}

		return {
			fileName: `${deck.name ?? "Unnamed"}.ydk`,
			fileContent: fileLines.join("\n"),
		};
	}
}

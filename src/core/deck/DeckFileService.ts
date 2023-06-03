import type { Deck, DeckPart } from "./Deck";
import { DECK_PART_ARR } from "./Deck";
import type { CardDatabase } from "../card/CardDatabase";
import { FindCardBy } from "../card/CardDatabase";

import type { DeckService } from "./DeckService";
import { DefaultDeckPartConfig } from "./DeckPartConfig";

export interface ImportResult {
	readonly deck: Deck;
	/**
	 * Missing passcodes.
	 */
	readonly missing: ReadonlyArray<string>;
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
		let currentDeckPart: DeckPart | null = null;
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

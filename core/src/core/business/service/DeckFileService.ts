import { inject, injectable } from "inversify";
import { Deck } from "../../model/ygo/Deck";
import { TYPES } from "../../../types";
import { CardDatabase } from "../CardDatabase";
import { CompressionService } from "./CompressionService";
import { DeckService } from "./DeckService";
import { EncodingService } from "./EncodingService";
import { DEFAULT_DECK_PART_ARR } from "../../model/ygo/DeckPart";
import { HttpService } from "./HttpService";
import parseUrl from "url-parse";
import { CardService } from "./CardService";

interface ImportResult {
    readonly deck: Deck;
    readonly missing: string[];
}

interface DeckFile {
    readonly fileName: string;
    readonly fileContent: string;
}

@injectable()
class DeckFileService {
    private readonly encodingService: EncodingService;
    private readonly httpService: HttpService;
    private readonly cardDatabase: CardDatabase;
    private readonly compressionService: CompressionService;
    private readonly deckService: DeckService;
    private readonly cardService: CardService;

    constructor(
        @inject(TYPES.HttpService)
        httpService: HttpService,
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase,
        @inject(TYPES.DeckService)
        deckService: DeckService,
        @inject(TYPES.EncodingService)
        encodingService: EncodingService,
        @inject(TYPES.CompressionService)
        compressionService: CompressionService,
        @inject(TYPES.CardService)
        cardService: CardService
    ) {
        this.httpService = httpService;
        this.encodingService = encodingService;
        this.compressionService = compressionService;
        this.deckService = deckService;
        this.cardDatabase = cardDatabase;
        this.cardService = cardService;
    }

    /**
     * Loads a deck from a remote .ydk file URL. The name is inferred from the URL.
     *
     * @param currentOrigin The current origin to ensure same-site loading will take place.
     * @param urlString URL to load from, MUST be the same origin as currentOrigin.
     * @throws Error if origins do not match.
     * @return Loaded deck.
     */
    public async fromRemoteFile(
        currentOrigin: string,
        urlString: string
    ): Promise<ImportResult> {
        const url = parseUrl(urlString);
        if (currentOrigin !== url.origin) {
            throw new Error("Decks can only be loaded from the same origin.");
        }

        const fileName = url.pathname.substring(
            url.pathname.lastIndexOf("/") + 1
        );
        const response = await this.httpService.get<string>(urlString, {
            responseType: "text",
            timeout: 5000,
        });
        return this.fromFile({
            fileName,
            fileContent: response.data,
        });
    }

    /**
     * Loads deck from a.ydk file.
     *
     * @param deckFile File to load.
     * @return Deck.
     */
    public fromFile(deckFile: DeckFile): ImportResult {
        const missing: string[] = [];
        const deck = this.deckService.createEmptyDeck();

        const lines = deckFile.fileContent
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        let currentDeckPart = null;
        for (const line of lines) {
            const foundDeckPart = DEFAULT_DECK_PART_ARR.find(
                (part) => part.indicator === line
            );
            if (foundDeckPart != null) {
                currentDeckPart = foundDeckPart;
                continue;
            }

            // Only start processing once a deckpart indicator was found. this allows for arbitrary file metadata as "head" of the file.
            if (currentDeckPart != null) {
                if (!this.cardDatabase.hasCard(line)) {
                    missing.push(line);
                } else {
                    const card = this.cardDatabase.getCard(line)!;
                    deck.parts.get(currentDeckPart)!.push(card);
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
    public toFile(deck: Deck): DeckFile {
        const fileLines: string[] = [];

        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            const deckPartCards = deck.parts.get(deckPart)!;
            fileLines.push(deckPart.indicator);
            fileLines.push(...deckPartCards.map((card) => card.id));
            fileLines.push("");
        }

        return {
            fileName: `${deck.name ?? "Unnamed"}.ydk`,
            fileContent: fileLines.join("\n"),
        };
    }
}

export { DeckFileService };

import { inject, injectable } from "inversify";
import { Deck } from "../model/Deck";
import { TYPES } from "../../types";
import { CardDatabase } from "./CardDatabase";
import { Card } from "../model/Card";
import { DECKPARTS } from "../data/DeckParts";
import { DeckPart } from "../model/DeckPart";
import { CompressionService } from "./CompressionService";
import { fromByteArray, toByteArray } from "base64-js";
import { deflate, inflate } from "pako";
import { isEqual } from "lodash";

interface ImportResult {
    deck: Deck;
    missing: string[];
}

interface DeckFile {
    fileName: string;
    fileContent: string;
}

@injectable()
class DeckImportExportService {
    // 4 bytes is enough to hold a 32 bit integer which is able to store all 9 digit IDs
    private static readonly BLOCK_SIZE = 4;
    private static readonly DELIMITER_BLOCK: Uint8Array = new Uint8Array(
        DeckImportExportService.BLOCK_SIZE
    ).fill(0);
    private static readonly ID_LIMIT = 2 ** 32;
    private readonly textEncoder: TextEncoder;
    private readonly textDecoder: TextDecoder;
    private readonly cardDatabase: CardDatabase;
    private readonly compressionService: CompressionService;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase,
        @inject(TYPES.CompressionService)
        compressionService: CompressionService
    ) {
        this.compressionService = compressionService;
        this.cardDatabase = cardDatabase;
        this.textEncoder = new TextEncoder();
        this.textDecoder = new TextDecoder();
    }

    public fromFile(deckFile: DeckFile): ImportResult {
        const parts = this.createPartMap();
        const missing: string[] = [];

        const lines = deckFile.fileContent
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);
        let currentDeckPart = null;
        for (const line of lines) {
            const foundDeckPart = DECKPARTS.find(
                part => part.indicator === line
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
                    parts.get(currentDeckPart)!.push(card);
                }
            }
        }

        return {
            deck: { name: deckFile.fileName.replace(".ydk", ""), parts },
            missing
        };
    }

    public toFile(deck: Deck): DeckFile {
        const fileLines: string[] = [];

        for (const deckPart of DECKPARTS) {
            const deckPartCards = deck.parts.get(deckPart)!;
            fileLines.push(deckPart.indicator);
            fileLines.push(...deckPartCards.map(card => card.id));
            fileLines.push("");
        }

        return {
            fileName: `${deck.name}.ydk`,
            fileContent: fileLines.join("\n")
        };
    }

    /**
     * Encodes a deck to a URI query parameter value safe string.
     *
     * Encoding steps:
     * <ol>
     *     <li>Create byte array of deck name and cards (see below)</li>
     *     <li>Deflate the byte array to producer shorter results</li>
     *     <li>Base64 encode the value with an URI safe alphabet to allow usage in URI query parameter values</li>
     * </ol>
     *
     * Byte Array structure:
     * Blocks of {@link #BLOCK_SIZE} represent a single card ID number,
     * with a special value {@link #DELIMITER_BLOCK} being used to separate deck-parts.
     * After the last card of the last deckpart and the delimiter,
     * the UTF-8 code-points of the deck name follow, if one is set.
     *
     * @param deck
     * @return Value that can be decoded to yield the same deck.
     */
    public toUrlQueryParamValue(deck: Deck): string {
        const result: number[] = [];

        for (const deckPart of DECKPARTS) {
            for (const card of deck.parts.get(deckPart)!) {
                result.push(...this.encodeCard(card));
            }
            result.push(...DeckImportExportService.DELIMITER_BLOCK);
        }
        if (deck.name != null && deck.name !== "") {
            result.push(...this.textEncoder.encode(deck.name));
        }

        const deflated = deflate(result);
        return this.encodeUriSafeBase64(deflated);
    }

    /**
     * Creates a deck from a query parameter value created by {@link toUrlQueryParamValue}.
     *
     * @param queryParamValue query parameter value.
     * @return Deck.
     */
    public fromUrlQueryParamValue(queryParamValue: string): Deck {
        const parts = this.createPartMap();

        const decoded = this.decodeUriSafeBase64(queryParamValue);
        const inflated = inflate(decoded);

        let deckPartIndex = 0;
        let metaDataStart: null | number = null;
        for (
            let i = 0;
            i < inflated.length;
            i += DeckImportExportService.BLOCK_SIZE
        ) {
            const block = inflated.subarray(
                i,
                i + DeckImportExportService.BLOCK_SIZE
            );
            if (isEqual(block, DeckImportExportService.DELIMITER_BLOCK)) {
                // After the last deckpart, meta data starts
                if (deckPartIndex === DECKPARTS.length - 1) {
                    metaDataStart = i + DeckImportExportService.BLOCK_SIZE;
                    break;
                }
                deckPartIndex++;
            } else {
                const deckPart = parts.get(DECKPARTS[deckPartIndex])!;
                deckPart.push(this.decodeCard(block));
            }
        }
        let name: string | null = null;
        if (metaDataStart != null && metaDataStart < inflated.length) {
            name = this.textDecoder.decode(inflated.subarray(metaDataStart));
        }
        return { name, parts };
    }

    public fromLegacyUrlQueryParamValue(
        val: string,
        base64Decoder: (val: string) => string
    ): Deck {
        const parts = this.createPartMap();
        const uncompressedValue = this.compressionService.inflateString(
            base64Decoder(val)
        );

        const DELIMITERS = {
            deckPart: "|",
            cardId: ";",
            cardAmount: "*"
        };

        uncompressedValue
            .split(DELIMITERS.deckPart)
            .forEach((deckPartList: string, index) => {
                const deckPart = DECKPARTS[index];
                const deckPartCards = parts.get(deckPart)!;

                if (deckPartList.length > 0) {
                    deckPartList.split(DELIMITERS.cardId).forEach(entry => {
                        let count = 1;
                        let cardId = entry;
                        if (entry.startsWith(DELIMITERS.cardAmount)) {
                            count = Number(entry[1]);
                            cardId = entry.slice(2);
                        }

                        if (!this.cardDatabase.hasCard(cardId)) {
                            throw new TypeError(
                                "Unknown card, this hopefully should never happen"
                            );
                        }
                        const card = this.cardDatabase.getCard(cardId)!;

                        for (let i = 0; i < count; i++) {
                            deckPartCards.push(card);
                        }
                    });
                }
            });

        return { name: null, parts };
    }

    private encodeCard(card: Card): Uint8Array {
        const idNumber = Number(card.id);
        if (idNumber === 0 || idNumber >= DeckImportExportService.ID_LIMIT) {
            throw new TypeError(
                `card '${card}' has an illegal value ${idNumber} as ID.`
            );
        }
        const buffer = new ArrayBuffer(DeckImportExportService.BLOCK_SIZE);
        // Create a 32 bit int view which allows easy access to the 4 byte
        // representation of the 32 bit number we set on it.
        const uint32Array = new Uint32Array(buffer);
        uint32Array[0] = idNumber;
        return new Uint8Array(buffer);
    }

    private decodeCard(block: Uint8Array): Card {
        // Copy input array to allow buffer access
        const uint8Array = new Uint8Array(block);
        // See #encodeCard for details
        const uint32Array = new Uint32Array(uint8Array.buffer);
        const cardId = String(uint32Array[0]);
        if (!this.cardDatabase.hasCard(cardId)) {
            throw new TypeError(`Could not find card for ID ${cardId}.`);
        }

        return this.cardDatabase.getCard(cardId)!;
    }

    private encodeUriSafeBase64(val: Uint8Array): string {
        return fromByteArray(val)
            .replace(/=/g, "~")
            .replace(/\+/g, "_")
            .replace(/\//g, "-");
    }

    private decodeUriSafeBase64(val: string): Uint8Array {
        return toByteArray(
            val
                .replace(/~/g, "=")
                .replace(/_/g, "+")
                .replace(/-/g, "/")
        );
    }

    private createPartMap(): Map<DeckPart, Card[]> {
        const parts = new Map<DeckPart, Card[]>();
        for (const deckPart of DECKPARTS) {
            parts.set(deckPart, []);
        }
        return parts;
    }
}

export { DeckImportExportService };

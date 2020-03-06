var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DeckImportExportService_1;
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { DECKPARTS } from "../data/DeckParts";
import { CompressionService } from "./CompressionService";
import { isEqual } from "lodash";
import { groupMapReducingBy } from "lightdash";
import { DeckService } from "./DeckService";
import { EncodingService } from "./EncodingService";
let DeckImportExportService = DeckImportExportService_1 = class DeckImportExportService {
    constructor(cardDatabase, deckService, encodingService, compressionService) {
        this.encodingService = encodingService;
        this.compressionService = compressionService;
        this.deckService = deckService;
        this.cardDatabase = cardDatabase;
    }
    fromFile(deckFile) {
        const missing = [];
        const deck = this.deckService.createEmptyDeck();
        const lines = deckFile.fileContent
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);
        let currentDeckPart = null;
        for (const line of lines) {
            const foundDeckPart = DECKPARTS.find(part => part.indicator === line);
            if (foundDeckPart != null) {
                currentDeckPart = foundDeckPart;
                continue;
            }
            // Only start processing once a deckpart indicator was found. this allows for arbitrary file metadata as "head" of the file.
            if (currentDeckPart != null) {
                if (!this.cardDatabase.hasCard(line)) {
                    missing.push(line);
                }
                else {
                    const card = this.cardDatabase.getCard(line);
                    deck.parts.get(currentDeckPart).push(card);
                }
            }
        }
        deck.name = deckFile.fileName.replace(".ydk", "");
        return {
            deck,
            missing
        };
    }
    toFile(deck) {
        const fileLines = [];
        for (const deckPart of DECKPARTS) {
            const deckPartCards = deck.parts.get(deckPart);
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
    toUrlQueryParamValue(deck) {
        const result = [];
        for (const deckPart of DECKPARTS) {
            for (const card of deck.parts.get(deckPart)) {
                result.push(...this.encodeCard(card));
            }
            result.push(...DeckImportExportService_1.DELIMITER_BLOCK);
        }
        if (deck.name != null && deck.name !== "") {
            result.push(...this.encodingService.encodeString(deck.name));
        }
        const deflated = this.compressionService.deflate(result);
        return this.encodingService.encodeUriSafeBase64String(deflated);
    }
    /**
     * Creates a deck from a query parameter value created by {@link toUrlQueryParamValue}.
     *
     * @param queryParamValue query parameter value.
     * @return Deck.
     */
    fromUrlQueryParamValue(queryParamValue) {
        const deck = this.deckService.createEmptyDeck();
        const decoded = this.encodingService.decodeUriSafeBase64String(queryParamValue);
        const inflated = this.compressionService.inflate(decoded);
        let deckPartIndex = 0;
        let metaDataStart = null;
        for (let i = 0; i < inflated.length; i += DeckImportExportService_1.BLOCK_SIZE) {
            const block = inflated.subarray(i, i + DeckImportExportService_1.BLOCK_SIZE);
            if (isEqual(block, DeckImportExportService_1.DELIMITER_BLOCK)) {
                // After the last deckpart, meta data starts
                if (deckPartIndex === DECKPARTS.length - 1) {
                    metaDataStart = i + DeckImportExportService_1.BLOCK_SIZE;
                    break;
                }
                deckPartIndex++;
            }
            else {
                const deckPart = deck.parts.get(DECKPARTS[deckPartIndex]);
                deckPart.push(this.decodeCard(block));
            }
        }
        if (metaDataStart != null && metaDataStart < inflated.length) {
            deck.name = this.encodingService.decodeString(inflated.subarray(metaDataStart));
        }
        return deck;
    }
    fromLegacyUrlQueryParamValue(val, base64Decoder) {
        const deck = this.deckService.createEmptyDeck();
        const uncompressedValue = this.compressionService.inflateString(base64Decoder(val));
        const DELIMITERS = {
            deckPart: "|",
            cardId: ";",
            cardAmount: "*"
        };
        uncompressedValue
            .split(DELIMITERS.deckPart)
            .forEach((deckPartList, index) => {
            const deckPart = DECKPARTS[index];
            const deckPartCards = deck.parts.get(deckPart);
            if (deckPartList.length > 0) {
                deckPartList.split(DELIMITERS.cardId).forEach(entry => {
                    let count = 1;
                    let cardId = entry;
                    if (entry.startsWith(DELIMITERS.cardAmount)) {
                        count = Number(entry[1]);
                        cardId = entry.slice(2);
                    }
                    if (!this.cardDatabase.hasCard(cardId)) {
                        throw new TypeError(`Unknown card ${cardId}, this hopefully should never happen.`);
                    }
                    const card = this.cardDatabase.getCard(cardId);
                    for (let i = 0; i < count; i++) {
                        deckPartCards.push(card);
                    }
                });
            }
        });
        return deck;
    }
    toShareableText(deck) {
        const result = [];
        for (const deckPart of DECKPARTS) {
            result.push(`${deckPart.name}:`);
            const deckPartCards = deck.parts.get(deckPart);
            const counted = this.countCards(deckPartCards);
            for (const [card, count] of counted.entries()) {
                result.push(`${card.name} x${count}`);
            }
            result.push("");
        }
        return result.join("\n");
    }
    toBuyLink(deck) {
        const counted = this.countCards(this.deckService.getAllCards(deck));
        const cardList = Array.from(counted.entries()).map(([card, count]) => `${count} ${card.name}`);
        return ("https://store.tcgplayer.com/massentry?partner=YGOPRODeck&productline=Yugioh&c=" +
            encodeURIComponent(["", ...cardList, ""].join("||")));
    }
    encodeCard(card) {
        const idNumber = Number(card.id);
        if (idNumber === 0 || idNumber >= DeckImportExportService_1.ID_LIMIT) {
            throw new TypeError(`Card '${card}' has an illegal value ${idNumber} as ID.`);
        }
        const buffer = new ArrayBuffer(DeckImportExportService_1.BLOCK_SIZE);
        // Create a 32 bit int view which allows easy access to the 4 byte
        // representation of the 32 bit number we set on it.
        const uint32Array = new Uint32Array(buffer);
        uint32Array[0] = idNumber;
        return new Uint8Array(buffer);
    }
    decodeCard(block) {
        // Copy input array to allow buffer access
        const uint8Array = new Uint8Array(block);
        // See #encodeCard for details
        const uint32Array = new Uint32Array(uint8Array.buffer);
        const cardId = String(uint32Array[0]);
        if (!this.cardDatabase.hasCard(cardId)) {
            throw new TypeError(`Could not find card for ID ${cardId}.`);
        }
        return this.cardDatabase.getCard(cardId);
    }
    countCards(cards) {
        return groupMapReducingBy(cards, card => card, () => 0, current => current + 1);
    }
};
// 4 bytes is enough to hold a 32 bit integer which is able to store all 9 digit IDs
DeckImportExportService.BLOCK_SIZE = 4;
DeckImportExportService.DELIMITER_BLOCK = new Uint8Array(DeckImportExportService_1.BLOCK_SIZE).fill(0);
DeckImportExportService.ID_LIMIT = 2 ** 32;
DeckImportExportService = DeckImportExportService_1 = __decorate([
    injectable(),
    __param(0, inject(TYPES.CardDatabase)),
    __param(1, inject(TYPES.DeckService)),
    __param(2, inject(TYPES.EncodingService)),
    __param(3, inject(TYPES.CompressionService)),
    __metadata("design:paramtypes", [Object, DeckService,
        EncodingService,
        CompressionService])
], DeckImportExportService);
export { DeckImportExportService };

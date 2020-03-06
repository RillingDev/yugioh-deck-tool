import { Deck } from "../model/Deck";
import { CardDatabase } from "./CardDatabase";
import { CompressionService } from "./CompressionService";
import { DeckService } from "./DeckService";
interface ImportResult {
    deck: Deck;
    missing: string[];
}
interface DeckFile {
    fileName: string;
    fileContent: string;
}
declare class DeckImportExportService {
    private static readonly BLOCK_SIZE;
    private static readonly DELIMITER_BLOCK;
    private static readonly ID_LIMIT;
    private readonly textEncoder;
    private readonly textDecoder;
    private readonly cardDatabase;
    private readonly compressionService;
    private readonly deckService;
    constructor(cardDatabase: CardDatabase, deckService: DeckService, compressionService: CompressionService);
    fromFile(deckFile: DeckFile): ImportResult;
    toFile(deck: Deck): DeckFile;
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
    toUrlQueryParamValue(deck: Deck): string;
    /**
     * Creates a deck from a query parameter value created by {@link toUrlQueryParamValue}.
     *
     * @param queryParamValue query parameter value.
     * @return Deck.
     */
    fromUrlQueryParamValue(queryParamValue: string): Deck;
    fromLegacyUrlQueryParamValue(val: string, base64Decoder: (val: string) => string): Deck;
    toShareableText(deck: Deck): string;
    toBuyLink(deck: Deck): string;
    private encodeCard;
    private decodeCard;
    private encodeUriSafeBase64;
    private decodeUriSafeBase64;
    private countCards;
}
export { DeckImportExportService };

import { Deck } from "../model/Deck";
import { CardDatabase } from "./CardDatabase";
import { CompressionService } from "./CompressionService";
interface ImportResult {
    deck: Deck;
    missing: string[];
}
interface DeckFile {
    fileName: string;
    fileContent: string;
}
declare class DeckImportExportService {
    private readonly cardDatabase;
    private readonly compressionService;
    constructor(cardDatabase: CardDatabase, compressionService: CompressionService);
    fromFile(deckFile: DeckFile): ImportResult;
    toFile(deck: Deck): DeckFile;
    fromLegacyUrlQueryParamValue(val: string, base64Decoder: (val: string) => string): Deck;
    private createPartMap;
}
export { DeckImportExportService };

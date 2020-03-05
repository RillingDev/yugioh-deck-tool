import { Deck } from "../model/Deck";
import { CardDatabase } from "./CardDatabase";
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
    constructor(cardDatabase: CardDatabase);
    fromFile(deckFile: DeckFile): ImportResult;
    toFile(deck: Deck): DeckFile;
}
export { DeckImportExportService };

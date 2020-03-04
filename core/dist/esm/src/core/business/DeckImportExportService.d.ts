import { Deck } from "../model/Deck";
import { CardDatabase } from "./CardDatabase";
interface ImportResult {
    deck: Deck;
    missing: string[];
}
declare class DeckImportExportService {
    private readonly cardDatabase;
    constructor(cardDatabase: CardDatabase);
    fromFile(fileContent: string, fileName: string): ImportResult;
}
export { DeckImportExportService };

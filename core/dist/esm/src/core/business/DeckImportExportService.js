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
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { DECKPARTS } from "../data/DeckParts";
let DeckImportExportService = class DeckImportExportService {
    constructor(cardDatabase) {
        this.cardDatabase = cardDatabase;
    }
    fromFile(deckFile) {
        const parts = new Map();
        for (const deckPart of DECKPARTS) {
            parts.set(deckPart, []);
        }
        const missing = [];
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
                    parts.get(currentDeckPart).push(card);
                }
            }
        }
        return {
            deck: { name: deckFile.fileName.replace(".ydk", ""), parts },
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
};
__decorate([
    inject(TYPES.CardDatabase),
    __metadata("design:type", Object)
], DeckImportExportService.prototype, "cardDatabase", void 0);
DeckImportExportService = __decorate([
    injectable(),
    __param(0, inject(TYPES.CardDatabase)),
    __metadata("design:paramtypes", [Object])
], DeckImportExportService);
export { DeckImportExportService };

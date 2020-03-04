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
    fromFile(fileContent, fileName) {
        const parts = new Map();
        const missing = [];
        const lines = fileContent
            .trim()
            .split("\n")
            .map(str => str.trim());
        let currentDeckPart = null;
        let currentCards = [];
        for (const line of lines) {
            const startingDeckPart = DECKPARTS.find(part => part.indicator === line);
            if (startingDeckPart != null) {
                currentDeckPart = startingDeckPart;
                currentCards = [];
                if (!parts.has(currentDeckPart)) {
                    parts.set(currentDeckPart, currentCards);
                }
                continue;
            }
            if (currentDeckPart != null) {
                if (this.cardDatabase.hasCard(line)) {
                    currentCards.push(this.cardDatabase.getCard(line));
                }
                else {
                    missing.push(line);
                }
            }
        }
        const name = fileName.replace(".ydk", "");
        return { deck: { name, parts }, missing };
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

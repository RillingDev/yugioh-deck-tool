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
import { CardTypeGroup } from "../model/CardTypeGroup";
import { shuffle } from "lodash";
let SortingService = class SortingService {
    constructor(cardDatabase) {
        this.cardDatabase = cardDatabase;
    }
    shuffle(cards) {
        return shuffle(cards);
    }
    sort(cards) {
        return cards.sort((a, b) => {
            // First, sort after the sort group.
            if (a.type.sortGroup != b.type.sortGroup) {
                return b.type.sortGroup - a.type.sortGroup;
            }
            // For non-monsters, sort by sub-type (race).
            if (a.type.group !== CardTypeGroup.MONSTER && a.race != b.race) {
                const races = this.cardDatabase.getRaces(a.type.group);
                return races.indexOf(a.race) - races.indexOf(b.race);
            }
            // For monsters, sort by level.
            if (a.type.group === CardTypeGroup.MONSTER && a.level !== b.level) {
                return a.level - b.level; // Sort descending rather than ascending.
            }
            // As the last step, sort by name.
            return a.name.localeCompare(b.name);
        });
    }
};
SortingService = __decorate([
    injectable(),
    __param(0, inject(TYPES.CardDatabase)),
    __metadata("design:paramtypes", [Object])
], SortingService);
export { SortingService };

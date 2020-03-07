import { uriDeckDecode, uriDeckEncode } from "./uriDeck";
import { getBuyLink, getShareText } from "./toText";
import logger from "loglevel";
import { CardDatabase, CardService, DEFAULT_DECKPART_ARR } from "../../../../core";
import { uiContainer } from "@/inversify.config";
import { UI_TYPES } from "@/types";

const REGEX_CREATED = /#created.+/;
const REGEX_DECKPARTS = /[#!].+\n?/g;

const fileToList = fileContent => {
    const fileParts = fileContent
        .replace(REGEX_CREATED)
        .trim()
        .split(REGEX_DECKPARTS)
        .slice(1);

    return DEFAULT_DECKPART_ARR.map((deckPart, index) =>
        fileParts[index]
            .split(/\n\r?/g)
            .map(line => line.trim())
            .filter(line => line.length > 0)
    );
};

const cardService = uiContainer.get<CardService>(UI_TYPES.CardService);
const cardDatabase = uiContainer.get<CardDatabase>(UI_TYPES.CardDatabase);
class Deck{
    private readonly name: string;
    private readonly main: any[];
    private readonly extra: any[];
    private readonly side: any[];

    constructor(list = [[], [], []], name = "Unnamed") {
        this.name = name;

        this.main = list[0];
        this.extra = list[1];
        this.side = list[2];

        logger.info("CREATED Deck", this);
    }

    static fromUri(uriDeck) {
        return new Deck(uriDeckDecode(uriDeck));
    }

    static fromFile(file) {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = e => {
                const name = file.name.replace(".ydk", "");
                const list = fileToList(e.target.result);

                resolve(new Deck(list, name));
            };

            if (file) {
                reader.readAsText(file);
            } else {
                reject(new Error("could not read file"));
            }
        });
    }

    static fromRemoteFile(uri) {
        return new Promise((resolve, reject) => {
            fetch(uri, {
                mode: "same-origin"
            }).then(res => {
                if (res.ok) {
                    res.text().then(text =>
                        resolve(new Deck(fileToList(text)))
                    );
                } else {
                    reject(res);
                }
            });
        });
    }

    toUri() {
        return uriDeckEncode(this.getList());
    }

    toFile() {
        const fileParts = [];

        DEFAULT_DECKPART_ARR.forEach(deckPart => {
            fileParts.push(deckPart.indicator, ...this[deckPart.id], "");
        });

        return new File([fileParts.join("\n").trim()], `${this.name}.ydk`, {
            type: "text/ydk"
        });
    }

    toText(cardDb) {
        return getShareText(this.getList(), cardDatabase);
    }

    toBuyLink(cardDb) {
        return getBuyLink(this.getAll(), cardDatabase);
    }

    cardCanAdd(deckPart, cardId, cardDb, banlist) {
        const card = cardDatabase.getCard(cardId);
        const cardCount = this.getAll().filter(activeSectionCardId => {
            if (!cardDatabase.hasCard(activeSectionCardId)) {
                return true;
            }
            return cardService.isTreatedAsSame(
                card,
                cardDatabase.getCard(activeSectionCardId)
            );
        }).length;
        return (
            deckPart.check(card) &&
            this[deckPart.id].length < deckPart.max &&
            cardCount < banlist.getVal(card)
        );
    }

    cardAdd(deckPart, cardId, cardDb, banlist) {
        if (this.cardCanAdd(deckPart, cardId, cardDatabase, banlist)) {
            this[deckPart.id].push(cardId);
        }
    }

    cardRemove(deckPart, cardId) {
        let isRemoved = false;

        if (this[deckPart.id].includes(cardId)) {
            this[deckPart.id] = this[deckPart.id].filter(currentCardId => {
                if (isRemoved) return true;
                if (currentCardId === cardId) {
                    isRemoved = true;
                    return false;
                }

                return true;
            });
        }
    }

    getList() {
        return [this.main, this.extra, this.side];
    }

    getAll() {
        return [...this.main, ...this.extra, ...this.side];
    }
};

export default Deck;

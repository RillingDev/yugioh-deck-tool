import { uriDeckDecode, uriDeckEncode } from "./uriDeck";
import { DECKPARTS } from "../data/deck";
import sort from "./sort";
import deepFreeze from "../deepFreeze";
import { getShareText, getBuyLink } from "./toText";
import CardDatabase from "../cardDb/cardDb";

const REGEX_CREATED = /#created.+/;
const REGEX_DECKPARTS = /[#!].+\n?/g;

const fileToList = fileContent => {
    const fileParts = fileContent
        .replace(REGEX_CREATED)
        .trim()
        .split(REGEX_DECKPARTS)
        .slice(1);

    return DECKPARTS.map((deckPart, index) =>
        fileParts[index]
            .split(/\n\r?/g)
            .map(line => line.trim())
            .filter(line => line.length > 0)
    );
};

const Deck = class {
    constructor(list = [[], [], []], name = "Unnamed") {
        this.name = name;
        this.parts = DECKPARTS;

        this.main = list[0];
        this.extra = list[1];
        this.side = list[2];

        this.all = this.getAll();

        deepFreeze(this.parts);

        // eslint-disable-next-line no-console
        console.log("CREATED Deck", this);
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

        DECKPARTS.forEach(deckPart => {
            fileParts.push(deckPart.indicator, ...this[deckPart.id], "");
        });

        return new File([fileParts.join("\n").trim()], `${this.name}.ydk`, {
            type: "text/ydk"
        });
    }
    toText(cardDb) {
        return getShareText(this.getList(), cardDb);
    }
    toBuyLink(cardDb) {
        return getBuyLink(this.all, cardDb);
    }
    cardCanAdd(deckPart, cardId, cardDb, banlist) {
        const card = cardDb.get(cardId);
        const cardCount = this.all.filter(activeSectionCardId =>
            CardDatabase.isTreatedAsSame(card, cardDb.get(activeSectionCardId))
        ).length;

        return (
            deckPart.check(card) &&
            this[deckPart.id].length < deckPart.max &&
            cardCount < banlist.getVal(card)
        );
    }
    cardAdd(deckPart, cardId, cardDb, banlist) {
        if (this.cardCanAdd(deckPart, cardId, cardDb, banlist)) {
            this[deckPart.id].push(cardId);
            this.all = this.getAll();
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
            this.all = this.getAll();
        }
    }
    getList() {
        return [this.main, this.extra, this.side];
    }
    getAll() {
        return [...this.main, ...this.extra, ...this.side];
    }
    sort(cardDb) {
        DECKPARTS.forEach(deckPart => {
            this[deckPart.id] = sort(this[deckPart.id], cardDb);
        });

        return this;
    }
};

export default Deck;

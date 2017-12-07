import {
    forEachEntry,
    arrFrom,
    objValues,
    arrCount,
    arrRemoveItem
} from "lightdash";
import { uriDeckDecode, uriDeckEncode } from "../uriDeck";

const EXTRA_DECK_TYPE_REGEX = /Fusion|Synchro|XYZ|Link/;

const DECKPARTS = [
    {
        id: "main",
        name: "Main",
        indicator: "#main",
        limit: 60,
        check: card => !EXTRA_DECK_TYPE_REGEX.test(card.type)
    },
    {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        limit: 15,
        check: card => EXTRA_DECK_TYPE_REGEX.test(card.type)
    },
    {
        id: "side",
        name: "Side",
        indicator: "!side",
        limit: 15,
        check: () => true
    }
];

const fileToList = function(fileContent) {
    const fileParts = fileContent
        .replace(/#created.+/, "")
        .trim()
        .split(/[#!].+\n?/g)
        .slice(1);

    return DECKPARTS.map((deckPart, index) =>
        fileParts[index]
            .split(/\n\r?/g)
            .map(line => line.trim())
            .filter(line => line.length > 0)
    );
};

const listToText = function(list, cardDb) {
    const result = [];

    DECKPARTS.forEach((deckPart, index) => {
        const deckPartCards = list[index];

        if (deckPartCards.length > 0) {
            const deckPartCardsCounted = arrFrom(
                arrCount(deckPartCards).entries()
            ).map(entry => `${cardDb.getName(entry[0])} x${entry[1]}`);

            result.push(`${deckPart.name}:`, ...deckPartCardsCounted, "");
        }
    });

    return result.join("\n").trim();
};

const Deck = class {
    constructor(list = [[], [], []], name = "Unnamed") {
        this.name = name;
        this.parts = DECKPARTS;

        this.main = list[0];
        this.extra = list[1];
        this.side = list[2];
        this.all = this.getAll();

        console.log("CREATED Deck", this);
    }
    static fromUri(uriDeck) {
        return new Deck(uriDeckDecode(uriDeck));
    }
    static fromFile(file) {
        const reader = new FileReader();

        return new Promise(resolve => {
            reader.onload = e => {
                const name = file.name.replace(".ydk", "");
                const list = fileToList(e.target.result);

                resolve(new Deck(list, name));
            };

            if (file) {
                reader.readAsText(file);
            } else {
                reject(null);
            }
        });
    }
    static fromRemoteFile(uri) {
        return new Promise(resolve => {
            fetch(uri, {
                mode: "same-origin"
            }).then(res => {
                if (res.ok) {
                    res.text().then(text => {
                        const list = convertFileToDeck(text);

                        resolve(new Deck(list));
                    });
                } else {
                    reject(err.statusText);
                }
            });
        });
    }
    toUri() {
        return uriDeckEncode(this.getList());
    }
    toFile() {
        const fileParts = [];

        DECKPARTS.forEach((deckPart, index) => {
            fileParts.push(deckPart.indicator, ...this[deckPart.id], "");
        });

        return new File([fileParts.join("\n").trim()], `${this.name}.ydk`, {
            type: "text/ydk"
        });
    }
    toText(cardDb) {
        return listToText(this.getList(), cardDb);
    }
    cardAdd(deckPart, cardId, cardDb) {
        const activeSection = this[deckPart.id];

        if (
            deckPart.check(cardDb.get(cardId)) &&
            activeSection.length < deckPart.limit &&
            activeSection.filter(
                activeSectionCardId => activeSectionCardId === cardId
            ).length < 3
        ) {
            activeSection.push(cardId);
            this.all = this.getAll();
        }
    }
    cardRemove(deckPart, cardId) {
        const activeSection = this[deckPart.id];

        if (activeSection.includes(cardId)) {
            this[deckPart.id] = arrRemoveItem(activeSection, cardId);
            this.all = this.getAll();
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

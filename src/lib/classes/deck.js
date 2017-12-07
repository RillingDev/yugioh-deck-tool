import { forEachEntry, arrFrom, objValues, arrCount } from "lightdash";
import { uriDeckDecode, uriDeckEncode } from "../uriDeck";

const DECKPARTS = [
    {
        id: "main",
        name: "Main",
        indicator: "#main",
        limit: 60
    },
    {
        id: "extra",
        name: "Extra",
        indicator: "#extra",
        limit: 15
    },
    {
        id: "side",
        name: "Side",
        indicator: "!side",
        limit: 15
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

const getListAll = list => [].concat(...objValues(list));

const Deck = class {
    constructor(list = [[], [], []], name = "Unnamed") {
        this.name = name;
        this.parts = DECKPARTS;
        this.list = list;
        this.listAll = getListAll(list);

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
        return uriDeckEncode(this.list);
    }
    toFile() {
        const fileParts = [];

        DECKPARTS.forEach((deckPart, index) => {
            fileParts.push(deckPart.indicator, ...this.list[index], "");
        });

        return new File([fileParts.join("\n").trim()], `${this.name}.ydk`, {
            type: "text/ydk"
        });
    }
    toText(cardDb) {
        return listToText(this.list, cardDb);
    }
};

export default Deck;

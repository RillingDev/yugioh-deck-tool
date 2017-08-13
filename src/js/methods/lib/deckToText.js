"use strict";

import utilEachObject from "./utilEachObject";

const deckToText = function (vm) {
    const result = [];

    vm.deckparts.forEach(deckpart => {
        const cards = vm.deck.list[deckpart.id];
        const cardAmount = {};

        result.push(`${deckpart.name}:`);

        cards.forEach(cardId => {
            if (cardAmount[cardId]) {
                cardAmount[cardId]++;
            } else {
                cardAmount[cardId] = 1;
            }
        });

        utilEachObject(cardAmount, (amount, cardId) => {
            const cardName = vm.cards.pairs.find(pair => pair[0] === cardId)[1];

            result.push(`${amount}x ${cardName}`);
        });

        result.push("");
    });

    return result.join("\n").trim();
};

export default deckToText;

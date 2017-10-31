const deckToText = function (deckparts, cards, deck) {
    const result = [];

    deckparts.forEach(deckpart => {
        const cards = deck.list[deckpart.id];

        if (cards.length > 0) {
            const cardAmount = new Map();
            const cardCache = [];

            result.push(`${deckpart.name}:`);

            cards.forEach(cardId => {
                if (cardAmount.has(cardId)) {
                    cardAmount.set(cardId, cardAmount.get(cardId) + 1);
                } else {
                    cardAmount.set(cardId, 1);
                }
            });

            cardAmount.forEach((amount, cardId) => {
                const card = cards.pairs.find(pair => pair[0] === String(cardId));
                const cardName = card ? card[1] : `[${cardId}]`;

                cardCache.push(`${cardName} x${amount}`);
            });

            result.push(...cardCache, "");
        }
    });

    return result.join("\n").trim();
};

export default deckToText;

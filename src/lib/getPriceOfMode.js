import {
    isDefined
} from "lightdash";

const getPriceMode = (priceData, priceMode, cardId) => {
    if (priceData.has(cardId)) {
        const val = priceData.get(cardId)[priceMode.id];

        return isDefined(val) ? val : 0;
    } else {
        return 0;
    }
};

export default getPriceMode;

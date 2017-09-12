import clipboard from "clipboard-js/clipboard";
import deckToText from "./lib/deckToText";

const shareText = function () {
    const vm = this;

    clipboard.copy({
        "text/plain": deckToText(vm),
    });
};

export default shareText;

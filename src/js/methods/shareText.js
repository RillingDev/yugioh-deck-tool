"use strict";

import clipboard from "clipboard-js/clipboard";

const shareText = function () {
    const vm = this;

    clipboard.copy({
        "text/plain": "Markup text. Paste me into a rich text editor.",
    });
};

export default shareText;

import convertFileToDeck from "./lib/convertFileToDeck";

const deckLoad = function (file) {
    const reader = new FileReader();
    const vm = this;

    reader.onload = function (e) {
        const fileContent = e.target.result;
        const deckList = convertFileToDeck(fileContent);

        vm.deck.name = file.name.replace(".ydk", "");
        vm.deck.list = deckList;
        vm.deckUpdate();
    };

    reader.readAsText(file);
};

export default deckLoad;

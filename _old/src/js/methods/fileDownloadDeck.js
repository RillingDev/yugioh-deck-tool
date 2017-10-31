import FileSaver from "file-saver/FileSaver";
import convertDeckToFile from "./lib/convertDeckToFile";

const fileDownloadDeck = function () {
    const vm = this;
    const fileData = convertDeckToFile(vm.deck.list);
    const file = new File([fileData], vm.deck.name + ".ydk", {
        type: "text/ydk"
    });

    return FileSaver.saveAs(file);
};

export default fileDownloadDeck;

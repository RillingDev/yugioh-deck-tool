const onFileChange = function (e) {
    const vm = this;
    const files = e.target.files || e.dataTransfer.files;

    vm.deckLoad(files[0]);
};

export default onFileChange;

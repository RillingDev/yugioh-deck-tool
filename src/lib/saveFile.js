const saveFile = file => {
    const el = document.createElement("a");

    el.href = window.URL.createObjectURL(file);
    el.download = file.name;

    el.click();
};

export default saveFile;

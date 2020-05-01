const saveFile = (file: File): void => {
    const el = document.createElement("a");

    el.href = window.URL.createObjectURL(file);
    el.download = file.name;

    document.body.appendChild(el);
    el.click();
    el.remove();
};

export { saveFile };

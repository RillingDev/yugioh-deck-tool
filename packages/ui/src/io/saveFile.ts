const saveFile = (file: File, context: Document): void => {
    const el = context.createElement("a");

    el.href = window.URL.createObjectURL(file);
    el.download = file.name;

    context.body.appendChild(el);
    el.click();
    el.remove();
};

export { saveFile };

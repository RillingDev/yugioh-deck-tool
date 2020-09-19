/**
 * Downloads a file.
 *
 * CAN ONLY BE USED FROM A USER-INITIATED EVENTS HANDLER.
 *
 * @param file File to download.
 * @param context Context to use.
 */
const downloadFile = (file: File, context: Document): void => {
    const el = context.createElement("a");

    el.href = URL.createObjectURL(file);
    el.download = file.name;

    context.body.appendChild(el);
    el.click();
    el.remove();
};

export { downloadFile };

/**
 * Downloads a file.
 *
 * CAN ONLY BE USED FROM A USER-INITIATED EVENTS HANDLER.
 *
 * @param file File to download.
 * @param context Context to use.
 */
export const downloadFile = (file: File, context: Document): void => {
    const objectUrl = URL.createObjectURL(file);

    const el = context.createElement("a");
    el.href = objectUrl;
    el.download = file.name;

    context.body.appendChild(el);
    el.click();

    el.remove();
    URL.revokeObjectURL(objectUrl);
};

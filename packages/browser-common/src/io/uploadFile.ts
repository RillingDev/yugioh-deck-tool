/**
 * Shows the native file upload dialog.
 *
 * CAN ONLY BE USED FROM A USER-INITIATED EVENTS HANDLER.
 *
 * @param accept Accepted file types.
 * @param callback Callback to access files.
 * @param context Context to use.
 */
export const uploadFile = (
    accept: string,
    callback: (files: null | FileList) => void,
    context: Document
): void => {
    const el = context.createElement("input");

    el.type = "file";
    el.accept = accept;
    el.addEventListener("input", (e) => {
        callback((e.target as HTMLInputElement).files);
    });

    context.body.appendChild(el);
    el.click();
    el.remove();
};

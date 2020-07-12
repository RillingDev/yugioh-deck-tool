/**
 * Note: Execution has to be started by a user interaction event.
 *
 * @public
 */
const downloadFile = (
    fileObjectUrl: string,
    fileName: string,
    context: Document
): void => {
    const el = context.createElement("a");

    el.href = fileObjectUrl;
    el.download = fileName;

    context.body.appendChild(el);
    el.click();
    el.remove();
};

export { downloadFile };

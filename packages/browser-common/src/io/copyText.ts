/**
 * Copies text to the clipboard.
 *
 * CAN ONLY BE USED FROM A USER-INITIATED EVENTS HANDLER.
 *
 * @param str Text to copy.
 * @param context Context to use.
 */
export const copyText = (str: string, context: Document): void => {
    const el = context.createElement("textarea");

    el.value = str;

    context.body.appendChild(el);
    el.select();
    context.execCommand("copy");
    el.remove();
};

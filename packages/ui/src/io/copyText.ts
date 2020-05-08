const copyText = (str: string, context: Document): void => {
    const el = context.createElement("textarea");

    el.value = str;

    context.body.appendChild(el);
    el.select();
    context.execCommand("copy");
    el.remove();
};

export { copyText };

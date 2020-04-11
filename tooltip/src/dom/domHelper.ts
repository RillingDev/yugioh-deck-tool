export const createElement = (
    type: string,
    classes: string[] = []
): HTMLElement => {
    const element = document.createElement(type);
    classes.forEach((className) => element.classList.add(className));
    return element;
};

export const createDiv = (
    children: HTMLElement[],
    classes: string[] = []
): HTMLDivElement => {
    const element = createElement("span", classes) as HTMLDivElement;
    children.forEach((child) => element.appendChild(child));
    return element;
};

export const createSpan = (
    textContent: string,
    classes: string[] = []
): HTMLSpanElement => {
    const element = createElement("span", classes) as HTMLSpanElement;
    element.textContent = textContent;
    return element;
};

export const createParagraph = (
    textContent: string,
    classes: string[] = []
): HTMLSpanElement => {
    const element = createElement("p", classes) as HTMLParagraphElement;
    element.textContent = textContent;
    return element;
};

export const createImg = (
    src: string,
    classes: string[] = []
): HTMLImageElement => {
    const element = createElement("img", classes) as HTMLImageElement;
    element.src = src;
    return element;
};

export const px = (val: number): string => `${val}px`;

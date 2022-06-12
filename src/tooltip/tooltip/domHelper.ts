const createElement = (
	type: string,
	classes: string[],
	children: HTMLElement[]
): HTMLElement => {
	const element = document.createElement(type);
	if (classes.length > 0) {
		element.classList.add(...classes);
	}
	element.append(...children);
	return element;
};

export const createDiv = (
	classes: string[],
	children: HTMLElement[]
): HTMLDivElement => createElement("div", classes, children) as HTMLDivElement;

export const createUl = (
	classes: string[],
	children: HTMLElement[]
): HTMLUListElement =>
	createElement("ul", classes, children) as HTMLUListElement;

export const createLi = (
	classes: string[],
	textContent: string
): HTMLLIElement => {
	const element = createElement("li", classes, []) as HTMLLIElement;
	element.textContent = textContent;
	return element;
};

export const createSpan = (
	classes: string[],
	textContent: string
): HTMLSpanElement => {
	const element = createElement("span", classes, []) as HTMLSpanElement;
	element.textContent = textContent;
	return element;
};

export const createP = (
	classes: string[],
	textContent: string
): HTMLSpanElement => {
	const element = createElement("p", classes, []) as HTMLParagraphElement;
	element.textContent = textContent;
	return element;
};

export const createImg = (
	classes: string[],
	src: string,
	aria: {
		hidden: boolean;
		alt: string;
	}
): HTMLImageElement => {
	const element = createElement("img", classes, []) as HTMLImageElement;
	element.src = src;
	element.alt = aria.alt;
	if (aria.hidden) {
		element.setAttribute("aria-hidden", "true");
	}

	return element;
};

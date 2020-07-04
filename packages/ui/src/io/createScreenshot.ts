import html2canvas from "html2canvas";

/**
 * Creates a screenshot of the given element and creates a data URL for it.
 *
 * @param el Element to screenshot.
 * @return Data URL.
 */
export const createScreenshot = async (el: HTMLElement): Promise<string> => {
    const canvas = await html2canvas(el, { scale: 2 });
    return canvas.toDataURL("image/png");
};

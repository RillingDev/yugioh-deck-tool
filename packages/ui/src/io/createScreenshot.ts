import html2canvas from "html2canvas";

export const SCREENSHOT_IMAGE_TYPE_MIME = "image/png";
export const SCREENSHOT_IMAGE_TYPE_EXTENSION = "png";

/**
 * Creates a screenshot of the given element and creates a data URL for it.
 *
 * @param el Element to screenshot.
 * @param options Canvas options.
 * @return Data URL.
 */
export const createScreenshot = async (
    el: HTMLElement,
    options: {
        scale?: number;
        onClone?: (doc: Document) => void;
    }
): Promise<string> => {
    const canvas = await html2canvas(el, {
        scale: options.scale,
        onclone: options.onClone,
    });
    return canvas.toDataURL(SCREENSHOT_IMAGE_TYPE_MIME);
};

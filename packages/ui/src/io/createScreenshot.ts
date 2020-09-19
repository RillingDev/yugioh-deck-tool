import html2canvas from "html2canvas";

const SCREENSHOT_IMAGE_TYPE_MIME = "image/png";
const SCREENSHOT_IMAGE_TYPE_EXTENSION = "png";

/**
 * Creates a screenshot of the given element and creates a data URL for it.
 *
 * @param el Element to screenshot.
 * @param filenameBase Filename up until extension (e.g. "foo" to receive a file with the name "foo.png")
 * @param options Canvas options.
 * @return Image file.
 */
export const createScreenshot = async (
    el: HTMLElement,
    filenameBase: string,
    options: {
        scale?: number;
        onClone?: (doc: Document) => void;
    }
): Promise<File> => {
    const canvas = await html2canvas(el, {
        scale: options.scale,
        onclone: options.onClone,
    });

    const fileName = `${filenameBase}.${SCREENSHOT_IMAGE_TYPE_EXTENSION}`;
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob == null) {
                reject(new TypeError("Could not convert canvas to blob."));
            }
            resolve(new File([blob!], fileName));
        }, SCREENSHOT_IMAGE_TYPE_MIME);
    });
};

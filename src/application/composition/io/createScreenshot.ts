import type { Options } from "html2canvas";
import html2canvas from "html2canvas";

const SCREENSHOT_IMAGE_MIME_TYPE = "image/png";
const SCREENSHOT_IMAGE_MIME_TYPE_EXTENSION = "png";

/**
 * Creates a screenshot of the given element.
 *
 * @param el Element to screenshot.
 * @param filenameBase Filename up until extension (e.g. "foo" to receive a file with the name "foo.png")
 * @param options Canvas options.
 * @return Image file.
 */
export const createScreenshot = async (
	el: HTMLElement,
	filenameBase: string,
	options: Partial<Options>
): Promise<File> => {
	const canvas = await html2canvas(el, options);

	const fileName = `${filenameBase}.${SCREENSHOT_IMAGE_MIME_TYPE_EXTENSION}`;
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob == null) {
				reject(new TypeError("Could not convert canvas to blob."));
			}
			resolve(
				new File([blob!], fileName, {
					type: blob!.type,
				})
			);
		}, SCREENSHOT_IMAGE_MIME_TYPE);
	});
};

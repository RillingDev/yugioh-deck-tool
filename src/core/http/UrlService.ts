import { injectable } from "inversify";

@injectable()
export class UrlService {
	/**
	 * Gets the file name of a request to a file, or an empty is string if none is found.
	 *
	 * @param url URL to check.
	 * @return File name or empty string.
	 */
	getFileName(url: URL): string {
		const pathname = url.pathname;
		if (!pathname.includes("/")) {
			return "";
		}
		return pathname.substring(pathname.lastIndexOf("/") + 1);
	}
}

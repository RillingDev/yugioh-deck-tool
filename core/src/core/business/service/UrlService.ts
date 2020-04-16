import { injectable } from "inversify";

import parseUrl from "url-parse";

/**
 * @public
 */
@injectable()
class UrlService {
    /**
     * Checks if two URLs have the same origin.
     *
     * @param urlA First URL.
     * @param urlB Second URL.
     * @return If they have the same URL.
     */
    public hasSameOrigin(urlA: string, urlB: string): boolean {
        return parseUrl(urlA).origin === parseUrl(urlB).origin;
    }

    /**
     * Gets the file name of a request to a file, or an empty is string if none is found.
     *
     * @param url URL to check.
     * @return File name or empty string.
     */
    public getFileName(url: string): string {
        const pathname = parseUrl(url).pathname;
        if (!pathname.includes("/")) {
            return "";
        }
        return pathname.substr(pathname.lastIndexOf("/") + 1);
    }

    /**
     * Returns the value of the single query parameter value of an URL.
     * DOES NOT WORK WITH MORE THAN ONE PARAMETER.
     *
     * @param url Url to check.
     * @param key Key to get.
     * @param validate If the URL should be validated. can not be used when the URL might contain illegal characters.
     * @return Query value or null.
     */
    public getSingleQueryParam(
        url: string,
        key: string,
        validate = true
    ): string | null {
        const parsed = parseUrl(url, validate);
        if (validate) {
            return parsed.query[key] ?? null;
        }

        // If `validate` is false, parseUrl sets a string here instead of the defined type.
        const queryString = (parsed.query as unknown) as string;
        const searchString = `?${key}=`;
        if (!queryString.includes(searchString)) {
            return null;
        }
        return queryString.replace(searchString, "");
    }
}

export { UrlService };

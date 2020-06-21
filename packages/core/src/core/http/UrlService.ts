import { injectable } from "inversify";

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
        return new URL(urlA).origin === new URL(urlB).origin;
    }

    /**
     * Gets the file name of a request to a file, or an empty is string if none is found.
     *
     * @param url URL to check.
     * @return File name or empty string.
     */
    public getFileName(url: string): string {
        const pathname = new URL(url).pathname;
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
        if (validate) {
            return new URL(url).searchParams.get(key);
        }

        // Very primitive fallback that does not actually convert URL characters
        const searchString = `?${key}=`;
        if (!url.includes(searchString)) {
            return null;
        }
        return url.substr(url.indexOf(searchString) + searchString.length);
    }
}

export { UrlService };

import { injectable } from "inversify";

@injectable()
export class UrlService {
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
}

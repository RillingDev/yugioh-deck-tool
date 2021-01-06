import { APPLICATION_TYPES } from "../types";
import type {
    Deck,
    DeckFileService,
    DeckService,
    DeckUriEncodingService,
    UrlService,
} from "../../../core/src/main";
import { getLogger } from "../../../core/src/main";
import { inject, injectable } from "inversify";

/**
 * @private
 */
@injectable()
export class DeckUrlController {
    private static readonly logger = getLogger(DeckUrlController);

    private static readonly PARAM_ENCODED_URI_DECK = "e";
    private static readonly PARAM_REMOTE_DECK = "u";

    private readonly deckService: DeckService;
    private readonly deckUriEncodingService: DeckUriEncodingService;
    private readonly deckFileService: DeckFileService;

    constructor(
        @inject(APPLICATION_TYPES.DeckService)
        deckService: DeckService,
        @inject(APPLICATION_TYPES.DeckUriEncodingService)
        deckUriEncodingService: DeckUriEncodingService,
        @inject(APPLICATION_TYPES.DeckFileService)
        deckFileService: DeckFileService
    ) {
        this.deckService = deckService;
        this.deckUriEncodingService = deckUriEncodingService;
        this.deckFileService = deckFileService;
    }

    /**
     * Loads referenced deck from current URL, if any exist.
     *
     * @param url current URL.
     * @return Parsed deck or null if none is found.
     */
    public async loadUriDeck(url: URL): Promise<Deck | null> {
        // Load deck file from a remote URL
        const remoteUrlValue = url.searchParams.get(
            DeckUrlController.PARAM_REMOTE_DECK
        );
        if (remoteUrlValue != null) {
            const importResult = await this.deckFileService.fromRemoteFile(
                location.origin,
                remoteUrlValue
            );
            if (importResult.missing.length > 0) {
                DeckUrlController.logger.warn(
                    `Could not read ${importResult.missing.length} cards in remote deck.`
                );
            }
            return importResult.deck;
        }

        // Load encoded uri deck
        const uriEncodedDeck = url.searchParams.get(
            DeckUrlController.PARAM_ENCODED_URI_DECK
        );
        if (uriEncodedDeck != null) {
            return this.deckUriEncodingService.fromUrlQueryParamValue(
                uriEncodedDeck
            );
        }

        return Promise.resolve(null);
    }

    /**
     * Encodes a deck into a shareable URL.
     *
     * @param deck Deck to encode.
     * @return Shareable link.
     */
    public getShareLink(deck: Deck): URL {
        const url = new URL(location.href);
        url.search = "";
        if (this.deckService.getAllCards(deck).length > 0) {
            url.searchParams.append(
                DeckUrlController.PARAM_ENCODED_URI_DECK,
                this.deckUriEncodingService.toUrlQueryParamValue(deck)
            );
        }
        return url;
    }
}

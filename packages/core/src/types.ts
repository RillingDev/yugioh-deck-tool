export const INTERNAL_TYPES = {
    CardLinkingService: Symbol.for("CardLinkingService"),
} as const;

export const TYPES = {
    EnvironmentConfig: Symbol.for("EnvironmentConfig"),

    HttpService: Symbol.for("HttpService"),
    UrlService: Symbol.for("UrlService"),

    CardDataLoaderService: Symbol.for("CardDataLoaderService"),
    CardDatabase: Symbol.for("CardDatabase"),
    CardService: Symbol.for("CardService"),
    CardPredicateService: Symbol.for("CardPredicateService"),

    BanlistService: Symbol.for("BanlistService"),
    PriceService: Symbol.for("PriceService"),
    SortingService: Symbol.for("SortingService"),
    FilterService: Symbol.for("FilterService"),

    DeckService: Symbol.for("DeckService"),
    DeckExportService: Symbol.for("DeckExportService"),
    DeckFileService: Symbol.for("DeckFileService"),
    DeckUriEncodingService: Symbol.for("DeckUriEncodingService"),
    DeckRandomizationService: Symbol.for("DeckRandomizationService"),
} as const;

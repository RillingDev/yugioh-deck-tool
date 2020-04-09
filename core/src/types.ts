const TYPES = {
    CardDatabase: Symbol.for("CardDatabase"),

    CardDataLoaderService: Symbol.for("CardDataLoaderService"),
    CardService: Symbol.for("CardService"),

    DeckService: Symbol.for("DeckService"),
    DeckExportService: Symbol.for("DeckExportService"),
    DeckFileService: Symbol.for("DeckFileService"),
    DeckUriEncodingService: Symbol.for("DeckUriEncodingService"),
    DeckRandomizationService: Symbol.for("DeckRandomizationService"),

    PriceService: Symbol.for("PriceService"),
    SortingService: Symbol.for("SortingService"),
    FilterService: Symbol.for("FilterService"),

    HttpService: Symbol.for("HttpService"),
    UrlService: Symbol.for("UrlService"),
};

export { TYPES };

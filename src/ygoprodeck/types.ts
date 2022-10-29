export const YGOPRODECK_INTERNAL_TYPES = {
	YgoprodeckApiService: Symbol.for("YgoprodeckApiService"),
	CardDataLoaderService: Symbol.for("CardDataLoaderService"),
} as const;

export const YGOPRODECK_TYPES = {
	YgoprodeckService: Symbol.for("YgoprodeckService"),
	ResourceService: Symbol.for("ResourceService"),
} as const;

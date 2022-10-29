import type { interfaces } from "inversify";
import { ContainerModule } from "inversify";
import { YGOPRODECK_INTERNAL_TYPES, YGOPRODECK_TYPES } from "./types";
import { YgoprodeckCardDataLoaderService } from "./api/YgoprodeckCardDataLoaderService";
import { YgoprodeckApiService } from "./api/YgoprodeckApiService";
import { YgoprodeckService } from "./api/YgoprodeckService";
import type { CardDatabase } from "@/core/lib";
import { TYPES } from "@/core/lib";
import { ResourceService } from "./api/ResourceService";
import { YgoprodeckCardDatabase } from "@/ygoprodeck/api/YgoprodeckCardDatabase";

/**
 * Module containing ygoprodeck.com providers.
 */
export const ygoprodeckModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<YgoprodeckApiService>(
		YGOPRODECK_INTERNAL_TYPES.YgoprodeckApiService
	).to(YgoprodeckApiService);
	bind<YgoprodeckCardDataLoaderService>(
		YGOPRODECK_INTERNAL_TYPES.CardDataLoaderService
	).to(YgoprodeckCardDataLoaderService);

	bind<YgoprodeckService>(YGOPRODECK_TYPES.YgoprodeckService).to(
		YgoprodeckService
	);
	bind<ResourceService>(YGOPRODECK_TYPES.ResourceService).to(ResourceService);

	bind<CardDatabase>(TYPES.CardDatabase)
		.to(YgoprodeckCardDatabase)
		.inSingletonScope();
});

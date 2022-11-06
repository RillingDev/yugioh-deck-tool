import { YgoprodeckApiService } from "./api/YgoprodeckApiService";
import { YgoprodeckService } from "./api/YgoprodeckService";
import type { EnvironmentConfig } from "@/core/lib";
import { ResourceService } from "./api/ResourceService";
import { YgoprodeckCardDatabase } from "@/ygoprodeck/api/YgoprodeckCardDatabase";

interface YgoprodeckModule {
	resourceService: ResourceService;
	ygoprodeckService: YgoprodeckService;
	cardDatabase: YgoprodeckCardDatabase;
}

/**
 * Module containing ygoprodeck.com providers.
 */
export const createYgoprodeckModule = (
	environmentConfig: EnvironmentConfig
): YgoprodeckModule => {
	const resourceService = new ResourceService(environmentConfig);
	const ygoprodeckApiService = new YgoprodeckApiService(
		environmentConfig,
		resourceService
	);
	const ygoprodeckService = new YgoprodeckService(
		ygoprodeckApiService,
		environmentConfig
	);
	const ygoprodeckCardDatabase = new YgoprodeckCardDatabase(
		ygoprodeckApiService
	);

	return {
		resourceService,
		ygoprodeckService,
		cardDatabase: ygoprodeckCardDatabase,
	};
};

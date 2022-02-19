import "reflect-metadata";

import { createCard } from "../../../helper/dataFactories";
import { Container } from "inversify";
import type { BanlistService } from "@/core/main";
import { baseModule } from "@/core/main";
import { TYPES } from "@/core/main";
import { Format } from "@/core/main";
import { DefaultBanState } from "@/core/main";
import type { CardDataLoaderService } from "@/core/main";
import { MockDataLoaderService } from "../../../helper/MockDataLoaderService";

describe("BanlistService", () => {
	let banlistService: BanlistService;

	beforeEach(() => {
		const container = new Container();
		container.load(baseModule);
		container
			.bind<CardDataLoaderService>(TYPES.CardDataLoaderService)
			.to(MockDataLoaderService);

		banlistService = container.get<BanlistService>(TYPES.BanlistService);
	});

	describe("hasBanlist", () => {
		it("returns true only for TCG, OCG and GOAT", () => {
			expect(banlistService.hasBanlist(Format.TCG)).toBe(true);
			expect(banlistService.hasBanlist(Format.OCG)).toBe(true);
			expect(banlistService.hasBanlist(Format.GOAT)).toBe(true);

			expect(banlistService.hasBanlist(Format.DUEL_LINKS)).toBe(false);
		});
	});

	describe("getBanStateByFormat", () => {
		it("returns UNLIMITED if format is null", () => {
			expect(
				banlistService.getBanStateByFormat(
					createCard({ passcode: "123" }),
					null
				)
			).toBe(DefaultBanState.UNLIMITED);
		});

		it("returns BANNED if the format is not listed for this card", () => {
			expect(
				banlistService.getBanStateByFormat(
					createCard({ passcode: "123", formats: [Format.GOAT] }),
					Format.RUSH_DUEL
				)
			).toBe(DefaultBanState.BANNED);
		});

		it("returns UNLIMITED if the format has no banlist", () => {
			expect(
				banlistService.getBanStateByFormat(
					createCard({
						passcode: "123",
						formats: [Format.RUSH_DUEL],
						banlist: {
							[Format.TCG]: DefaultBanState.LIMITED,
							[Format.OCG]: DefaultBanState.LIMITED,
							[Format.GOAT]: DefaultBanState.LIMITED,
						},
					}),
					Format.RUSH_DUEL
				)
			).toBe(DefaultBanState.UNLIMITED);
		});

		it("returns banlist if the format has a banlist", () => {
			expect(
				banlistService.getBanStateByFormat(
					createCard({
						passcode: "123",
						formats: [Format.TCG],
						banlist: {
							[Format.TCG]: DefaultBanState.LIMITED,
							[Format.OCG]: DefaultBanState.LIMITED,
							[Format.GOAT]: DefaultBanState.LIMITED,
						},
					}),
					Format.TCG
				)
			).toBe(DefaultBanState.LIMITED);
		});
	});
});

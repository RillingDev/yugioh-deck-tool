import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "@yugioh-deck-tool/core";
import { baseModule } from "@yugioh-deck-tool/core";
import type { PriceService } from "@yugioh-deck-tool/core";
import { createCard } from "../../helper/dataFactories";
import type { Vendor } from "@yugioh-deck-tool/core";
import { DefaultVendor } from "@yugioh-deck-tool/core";
import { DefaultCurrency } from "@yugioh-deck-tool/core";
import type { CardDataLoaderService } from "@yugioh-deck-tool/core";
import { MockDataLoaderService } from "../../helper/MockDataLoaderService";

describe("PriceService", () => {
	let priceService: PriceService;

	beforeEach(() => {
		const container = new Container();
		container.load(baseModule);
		container
			.bind<CardDataLoaderService>(TYPES.CardDataLoaderService)
			.to(MockDataLoaderService);

		priceService = container.get<PriceService>(TYPES.PriceService);
	});

	describe("formatPrice", () => {
		it("formats", () => {
			expect(
				priceService.formatPrice(10.1234, DefaultCurrency.USD)
			).toEqual("$10.12");
		});
	});

	describe("getPrice", () => {
		it("excludes without data", () => {
			const card1 = createCard({
				passcode: "123",
				prices: new Map<Vendor, number>([
					[DefaultVendor.COOL_STUFF_INC, 1000],
				]),
			});
			expect(
				priceService.getPrice([card1], DefaultVendor.TCG_PLAYER)
			).toEqual({
				price: 0,
				missing: [card1],
			});
		});

		it("uses price for vendor", () => {
			const card1 = createCard({
				passcode: "123",
				prices: new Map<Vendor, number>([
					[DefaultVendor.TCG_PLAYER, 999],
					[DefaultVendor.COOL_STUFF_INC, 1000],
				]),
			});
			expect(
				priceService.getPrice([card1], DefaultVendor.COOL_STUFF_INC)
			).toEqual({
				price: 1000,
				missing: [],
			});
		});

		it("returns sum of prices", () => {
			const card1 = createCard({
				passcode: "123",
				prices: new Map<Vendor, number>([
					[DefaultVendor.TCG_PLAYER, 500],
				]),
			});
			const card2 = createCard({
				passcode: "456",
				prices: new Map<Vendor, number>([
					[DefaultVendor.TCG_PLAYER, 100],
				]),
			});
			const card3 = createCard({
				passcode: "789",
				prices: new Map<Vendor, number>([]),
			});
			expect(
				priceService.getPrice(
					[card1, card1, card2, card3],
					DefaultVendor.TCG_PLAYER
				)
			).toEqual({
				price: 1100,
				missing: [card3],
			});
		});
	});
});

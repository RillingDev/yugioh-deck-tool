import type {CardDatabase} from "@/core/lib";
import {vi} from "vitest";

export class MockCardDatabase implements CardDatabase {
	getArchetypes = vi.fn();

	getAttributes = vi.fn();

	getCard = vi.fn();

	getCards = vi.fn();

	getLevels = vi.fn();

	getLinkMarkers = vi.fn();

	getSets = vi.fn();

	getSubTypes = vi.fn();

	getTypes = vi.fn();

	hasCard = vi.fn();

	prepareAll = vi.fn();

	prepareCard = vi.fn();
}

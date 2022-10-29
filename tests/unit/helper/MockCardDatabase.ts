import type { Card, CardDatabase, CardType } from "@/core/lib";
import type { CardSet } from "@/core/lib";
import { injectable } from "inversify";
import type { CardTypeCategory } from "@/core/lib";
import type { FindCardBy } from "@/core/lib";

@injectable()
export class MockCardDatabase implements CardDatabase {
	getArchetypes(): string[] {
		return [];
	}

	getAttributes(): string[] {
		return [];
	}

	getCard(): Card | null {
		return null;
	}

	getCards(): Card[] {
		return [];
	}

	getLevels(): number[] {
		return [];
	}

	getLinkMarkers(): string[] {
		return [];
	}

	getSets(): CardSet[] {
		return [];
	}

	getSubTypes(): string[] {
		return [];
	}

	getTypes(): CardType[] {
		return [];
	}

	hasCard(): boolean {
		return false;
	}

	prepareAll(): Promise<void> {
		return Promise.resolve(undefined);
	}

	prepareCard(): Promise<string | null> {
		return Promise.resolve(null);
	}
}

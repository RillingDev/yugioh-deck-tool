import { createCard } from "../../helper/dataFactories";
import { bindReferenceLink } from "@/tooltip/tooltip/bindReferenceLink";
import { describe, expect, it } from "vitest";

describe("bindReferenceLink", () => {
	it("creates link to ygoprodeck db", () => {
		const anchorElement = document.createElement("a");
		const card1 = createCard({ passcode: "123", name: "Foo Bar" });

		bindReferenceLink(anchorElement, card1);

		expect(anchorElement.href).toEqual(
			"https://ygoprodeck.com/card/?search=Foo+Bar"
		);
		expect(anchorElement.target).toEqual("_blank");
		expect(anchorElement.rel).toEqual("noopener");
	});
});

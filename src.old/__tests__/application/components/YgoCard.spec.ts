import { mount } from "@vue/test-utils";
import YgoCard from "../../../../src/application/components/YgoCard.vue";
import type { Card } from "@/core/lib";
import { createCard } from "../../helper/dataFactories";
import type { ComponentOptions } from "vue";
import type { ResourceService } from "@/ygoprodeck/api/ResourceService";

import { describe, expect, it, vi } from "vitest";

vi.mock("@/application/ctx", () => {
	return {
		resourceService: {
			getPlaceholderCardImageUrl() {
				return "placeholderCardImageUrl";
			},
		} as ResourceService,
	};
});

describe("YgoCard.vue", () => {
	it("binds card name", () => {
		const card: Card = createCard({ passcode: "123", name: "foo" });

		const wrapper = mount(YgoCard as ComponentOptions<Vue>, {
			propsData: { card },
		});

		expect(wrapper.attributes()["data-name"]).toEqual("foo");
	});
});

<template>
    <a
        :data-name="card.name"
        class="card"
        tabindex="0"
        @click="(e) => onClick(e)"
    >
        <img
            :alt="card.name"
            :class="{ 'card__img--vertically-scaling': scaleVertically }"
            :src="imgSrc"
            class="card__img"
        />
    </a>
</template>

<script lang="ts">
import type { PropType } from "@vue/composition-api";
import { computed, defineComponent } from "@vue/composition-api";
import type { Card } from "../../../core/src/main";
import { imageUrlCardPlaceholder } from "../../../ui/src/main";

export default defineComponent({
    props: {
        card: {
            required: true,
            type: Object as PropType<Card>,
        },
        scaleVertically: {
            required: false,
            type: Boolean as PropType<boolean>,
            default: false,
        },
    },
    setup(props, context) {
        const imgSrc = computed<string>(
            () => props.card.image?.urlSmall ?? imageUrlCardPlaceholder()
        );
        const onClick = (e: Event): void => context.emit("click", e);

        return { imgSrc, onClick };
    },
});
</script>

<style lang="scss">
@import "../../../ui/src/styles/variables";

.deck-tool,
.deck-tool__portal {
    .card {
        display: block; // Make sure link covers full card
        &:focus {
            outline: 4px solid $black;
        }
    }

    .card__img {
        width: 100%;
        height: auto;
        pointer-events: none; // Allow "clicking through" to parent link.

        &--vertically-scaling {
            width: auto;
            height: 100%;
        }
    }
}
</style>

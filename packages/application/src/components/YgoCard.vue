<template>
    <a :data-name="card.name" class="card" tabindex="0">
        <img
            :alt="card.name"
            :class="{ 'card__img--vertically-scaling': scaleVertically }"
            :src="imgSrc"
            class="card__img"
        />
    </a>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@vue/composition-api";
import { Card } from "../../../core/src/main";
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
    setup(props) {
        const imgSrc = computed<string>(
            () => props.card.image?.urlSmall ?? imageUrlCardPlaceholder()
        );

        return { imgSrc };
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
            outline: 3px solid $blue;
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

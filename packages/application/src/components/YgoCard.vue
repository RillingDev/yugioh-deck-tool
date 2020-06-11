<template>
    <a :data-name="name" class="card">
        <img
            :alt="name"
            :class="scaleVertically ? 'card__img--vertically-scaling' : ''"
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
            default: () => false,
        },
    },
    setup(props) {
        const imgSrc = computed<string>(
            () => props.card.image?.urlSmall ?? imageUrlCardPlaceholder()
        );
        const name = computed<string>(() => props.card.name);

        return { name, imgSrc };
    },
});
</script>

<style lang="scss">
.deck-tool,
.deck-tool__modal {
    .card {
        display: block; // Make sure link covers full card
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

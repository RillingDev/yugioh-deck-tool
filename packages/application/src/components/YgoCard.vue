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
import { PropType } from "vue";
import { computed, defineComponent } from "@vue/composition-api";
import { Card } from "../../../core/src/main";

export default defineComponent({
    props: {
        card: {
            required: true,
            type: Object as PropType<Card>,
        },
        scaleVertically: {
            required: false,
            type: Boolean,
            default: () => false,
        },
    },
    setup(props) {
        const name = computed(() => props.card.name);
        const imgSrc = computed(() => props.card.image.urlSmall);

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

<template>
    <a :data-name="name" @contextmenu="(e) => onCardRightClick(e)" class="card">
        <img
            :alt="name"
            :class="scaleVertically ? 'card__img--vertically-scaling' : ''"
            :src="imgSrc"
            class="card__img"
        />
    </a>
</template>

<script lang="ts">
import { Card } from "yugioh-deck-tool-core/src/main";
import { PropType } from "vue";
import { computed, defineComponent } from "@vue/composition-api";

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
    setup(props, context) {
        const name = computed(() => props.card.name);
        const imgSrc = computed(() => props.card.image.urlSmall);
        const onRightClick = (e: Event) => {
            context.emit("right-click", null);
        };

        return { name, imgSrc, onCardRightClick: onRightClick };
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

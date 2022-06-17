<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onBeforeUnmount,
  onMounted
} from 'vue';

export default defineComponent({
  name: 'BalSlider',

  emits: ['update:modelValue'],

  props: {
    modelValue: { type: Number, default: 0 },
    max: { type: Number, default: 1 }
  },

  setup(props, { emit }) {
    const dragging = ref(false);
    const startX = ref(0);
    const slider = ref(null);
    const sliderSize = ref(0);
    const startPos = ref(0);

    function resetSize() {
      if (slider.value) {
        sliderSize.value = slider.value['clientWidth'];
      }
    }
    onMounted(() => {
      resetSize();
      window.addEventListener('resize', resetSize);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', resetSize);
    });

    const barStyles = computed(() => ({
      width: `${props.modelValue * 100}%`
    }));

    const wrapperStyle = computed(() => ({
      left: `${props.modelValue * 100}%`
    }));
    const currentPos = computed(() => {
      return `${(props.modelValue / props.max) * 100}%`;
    });
    function onDragStart(event: Event) {
      dragging.value = true;

      const { type } = event;
      let { clientX } = event as MouseEvent;
      if (type === 'touchstart') {
        const touch = (event as TouchEvent).touches;
        clientX = touch[0].clientX;
      }
      startX.value = clientX;
      startPos.value = parseFloat(currentPos.value);
    }
    function onButtonDown(event: MouseEvent) {
      event.preventDefault();
      onDragStart(event);
      window.addEventListener('mousemove', onDragging);
      window.addEventListener('mouseup', onDragEnd);
      window.addEventListener('touchmove', onDragging);
      window.addEventListener('touchend', onDragEnd);
      window.addEventListener('contextmenu', onDragEnd);
    }
    function onDragging(e: Event) {
      const event = e;

      if (!dragging.value) {
        return;
      }
      let diff = 0;

      const currentX = (event as MouseEvent).clientX;
      diff = currentX - startX.value;

      diff = (diff / sliderSize.value) * 100;
      const newPos = startPos.value + diff;
      setPosition(newPos);
    }
    function setPosition(pos) {
      let newPos = pos;
      if (newPos === null || isNaN(newPos)) {
        return;
      }

      if (newPos > 100) {
        newPos = 100;
      } else if (newPos < 0) {
        newPos = 0;
      }

      let value = Math.round(newPos) * 0.01;
      value = Number(parseFloat(`${value}`).toFixed(2));

      emit('update:modelValue', value);
    }
    function onDragEnd() {
      if (dragging.value) {
        setTimeout(() => {
          dragging.value = false;
        }, 0);
        window.removeEventListener('mousemove', onDragging);
        window.removeEventListener('touchmove', onDragging);
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('touchend', onDragEnd);
        window.removeEventListener('contextmenu', onDragEnd);
      }
    }

    return {
      barStyles,
      wrapperStyle,
      onButtonDown,
      slider
    };
  }
});
</script>

<template>
  <div class="relative m-3" ref="slider">
    <div class="progress-track ">
      <div class="progress-bar h-2 bg-green-400" :style="barStyles" />
    </div>
    <div
      class="slider-btn w-5 h-5 border-2 absolute rounded-full transform -translate-x-2 -translate-y-3.5  bg-blue-400 cursor-pointer"
      :style="wrapperStyle"
      @mousedown="onButtonDown"
      @touchstart="onButtonDown"
    ></div>
  </div>
</template>

<style scoped>
.progress-track {
  @apply w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex;
}

.progress-bar {
  /* transition: all 0.3s ease; */
}
</style>

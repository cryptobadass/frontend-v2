<script lang="ts">
import { format } from 'date-fns';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BalSlider',

  emits: ['update:modelValue'],

  props: {
    modelValue: { type: String, default: '' },
    min: { type: Number, default: new Date().getTime() }
  },

  setup(props, { emit }) {
    const day = ref<any>('');
    const time = ref('');

    console.log('props,', props.modelValue);

    if (props.modelValue) {
      console.log(props.modelValue);
    }

    function dayChange(v) {
      if (v) {
        if (!time.value) {
          time.value = '00:00';
        }
      } else {
        time.value = '';
      }
      setDate();
    }
    function timeChange(v) {
      if (v) {
        console.log('change', v);
      } else {
        day.value = '';
      }
      setDate();
    }
    function setDate() {
      console.log(day.value, time.value);
      if (day.value) {
        let str =
          format(day.value, 'yyyy/MM/dd') + ' ' + (time.value || '00:00');
        emit('update:modelValue', new Date(str));
      } else {
        emit('update:modelValue', null);
      }
    }

    return {
      day,
      time,
      dayChange,
      timeChange
    };
  }
});
</script>

<template>
  <div class="relative m-3" ref="slider">
    <el-date-picker
      v-model="day"
      type="date"
      placeholder="Pick a day"
      @change="dayChange"
      format="d MMM YYYY"
    />
    <div class="w-36 inline-block">
      <el-time-select
        v-model="time"
        start="00:00"
        step="00:30"
        end="23:30"
        placeholder="Select time"
        @change="timeChange"
      />
    </div>
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

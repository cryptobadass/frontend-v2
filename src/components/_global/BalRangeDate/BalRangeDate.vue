<script lang="ts">
import { fromUnixTime, format, setDate } from 'date-fns';
import {
  defineComponent,
  computed,
  ref,
  onBeforeUnmount,
  onMounted,
  watch
} from 'vue';

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

    console.log('props,',props.modelValue)

    if (props.modelValue) {
      console.log(props.modelValue);
     
      // time.value = format(
      //   fromUnixTime(new Date(props.modelValue).getTime() / 1000),
      //   'HH:mm'
      // );
    }

    // const day = computed(() => {
    //   return props.modelValue?'' :''
    // });
    // const time = computed(()=>{
    //   return props.modelValue?'' :''
    // })

    // emit('update:modelValue', value);
    function dayChange(v) {
      if (v) {
        // let d = format(fromUnixTime(v.getTime() / 1000), 'yyyy/MM/dd');
        // console.log('change', d);
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
        // let d = format(fromUnixTime(v.getTime() / 1000), 'HH:mm');
        console.log('change', v);
      } else {
        day.value = '';
      }
      setDate();
    }
    function setDate() {
      console.log(day.value, time.value);
      if (day.value) {
        // let _day = day.value;
        let str =
          format(day.value, 'yyyy/MM/dd') + ' ' + (time.value || '00:00');
        emit('update:modelValue', new Date(str));
      } else {
        emit('update:modelValue', null);
      }
    }

    // watch(day, () => {
    //   console.log('watch',day.value)
    // });

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

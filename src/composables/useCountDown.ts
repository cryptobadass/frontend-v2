import { differenceInSeconds, sub } from 'date-fns';
import { useIntervalFn } from '@vueuse/core';
import { ref } from 'vue';
import { te } from 'date-fns/locale';

export const oneSecondInMs = 1000;
const padZero = (num: number | string, length = 2) => {
  num += '';
  while ((num as string).length < length) {
    num = '0' + num;
  }
  return num.toString();
};
export default function useCountDown(end: number) {
  const ts = ref('');
  if (!end) return ts;
  const endTime = new Date(end * oneSecondInMs);
  let time: any = null;

  const update = () => {
    const diffInSeconds = differenceInSeconds(endTime, new Date());
    if (diffInSeconds > 0) {
      const day = Math.floor(diffInSeconds / 3600 / 24);
      const hour = Math.floor((diffInSeconds / 3600) % 24);
      const minute = Math.floor((diffInSeconds / 60) % 60);
      const second = Math.floor(diffInSeconds % 60);
      ts.value = [day, hour, minute, second]
        .join(':')
        .replace(/\b\d\b/g, '0$&');
      time = setTimeout(update, 1000);
    } else {
      ts.value = '00:00:00:00';
      clearTimeout(time);
    }
  };
  time = setTimeout(update, 1000);

  return ts;
}

<script setup lang="ts">
import { HtmlInputEvent } from '@/types';
import { ref, computed, watchEffect } from 'vue';
import useTokens from '@/composables/useTokens';
import TokenSelectInput from '@/components/inputs/TokenSelectInput/TokenSelectInput.vue';
import { TokenInfo } from '@/types/TokenList';

/**
 * TYPES
 */
type InputValue = string | number;

type Props = {
  address?: string;
  weight?: number;
  label?: string;
  fixedToken?: boolean;
  hint?: string;
  hintAmount?: string;
  excludedTokens?: string[];
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  address: '',
  weight: 0,
  hintAmount: ''
});

const emit = defineEmits<{
  (e: 'blur', value: string): void;
  (e: 'input', value: string): void;
  (e: 'update:weight', value: string): void;
  (e: 'update:address', value: string): void;
  (e: 'update:isValid', value: boolean): void;
  (e: 'update:isLocked', value: boolean): void;
  (e: 'keydown', value: HtmlInputEvent);
  (e: 'delete'): void;
}>();

/**
 * STATE
 */
const _weight = ref<InputValue>('');
const _address = ref<string>('');
const lockPath = ref<HTMLElement>();
const lockIcon = ref<HTMLElement>();
const isLocked = ref(false);

/**
 * COMPOSABLEs
 */
const { getToken } = useTokens();
import anime from 'animejs';

/**
 * COMPUTED
 */
const hasToken = computed(() => !!_address.value);

const token = computed((): TokenInfo | undefined => {
  if (!hasToken.value) return undefined;
  return getToken(_address.value);
});

/**
 * METHODS
 */
function lockWeight(keepLocked?: boolean) {
  if (isLocked.value && !keepLocked) {
    anime({
      targets: lockPath.value,
      d: 'M7 11V7a5 4 0 0 1 10 -2v-1',
      easing: 'spring(0.2, 80, 10, 0)'
    });
    isLocked.value = false;
  } else {
    if (!isLocked.value) {
      anime({
        targets: lockPath.value,
        d: 'M7 11V7a5 5 0 0 1 10 0v4',
        easing: 'spring(0.2, 80, 10, 0)'
      });

      anime({
        delay: 125,
        targets: lockIcon.value,
        translateY: '1px',
        easing: 'linear',
        duration: 100,
        complete: () => {
          anime({
            targets: lockIcon.value,
            translateY: '0px',
            easing: 'linear',
            duration: 100
          });
        }
      });
    }
    isLocked.value = true;
  }
  emit('update:isLocked', isLocked.value);
}

function onInput(event) {
  emit('input', event);
  lockWeight(true);
}

/**
 * CALLBACKS
 */
watchEffect(() => {
  _weight.value = props.weight;
  _address.value = props.address;
});
</script>

<template>
  <BalTextInput
    name="weight"
    size="lg"
    v-model="_weight"
    :placeholder="hintAmount || '0.0'"
    type="number"
    :label="label"
    :decimalLimit="token?.decimals || 18"
    validateOn="input"
    autocomplete="off"
    autocorrect="off"
    noShadow
    noBorder
    noRadius
    step="any"
    spellcheck="false"
    v-bind="$attrs"
    inputAlignRight
    @blur="emit('blur', $event)"
    @input="onInput"
    @update:modelValue="emit('update:weight', $event)"
    @update:isValid="emit('update:isValid', $event)"
    @keydown="emit('keydown', $event)"
  >
    <template v-slot:prepend>
      <TokenSelectInput
        v-model="_address"
        :fixed="fixedToken"
        class="mr-2"
        @update:modelValue="emit('update:address', $event)"
        :excludedTokens="excludedTokens"
      />
    </template>
    <template v-slot:append>
      <BalStack align="center" justify="center" horizontal spacing="none">
        <BalIcon name="percent" size="lg" class="mt-4 text-white" />
        <button
          @click="lockWeight(false)"
          :class="[
            'ml-2 ease-color mt-4 text-gray-500 dark:text-gray-300 hover:text-cyan dark:hover:text-cyan flex items-center shadow-sm border dark:border-0 bg-gray-50 dark:bg-gray-850 rounded-full justify-center',
            {
              'text-blue-500 dark:text-blue-500': isLocked,
              'border-transparent': !isLocked
            }
          ]"
        >
          <svg
            v-if="isLocked"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path data-name="Path 2419" d="M0 0h24v24H0z" style="fill:none" />
            <path
              data-name="Path 2420"
              d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2.006 2.006 0 0 0-2 2v10a2.006 2.006 0 0 0 2 2h12a2.006 2.006 0 0 0 2-2V10a2.006 2.006 0 0 0-2-2zm-6 9a2 2 0 1 1 2-2 2.006 2.006 0 0 1-2 2zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0z"
              style="fill:#0ff"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            v-else
          >
            <path data-name="Path 2421" d="M0 0h24v24H0z" style="fill:none" />
            <path
              data-name="Path 2422"
              d="M12 17a2 2 0 1 0-2-2 2.006 2.006 0 0 0 2 2zm6-9h-1V6A5 5 0 0 0 7 6h1.9a3.1 3.1 0 0 1 6.2 0v2H6a2.006 2.006 0 0 0-2 2v10a2.006 2.006 0 0 0 2 2h12a2.006 2.006 0 0 0 2-2V10a2.006 2.006 0 0 0-2-2zm0 12H6V10h12z"
              style="fill:#a1a7bb"
            />
          </svg>
        </button>
        <button
          @click="emit('delete')"
          :class="[
            'ml-2 ease-color mt-4 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 flex items-center shadow-sm border dark:border-0 bg-gray-50 dark:bg-gray-850 rounded-full justify-center'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path data-name="Path 2417" d="M0 0h24v24H0z" style="fill:none" />
            <path
              data-name="Path 2418"
              d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18a2.006 2.006 0 0 0 2 2h6a2.006 2.006 0 0 0 2-2V8H3zM14 5h-3l-1-1H6L5 5H2v2h12z"
              style="fill:#a1a7bb"
            />
          </svg>
        </button>
      </BalStack>
    </template>
  </BalTextInput>
</template>

<style scoped>
.ease-color {
  transition: color border-color easeOut 0.1s;
}
</style>

import { Ref, computed } from 'vue';

export default function useInputStyles(props, isInvalid: Ref<boolean>) {
  const paddingClass = (): string => {
    switch (props.size) {
      case 'sm':
        return 'py-px px-1';
      case 'lg':
        return 'py-2 px-3';
      default:
        return 'py-1 px-2';
    }
  };

  const inputHeightClass = (): string => {
    switch (props.size) {
      case 'sm':
        return 'h-8';
      case 'lg':
        return 'h-12';
      default:
        return 'h-10';
    }
  };

  const inputContainerClasses = computed(() => ({
    'border border-gray-100 dark:border-gray-700': true,
    [paddingClass()]: true,
    'border-red-500 dark:border-red-500': isInvalid.value
  }));

  const inputGroupClasses = {
    [paddingClass()]: true
  };

  const headerClasses = {
    [paddingClass()]: true
  };

  const footerClasses = {
    [paddingClass()]: true
  };

  const inputClasses = {
    [inputHeightClass()]: true,
    'text-right': props.inputAlignRight
  };

  const prependClasses = {
    [inputHeightClass()]: true
  };

  const appendClasses = {
    [inputHeightClass()]: true
  };

  return {
    inputContainerClasses,
    inputGroupClasses,
    headerClasses,
    footerClasses,
    inputClasses,
    prependClasses,
    appendClasses
  };
}

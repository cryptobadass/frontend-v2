import BalTextArea from './BalTextArea.vue';
import { generateTemplate } from '../../../../.storybook/helpers/templates';

export default {
  component: BalTextArea,
  title: 'Components/inputs/BalTextInput',
  args: {
    darkMode: false,
    inputAlignRight: false,
    decimalLimit: 18
  },
  argTypes: {
    size: {
      type: { name: 'string', default: 'md' },
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg']
      }
    },
    type: {
      type: { name: 'string', default: 'text' },
      control: {
        type: 'select',
        options: ['text', 'number', 'password', 'email', 'date']
      }
    }
  }
};

const Template = args => ({
  components: { BalTextArea },
  setup() {
    return { args };
  },
  template: generateTemplate(`
<div class="max-w-lg mx-auto">
  <BalTextInput v-model="args.modelValue" v-bind="args">
  </BalTextInput>
</div>
`)
});

export function isRequired() {
  return v => !!v || 'is required';
}

export const Default = Template.bind({});
// @ts-ignore
Default.args = {
  modelValue: '',
  placeholder: '0.0',
  name: 'input-1',
  label: 'A label',
  type: 'number',
  rules: [isRequired()]
};

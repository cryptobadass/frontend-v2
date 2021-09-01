import BalTextInput2 from './BalTextInput2.vue';
import { generateTemplate } from '../../../../.storybook/helpers/templates';

export default {
  component: BalTextInput2,
  title: 'Components/inputs/BalTextInput2',
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
  components: { BalTextInput2 },
  setup() {
    return { args };
  },
  template: generateTemplate(`
<div class="max-w-lg mx-auto">
  <BalTextInput2 v-model="args.modelValue" v-bind="args">
  </BalTextInput2>
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

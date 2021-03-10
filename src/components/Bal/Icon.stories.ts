import BalIcon from './Icon.vue';
import { generateTemplate } from '../../../.storybook/helpers/templates';

export default {
  component: BalIcon,
  title: 'Components/Bal/Icon',
  parameters: {
    layout: 'centered'
  },
  args: {
    darkMode: false,
    name: 'coffee',
    size: 'md'
  },
  argTypes: {
    size: {
      type: { name: 'string', default: 'md' },
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg']
      }
    }
  }
};

type Props = {
  name?: string;
  size?: string;
};

const Template = (args: Props) => ({
  components: { BalIcon },
  setup() {
    return { args };
  },
  template: generateTemplate(`
<BalIcon v-bind="args" />
`)
});

export const Default = Template.bind({});

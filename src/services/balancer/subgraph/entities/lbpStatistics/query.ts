import { merge } from 'lodash';

const defaultArgs = {
};

const defaultAttrs = {
  type: true,
  amounts: true,
  timestamp: true,
  pool: {
    address: true
  }
};

export default (args = {}, attrs = {}) => ({
  joinExits: {
    __args: merge({}, defaultArgs, args),
    ...merge({}, defaultAttrs, attrs)
  }
});

export const useRouter = () => {
  return {
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
  };
};

export default {
  asPath: '/',
  route: '/',
  pathname: '/',
  query: {},
  // TODO: Properly mock the following methods
  back() {},
  beforePopState() {},
  prefetch() {},
  push() {},
  reload() {},
  replace() {},
  events: {
    // TODO: Implement EventEmitter
    on() {},
    off() {},
    trigger() {},
  },
};

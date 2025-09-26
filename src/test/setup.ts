import "@testing-library/jest-dom";

// Mock UXP globals for testing
Object.defineProperty(window, 'require', {
  value: (moduleName: string) => {
    if (moduleName === 'uxp') {
      return {
        host: {
          name: 'premierepro'
        }
      };
    }
    if (moduleName === 'premierepro') {
      return {
        Project: {
          getActiveProject: () => Promise.resolve({
            getRootItem: () => Promise.resolve({}),
            executeTransaction: (fn: any, name: string) => fn({
              addAction: () => {}
            })
          })
        }
      };
    }
    return {};
  },
  writable: true
});
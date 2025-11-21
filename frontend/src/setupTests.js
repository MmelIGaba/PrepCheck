import '@testing-library/jest-dom'

// Polyfill localStorage for Node environment
if (typeof global.localStorage === 'undefined') {
  global.localStorage = {
    store: {},
    getItem(key) {
      return this.store[key] || null;
    },
    setItem(key, value) {
      this.store[key] = String(value);
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    }
  };
}

// Polyfill document.cookie for Node environment
if (typeof global.document === 'undefined') {
  global.document = {
    cookie: '',
  };
}

// Now import MSW server
import { server } from '../tests/mocks/server'

// Start MSW before all tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

import '@testing-library/jest-dom';

const storageMap = new Map<string, string>();

const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) || null,
  setItem: (key: string, value: string) => {
    storageMap.set(key, String(value));
  },
  removeItem: (key: string) => {
    storageMap.delete(key);
  },
  clear: () => {
    storageMap.clear();
  },
  get length() {
    return storageMap.size;
  },
  key: (i: number) => Array.from(storageMap.keys())[i] || null,
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

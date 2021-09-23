import { useCallback, useState } from "react";

export function flatten(obj: {[x:string]: any}, { prefix = "", restrictTo }: { prefix?: string, restrictTo: string[] }) {
  let restrict = restrictTo;
  if (restrict) {
    restrict = restrict.filter((k) => obj.hasOwnProperty(k));
  }
  const result: {[x:string]: any} = {};
  (function recurse(obj, current, keys) {
    (keys || Object.keys(obj)).forEach((key) => {
      const value = obj[key];
      const newKey = current ? current + '.' + key : key; // joined key with dot
      if (value && typeof value === 'object') {
        // @ts-ignore
        recurse(value, newKey); // nested object
      } else {
        result[newKey] = value;
      }
    });
  })(obj, prefix, restrict);
  return result;
}

export function useLocalStorageState(key: string, defaultState?: string) {
  const [state, setState] = useState(() => {
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

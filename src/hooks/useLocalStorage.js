import { useCallback, useEffect, useState } from "react";
import { CHANGE_EVENT, STORES, invalidate, readJSON, writeJSON } from "@/utils/storage";

/**
 * Persisted state synchronised across every component (and browser tab)
 * that uses the same key.
 */
export function useLocalStorage(key, seed) {
  const [value, setValue] = useState(() => readJSON(key, seed));

  useEffect(() => {
    const onChange = (e) => {
      const changed = e.detail?.key;
      if (!changed || changed === key) setValue(readJSON(key, seed));
    };
    const onStorage = (e) => {
      if (!e.key || e.key === key) {
        invalidate(e.key || undefined);
        setValue(readJSON(key, seed));
      }
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
    // seed is a stable module-level factory
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (updater) => {
      const current = readJSON(key, seed);
      const next = typeof updater === "function" ? updater(current) : updater;
      writeJSON(key, next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, update];
}

/** Named admin data store, e.g. useStore("users"). */
export function useStore(name) {
  const def = STORES[name];
  return useLocalStorage(def.key, def.seed);
}

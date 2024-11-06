import { useState, useEffect } from "react";

const setItem = <T,>(key: string, value: T, storage: Storage): void => {
    try {
        storage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error((error as Error).message);
    }
};

const getItem = <T,>(key: string, storage: Storage): T | undefined => {
    try {
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    } catch (error) {
        console.error((error as Error).message);
        return undefined;
    }
};

export const usePersistedState = <T,>(
    key: string,
    initialValue: T | (() => T),
    storage: Storage = localStorage
) => {
    const [value, setValue] = useState<T>(() => {
        const item = getItem<T>(key, storage);

        if (item) {
            return item;
        }

        if (typeof initialValue === "function") {
            return (initialValue as () => T)();
        }

        return initialValue;
    });

    useEffect(() => {
        setItem(key, value, storage);
    }, [key, value, storage]);

    return [value, setValue] as const;
};

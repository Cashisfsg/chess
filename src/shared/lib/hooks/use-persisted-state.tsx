import { useState, useEffect } from "react";

const setItem = (key: string, value: unknown) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(error);
    }
};

const getItem = (key: string) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const usePersistedState = <T,>(key: string, initialValue: T) => {
    const [value, setValue] = useState<T>(() => {
        const item = getItem(key);
        return item || initialValue;
    });

    useEffect(() => {
        setItem(key, value);
    }, [key, value]);

    return [value, setValue] as const;
};

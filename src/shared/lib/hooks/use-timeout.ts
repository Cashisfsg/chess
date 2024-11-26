import { useEffect, useLayoutEffect, useRef } from "react";

export const useTimeout = (callback: () => void, delay: number = 300) => {
    const callbackTimeout = useRef(callback);

    useLayoutEffect(() => {
        callbackTimeout.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay <= 0) return;

        const timeout = setTimeout(() => {
            callbackTimeout.current();
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [delay]);
};

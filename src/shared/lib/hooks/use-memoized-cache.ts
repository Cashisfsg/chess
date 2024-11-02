import { useRef, useCallback } from "react";

type Action<K, V> =
    | { type: "create"; payload: [K, V] }
    | { type: "read"; payload: K }
    | { type: "update"; payload: [K, V] }
    | { type: "delete"; payload: K };

export const useMemoizedCache = <K, V>(initialValue: Map<K, V> | [K, V][]) => {
    const cache = useRef(new Map(initialValue));

    const dispatch = useCallback((action: Action<K, V>) => {
        switch (action.type) {
            case "create":
                if (cache.current.has(action.payload[0])) {
                    break;
                }

                cache.current.set(action.payload[0], action.payload[1]);

                break;

            case "read":
                if (cache.current.has(action.payload)) {
                    return cache.current.get(action.payload);
                }

                break;

            case "update":
                cache.current.set(action.payload[0], action.payload[1]);

                break;

            case "delete":
                cache.current.delete(action.payload);

                break;

            default:
                break;
        }
    }, []);

    return [cache, dispatch] as const;
};

import { useReducer, useEffect, useCallback } from "react";

interface InitialState {
    status: "initial";
    data: undefined;
    error: null;
}

interface SuccessState<D> {
    status: "success";
    data: D;
    error: null;
}

interface ErrorState<D> {
    status: "error";
    data: D | undefined;
    error: Error;
}

type State<D> = InitialState | SuccessState<D> | ErrorState<D>;

type ReducerAction<D> =
    | { type: "reinitialize" }
    | { type: "fulfill"; payload: D }
    | { type: "reject"; payload: Error };

type StorageAction<D> =
    | { type: "set"; payload: D }
    | { type: "get" }
    | { type: "remove" };

interface StorageOptions<T> {
    serializer?: (item: T) => string;
    deserializer?: (item: string) => T;
}

const initialState: InitialState = {
    status: "initial",
    data: undefined,
    error: null
};

const defaultSerializer = <T>(item: T): string => {
    try {
        return JSON.stringify(item);
    } catch (error) {
        throw new Error(
            `Error during serializing JSON: ${(error as Error).message}`
        );
    }
};

const defaultDeserializer = <T>(item: string): T => {
    try {
        return JSON.parse(item);
    } catch (error) {
        throw new Error(
            `Error during parsing JSON: ${(error as Error).message}`
        );
    }
};

const reducer = <T>(state: State<T>, action: ReducerAction<T>): State<T> => {
    switch (action.type) {
        case "reinitialize":
            return { ...state, ...initialState };

        case "fulfill":
            return {
                ...state,
                status: "success",
                data: action.payload,
                error: null
            };

        case "reject":
            return {
                ...state,
                status: "error",
                error: action.payload
            };

        default:
            return state;
    }
};

export const useStorage = <T>(
    key: string,
    storage: Storage = localStorage,
    options?: StorageOptions<T>
): [State<T>, React.Dispatch<StorageAction<T>>] => {
    const [state, dispatch] = useReducer<
        (state: State<T>, action: ReducerAction<T>) => State<T>
    >(reducer, initialState);

    const storageReducer = useCallback(
        (action: StorageAction<T>): T | undefined => {
            switch (action.type) {
                case "set":
                    try {
                        storage.setItem(
                            key,
                            options?.serializer
                                ? options.serializer(action.payload)
                                : defaultSerializer(action.payload)
                        );
                        dispatch({ type: "fulfill", payload: action.payload });
                    } catch (error) {
                        console.error((error as Error).message);
                        dispatch({ type: "reject", payload: error as Error });
                    }
                    break;

                case "get":
                    try {
                        const item = storage.getItem(key);

                        if (!item) {
                            dispatch({ type: "reinitialize" });
                            return undefined;
                        }

                        const parsedItem = options?.deserializer
                            ? options.deserializer(item)
                            : defaultDeserializer<T>(item);

                        dispatch({
                            type: "fulfill",
                            payload: parsedItem
                        });

                        return parsedItem;
                    } catch (error) {
                        console.error((error as Error).message);
                        dispatch({ type: "reject", payload: error as Error });
                        return undefined;
                    }

                case "remove":
                    try {
                        storage.deleteItem(key);
                        dispatch({ type: "reinitialize" });
                    } catch (error) {
                        console.error((error as Error).message);
                        dispatch({ type: "reject", payload: error as Error });
                    }
                    break;

                default:
                    break;
            }
        },
        [key, storage, options]
    );

    useEffect(() => {
        storageReducer({ type: "get" });
    }, [storageReducer]);

    return [state, storageReducer];
};

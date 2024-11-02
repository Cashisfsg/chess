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

interface ErrorState {
    status: "error";
    data: undefined;
    error: Error;
}

type State<D> = InitialState | SuccessState<D> | ErrorState;

type ReducerAction<D> =
    | { type: "reinitialize" }
    | { type: "fulfill"; payload: D }
    | { type: "reject"; payload: Error };

type DispatchAction<D> =
    | { type: "set"; payload: D }
    | { type: "get" }
    | { type: "remove" };

const initialState: InitialState = {
    status: "initial",
    data: undefined,
    error: null
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
                data: undefined,
                error: action.payload
            };

        default:
            return state;
    }
};

export const useStorage = <T>(
    key: string,
    storage: Storage = localStorage
): [State<T>, React.Dispatch<DispatchAction<T>>] => {
    const [state, dispatch] = useReducer<
        (state: State<T>, action: ReducerAction<T>) => State<T>
    >(reducer, initialState);

    const execute = useCallback(
        (action: DispatchAction<T>): T | undefined => {
            switch (action.type) {
                case "set":
                    try {
                        storage.setItem(key, JSON.stringify(action.payload));
                        dispatch({ type: "fulfill", payload: action.payload });
                        return action.payload;
                    } catch (error) {
                        console.error((error as Error)?.message);
                        dispatch({ type: "reject", payload: error as Error });
                        return undefined;
                    }

                case "get":
                    try {
                        const item = storage.getItem(key);

                        if (item) {
                            const parsedItem = JSON.parse(item);
                            dispatch({
                                type: "fulfill",
                                payload: parsedItem
                            });
                            return parsedItem;
                        }

                        dispatch({ type: "reinitialize" });
                        return undefined;
                    } catch (error) {
                        console.error((error as Error)?.message);
                        dispatch({ type: "reject", payload: error as Error });
                        return undefined;
                    }

                case "remove":
                    try {
                        storage.deleteItem(key);
                        dispatch({ type: "reinitialize" });
                    } catch (error) {
                        console.error((error as Error)?.message);
                        dispatch({ type: "reject", payload: error as Error });
                    }
                    break;

                default:
                    return undefined;
            }
        },
        [key, storage]
    );

    useEffect(() => {
        execute({ type: "get" });
    }, [execute]);

    return [state, execute];
};

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

type Action<D> =
    | { type: "set"; payload: D }
    | { type: "get" }
    | { type: "remove" };

const initialState: InitialState = {
    status: "initial",
    data: undefined,
    error: null
};

export const useStorage = <T>(
    key: string,
    storage: Storage = localStorage
): [State<T>, React.Dispatch<Action<T>>] => {
    const reducer = useCallback(
        (state: State<T>, action: Action<T>): State<T> => {
            switch (action.type) {
                case "set":
                    try {
                        storage.setItem(key, JSON.stringify(action.payload));
                        return {
                            ...state,
                            status: "success",
                            data: action.payload,
                            error: null
                        };
                    } catch (error) {
                        console.error((error as Error)?.message);
                        return {
                            ...state,
                            status: "error",
                            data: undefined,
                            error: error as Error
                        };
                    }

                case "get":
                    try {
                        const item = storage.getItem(key);
                        return item
                            ? {
                                  ...state,
                                  status: "success",
                                  data: JSON.parse(item),
                                  error: null
                              }
                            : { ...state, ...initialState };
                    } catch (error) {
                        console.error((error as Error)?.message);
                        return {
                            ...state,
                            status: "error",
                            data: undefined,
                            error: error as Error
                        };
                    }

                case "remove":
                    try {
                        storage.deleteItem(key);
                        return { ...state, ...initialState };
                    } catch (error) {
                        console.error((error as Error)?.message);
                        return {
                            ...state,
                            status: "error",
                            data: undefined,
                            error: error as Error
                        };
                    }

                default:
                    return state;
            }
        },
        [key, storage]
    );

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatch({ type: "get" });
    }, []);

    return [state, dispatch];
};

import { useReducer, useCallback } from "react";

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
    | { type: "create"; payload: { value: D } }
    | { type: "read" }
    | { type: "delete" };

const initialState: InitialState = {
    status: "initial",
    data: undefined,
    error: null
};

export const useLocalStorage = <T>(
    key: string
): [State<T>, React.Dispatch<Action<T>>] => {
    const reducer = useCallback(
        (state: State<T>, action: Action<T>): State<T> => {
            switch (action.type) {
                case "create":
                    try {
                        localStorage.setItem(
                            key,
                            JSON.stringify(action.payload.value)
                        );
                        return {
                            ...state,
                            status: "success",
                            data: action.payload.value,
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

                case "read":
                    try {
                        const item = localStorage.getItem(key);
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

                case "delete":
                    try {
                        localStorage.deleteItem(key);
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
        [key]
    );

    const [state, dispatch] = useReducer(reducer, initialState);

    return [state, dispatch];
};

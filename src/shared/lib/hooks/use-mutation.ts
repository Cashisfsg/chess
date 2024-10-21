import { useReducer, useCallback } from "react";

interface InitialState {
    status: "idle";
    data: undefined;
    error: null;
}

interface LoadingState<D> {
    status: "pending";
    data: D | undefined;
    error: null;
}

interface SuccessState<D> {
    status: "fulfilled";
    data: D;
    error: null;
}

interface ErrorState<D> {
    status: "rejected";
    data: D | undefined;
    error: Error;
}

type State<D> =
    | InitialState
    | LoadingState<D>
    | SuccessState<D>
    | ErrorState<D>;

type Action<D> =
    | { type: "pending" }
    | { type: "fulfilled"; payload: D }
    | { type: "rejected"; payload: Error };

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
        case "pending":
            return { ...state, status: "pending", error: null };
        case "fulfilled":
            return {
                ...state,
                status: "fulfilled",
                data: action.payload,
                error: null
            };
        case "rejected":
            return { ...state, status: "rejected", error: action.payload };
        default:
            return state;
    }
};

const initialState: InitialState = {
    status: "idle",
    data: undefined,
    error: null
};

export const useMutation = <T, V>(
    callback: (variables: V, requestOptions?: RequestInit) => Promise<Response>,
    requestOptions?: RequestInit
): [(variables: V) => Promise<T | undefined>, State<T>] => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const mutate = useCallback(
        async (variables: V) => {
            const controller = new AbortController();
            const signal = controller.signal;

            dispatch({ type: "pending" });

            try {
                const response = await callback(variables, {
                    ...requestOptions,
                    signal
                });

                if (!response.ok) {
                    throw new Error("Something went wrong");
                }

                const result = (await response.json()) as T;
                dispatch({ type: "fulfilled", payload: result });

                return result;
            } catch (error) {
                dispatch({ type: "rejected", payload: error as Error });
            }
        },
        [callback, requestOptions]
    );

    return [mutate, state as State<T>];
};

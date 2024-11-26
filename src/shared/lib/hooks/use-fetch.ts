import { useEffect, useReducer } from "react";

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

export type SearchParams = Record<string, string | number>;

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

export const useFetch = <T, P>(
    query: (searchParams: P, requestOptions?: RequestInit) => Promise<Response>,
    searchParams: P
): State<T> => {
    const [state, dispatch] = useReducer<
        (state: State<T>, action: Action<T>) => State<T>
    >(reducer, initialState);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            dispatch({ type: "pending" });

            try {
                const response = await query(searchParams, { signal });

                if (!response.ok) {
                    throw new Error("Something went wrong");
                }

                const data = await response.json();

                dispatch({ type: "fulfilled", payload: data });
            } catch (error) {
                if ((error as Error).name === "AbortError") {
                    console.error(
                        "Request aborted: ",
                        (error as Error).message
                    );
                }

                dispatch({ type: "rejected", payload: error as Error });
            }
        })();

        return () => {
            controller.abort();
        };
    }, [query, searchParams]);

    return state;
};

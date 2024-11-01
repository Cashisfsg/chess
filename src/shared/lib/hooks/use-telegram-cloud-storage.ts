import { useReducer } from "react";

import { TelegramClient } from "@/shared/api/telegram/types";

interface InitialState {
    status: "idle";
    data: undefined;
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

type State<D> = InitialState | SuccessState<D> | ErrorState<D>;

type Action<D> =
    | { type: "create"; payload: { key: string; value: D } }
    | { type: "read"; payload: { key: string } };

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;

    const cloudStorage = tg.CloudStorage;

    switch (action.type) {
        case "create": {
            let initialState = state;

            if (!/^[A-Za-z0-9_-]{1,128}$/.test(action.payload.key)) {
                return {
                    ...state,
                    status: "rejected",
                    error: new Error("Invalid key format")
                };
            }

            if (JSON.stringify(action.payload.value).length > 4096) {
                return {
                    ...state,
                    status: "rejected",
                    error: new Error("Value exceeds 4096 characters")
                };
            }

            cloudStorage.setItem(
                action.payload.key,
                JSON.stringify(action.payload.value),
                (error, success) => {
                    if (error === null && success) {
                        initialState = {
                            ...state,
                            status: "fulfilled",
                            data: action.payload.value,
                            error: null
                        };
                    } else if (
                        typeof error === "string" &&
                        success === undefined
                    ) {
                        initialState = {
                            ...state,
                            status: "rejected",
                            error: new Error(error)
                        };
                    }
                }
            );

            return initialState;
        }

        case "read": {
            let initialState = state;

            if (!/^[A-Za-z0-9_-]{1,128}$/.test(action.payload.key)) {
                return {
                    ...state,
                    status: "rejected",
                    error: new Error("Invalid key format")
                };
            }

            cloudStorage.getItem(action.payload.key, (error, value) => {
                if (error === null && value) {
                    initialState = {
                        ...state,
                        status: "fulfilled",
                        data: JSON.parse(value),
                        error: null
                    };
                } else if (typeof error === "string" && value === undefined) {
                    initialState = {
                        ...state,
                        status: "rejected",
                        error: new Error(error)
                    };
                }
            });

            return initialState;
        }

        default:
            return state;
    }
};

const initialState: InitialState = {
    status: "idle",
    data: undefined,
    error: null
};

export const useTelegramCloudStorage = <T>() => {
    // const [value, setValue] = useState<T | undefined>(undefined);

    // const cloudStorage = useRef(() => {
    //     const tg = (
    //         window as Window & typeof globalThis & { Telegram: TelegramClient }
    //     ).Telegram.WebApp;

    //     return tg.CloudStorage;
    // });

    const [value, dispatch] = useReducer<
        (state: State<T>, action: Action<T>) => State<T>
    >(reducer, initialState);

    // const setItem = (
    //     value: T,
    //     callback?: (error: Error | null, success?: boolean) => void
    // ) => {
    //     cloudStorage.setItem(key, JSON.stringify(value), callback);
    // };

    // const getItem = (
    //     key: string
    //     // callback?: (error: Error | null, value?: string) => string | void
    // ) =>
    //     cloudStorage.getItem(key, (error, storedValue) => {
    //         return storedValue;
    //     });

    return [value, dispatch] as const;
};

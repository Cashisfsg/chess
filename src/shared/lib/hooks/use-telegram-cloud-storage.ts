import { useReducer, useCallback } from "react";

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
    | { type: "create"; payload: { value: D } }
    | { type: "read" }
    | { type: "delete" };

type SecondAction<D> =
    | { type: "fulfill"; payload: { value: D } }
    | { type: "reject"; payload: { error: Error } }
    | { type: "reset" };

const reducer = <T>(state: State<T>, action: SecondAction<T>): State<T> => {
    switch (action.type) {
        case "fulfill":
            return {
                ...state,
                status: "fulfilled",
                data: action.payload.value,
                error: null
            };

        case "reject":
            return {
                ...state,
                status: "rejected",
                error: action.payload.error
            };

        case "reset":
            return {
                ...state,
                status: "idle",
                data: undefined,
                error: null
            };

        default:
            return state;
    }
};

const initialState: InitialState = {
    status: "idle",
    data: undefined,
    error: null
};

export const useTelegramCloudStorage = <T>(key: string) => {
    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;

    const cloudStorage = tg.CloudStorage;

    const [value, dispatch] = useReducer<
        (state: State<T>, action: SecondAction<T>) => State<T>
    >(reducer, initialState);

    const reduce = useCallback(
        async (action: Action<T>): Promise<void> => {
            switch (action.type) {
                case "create":
                    return new Promise((resolve, reject) => {
                        if (!/^[A-Za-z0-9_-]{1,128}$/.test(key)) {
                            reject("Invalid key format");
                        }

                        if (
                            JSON.stringify(action.payload.value).length > 4096
                        ) {
                            reject("Value exceeds 4096 characters");
                        }

                        cloudStorage.setItem(
                            key,
                            JSON.stringify(action.payload.value),
                            (error, success) => {
                                if (error === null && success) {
                                    resolve(action.payload.value);
                                } else if (
                                    typeof error === "string" &&
                                    success === undefined
                                ) {
                                    reject(error);
                                }
                            }
                        );
                    })
                        .then(data =>
                            dispatch({
                                type: "fulfill",
                                payload: { value: data as T }
                            })
                        )
                        .catch(error =>
                            dispatch({
                                type: "reject",
                                payload: { error: error }
                            })
                        );

                case "read":
                    return new Promise((resolve, reject) => {
                        if (!/^[A-Za-z0-9_-]{1,128}$/.test(key)) {
                            reject("Invalid key format");
                        }

                        cloudStorage.getItem(key, (error, value) => {
                            if (error === null && value) {
                                resolve(JSON.parse(value));
                            } else if (
                                typeof error === "string" &&
                                value === undefined
                            ) {
                                reject(error);
                            }
                        });
                    })
                        .then(data =>
                            dispatch({
                                type: "fulfill",
                                payload: { value: data as T }
                            })
                        )
                        .catch(error =>
                            dispatch({
                                type: "reject",
                                payload: { error: error }
                            })
                        );

                case "delete":
                    return new Promise((resolve, reject) => {
                        cloudStorage.removeItem(key, (error, success) => {
                            if (error === null && success) {
                                resolve(success);
                            } else if (
                                typeof error === "string" &&
                                success === undefined
                            ) {
                                reject(error);
                            }
                        });
                    })
                        .then(success => {
                            if (success) {
                                dispatch({ type: "reset" });
                            }
                        })
                        .catch(error =>
                            dispatch({
                                type: "reject",
                                payload: { error: error }
                            })
                        );

                default:
                    break;
            }
        },
        [key]
    );

    return [value, reduce] as const;
};

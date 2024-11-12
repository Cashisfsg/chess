import { useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
import { TelegramClient } from "@/shared/api/telegram/types";

type Callback<T extends unknown[] = []> = (...args: Partial<T>) => void;

export const useTelegramBackButton = <T extends unknown[]>(
    onClick?: Callback<T>
) => {
    const backButton = useRef(
        (window as Window & typeof globalThis & { Telegram: TelegramClient })
            .Telegram.WebApp.BackButton
    );
    const callbackRef = useRef(onClick);

    const navigate = useNavigate();

    useLayoutEffect(() => {
        callbackRef.current = onClick;
    });

    useEffect(() => {
        const button = backButton.current;

        if (button.isVisible) return;

        const callback: Callback<T> =
            callbackRef.current ||
            (() => {
                navigate(-1);
            });

        button.show();
        button.onClick(callback);

        return () => {
            button.offClick(callback);
            button.hide();
        };
    }, [callbackRef, navigate]);
};

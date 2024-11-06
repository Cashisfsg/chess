import { TelegramClient } from "@/shared/api/telegram/types";
import { useEffect, useLayoutEffect, useRef } from "react";

type Callback<T extends unknown[] = []> = (...args: Partial<T>) => void;

export const useTelegramBackButton = <T extends unknown[]>(
    onClick: Callback<T>
) => {
    const backButton = useRef(
        (window as Window & typeof globalThis & { Telegram: TelegramClient })
            .Telegram.WebApp.BackButton
    );
    const callbackRef = useRef(onClick);

    useLayoutEffect(() => {
        callbackRef.current = onClick;
    });

    useEffect(() => {
        const button = backButton.current;

        if (button.isVisible) return;

        button.show();
        button.onClick(callbackRef.current);

        return () => {
            button.offClick(callbackRef.current);
            button.hide();
        };
    }, [callbackRef]);
};

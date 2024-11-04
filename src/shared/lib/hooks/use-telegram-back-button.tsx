import { TelegramClient } from "@/shared/api/telegram/types";
import { useEffect, useLayoutEffect, useRef } from "react";

interface TelegramBackButtonProps<T extends unknown[] = []> {
    onClick: (...args: Partial<T>) => void;
}

export const useTelegramBackButton = <T extends unknown[]>({
    onClick
}: TelegramBackButtonProps<T>) => {
    const backButton = useRef(
        (window as Window & typeof globalThis & { Telegram: TelegramClient })
            .Telegram.WebApp.BackButton
    );
    const callbackRef = useRef(onClick);

    useLayoutEffect(() => {
        callbackRef.current = onClick;
    }, [onClick]);

    useEffect(() => {
        const button = backButton.current;

        if (button.isVisible) return;

        button.show();
        button.onClick(callbackRef.current);

        // return () => {
        // button.offClick(callbackRef.current);
        // button.hide();
        // };
    }, [callbackRef]);
};

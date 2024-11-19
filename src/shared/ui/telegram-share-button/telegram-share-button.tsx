import { useRef } from "react";

import { composeEventHandlers } from "@/shared/lib/utils/compose-event-handlers";

import { TelegramClient } from "@/shared/api/telegram/types";

interface ShareParams {
    url: string;
    caption?: string;
    receiver?: string;
}

interface TelegramShareButtonProps
    extends React.ComponentPropsWithoutRef<"button"> {
    params: ShareParams;
}

const BASE_URL = "https://t.me";

export const TelegramShareButton: React.FC<TelegramShareButtonProps> = ({
    params,
    onClick,
    ...props
}) => {
    const webApp = useRef(
        (window as Window & typeof globalThis & { Telegram: TelegramClient })
            .Telegram.WebApp
    );

    const url = useRef(new URL("/share/url", BASE_URL));

    Object.entries(params).forEach(([key, value]) => {
        url.current.searchParams.append(key, value.toString());
    });

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        webApp.current.openTelegramLink(url.current.toString());
    };

    return (
        <button
            onClick={composeEventHandlers(onClick, onClickHandler)}
            {...props}
        />
    );
};

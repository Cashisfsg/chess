import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import useSWR from "swr";

// import { baseQuery } from "@/shared/api/config";
// import { buildQueryString } from "@/shared/lib/utils/build-query-string";
import { composeEventHandlers } from "@/shared/lib/utils/compose-event-handlers";
import { TelegramClient } from "@/shared/api/telegram/types";
import { useStorage } from "@/shared/lib/hooks/use-storage";

// interface SearchRoomResponse {
//     room_id: number;
//     color: "black" | "white";
// }

interface SearchGameButtonProps
    extends React.ComponentPropsWithoutRef<"button"> {}

export const SearchGameButton: React.FC<SearchGameButtonProps> = ({
    onClick,
    ...props
}) => {
    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;

    const [isLoading, setIsLoading] = useState(false);

    // const [skipRequest, setSkipRequest] = useState(true);
    const navigate = useNavigate();
    const [, dispatch] = useStorage<"black" | "white">("color", sessionStorage);

    // const { isLoading, mutate } = useSWR<SearchRoomResponse>(
    //     !skipRequest && tg?.initDataUnsafe?.user?.id
    //         ? buildQueryString("/search", {
    //               user_id: tg?.initDataUnsafe?.user?.id
    //           })
    //         : null,
    //     baseQuery,
    //     {
    //         errorRetryCount: 0,
    //         revalidateOnFocus: false,
    //         refreshInterval: 0,
    //         onSuccess: ({ room_id, color }) => {
    //             dispatch({ type: "set", payload: color });
    //             navigate(`/game/${room_id}`);
    //         },
    //         onError: error => console.error(error)
    //     }
    // );

    // const onClickHandler: React.MouseEventHandler<
    //     HTMLButtonElement
    // > = async () => {
    //     if (skipRequest) {
    //         setSkipRequest(false);
    //         return;
    //     }

    //     mutate(undefined, { revalidate: true });
    // };

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        const user_id = tg?.initDataUnsafe?.user?.id;

        if (!user_id) return;

        const socket = new WebSocket(
            `wss://www.chesswebapp.xyz/api/v1/search?user_id=${user_id}`
        );

        setIsLoading(true);

        socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (!("room_id" in response) || !("color" in response)) return;

            const { room_id, color } = response;

            dispatch({ type: "set", payload: color });
            navigate(`/game/${room_id}`);
        };

        socket.onclose = () => {
            setIsLoading(false);
        };
    };

    return (
        <button
            disabled={isLoading}
            onClick={composeEventHandlers(onClick, onClickHandler)}
            className="flex items-center justify-center gap-x-4 rounded-2xl bg-[#5d9948] px-6 py-4 text-2xl font-bold text-white shadow-lg transition-colors duration-150 active:bg-[#a3d160] disabled:opacity-50"
            {...props}
        >
            <svg
                width="55"
                height="55"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M45.07 69.58c-7.03-4.45-8.37-9.82-8.79-12.72h4.76s1.76-2.36 1.76-4.96v-1.03l-5.38-3.51c2.17-2.17 3.51-5.17 3.51-8.37 0-6.41-5.27-11.58-11.68-11.58s-11.68 5.17-11.68 11.58c0 3.2 1.34 6.2 3.51 8.37l-5.38 3.51v1.03c0 2.48 1.76 4.96 1.76 4.96h4.76c-.31 2.89-1.76 8.27-8.79 12.72-4.03 2.58-6.31 7.34-6.31 13.13 0 1.03.69 1.77 1.86 1.86 1.17.09 9.42.43 20.26.43 10.84 0 19.18-.31 20.37-.43 1.18-.12 1.86-.83 1.86-1.86 0-5.79-2.38-10.54-6.41-13.13h.01z"
                    fill="#E8E6E1"
                />
                <path
                    d="m21.09 47.35-5.38 3.51v.02l4.64.03c.24-1.7.7-3.54.73-3.57l.01.01zM17.36 71.28c3.18-2.32 3.85-9.46 3.94-10.65-1.07 2.75-3.28 6.04-7.86 8.94-4.03 2.58-6.31 7.34-6.31 13.13 2-6.59 5.01-7.6 10.23-11.42z"
                    fill="#fff"
                />
                <path
                    d="M37.05 67.85c3.68 3.45 9.14 4.59 11.42 4.93-.94-1.27-2.08-2.35-3.4-3.2-7.03-4.45-8.37-9.82-8.79-12.72h4.76s1.76-2.36 1.76-4.96v-1.03l-5.38-3.51c2.17-2.17 3.51-5.17 3.51-8.37 0-4.85-3.02-8.99-7.26-10.71 3.96 2.41 6.75 9.23 3.12 14.38-2.71 3.84-8.01 4.75-8.01 4.75h6.49c.07.05 3.2 5.02-1.06 7.8l-17.66.03c.45.97.91 1.62.92 1.64h8.69s5.95 6.35 10.89 10.99v-.02z"
                    fill="#B3ACA8"
                />
                <path
                    d="M29.25 27.4c-6.41 0-11.68 5.17-11.68 11.58 0 1.21.19 2.39.55 3.51.81-9.78 7.06-14.6 11.13-15.09z"
                    fill="#fff"
                />
                <path
                    d="M38.46 45.66c-.02.55 0 5.56 5.17 5.58 2.24 0 4.09-.64 6.08-1.58l30.87-14.94s2.35-1.14 2.35-3.9V12.06s-.21-2.94-3.58-3.6C72.02 7.04 59.31 5 52.6 5c-8.7 0-10.51.66-15.92 2.13-4.48 1.23-10.03 4.46-10.03 4.46s-9.52 4.47-12.71 8.43c-3.01 3.72-6.85 14.59-6.85 17.43 0 2.29 5.67 2.34 7.16 1.92 3.11-.91 8.35-12.23 8.35-12.23s9.8-4.7 14.85-4.7c2.17 0 7.58-.02 10.11-.02 2.53 0 6 2.61 7.44 5.56 1.13 2.31-12.19 11.85-14 12.98-1.34.84-2 2.5-2.3 3.6l-.23 1.11-.01-.01z"
                    fill="#D5A47D"
                />
                <path
                    d="M22.58 27.13s9.8-4.7 14.85-4.7c2.17 0 7.58-.02 10.11-.02.43 0 .89.08 1.36.22 2.29.68 4.88 2.9 6.08 5.35.01.03.03.06.03.09.03.08.04.18.03.27.1-.33 1.04-3.64.6-5.69-.49-2.29-2.4-6.07-6.71-5.93-7.59.25-13.31.92-13.31.92l-15.37 5.6s-1.44 5.84-4.76 12.31c-1.31 2.55-2.46 3.59-3.24 4.01.62 0 1.18-.05 1.6-.12.06-.01.11-.02.16-.03h.03c.05-.01.1-.02.14-.04h.02c3.11-.91 8.35-12.23 8.35-12.23l.03-.01zM71.78 33.83c-4.12 2.39-29.56 16.26-30.69 16.87.67.33 1.49.54 2.54.54 2.24 0 4.09-.64 6.08-1.58l30.87-14.93s.52-.25 1.06-.8a5.409 5.409 0 0 0 .48-.57c.03-.05.07-.1.1-.15.09-.13.17-.27.25-.43.05-.09.09-.19.13-.29a4.023 4.023 0 0 0 .2-.63c.07-.31.12-.66.12-1.03V15.97c-1.47 10.68-6.02 14.89-11.15 17.86h.01z"
                    fill="#8D694B"
                />
            </svg>
            <span>{isLoading ? "Поиск соперника" : "Найти соперника"}</span>
        </button>
    );
};

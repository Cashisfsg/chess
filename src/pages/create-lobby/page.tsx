import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ClipboardCopy } from "@/shared/ui/clipboard-copy";
import { TelegramShareButton } from "@/shared/ui/telegram-share-button";
import { useTelegramBackButton } from "@/shared/lib/hooks/use-telegram-back-button";
import { useStorage } from "@/shared/lib/hooks/use-storage";
import { TelegramClient } from "@/shared/api/telegram/types";

export const CreateLobbyPage = () => {
    useTelegramBackButton();

    const navigate = useNavigate();
    const params = useParams();
    const [, dispatch] = useStorage<"black" | "white">("color", sessionStorage);

    const user = useRef(
        (window as Window & typeof globalThis & { Telegram: TelegramClient })
            .Telegram.WebApp.initDataUnsafe?.user
    );

    useEffect(() => {
        if (
            !("roomId" in params) ||
            !params.roomId ||
            !user.current ||
            !user.current.id
        )
            return;

        const socket = new WebSocket(
            `wss://www.chesswebapp.xyz/api/v1/room/ws?room_id=${params.roomId}&user_id=${user.current.id}`
        );

        socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (
                !("data" in response) ||
                !("type" in response) ||
                response.type !== "start_game"
            )
                return;

            dispatch({ type: "set", payload: response.data });

            navigate(`/game/${params.roomId}`);
        };

        return () => {
            socket.close(1000, "Close connection");
        };
    }, [params]);

    return (
        <main className="grid flex-auto grid-rows-[auto_1fr_1fr] gap-y-6">
            <header className="flex items-center justify-center gap-x-4 text-4xl font-bold">
                <svg
                    width="55"
                    height="55"
                    fill="none"
                    viewBox="0 0 90 90"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M49.041 79.704c-1.206 0-2.457-.27-3.717-.801-.45-.144-.972-.531-1.629-1.08l-1.107-.954s-30.42-20.844-31.833-22.392c-1.404-1.557-2.412-5.229-2.997-5.958-.999-1.251-2.817-2.871-5.112-4.545C.576 42.462.225 41.112.045 39.969c-.198-1.341.351-3.249.531-3.789l6.615-18.918c.261-.657.918-2.025 2.25-2.799.603-.387 1.521-.711 2.565-.711.882 0 1.764.225 2.619.666 2.025 1.035 4.797 2.43 6.669 3.312l2.115.99 22.959 8.307.549.297c3.294 1.773 9.459 5.049 13.653 7.011 2.502 1.152 6.831 4.392 11.808 8.199 3.771 2.88 5.805 4.41 7.047 5.022l.27.126.225.198c4.077 3.474 4.842 7.074 2.259 10.719-.9 1.269-2.637 2.79-5.823 2.79-.18 0-.351 0-.531-.009 0 1.458-.495 3.042-1.872 4.383-1.656 1.638-3.78 2.502-6.147 2.502-.828 0-1.611-.108-2.313-.261-.126 1.341-.585 2.853-1.737 4.05-1.566 1.62-4.194 2.664-6.714 2.664-.333 0-.657-.018-.972-.054a7.346 7.346 0 0 1-1.071 2.052c-1.404 1.899-3.573 2.988-5.949 2.988h-.009z"
                        fill="#8D694B"
                    />
                    <path
                        d="M60.876 34.794c.576.207 1.26.495 2.016.855-.882-.558-1.674-1.017-2.331-1.323-4.203-1.962-10.359-5.238-13.653-7.011l-.549-.297-21.222-7.677a21.111 21.111 0 0 0-2.052 1.935c-.954 1.017-2.313 3.186-3.042 10.152-.36 3.42-.405 6.471-.378 6.606l-.117 1.458.774.864c.855.954 2.313 1.341 4.347 1.143 1.377-.126 2.772-.522 3.843-1.062 3.15-1.611 4.914-6.03 6.093-8.964.234-.576.396-1.008.54-1.341 2.295-.288 8.73-1.017 10.989-1.269 2.061.882 9.846 4.185 14.751 5.922l-.009.009z"
                        fill="#6B4D3A"
                    />
                    <path
                        d="M72.036 42.408c-4.041-3.078-8.973-6.489-11.637-7.731-4.725-2.196-12.168-6.201-14.139-7.263-2.268.036-8.748.162-11.052.243-.18.315-.378.738-.657 1.287-1.44 2.808-3.609 7.038-6.894 8.352-1.107.441-2.547.702-3.924.702-2.034 0-3.456-.522-4.221-1.548l-.693-.927.252-1.458-.009.027c-.018 0 .297-3.105.99-6.561 1.377-6.867 2.934-8.901 3.978-9.828 3.456-3.06 6.21-3.969 10.728-4.734 1.206-.207 2.799-.612 4.518-1.035 3.951-.999 8.028-2.034 10.818-2.034.801 0 1.467.081 2.043.252 2.466.72 7.992 2.259 11.322 2.916 1.8.351 3.672 1.152 5.319 1.872 1.125.486 2.529 1.089 3.096 1.134.684-.054 3.213-1.26 4.563-1.899.747-.351 1.404-.513 2.061-.513.936 0 1.845.297 2.7.873 1.584 1.053 2.079 2.754 2.16 3.087l6.291 19.557c.063.063.468 1.557.297 2.844-.135 1.026-.549 2.367-2.421 3.609-4.392 2.889-5.148 3.654-5.22 3.726l-1.71 1.125s-3.663-2.34-8.568-6.075h.009z"
                        fill="#E3C29C"
                    />
                    <path
                        d="M36.756 80.1c-1.44 0-2.763-.378-3.834-1.089a7.67 7.67 0 0 1-2.214-2.259 8.15 8.15 0 0 1-2.151.297c-1.305 0-2.484-.36-3.402-1.026-1.629-1.188-2.772-2.763-3.303-4.428h-.315c-.909 0-1.764-.18-2.556-.522-1.98-.873-3.348-2.799-3.744-4.914h-.108a10.117 10.117 0 0 1-1.017-.126c-1.647-.324-3.087-1.323-4.068-2.826-1.134-1.737-1.557-3.969-1.116-5.967.675-3.042 3.546-6.201 7.191-6.201.378 0 .765.036 1.143.117 2.286.441 3.906 2.07 4.725 4.023a8.14 8.14 0 0 1 2.142-.288c1.215 0 2.367.288 3.339.837 1.269.702 2.169 1.881 2.637 3.312a7.246 7.246 0 0 1 1.467-.153c1.512 0 2.925.513 4.095 1.467 1.665 1.368 2.43 3.465 2.241 5.985 1.404.234 2.718.81 3.627 1.638 3.204 2.898 2.304 6.498 1.971 7.848-.684 2.763-3.978 4.266-6.732 4.266l-.018.009z"
                        fill="#D5A47D"
                    />
                    <path
                        d="M43.857 73.188c0-1.584-.459-3.51-2.33-5.202-.91-.819-2.224-1.404-3.628-1.638.19-2.52-.576-4.617-2.24-5.985a6.399 6.399 0 0 0-4.096-1.467c-.486 0-.98.054-1.467.153-.468-1.431-1.377-2.61-2.637-3.312-.972-.549-2.124-.837-3.339-.837a8.14 8.14 0 0 0-2.142.288c-.819-1.953-2.439-3.582-4.725-4.023a5.538 5.538 0 0 0-1.143-.117c-1.395 0-2.664.459-3.753 1.206-.117 1.701-2.106 5.481.702 8.442 2.808 2.961 5.292-.603 5.625-.585h.108c-.846 1.818-2.286 4.185.531 6.678 2.745 2.43 5.985-1.251 6.093-1.251-.459 1.683-1.404 5.067 1.854 7.29s6.291-1.944 7.011-2.124c.558.882-.747 4.194 2.907 6.273 3.654 2.07 6.273-1.854 6.678-3.78l-.009-.009z"
                        fill="#E3C29C"
                    />
                    <path
                        d="M73.836 32.958c-11.493 1.287-20.727-7.353-24.867-7.506-4.149-.144-13.761 2.205-13.761 2.205 2.304-.072 8.793-.207 11.052-.243 1.971 1.062 9.414 5.067 14.139 7.263 2.673 1.251 7.596 4.653 11.637 7.731 0 0 9.018-10.26 1.8-9.459v.009zM76.266 45.522c2.619 1.872 4.338 2.97 4.338 2.97l1.71-1.125c.072-.072.819-.846 5.22-3.726.306-.207.531-.414.756-.621-3.348.963-12.015 2.511-12.024 2.511v-.009z"
                        fill="#D5A47D"
                    />
                </svg>
                <h1 className="text-2xl font-bold">Создание лобби</h1>
            </header>

            <section className="flex flex-col gap-y-4 rounded-md bg-black/20 px-4 py-3">
                <header className="flex flex-col items-center gap-y-4 text-xl font-bold">
                    <svg
                        width="55"
                        height="55"
                        fill="none"
                        viewBox="0 0 90 90"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M29.74 30.53c2.1-2.05 4.73-3.49 7.59-4.16a3.787 3.787 0 0 1 .81-4.12L45 15.32V5H12.33c-1.94 0-3.81.77-5.18 2.15A7.344 7.344 0 0 0 5 12.33V45h10.26l14.48-14.47z"
                            fill="#807B76"
                        />
                        <path
                            d="M60.39 59.33c-2.16 2.1-4.85 3.56-7.79 4.21l.07.13c.29.69.37 1.46.22 2.19-.14.74-.5 1.41-1.03 1.95L45 74.74V85h32.67c1.94 0 3.81-.77 5.18-2.15A7.344 7.344 0 0 0 85 77.67V45H74.69l-14.3 14.33z"
                            fill="#666463"
                        />
                        <path
                            d="M45 76.57V85h32.67c1.94 0 3.81-.77 5.18-2.15A7.344 7.344 0 0 0 85 77.67V45h-8.17L45 76.57z"
                            fill="#807B76"
                        />
                        <path
                            d="M29.68 73.05c-.76.67-1.74 1.04-2.75 1.04s-1.99-.37-2.75-1.04L17 65.85A4.21 4.21 0 0 1 15.88 63c0-1.05.4-2.08 1.12-2.85l21.13-21.14c.55-.5 1.23-.85 1.96-1a4.22 4.22 0 0 1 2.2.13l7.62 7.58L56 39.59l-7.54-7.58h-.21a12.479 12.479 0 0 0-15.86 1.29L11.15 54.49a12.485 12.485 0 0 0-3.55 8.73c0 3.26 1.27 6.39 3.55 8.72l7 6.95c2.33 2.27 5.46 3.55 8.72 3.55 3.26 0 6.39-1.27 8.72-3.55l13.57-13.74c-3.22 0-6.37-.92-9.07-2.66L29.68 73.06v-.01z"
                            fill="#D1CCC5"
                        />
                        <path
                            d="m78.85 18-7-7a12.504 12.504 0 0 0-8.74-3.49c-3.26.02-6.38 1.32-8.7 3.61l-13.57 13.8c3.25-.28 6.49.67 9.07 2.67L60.49 17c.77-.72 1.79-1.13 2.85-1.13s2.08.4 2.85 1.13l7 7c.73.77 1.13 1.79 1.13 2.85s-.41 2.08-1.13 2.85L51.87 50.86c-.55.51-1.23.86-1.96 1.01-.73.15-1.49.1-2.2-.14l-6-6-6 6.16 6 6h.21c2.38 1.66 5.27 2.44 8.16 2.2 2.89-.24 5.62-1.47 7.7-3.49l21.07-21.14c2.28-2.33 3.55-5.47 3.55-8.73 0-3.26-1.28-6.4-3.55-8.73z"
                            fill="#D1CCC5"
                        />
                        <path
                            d="M32.2 34.96 13.54 53.62a1.75 1.75 0 0 0 0 2.47c.68.68 1.79.68 2.47 0l18.66-18.66c.68-.68.68-1.79 0-2.47a1.75 1.75 0 0 0-2.47 0zM55.93 11.24l-8.39 8.39a1.75 1.75 0 0 0 0 2.47c.68.68 1.79.68 2.47 0l8.39-8.39c.68-.68.68-1.79 0-2.47a1.75 1.75 0 0 0-2.47 0zM72.92 31.57 54.26 50.23a1.75 1.75 0 0 0 0 2.47c.68.68 1.79.68 2.47 0l18.66-18.66c.68-.68.68-1.79 0-2.47a1.75 1.75 0 0 0-2.47 0zM38.33 66.15l-8.39 8.39a1.75 1.75 0 0 0 0 2.47c.68.68 1.79.68 2.47 0l8.39-8.39c.68-.68.68-1.79 0-2.47a1.75 1.75 0 0 0-2.47 0z"
                            fill="#E8E6E1"
                        />
                        <path
                            d="m74.69 45-14.3 14.33c-2.16 2.1-4.85 3.56-7.79 4.21l.07.13c.29.69.37 1.46.22 2.19-.14.74-.5 1.41-1.03 1.95L45 74.74v8.83L83.57 45h-8.88z"
                            fill="#4A4743"
                        />
                    </svg>
                    <h2>Ссылка для игрока</h2>
                </header>

                <ClipboardCopy
                    textToCopy={`https://t.me/test_chess_cboyxd_bot?startapp=${params.roomId}`}
                />

                <TelegramShareButton
                    params={{
                        url: `https://t.me/test_chess_cboyxd_bot?startapp=${params.roomId}`
                    }}
                    className="flex items-center justify-center gap-x-4 rounded-2xl bg-black/30 px-6 py-4 text-xl font-bold shadow-lg transition-colors duration-150 active:bg-white/15"
                >
                    <svg
                        height="36"
                        width="36"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <linearGradient
                            id="BiF7D16UlC0RZ_VqXJHnXa"
                            x1="9.858"
                            x2="38.142"
                            y1="9.858"
                            y2="38.142"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop
                                offset="0"
                                stop-color="#33bef0"
                            />
                            <stop
                                offset="1"
                                stop-color="#0a85d9"
                            />
                        </linearGradient>
                        <path
                            fill="url(#BiF7D16UlC0RZ_VqXJHnXa)"
                            d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                        />
                        <path
                            d="M10.119,23.466c8.155-3.695,17.733-7.704,19.208-8.284c3.252-1.279,4.67,0.028,4.448,2.113	c-0.273,2.555-1.567,9.99-2.363,15.317c-0.466,3.117-2.154,4.072-4.059,2.863c-1.445-0.917-6.413-4.17-7.72-5.282	c-0.891-0.758-1.512-1.608-0.88-2.474c0.185-0.253,0.658-0.763,0.921-1.017c1.319-1.278,1.141-1.553-0.454-0.412	c-0.19,0.136-1.292,0.935-1.745,1.237c-1.11,0.74-2.131,0.78-3.862,0.192c-1.416-0.481-2.776-0.852-3.634-1.223	C8.794,25.983,8.34,24.272,10.119,23.466z"
                            opacity=".05"
                        />
                        <path
                            d="M10.836,23.591c7.572-3.385,16.884-7.264,18.246-7.813c3.264-1.318,4.465-0.536,4.114,2.011	c-0.326,2.358-1.483,9.654-2.294,14.545c-0.478,2.879-1.874,3.513-3.692,2.337c-1.139-0.734-5.723-3.754-6.835-4.633	c-0.86-0.679-1.751-1.463-0.71-2.598c0.348-0.379,2.27-2.234,3.707-3.614c0.833-0.801,0.536-1.196-0.469-0.508	c-1.843,1.263-4.858,3.262-5.396,3.625c-1.025,0.69-1.988,0.856-3.664,0.329c-1.321-0.416-2.597-0.819-3.262-1.078	C9.095,25.618,9.075,24.378,10.836,23.591z"
                            opacity=".07"
                        />
                        <path
                            fill="#fff"
                            d="M11.553,23.717c6.99-3.075,16.035-6.824,17.284-7.343c3.275-1.358,4.28-1.098,3.779,1.91	c-0.36,2.162-1.398,9.319-2.226,13.774c-0.491,2.642-1.593,2.955-3.325,1.812c-0.833-0.55-5.038-3.331-5.951-3.984	c-0.833-0.595-1.982-1.311-0.541-2.721c0.513-0.502,3.874-3.712,6.493-6.21c0.343-0.328-0.088-0.867-0.484-0.604	c-3.53,2.341-8.424,5.59-9.047,6.013c-0.941,0.639-1.845,0.932-3.467,0.466c-1.226-0.352-2.423-0.772-2.889-0.932	C9.384,25.282,9.81,24.484,11.553,23.717z"
                        />
                    </svg>
                    <span>Поделиться</span>
                </TelegramShareButton>
            </section>

            {/* <section className="flex flex-col gap-y-4 rounded-md bg-black/20 px-4 py-3">
                <header className="flex flex-col items-center gap-y-4 text-xl font-bold">
                    <svg
                        width="55"
                        height="55"
                        fill="none"
                        viewBox="0 0 90 90"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M29.74 30.53c2.1-2.05 4.73-3.49 7.59-4.16a3.787 3.787 0 0 1 .81-4.12L45 15.32V5H12.33c-1.94 0-3.81.77-5.18 2.15A7.344 7.344 0 0 0 5 12.33V45h10.26l14.48-14.47z"
                            fill="#807B76"
                        />
                        <path
                            d="M60.39 59.33c-2.16 2.1-4.85 3.56-7.79 4.21l.07.13c.29.69.37 1.46.22 2.19-.14.74-.5 1.41-1.03 1.95L45 74.74V85h32.67c1.94 0 3.81-.77 5.18-2.15A7.344 7.344 0 0 0 85 77.67V45H74.69l-14.3 14.33z"
                            fill="#666463"
                        />
                        <path
                            d="M45 76.57V85h32.67c1.94 0 3.81-.77 5.18-2.15A7.344 7.344 0 0 0 85 77.67V45h-8.17L45 76.57z"
                            fill="#807B76"
                        />
                        <path
                            d="M29.68 73.05c-.76.67-1.74 1.04-2.75 1.04s-1.99-.37-2.75-1.04L17 65.85A4.21 4.21 0 0 1 15.88 63c0-1.05.4-2.08 1.12-2.85l21.13-21.14c.55-.5 1.23-.85 1.96-1a4.22 4.22 0 0 1 2.2.13l7.62 7.58L56 39.59l-7.54-7.58h-.21a12.479 12.479 0 0 0-15.86 1.29L11.15 54.49a12.485 12.485 0 0 0-3.55 8.73c0 3.26 1.27 6.39 3.55 8.72l7 6.95c2.33 2.27 5.46 3.55 8.72 3.55 3.26 0 6.39-1.27 8.72-3.55l13.57-13.74c-3.22 0-6.37-.92-9.07-2.66L29.68 73.06v-.01z"
                            fill="#D1CCC5"
                        />
                        <path
                            d="m78.85 18-7-7a12.504 12.504 0 0 0-8.74-3.49c-3.26.02-6.38 1.32-8.7 3.61l-13.57 13.8c3.25-.28 6.49.67 9.07 2.67L60.49 17c.77-.72 1.79-1.13 2.85-1.13s2.08.4 2.85 1.13l7 7c.73.77 1.13 1.79 1.13 2.85s-.41 2.08-1.13 2.85L51.87 50.86c-.55.51-1.23.86-1.96 1.01-.73.15-1.49.1-2.2-.14l-6-6-6 6.16 6 6h.21c2.38 1.66 5.27 2.44 8.16 2.2 2.89-.24 5.62-1.47 7.7-3.49l21.07-21.14c2.28-2.33 3.55-5.47 3.55-8.73 0-3.26-1.28-6.4-3.55-8.73z"
                            fill="#D1CCC5"
                        />
                        <path
                            d="M32.2 34.96 13.54 53.62a1.75 1.75 0 0 0 0 2.47c.68.68 1.79.68 2.47 0l18.66-18.66c.68-.68.68-1.79 0-2.47a1.75 1.75 0 0 0-2.47 0zM55.93 11.24l-8.39 8.39a1.75 1.75 0 0 0 0 2.47c.68.68 1.79.68 2.47 0l8.39-8.39c.68-.68.68-1.79 0-2.47a1.75 1.75 0 0 0-2.47 0zM72.92 31.57 54.26 50.23a1.75 1.75 0 0 0 0 2.47c.68.68 1.79.68 2.47 0l18.66-18.66c.68-.68.68-1.79 0-2.47a1.75 1.75 0 0 0-2.47 0zM38.33 66.15l-8.39 8.39a1.75 1.75 0 0 0 0 2.47c.68.68 1.79.68 2.47 0l8.39-8.39c.68-.68.68-1.79 0-2.47a1.75 1.75 0 0 0-2.47 0z"
                            fill="#E8E6E1"
                        />
                        <path
                            d="m74.69 45-14.3 14.33c-2.16 2.1-4.85 3.56-7.79 4.21l.07.13c.29.69.37 1.46.22 2.19-.14.74-.5 1.41-1.03 1.95L45 74.74v8.83L83.57 45h-8.88z"
                            fill="#4A4743"
                        />
                    </svg>
                    <h2>Ссылка для зрителей</h2>
                </header>
                <ClipboardCopy textToCopy={"Text to copy"} />

                <TelegramShareButton
                    params={{ url: "https://www.youtube.com" }}
                    className="flex items-center justify-center gap-x-4 rounded-2xl bg-black/30 px-6 py-4 text-xl font-bold shadow-lg transition-colors duration-150 active:bg-white/15"
                >
                    <svg
                        height="36"
                        width="36"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <linearGradient
                            id="BiF7D16UlC0RZ_VqXJHnXa"
                            x1="9.858"
                            x2="38.142"
                            y1="9.858"
                            y2="38.142"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop
                                offset="0"
                                stop-color="#33bef0"
                            />
                            <stop
                                offset="1"
                                stop-color="#0a85d9"
                            />
                        </linearGradient>
                        <path
                            fill="url(#BiF7D16UlC0RZ_VqXJHnXa)"
                            d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                        />
                        <path
                            d="M10.119,23.466c8.155-3.695,17.733-7.704,19.208-8.284c3.252-1.279,4.67,0.028,4.448,2.113	c-0.273,2.555-1.567,9.99-2.363,15.317c-0.466,3.117-2.154,4.072-4.059,2.863c-1.445-0.917-6.413-4.17-7.72-5.282	c-0.891-0.758-1.512-1.608-0.88-2.474c0.185-0.253,0.658-0.763,0.921-1.017c1.319-1.278,1.141-1.553-0.454-0.412	c-0.19,0.136-1.292,0.935-1.745,1.237c-1.11,0.74-2.131,0.78-3.862,0.192c-1.416-0.481-2.776-0.852-3.634-1.223	C8.794,25.983,8.34,24.272,10.119,23.466z"
                            opacity=".05"
                        />
                        <path
                            d="M10.836,23.591c7.572-3.385,16.884-7.264,18.246-7.813c3.264-1.318,4.465-0.536,4.114,2.011	c-0.326,2.358-1.483,9.654-2.294,14.545c-0.478,2.879-1.874,3.513-3.692,2.337c-1.139-0.734-5.723-3.754-6.835-4.633	c-0.86-0.679-1.751-1.463-0.71-2.598c0.348-0.379,2.27-2.234,3.707-3.614c0.833-0.801,0.536-1.196-0.469-0.508	c-1.843,1.263-4.858,3.262-5.396,3.625c-1.025,0.69-1.988,0.856-3.664,0.329c-1.321-0.416-2.597-0.819-3.262-1.078	C9.095,25.618,9.075,24.378,10.836,23.591z"
                            opacity=".07"
                        />
                        <path
                            fill="#fff"
                            d="M11.553,23.717c6.99-3.075,16.035-6.824,17.284-7.343c3.275-1.358,4.28-1.098,3.779,1.91	c-0.36,2.162-1.398,9.319-2.226,13.774c-0.491,2.642-1.593,2.955-3.325,1.812c-0.833-0.55-5.038-3.331-5.951-3.984	c-0.833-0.595-1.982-1.311-0.541-2.721c0.513-0.502,3.874-3.712,6.493-6.21c0.343-0.328-0.088-0.867-0.484-0.604	c-3.53,2.341-8.424,5.59-9.047,6.013c-0.941,0.639-1.845,0.932-3.467,0.466c-1.226-0.352-2.423-0.772-2.889-0.932	C9.384,25.282,9.81,24.484,11.553,23.717z"
                        />
                    </svg>
                    <span>Поделиться</span>
                </TelegramShareButton>
            </section> */}
        </main>
    );
};

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { UserCard } from "@/entities/user/ui/user-card";
import { GameOverDialog } from "@/widgets/game-over-dialog/ui/game-over-dialog";
import { TelegramClient } from "@/shared/api/telegram/types";

import { baseQuery } from "@/shared/api/config";

export const RoomPage = () => {
    const chess = useMemo(() => {
        return new Chess();
    }, []);
    const [fen, setFen] = useState(chess.fen());
    const params = useParams();

    const user = useRef(
        (window as Window & typeof globalThis & { Telegram: TelegramClient })
            .Telegram.WebApp.initDataUnsafe?.user
    );

    useEffect(() => {
        let socket: WebSocket | null = null;

        (async () => {
            if (
                !("roomId" in params) ||
                params.roomId === undefined ||
                user.current === undefined ||
                user.current.id === undefined
            )
                return;

            try {
                await baseQuery("/room/add_spectator", {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        user_id: user.current.id,
                        room_id: params.roomId
                    })
                });

                socket = new WebSocket(
                    `wss://www.chesswebapp.xyz/api/v1/watch?user_id=${user.current.id}&room_id=${params.roomId}`
                );

                socket.onmessage = (event: MessageEvent) => {
                    const response = JSON.parse(event.data);

                    if (!("type" in response) || !("data" in response)) return;

                    if (response.type === "move") {
                        chess.load(response.data);
                        setFen(chess.fen());
                    }
                };
            } catch (error) {
                console.error(error);
            }
        })();

        return () => {
            socket?.close(1000, "Close connection");
        };
    }, [chess, params]);

    return (
        <main
            className={"flex max-h-full flex-auto basis-full flex-col gap-y-8"}
        >
            <UserCard
                fullname={"User"}
                color="black"
            />
            <div className="flex aspect-square flex-auto items-center">
                <Chessboard
                    areArrowsAllowed={false}
                    position={fen}
                    isDraggablePiece={() => false}
                />
            </div>
            <UserCard
                fullname={"User"}
                color="white"
            />
            <GameOverDialog />
        </main>
    );
};

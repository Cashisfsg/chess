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
    const [users, setUsers] = useState({ black: undefined, white: undefined });
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
                    method: "PATCH",
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

                    const { type, data } = response;

                    switch (type) {
                        case "start_watch":
                            chess.load(data.fen);
                            setFen(chess.fen());
                            setUsers(users => ({
                                ...users,
                                white: data.white_piece_user_id,
                                black: data.black_piece_user_id
                            }));
                            break;

                        case "move":
                            chess.load(data);
                            setFen(chess.fen());
                            break;

                        default:
                            break;
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
        <main className="flex max-h-full flex-auto basis-full flex-col gap-y-8">
            <UserCard
                fullname={`User-${users.black}`}
                color="black"
            />
            <div className="flex aspect-square flex-auto items-center">
                <Chessboard
                    areArrowsAllowed={false}
                    position={fen}
                    isDraggablePiece={() => false}
                />
            </div>

            <button
                onClick={async () => {
                    try {
                        await baseQuery("/room/add_spectator", {
                            headers: {
                                accept: "application/json",
                                "Content-Type": "application/json"
                            },
                            method: "PATCH",
                            body: JSON.stringify({
                                user_id: user.current?.id,
                                room_id: parseInt(params.roomId || "0")
                            })
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }}
            >
                Add spectator
            </button>

            <UserCard
                fullname={`User-${users.white}`}
                color="white"
            />
            <GameOverDialog />
        </main>
    );
};

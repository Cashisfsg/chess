import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Chess, Square, validateFen } from "chess.js";
import { Chessboard } from "react-chessboard";

import { useWebSocketContext } from "@/app/providers/web-socket/use-web-socket-context";
import { UserCard } from "@/entities/user";

const sendWinner = async ({
    roomId,
    color
}: {
    roomId: number;
    color: "w" | "b";
}) => {
    try {
        const winner = {
            w: "white",
            b: "black"
        };

        const response = await fetch(
            import.meta.env.VITE_BASE_API_URL + "/room/play/winner",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    room_id: roomId,
                    winner_color: winner[color]
                })
            }
        );

        if (!response.ok) {
            const message = await response.json();
            throw new Error(message);
        }

        return await response.json();
    } catch (error) {
        alert((error as Error).message);
    }
};

const checkMateCheck = (chess: Chess, roomId: number) => {
    if (!chess.isGameOver()) return;

    if (chess.isCheckmate()) {
        setTimeout(async () => {
            const loser = chess.turn();

            await sendWinner({ roomId, color: loser });

            if (loser === "b") {
                alert("white win");
            } else {
                alert("Black win");
            }
        }, 2000);
    }
};

type Move =
    | string
    | {
          from: string;
          to: string;
          promotion?: string;
      };

export const GamePage = () => {
    const [chess, setChess] = useState(new Chess());

    const params = useParams();
    const { socket, connect, disconnect } = useWebSocketContext();

    // const socket = useMemo(() => {
    //     if (!("roomId" in params)) return null;

    //     return new WebSocket(
    //         `wss://www.chesswebapp.xyz/api/v1/room/play?room_id=${params.roomId}&user_id=${JSON.parse(localStorage.getItem("user") || "{}")?.user_id}`
    //     );
    // }, [params]);

    // const tg = (
    //     window as Window & typeof globalThis & { Telegram: TelegramClient }
    // ).Telegram.WebApp;

    useEffect(() => {
        console.log("Params: ");
        console.log(params);

        if (!("roomId" in params) || !params?.roomId) return;

        const stored = localStorage.getItem("user");

        if (!stored) return;

        const user = JSON.parse(stored);

        console.log("User");
        console.log(user);

        if (!("user_id" in user) || !user.user_id) return;

        const { roomId } = params;
        const { user_id: userId } = user;

        connect({ roomId, userId });

        return () => {
            disconnect();
        };
    }, [params]);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (!("type" in response)) return;

            const { type } = response;

            switch (type) {
                case "move": {
                    const { ok } = validateFen(response.data);

                    if (!ok) {
                        alert("Invalid fen: " + response.data);
                        break;
                    }

                    const newChess = new Chess(response.data);

                    setChess(newChess);

                    if (!("roomId" in params) || !params.roomId) return;

                    checkMateCheck(newChess, parseInt(params.roomId));

                    break;
                }

                default:
                    console.log(response);

                    break;
            }
        };
    }, [socket, params?.roomId]);

    const [selectedPiece, setSelectedPiece] = useState<{
        square: string;
        color: string;
        moves: string[];
    }>({
        square: "",
        color: "",
        moves: []
    });

    function makeAMove(move: Move) {
        chess.move(move);

        const newChess = new Chess(chess.fen());

        setChess(newChess);

        checkMateCheck(newChess, parseInt(params?.roomId || "0"));

        socket?.send(JSON.stringify({ type: "move", data: chess.fen() }));
    }

    function onDrop(sourceSquare: Square, targetSquare: Square) {
        try {
            makeAMove({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q" // always promote to a queen for example simplicity
            });

            if (chess.isGameOver()) {
                const color = sessionStorage.getItem("color");

                if (!color) return false;

                socket?.send(
                    JSON.stringify({ type: "checkmate", winner: color })
                );
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    const highlightSquares = (
        pieceSquare: string,
        availableMoves: string[]
    ): void => {
        document
            .querySelector(`[data-square=${pieceSquare}]`)
            ?.classList.add("selected-piece");

        const regex = new RegExp("^[a-hBKNRQ]x[a-h][1-8][+]?$");

        availableMoves.forEach(move => {
            const match = move.match(/[a-hBKNRQ][1-8]/);

            if (!match) return;

            if (regex.test(move)) {
                document
                    .querySelector(`[data-square=${match[0]}]`)
                    ?.classList.add("attacked");
            } else {
                document
                    .querySelector(`[data-square=${match[0]}]`)
                    ?.classList.add("possible");
            }
        });
    };

    const unHighlightSquares = () => {
        document
            .querySelectorAll("[data-square]")
            .forEach(square =>
                square.classList.remove(
                    "selected-piece",
                    "possible",
                    "attacked"
                )
            );
    };

    return (
        <main className="flex max-h-full flex-auto basis-full flex-col gap-y-8">
            <UserCard
                id={"538945734"}
                color="black"
            />
            <div className="flex aspect-square flex-auto items-center">
                <Chessboard
                    areArrowsAllowed={true}
                    boardOrientation={
                        sessionStorage.getItem("color") as "black" | "white"
                    }
                    position={chess.fen()}
                    isDraggablePiece={({ piece }) => {
                        const color = sessionStorage.getItem("color");

                        if (color) {
                            return (
                                color.startsWith(chess.turn()) &&
                                piece.startsWith(chess.turn())
                            );
                        }

                        return piece.startsWith(chess.turn());
                    }}
                    onPieceClick={(piece, square) => {
                        const { color } = chess.get(square);

                        if (chess.turn() !== color) return;

                        unHighlightSquares();

                        const enabledMoves = chess.moves({ square });

                        setSelectedPiece(piece => ({
                            ...piece,
                            square,
                            color,
                            moves: enabledMoves
                        }));

                        highlightSquares(square, enabledMoves);
                    }}
                    onSquareClick={(square, piece) => {
                        if (
                            selectedPiece.square === "" ||
                            (selectedPiece.square !== "" &&
                                piece !== undefined &&
                                piece.startsWith(selectedPiece.color))
                        ) {
                            console.log(square, piece);

                            return;
                        }

                        try {
                            makeAMove({
                                from: selectedPiece.square,
                                to: square,
                                promotion: "q" // always promote to a queen for example simplicity
                            });
                        } catch (error) {
                            console.log("Invalid move");
                        } finally {
                            setSelectedPiece(piece => ({
                                ...piece,
                                square: "",
                                color: "",
                                moves: []
                            }));
                            unHighlightSquares();
                        }
                    }}
                    onPieceDragBegin={(piece, square) => {
                        const { color } = chess.get(square);

                        if (chess.turn() !== color) return;

                        const availableMoves = chess.moves({ square });

                        highlightSquares(square, availableMoves);
                    }}
                    onPieceDragEnd={unHighlightSquares}
                    onPieceDrop={onDrop}
                />
            </div>
            <UserCard
                id={"sdf4234"}
                color="white"
            />
        </main>
    );
};

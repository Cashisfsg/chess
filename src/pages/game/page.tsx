import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { Chess, Square, validateFen } from "chess.js";
import { Chessboard } from "react-chessboard";

import { useWebSocketContext } from "@/app/providers/web-socket/use-web-socket-context";

import { GameOverDialog } from "@/widgets/game-over-dialog";
import { UserCard } from "@/entities/user";
import { TelegramClient } from "@/shared/api/telegram/types";
import { useStorage } from "@/shared/lib/hooks/use-storage";

type Move =
    | string
    | {
          from: string;
          to: string;
          promotion?: string;
      };

export const GamePage = () => {
    const [chess, setChess] = useState(new Chess());

    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;

    const params = useParams();
    const { socket, connect, disconnect } = useWebSocketContext();
    const [{ data: boardOrientation }] = useStorage<"black" | "white">(
        "color",
        sessionStorage
    );

    useEffect(() => {
        if (!("roomId" in params) || !params?.roomId) return;

        const user = tg?.initDataUnsafe?.user;

        if (!user?.id) return;

        const { roomId } = params;

        connect({ roomId, userId: String(user.id) });

        return () => {
            disconnect();
        };
    }, [params, tg?.initDataUnsafe?.user]);

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener("message", (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (!("type" in response)) return;

            const { type } = response;

            switch (type) {
                case "init":
                    if (!("data" in response)) break;

                    setChess(new Chess(response.data));

                    break;

                case "move": {
                    clearTimeout(timerRef.current);

                    const { ok } = validateFen(response.data);

                    if (!ok) {
                        console.error("Invalid fen: " + response.data);
                        break;
                    }

                    const newChess = new Chess(response.data);

                    setChess(newChess);

                    if (newChess.isCheck()) {
                        document
                            .querySelector(
                                `[data-piece=${boardOrientation ? boardOrientation[0] + "K" : "wK"}]`
                            )
                            ?.classList.add("attacked");
                    }

                    timerRef.current = setTimeout(() => {
                        makeARandomMove();
                    }, 30000);

                    break;
                }

                case "connect_user":
                    if (!("data" in response)) break;

                    sessionStorage.setItem(
                        "game_time_start",
                        JSON.stringify(response.data)
                    );

                    break;

                default:
                    break;
            }
        });
    }, [socket, params, boardOrientation]);

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

        socket?.send(JSON.stringify({ type: "move", data: chess.fen() }));

        if (!newChess.isCheck()) {
            document
                .querySelector(
                    `[data-piece=${boardOrientation ? boardOrientation[0] + "K" : "wK"}]`
                )
                ?.classList.remove("attacked");
        }

        if (
            chess.moves().length === 0 &&
            !chess.isCheckmate() &&
            chess.isDraw()
        ) {
            socket?.send(JSON.stringify({ type: "draw", detail: "stalemate" }));
            return;
        }

        if (chess.isCheckmate()) {
            if (!boardOrientation)
                throw Error(
                    "Board orientation does not exist in session storage"
                );

            socket?.send(
                JSON.stringify({ type: "checkmate", winner: boardOrientation })
            );
            return;
        }

        if (chess.isDraw()) {
            socket?.send(JSON.stringify({ type: "draw", detail: "draw" }));
            return;
        }
    }

    function makeARandomMove() {
        if (!boardOrientation?.startsWith(chess.turn())) return;

        const availableMoves = chess.moves();
        const randomMove =
            availableMoves[Math.round(Math.random() * availableMoves.length)];

        chess.move(randomMove);

        const newChess = new Chess(chess.fen());

        setChess(newChess);

        socket?.send(JSON.stringify({ type: "move", data: chess.fen() }));
    }

    function onDrop(sourceSquare: Square, targetSquare: Square) {
        try {
            makeAMove({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q" // always promote to a queen for example simplicity
            });

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
        <main
            className={"flex max-h-full flex-auto basis-full flex-col gap-y-8"}
        >
            <UserCard
                fullname={"User"}
                color={boardOrientation === "white" ? "black" : "white"}
            />
            <div className="flex aspect-square flex-auto items-center">
                <Chessboard
                    areArrowsAllowed={true}
                    boardOrientation={boardOrientation}
                    position={chess.fen()}
                    isDraggablePiece={({ piece }) => {
                        if (boardOrientation) {
                            return (
                                boardOrientation.startsWith(chess.turn()) &&
                                piece.startsWith(chess.turn())
                            );
                        }

                        return piece.startsWith(chess.turn());
                    }}
                    onPieceClick={(piece, square) => {
                        if (
                            !boardOrientation ||
                            !boardOrientation.startsWith(chess.turn()) ||
                            !boardOrientation.startsWith(chess.turn())
                        )
                            return;

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
                            return;
                        }

                        try {
                            makeAMove({
                                from: selectedPiece.square,
                                to: square,
                                promotion: "q" // always promote to a queen for example simplicity
                            });
                        } catch (error) {
                            console.error("Invalid move");
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
                fullname={tg?.initDataUnsafe?.user?.first_name}
                color={boardOrientation === "white" ? "white" : "black"}
            />
            <GameOverDialog />
        </main>
    );
};

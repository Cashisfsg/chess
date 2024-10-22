import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Chess, Square, validateFen } from "chess.js";
import { Chessboard } from "react-chessboard";

// import { TelegramClient } from "../../shared/api/telegram/types";

const checkMateCheck = (chess: Chess) => {
    if (!chess.isGameOver()) return;

    if (chess.isCheckmate()) {
        const loser = chess.turn();

        loser === "b" ? alert("White win") : alert("Black win");
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

    const socket = useMemo(() => {
        if (!("roomId" in params)) return null;

        return new WebSocket(
            `wss://www.chesswebapp.xyz/api/v1/room/play?room_id=${params.roomId}&user_id=${JSON.parse(localStorage.getItem("user") || "{}")?.user_id}`
        );
    }, [params]);

    // const tg = (
    //     window as Window & typeof globalThis & { Telegram: TelegramClient }
    // ).Telegram.WebApp;

    useEffect(() => {
        if (!socket) return;

        socket.onopen = () => {
            console.log("socket open");
        };

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

                    checkMateCheck(newChess);

                    break;
                }

                default:
                    console.log(response);

                    break;
            }
        };

        socket.onerror = error => {
            console.log(error);
        };

        socket.onclose = () => {
            console.log("socket close");
        };

        return () => {
            socket.close(1000, "Close connection");
        };
    }, [socket]);

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

        setChess(new Chess());

        checkMateCheck(newChess);

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
                alert("Game over");
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    // const selectAvailableSquares = (
    //     availableMoves: string[]
    // ): HTMLElement[] => {
    //     if (availableMoves.length === 0) return [];

    //     try {
    //         return Array.from(
    //             document.querySelectorAll(
    //                 availableMoves
    //                     .map(square => {
    //                         const regex = new RegExp("^[a-hBKNRQ]x[a-h][1-8]$");

    //                         if (regex.test(square)) {
    //                             return `[data-square=${square.substring(2)}]`;
    //                         } else {
    //                             return `[data-square=${
    //                                 square.match(/[a-hBKNRQ][1-8]/)?.[0]
    //                             }]`;
    //                         }
    //                     })
    //                     .join(", ")
    //             )
    //         );
    //     } catch (error) {
    //         return [];
    //     }
    // };

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
            <p>Player 1</p>
            <div className="flex aspect-square flex-auto items-center">
                <Chessboard
                    areArrowsAllowed={true}
                    boardOrientation={
                        sessionStorage.getItem("color") as "black" | "white"
                    }
                    position={chess.fen()}
                    isDraggablePiece={() => {
                        const color = sessionStorage.getItem("color");

                        if (color) {
                            return color.startsWith(chess.turn());
                        }

                        return true;
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
            <p>Player 2</p>
        </main>
    );
};

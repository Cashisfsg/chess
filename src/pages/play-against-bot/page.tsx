import { useState, useMemo, useRef } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";

import { UserCard } from "@/entities/user/ui/user-card";
import { TelegramClient } from "@/shared/api/telegram/types";

type Move =
    | string
    | {
          from: string;
          to: string;
          promotion?: string;
      };

export const PlayAgainstBotPage = () => {
    const chess = useMemo(() => {
        return new Chess();
    }, []);

    const [fen, setFen] = useState(chess.fen());
    const user = useRef(
        (window as Window & typeof globalThis & { Telegram: TelegramClient })
            .Telegram.WebApp.initDataUnsafe?.user
    );
    const selectedPiece = useRef<{
        square: string;
        color: string;
        moves: string[];
    }>({
        square: "",
        color: "",
        moves: []
    });
    const makeAMove = (move: Move) => {
        chess.move(move);
        setFen(chess.fen());
    };

    const makeARandomMove = () => {
        const availableMoves = chess.moves();

        const index = Math.round(Math.random() * (availableMoves.length - 1));

        const randomMove = availableMoves[index];

        chess.move(randomMove);
        setFen(chess.fen());
    };

    const onDrop = (sourceSquare: Square, targetSquare: Square) => {
        try {
            makeAMove({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q" // always promote to a queen for example simplicity
            });

            setTimeout(() => {
                makeARandomMove();
            }, 300);

            return true;
        } catch (error) {
            return false;
        }
    };

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
                fullname="Bot"
                color="black"
            />

            <div className="flex aspect-square flex-auto items-center">
                <Chessboard
                    areArrowsAllowed={false}
                    position={fen}
                    isDraggablePiece={() => chess.turn() === "w"}
                    onPieceClick={(piece, square) => {
                        if (chess.turn() !== "w") return;

                        const { color } = chess.get(square);

                        if (chess.turn() !== color) return;

                        unHighlightSquares();

                        const enabledMoves = chess.moves({ square });

                        selectedPiece.current = {
                            ...selectedPiece.current,
                            square,
                            color,
                            moves: enabledMoves
                        };

                        highlightSquares(square, enabledMoves);
                    }}
                    onSquareClick={(square, piece) => {
                        if (
                            selectedPiece.current.square === "" ||
                            (selectedPiece.current.square !== "" &&
                                piece !== undefined &&
                                piece.startsWith(selectedPiece.current.color))
                        ) {
                            return;
                        }

                        try {
                            makeAMove({
                                from: selectedPiece.current.square,
                                to: square,
                                promotion: "q" // always promote to a queen for example simplicity
                            });

                            setTimeout(() => {
                                makeARandomMove();
                            }, 300);
                        } catch (error) {
                            console.error("Invalid move");
                        } finally {
                            selectedPiece.current = {
                                ...selectedPiece.current,
                                square: "",
                                color: "",
                                moves: []
                            };
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

            <button
                onClick={() => {
                    chess.move("d4");
                    setFen(chess.fen());
                }}
            >
                Move d4
            </button>

            <UserCard
                fullname={user.current?.first_name}
                color="white"
            />
            {/* <GameOverDialog /> */}
        </main>
    );
};

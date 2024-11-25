import { useState, useMemo, useRef, useEffect } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";

import { GameOverDialogSinglePlayer } from "@/widgets/game-over-dialog";
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
    const dialogRef = useRef<HTMLDialogElement>(null);

    const boardOrientation = useRef<"black" | "white">(
        (["black", "white"] as const)[Math.round(Math.random())]
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
        if (chess.isGameOver()) dialogRef.current?.showModal();
    };

    const makeARandomMove = () => {
        const availableMoves = chess.moves();

        const index = Math.round(Math.random() * (availableMoves.length - 1));

        const randomMove = availableMoves[index];

        chess.move(randomMove);
        setFen(chess.fen());
        if (chess.isGameOver()) dialogRef.current?.showModal();
    };

    useEffect(() => {
        if (boardOrientation.current === "white") return;

        makeARandomMove();
    }, []);

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
                color={boardOrientation.current === "white" ? "black" : "white"}
            />

            <div className="flex flex-auto items-center">
                <Chessboard
                    areArrowsAllowed={false}
                    boardOrientation={boardOrientation.current}
                    position={fen}
                    isDraggablePiece={({ piece }) =>
                        piece.startsWith(
                            boardOrientation.current.substring(0, 1)
                        )
                    }
                    onPieceClick={(piece, square) => {
                        console.log(boardOrientation.current);
                        console.log(chess.turn());

                        if (!boardOrientation.current.startsWith(chess.turn()))
                            return;
                        console.log("First check");

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

            <UserCard
                fullname={user.current?.first_name}
                color={boardOrientation.current === "white" ? "white" : "black"}
            />

            <GameOverDialogSinglePlayer
                dialogRef={dialogRef}
                label={
                    chess.isCheckmate()
                        ? "Мат"
                        : chess.isDraw() || chess.isStalemate()
                          ? "Ничья"
                          : ""
                }
                description={
                    chess.isCheckmate()
                        ? `Победили ${chess.turn() === "w" ? "черные" : "белые"}`
                        : chess.isStalemate()
                          ? "Победила дружба"
                          : chess.isDraw()
                            ? "Пат"
                            : ""
                }
            />
        </main>
    );
};

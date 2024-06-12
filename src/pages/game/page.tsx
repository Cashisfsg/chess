import { useState, useReducer } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";

export const GamePage = () => {
    const [game, setGame] = useState(new Chess());
    const [currentPlayer, togglePlayer] = useReducer(state => {
        if (state === "w") {
            return "b";
        } else {
            return "w";
        }
    }, "w");

    const [selectedPiece, setSelectedPiece] = useState<{
        square: string;
        color: string;
        moves: string[];
    }>({
        square: "",
        color: "",
        moves: []
    });

    function makeAMove(
        move:
            | string
            | {
                  from: string;
                  to: string;
                  promotion?: string | undefined;
              }
    ) {
        const gameCopy = new Chess(game.fen());
        gameCopy.move(move);
        setGame(gameCopy);
    }

    function onDrop(sourceSquare: Square, targetSquare: Square) {
        try {
            makeAMove({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q" // always promote to a queen for example simplicity
            });

            togglePlayer();

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

        availableMoves.forEach(move => {
            const regex = new RegExp("^[a-hBKNRQ]x[a-h][1-8][+]?$");

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
                    boardOrientation="white"
                    position={game.fen()}
                    onPieceClick={(piece, square) => {
                        const { color } = game.get(square);

                        if (currentPlayer !== color) return;

                        const enabledMoves = game.moves({ square });

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
                            togglePlayer();
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
                        // Проверка если текущая фигура не принадлежит игроку ничего не делать
                        const { color } = game.get(square);

                        if (currentPlayer !== color) return;

                        const availableMoves = game.moves({ square });

                        highlightSquares(square, availableMoves);
                    }}
                    onPieceDragEnd={unHighlightSquares}
                    onPieceDrop={onDrop}
                    // customPieces={{ bP: wK }}
                />
            </div>
            <p>Player 2</p>
        </main>
    );
};

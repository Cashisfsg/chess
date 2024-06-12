import {
    useState,
    useReducer,
    useMemo,
    useEffect,
    useRef,
    useLayoutEffect
} from "react";
import { Chess, Square } from "chess.js";
import { Chessboard, ClearPremoves } from "react-chessboard";
import { CustomPieceFnArgs } from "react-chessboard/dist/chessboard/types";
// import Bishop from "./assets/bishop.png";
// import Pawn from "./assets/pawn.png";
// import Knight from "./assets/knight.png";
// import King from "./assets/king.png";
// import "./App.css";
import { useFirstRender } from "./hooks/use-first-render";
import { useIsMounted } from "./hooks/use-is-mounted";
import { Select } from "./components/select/select";

const COLUMNS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SQUARES = COLUMNS.flatMap(column =>
    ROWS.map(row => `[data-square=${column + row}]`)
).join(", ");

export const GamePage = () => {
    const [game, setGame] = useState(new Chess());
    const [possibleMoves, setPossibleMoves] = useState<HTMLElement[]>([]);
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
            setSelectedPiece(piece => ({
                ...piece,
                square: "",
                color: "",
                moves: []
            }));
            togglePlayer();
            unHighlightSquares();
            unHighlightSelectedPiece();
            return true;
        } catch (error) {
            return false;
        }
    }

    const selectAvailableSquares = (enabledMoves: string[]): HTMLElement[] => {
        try {
            return Array.from(
                document.querySelectorAll(
                    enabledMoves
                        .map(square => {
                            const regex = new RegExp("^[a-hBKNRQ]x[a-h][1-8]$");

                            if (regex.test(square)) {
                                return `[data-square=${square.substring(2)}]`;
                            } else {
                                return `[data-square=${
                                    square.match(/[a-hBKNRQ][1-8]/)?.[0]
                                }]`;
                            }
                        })
                        .join(", ")
                )
            );
        } catch (error) {
            return [];
        }
    };

    const highlightSelectedPiece = (square: string) => {
        const piece = document.querySelector(
            `[data-square=${square}]`
        ) as HTMLElement;

        if (!piece) return;

        piece.classList.add("selected-piece");
    };

    const unHighlightSelectedPiece = () => {
        if (selectedPiece.square === "") return;

        const piece = document.querySelector(
            `[data-square=${selectedPiece.square}]`
        ) as HTMLElement;

        if (!piece) return;

        piece.classList.remove("selected-piece");
    };

    const highlightSquares = (
        availableSquares: HTMLElement[],
        availableMoves: string[],
        attackedMoves: string[]
    ): void => {
        availableSquares.forEach(square => {
            const coords = square.getAttribute("data-square");

            if (!coords) return;

            if (attackedMoves.includes(coords)) {
                square.classList.add("attacked");
            } else if (availableMoves.includes(coords)) {
                square.classList.add("possible");
            }
        });
    };

    const unHighlightSquares = () => {
        possibleMoves.forEach(square => {
            square.classList.remove("possible", "attacked");
        });
    };

    return (
        <main className="flex max-h-full flex-auto basis-full flex-col gap-y-8">
            <p>Player 1</p>
            <div className="flex aspect-square flex-auto items-center">
                {/* <Select /> */}
                <Chessboard
                    areArrowsAllowed={true}
                    boardOrientation="white"
                    position={game.fen()}
                    onPieceClick={(piece, square) => {
                        console.log("Piece clicked", game.get(square));

                        if (currentPlayer !== game.get(square).color) return;
                        unHighlightSquares();
                        unHighlightSelectedPiece();

                        const { color } = game.get(square);
                        const enabledMoves = game.moves({ square });

                        setSelectedPiece(piece => ({
                            ...piece,
                            square,
                            color,
                            moves: enabledMoves
                        }));
                        console.log(enabledMoves);

                        const moveableSquares =
                            selectAvailableSquares(enabledMoves);

                        const availableMoves = enabledMoves
                            .filter(move => {
                                const regex = new RegExp(
                                    "^[a-hBKNRQ]x[a-h][1-8]$"
                                );

                                return !regex.test(move);
                            })
                            .map(move => {
                                const match = move.match(/[a-hBKNRQ][1-8]/);

                                if (!match) return "";

                                return match[0];
                            });

                        const attackedMoves = enabledMoves
                            .filter(move => {
                                const regex = new RegExp(
                                    "^[a-hBKNRQ]x[a-h][1-8][+]?$"
                                );

                                return regex.test(move);
                            })
                            .map(move => {
                                const match = move.match(/[a-hBKNRQ][1-8]/);

                                console.log("mathc", match);

                                if (!match) return "";

                                return match[0];
                            });

                        highlightSquares(
                            moveableSquares,
                            availableMoves,
                            attackedMoves
                        );
                        highlightSelectedPiece(square);

                        setPossibleMoves(moveableSquares);
                    }}
                    onSquareClick={(square, piece) => {
                        console.log("Click square clicked");

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
                            unHighlightSelectedPiece();
                            setPossibleMoves([]);
                        }
                    }}
                    // promotionToSquare={possibleMoves}
                    // promotionDialogVariant="vertical"
                    // showPromotionDialog={true}
                    onPieceDragBegin={piece => {
                        console.log(piece);
                    }}
                    onPieceDrop={onDrop}
                    // customPieces={{ bP: wK }}
                />
            </div>
            <p>Player 2</p>
        </main>
    );
};

interface Piece extends CustomPieceFnArgs {}

const wK = (props: CustomPieceFnArgs) => {
    return (
        // <div
        //     {...props}
        //     style={{
        //         // width: "100%",
        //         // height: "",
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //     }}
        // >
        <img
            src={King}
            style={{
                width: "125px",
                height: "125px",
                objectFit: "contain",
                objectPosition: "center",
                userSelect: "none"
            }}
            {...props}
            // height="50"
            // width="50"
        />
        // </div>
    );
};

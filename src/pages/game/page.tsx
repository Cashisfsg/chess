import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Chess, Square, validateFen } from "chess.js";
import { Chessboard } from "react-chessboard";

import { useWebSocketContext } from "@/app/providers/web-socket/use-web-socket-context";
import { UserCard } from "@/entities/user";

import { GameOverDialog } from "@/widgets/game-over-dialog";

type Move =
    | string
    | {
          from: string;
          to: string;
          promotion?: string;
      };

export const GamePage = () => {
    const [chess, setChess] = useState(new Chess());
    // const [chess, setChess] = useState(
    //     new Chess("7k/6Q1/6K1/8/8/8/8/8 b - - 0")
    // ); //checkmate
    // const [chess, setChess] = useState(
    //     new Chess("7k/5Q2/7K/8/8/8/8/8 b - - 0 1")
    // ); //stalemate
    // const [chess, setChess] = useState(
    //     new Chess("8/8/8/8/8/8/2k5/K7 w - - 100 200")
    // ); //draw

    const params = useParams();
    const { socket, connect, disconnect } = useWebSocketContext();

    useEffect(() => {
        if (
            chess.moves().length === 0 &&
            !chess.isCheckmate() &&
            chess.isDraw()
        ) {
            console.log("Moves: ");
            console.log(chess.moves());

            console.log("Stalemate detected");
            return;
        }

        if (chess.isCheckmate()) {
            console.log("Checkmate detected");
            return;
        }

        if (chess.isDraw()) {
            console.log("Draw detected");
            return;
        }
    }, [chess]);

    useEffect(() => {
        if (!("roomId" in params) || !params?.roomId) return;

        const stored = localStorage.getItem("user");

        if (!stored) return;

        const user = JSON.parse(stored);

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

        socket.addEventListener("message", (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (!("type" in response)) return;

            const { type } = response;

            switch (type) {
                case "move": {
                    const { ok } = validateFen(response.data);

                    if (!ok) {
                        console.error("Invalid fen: " + response.data);
                        break;
                    }

                    const newChess = new Chess(response.data);

                    setChess(newChess);

                    break;
                }

                default:
                    break;
            }
        });
    }, [socket, params]);

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

        if (
            chess.moves().length === 0 &&
            !chess.isCheckmate() &&
            chess.isDraw()
        ) {
            socket?.send(JSON.stringify({ type: "draw", detail: "stalemate" }));
            return;
        }

        if (chess.isCheckmate()) {
            const color = sessionStorage.getItem("color");

            if (!color)
                throw Error(
                    "Board orientation does not exist in session storage"
                );

            socket?.send(JSON.stringify({ type: "checkmate", winner: color }));
            return;
        }

        if (chess.isDraw()) {
            socket?.send(JSON.stringify({ type: "draw", detail: "draw" }));
            return;
        }
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
                        const boardOrientation =
                            sessionStorage.getItem("color");

                        if (!boardOrientation) return;

                        if (
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
                id={"sdf4234"}
                color="white"
            />
            <GameOverDialog />
        </main>
    );
};

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertDialog } from "@/shared/ui/alert-dialog";
import { useWebSocketContext } from "@/app/providers/web-socket/use-web-socket-context";

export const GameOverDialog = () => {
    const [winner, setWinner] = useState<"black" | "white" | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const { socket } = useWebSocketContext();

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (!("type" in response) || !("data" in response)) return;

            const { type, data } = response;

            if (type !== "game-over" || !("reason" in data)) return;

            const { reason } = data;

            if (reason === "checkmate") {
                setWinner(data.winner);
                dialogRef.current?.showPopover();
            }
        };
    }, [socket]);

    return (
        <AlertDialog.Root>
            <AlertDialog.Content forwardRef={dialogRef}>
                <AlertDialog.Label>
                    Победили {winner === "white" ? "черные" : "белые"}
                </AlertDialog.Label>
                <Link to="/settings">Новая игра</Link>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

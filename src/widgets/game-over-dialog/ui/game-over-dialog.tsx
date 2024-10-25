import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { useWebSocketContext } from "@/app/providers/web-socket/use-web-socket-context";

import { AlertDialog } from "@/shared/ui/alert-dialog";

export const GameOverDialog = () => {
    const [winner, setWinner] = useState<"black" | "white" | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { socket } = useWebSocketContext();

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener("message", (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (!("type" in response) || !("data" in response)) return;

            const { type, data } = response;

            if (type !== "game_over" || !("reason" in data)) return;

            const { reason } = data;

            if (reason === "checkmate") {
                console.log("Show modal");

                dialogRef.current?.showModal();
                setWinner(data.winner);
            }
        });
    }, [socket]);

    return (
        <AlertDialog.Root>
            <AlertDialog.Content
                forwardRef={dialogRef}
                className="fixed inset-0 my-auto flex-col gap-y-4 overflow-hidden rounded-2xl bg-black p-4 open:flex"
            >
                <AlertDialog.Label className="-mx-4 -mt-4 bg-[#1f1f1f] py-4 text-2xl font-bold text-white">
                    Мат
                </AlertDialog.Label>
                <AlertDialog.Description className="text-lg font-bold text-white">
                    Победили {winner === "white" ? "белые" : "черные"}
                </AlertDialog.Description>
                <Link
                    to="/settings"
                    className="flex items-center justify-center gap-x-4 rounded-2xl bg-[#5d9948] px-6 py-4 text-2xl font-bold text-white shadow-lg transition-colors duration-150 active:bg-[#a3d160] disabled:opacity-50"
                >
                    Новая игра
                </Link>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { useWebSocketContext } from "@/app/providers/web-socket/use-web-socket-context";

import { useTimeout } from "@/shared/lib/hooks/use-timeout";
import { AlertDialog } from "@/shared/ui/alert-dialog";

interface PartyDetails {
    label: string;
    description: string;
}

export const GameOverDialogMultiPlayer = () => {
    const [details, setDetails] = useState<PartyDetails>({
        label: "",
        description: ""
    });
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { socket, disconnect } = useWebSocketContext();

    useTimeout(() => {
        dialogRef.current?.showModal();
        socket?.send(JSON.stringify({ type: "draw", detail: "draw" }));
    }, 5000);

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener("message", (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (!("type" in response) || !("data" in response)) return;

            const { type, data } = response;

            if (type !== "game_over" || !("reason" in data)) return;

            const { reason } = data;

            switch (reason) {
                case "checkmate": {
                    if (!("winner" in data)) break;

                    const { winner } = data;

                    setDetails({
                        label: "Мат",
                        description: `Победили ${winner === "black" ? "черные" : "белые"}`
                    });

                    break;
                }

                case "stalemate":
                    setDetails({ label: "Ничья", description: "Пат" });

                    break;

                case "draw":
                    setDetails({
                        label: "Ничья",
                        description: "Победила дружба"
                    });

                    break;

                case "user_disconnected":
                    setDetails({
                        label: "Игра окончена",
                        description: "Связь с противником потеряна"
                    });

                    break;

                default:
                    break;
            }

            dialogRef.current?.showModal();
            disconnect();
        });
    }, [socket, disconnect]);

    return (
        <AlertDialog.Root>
            <AlertDialog.Content
                forwardRef={dialogRef}
                className="fixed inset-0 my-auto flex-col gap-y-4 overflow-hidden rounded-2xl bg-black p-4 open:flex"
            >
                <AlertDialog.Label className="-mx-4 -mt-4 bg-[#1f1f1f] py-4 text-2xl font-bold text-white">
                    {details.label}
                </AlertDialog.Label>
                <AlertDialog.Description className="text-lg font-bold text-white">
                    {details.description}
                </AlertDialog.Description>
                <Link
                    to="/search"
                    className="flex items-center justify-center gap-x-4 rounded-2xl bg-[#5d9948] px-6 py-4 text-2xl font-bold text-white shadow-lg transition-colors duration-150 active:bg-[#a3d160] disabled:opacity-50"
                >
                    Новая игра
                </Link>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

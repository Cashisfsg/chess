import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { TelegramClient } from "@/shared/api/telegram/types";
import { composeEventHandlers } from "@/shared/lib/utils/compose-event-handlers";

interface CreateLobbyButtonProps
    extends React.ComponentPropsWithoutRef<"button"> {}

export const CreateLobbyButton: React.FC<CreateLobbyButtonProps> = ({
    onClick,
    ...props
}) => {
    const currentUser = useRef(
        (window as Window & typeof globalThis & { Telegram: TelegramClient })
            .Telegram.WebApp.initDataUnsafe?.user
    );

    const navigate = useNavigate();

    const onClickHandler = async () => {
        const user = currentUser.current;

        if (!user || !user?.id) return;

        const request = {
            user_id: user.id,
            name: `room-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            private: true
        };

        const response = await fetch(
            `${import.meta.env.VITE_BASE_API_URL}/room/create`,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(request)
            }
        );

        const room_id = await response.json();

        navigate(`/lobby/${room_id}`);
    };

    return (
        <button
            onClick={composeEventHandlers(onClick, onClickHandler)}
            {...props}
        />
    );
};

import { useRef } from "react";

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

    const onClickHandler = async () => {
        const user = currentUser.current;

        if (!user || !user?.id) return;

        const request = {
            user_id: user.id,
            name: "room-name",
            private: false
        };

        const response = await fetch(import.meta.env.VITE_BASE_API_URL, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();

        console.log("Response data: ");
        console.log(data);
    };

    return (
        <button
            onClick={composeEventHandlers(onClick, onClickHandler)}
            {...props}
        />
    );
};

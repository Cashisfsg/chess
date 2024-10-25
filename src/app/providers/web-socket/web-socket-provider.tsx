import { useState, useEffect, useMemo, useCallback } from "react";

import {
    WebSocketContext,
    type WSConnectionProperties
} from "./use-web-socket-context";

interface ProviderProps extends React.PropsWithChildren {}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const connect = useCallback(
        ({ roomId, userId }: WSConnectionProperties) => {
            console.log("Web socket try to connect");

            setSocket(
                new WebSocket(
                    `wss://www.chesswebapp.xyz/api/v1/play?room_id=${roomId}&user_id=${userId}`
                )
            );
        },
        []
    );

    const disconnect = useCallback(() => {
        socket?.close(1000, "Close connection");
    }, [socket]);

    const context = useMemo(
        () => ({
            socket,
            connect,
            disconnect
        }),
        [socket]
    );

    useEffect(() => {
        if (!socket) return;

        socket.onopen = () => {
            console.log("socket open");
        };

        socket.onerror = error => {
            console.log(error);
        };

        socket.onclose = () => {
            console.log("socket close");
        };
    }, [socket]);

    return (
        <WebSocketContext.Provider value={context}>
            {children}
        </WebSocketContext.Provider>
    );
};

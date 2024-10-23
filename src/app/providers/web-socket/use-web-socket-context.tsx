import { createContext, useContext } from "react";

export interface WSConnectionProperties {
    roomId: string;
    userId: string;
}

type WSConnect = ({ roomId, userId }: WSConnectionProperties) => void;

type WSDisconnect = () => void;

interface WSContext {
    socket: WebSocket | null;
    connect: WSConnect;
    disconnect: WSDisconnect;
}

export const WebSocketContext = createContext<WSContext | null>(null);

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);

    if (!context) {
        throw new Error(
            "Component must be rendered as child of WebSocket provider"
        );
    }

    return context;
};

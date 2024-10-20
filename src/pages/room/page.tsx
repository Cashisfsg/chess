import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

// import { socket } from "../../shared/api/socket/socket";

interface FormFields {
    fen: HTMLInputElement;
}

export const RoomPage = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const params = useParams();

    const connectSocket = useCallback(() => {
        if (!("roomId" in params)) return;

        const socket = new WebSocket(
            `ws://www.chesswebapp.xyz:12345/room/play?room_id=${params.roomId}&user_id=123`
        );

        socket.onopen = () => {
            console.log("socket open");
        };

        socket.onmessage = (event: MessageEvent) => {
            alert("Event received. Data: " + event.data);
        };

        socket.onerror = error => {
            console.log(error);
        };

        socket.onclose = () => {
            console.log("socket close");
        };

        setSocket(socket);
    }, [params]);

    useEffect(() => {
        return () => {
            socket?.close(1000, "Close connection");
        };
    }, [socket]);

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = event => {
        event.preventDefault();

        const { fen } = event.currentTarget;

        socket?.send(fen.value);

        event.currentTarget.reset();
    };

    return (
        <div>
            Room page
            <button onClick={connectSocket}>Open socket</button>
            <form onSubmit={onSubmitHandler}>
                <label>
                    <span>FEN</span>
                    <input
                        type="text"
                        name="fen"
                    />
                </label>
                <button>Send message</button>
            </form>
        </div>
    );
};

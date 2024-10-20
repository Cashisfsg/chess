export const socket = new WebSocket("ws://www.chesswebapp.xyz:12345/room/play");

socket.onopen = () => {
    console.log("socket open");
};

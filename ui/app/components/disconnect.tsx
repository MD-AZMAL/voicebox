"use client";

import { useRoom } from "@/app/lib/context/room";
import { useWebSocket } from "@/app/lib/context/socket";
import { Button } from "@/components/ui/button";

export default function Disconnect() {
  const { conn, setConn } = useWebSocket();
  const { roomName, setRoomName } = useRoom();

  const handleClick = () => {
    if (conn) {
      const ws = new WebSocket(
        `ws://127.0.0.1:8080/ws/unregister?username=${sessionStorage.getItem(
          "username"
        )}&roomName=${roomName}`
      );

      if (ws.OPEN) {
        setRoomName("");
        setConn(null);
        ws.close();
      }
    }
  };

  return (
    <Button
      variant={"destructive"}
      className="place-items-center grid shadow-lg hover:shadow-2xl rounded-full w-[6rem] h-[6rem] cursor-pointer"
      onClick={handleClick}
      disabled={roomName === ""}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icon-tabler-phone-off icons-tabler-outline"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 21l18 -18" />
        <path d="M5.831 14.161a15.946 15.946 0 0 1 -2.831 -8.161a2 2 0 0 1 2 -2h4l2 5l-2.5 1.5c.108 .22 .223 .435 .345 .645m1.751 2.277c.843 .84 1.822 1.544 2.904 2.078l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a15.963 15.963 0 0 1 -10.344 -4.657" />
      </svg>
    </Button>
  );
}

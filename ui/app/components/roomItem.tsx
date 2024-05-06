"use client";

import { useRoom } from "@/app/lib/context/room";
import { useWebSocket } from "@/app/lib/context/socket";
import { Room } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export function RoomItemSkeleton() {
  return (
    <div className="flex items-center bg-gray-900 mb-2 p-2 rounded-sm w-full">
      <Skeleton className="flex-grow" />
    </div>
  );
}

export default function RoomItem({
  room,
}: Readonly<{
  room: Room;
}>) {
  const { conn, setConn } = useWebSocket();
  const { setRoomName } = useRoom();

  const handleClick = () => {
    if (!conn) {
      const ws = new WebSocket(
        `ws://127.0.0.1:8080/ws/register?username=${localStorage.getItem(
          "username"
        )}&roomName=${room.name}`
      );

      ws.onmessage = (e) => {
        console.log("rec : ", e);
      };

      ws.onopen = (e) => {
        console.log("open", e);

        setRoomName(room.name);
      };

      if (ws.OPEN) {
        setConn(ws);
      }
    }
  };

  return (
    <div
      className="flex items-center bg-gray-900 mb-2 p-2 rounded-sm w-full cursor-pointer"
      onClick={handleClick}
    >
      <p className="flex-grow">{room.name}</p>
    </div>
  );
}

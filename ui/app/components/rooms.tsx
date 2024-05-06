import RoomItem from "@/app/components/roomItem";
import { Room } from "@/app/lib/types";

export default async function Rooms() {
  const res = await fetch("http://localhost:8080/get-rooms", {
    cache: "no-cache",
  });

  const rooms = (await res.json()) as Room[];

  return (
    <>
      {rooms.length ? (
        rooms.map((room) => <RoomItem room={room} key={room.name} />)
      ) : (
        <p className="text-center text-slate-500 text-sm">No rooms found</p>
      )}
    </>
  );
}

import RoomItem from "@/app/components/roomItem";
import { Room } from "@/app/lib/types";

export default async function Rooms() {
  let res;

  try {
    res = await fetch(`http://${process.env.BACKEND_URL as string}/get-rooms`, {
      cache: "no-cache",
    });
  } catch (error) {
    console.error(error);
  }

  const rooms = res ? ((await res?.json()) as Room[]) : ([] as Room[]);

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

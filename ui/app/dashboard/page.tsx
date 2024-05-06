import Callzone from "@/app/components/callzone";
import CreateRoomForm from "@/app/components/createRoomForm";
import JoinRoomForm from "@/app/components/joinRoomForm";
import RoomItem, { RoomItemSkeleton } from "@/app/components/roomItem";
import Rooms from "@/app/components/rooms";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="gap-4 grid grid-cols-5 w-full min-h-[100vh]">
      <div className="flex flex-col gap-4 px-8 py-12 border-r">
        <div>
          <h2 className="mb-2 font-bold text-2xl">Rooms</h2>
          <div className="mb-4">
            <CreateRoomForm />
          </div>
        </div>
        <div className="flex-1">
          <Suspense fallback={<RoomItemSkeleton />}>
            <Rooms />
          </Suspense>
        </div>
        {/* <div>
          <JoinRoomForm />
        </div> */}
      </div>
      <div className="col-span-4 p-12 overflow-hidden">
        <Callzone />
      </div>
    </div>
  );
}

import Disconnect from "@/app/components/disconnect";
import Members from "@/app/components/members";
import Microphone from "@/app/components/microphone";

export default function Callzone() {
  return (
    <div className="flex flex-col items-center gap-4 bg-gray-800 p-5 rounded-xl w-full h-full">
      <Members />
      <div className="flex gap-8">
        <Microphone />
        <Disconnect />
      </div>
    </div>
  );
}

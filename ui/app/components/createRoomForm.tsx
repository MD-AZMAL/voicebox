"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function CreateRoomForm() {
  const [roomName, setRoomName] = useState<string>();

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleSubmit = async () => {
    const requestBody = {
      name: roomName?.toLowerCase().replaceAll(" ", "-"),
      createdBy: sessionStorage.getItem("username"),
    };

    await fetch("/api/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    router.refresh();
  };

  return (
    <form action={handleSubmit} className="flex items-center gap-2 w-full -sm">
      <Input
        id="room"
        placeholder="Enter your room name"
        value={roomName ? roomName : ""}
        onChange={handleChange}
        required
      />
      <Button type="submit" onClick={handleSubmit}>
        Create
      </Button>
    </form>
  );
}

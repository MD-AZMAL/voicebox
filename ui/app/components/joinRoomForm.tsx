"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";

export default function JoinRoomForm() {
  const [roomName, setRoomName] = useState<string>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleSubmit = () => {};

  return (
    <form
      action={handleSubmit}
      className="flex items-center gap-2 w-full max-w-sm"
    >
      <Input
        id="room"
        placeholder="Enter your room id"
        required
        value={roomName ? roomName : ""}
        onChange={handleChange}
      />
      <Button type="submit" onClick={handleSubmit}>
        Join
      </Button>
    </form>
  );
}

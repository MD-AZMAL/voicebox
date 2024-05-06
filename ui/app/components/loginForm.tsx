"use client";

import { loginUser } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState<string>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async () => {
    if (username) {
      console.log(username);

      sessionStorage.setItem("username", username);

      try {
        await loginUser();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form
      action={handleSubmit}
      className="flex items-center gap-2 w-full max-w-sm"
    >
      <Input
        id="username"
        placeholder="Enter your username"
        value={username ? username : ""}
        onChange={handleChange}
        required
      />
      <Button type="submit">Login</Button>
    </form>
  );
}

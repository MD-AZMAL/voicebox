"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function UserBadge() {
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    setUser(sessionStorage ? sessionStorage.getItem("username") || "" : "");
  }, []);
  return <Button className="w-full">{user} </Button>;
}

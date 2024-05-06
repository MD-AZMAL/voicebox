"use server";

import { redirect } from "next/navigation";

export async function loginUser() {
  return redirect("/dashboard");
}

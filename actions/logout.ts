"use server";

import { signOut } from "@/auth";
import { db } from "@/lib/db";

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};


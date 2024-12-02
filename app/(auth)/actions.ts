// THIS FILE IS ACTUALLY CREATED TO WRITE THE CODE THAT INTERACTS WITH THE SERVER THAT IS THE DATABASE
// THIS FILE CONTAINS THE SERVER ACTIONS CODE FOR NEXTJS AUTH
// THIS FILE CAN ALSO CONTAIN REST APIS IF NEEDED
"use server";

import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  //   After logout you redirect to the login page
  return redirect("/login");
}

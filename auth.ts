import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./lib/prisma";
import { Lucia } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { Session, User } from "@prisma/client";

// Creating an adapter for lucia
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// Configuring Lucia
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  },
  getUserAttributes: (databaseUserAttributes) => {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatartUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

// This is used to change the type inside the Lucia object according to our needs
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatartUrl: string | null;
  googleId: string | null;
}

// We will cache the session data while validation so that we dont have to make a database request each and every time we require the sesion data
// So we cache the session data, the cache is cleared when the entire website is reloaded
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    // First we fetch the sessionData from the browser cookie
    const sessionId =
      (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    // Then lucia compares and validates whether the sessionData obtained from the browser and the session data
    // in the database are the same
    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch (error) {}

    return result;
  },
);

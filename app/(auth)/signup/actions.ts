// THIS WILL CONTAINE THE SERVER ACTIONS CODE FOR ONLY THE SIGNUP PAGE
"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { hashConfig } from "@/lib/utils";
import { signupSchema, SignupValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// The error thrown in here cannot be catched by the frontend component so what we do is we
// actually return the error as string format so that it can be caught properly and then handled in the frontend
export async function signup(
  credentials: SignupValues,
): Promise<{ error: string }> {
  try {
    // BACKEND VALIDATION
    // Applying the zod validation while passing the data from frontend
    // It throws an error if not validated
    const { username, email, password } = signupSchema.parse(credentials);

    // Creating an hashed password
    const passwordHash = await hash(password, hashConfig);

    // This is used to generate an userid using lucia
    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    // We do this in the form of transaction so that,
    // * If any one transaction fails then it reverts back all the changes else completed the entire operation successfully
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
    });

    // Once the user is created we create the session cookie
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/"); // The redirect throws a special kind of error so we need to handle the error thorwn by the redirect error
  } catch (error) {
    // If the error is thrown by the redirect error then throw it
    if (isRedirectError(error)) throw error;
    console.error("Error while sigining up: ", error);
    return {
      error: "Something went wrong. Please try again",
    };
  }
}

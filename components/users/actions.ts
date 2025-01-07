"use server";
import NotFound from "@/app/(main)/not-found";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect, UserData } from "@/lib/types";
import React from "react";

/**
 *
 * @param {string} username - The username for which to fetch the userId
 * @returns {Promise<string | void>} A promise that resolves to the userId if found or else navigates you to the notFound page
 * @throws {Error} Throws an error if an issue occurs during the database query.
 * @description This function fetches the userId from the username that is given as the paramter
 */
export default async function fetchUserIdFromUsername(
  username: string,
): Promise<UserData | null> {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      throw new Error("Unauthorized");
    }
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUser?.id),
    });
    if (!user) throw new Error(`User ${username} not found`);
    return user;
  } catch (error) {
    console.error("Error while fetching userid from username: ", error);
    return null;
  }
}

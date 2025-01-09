"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  // First validate the user update data and only then call the validateUser
  // for better optimization, instead of unnecessarily request the DB for data
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}

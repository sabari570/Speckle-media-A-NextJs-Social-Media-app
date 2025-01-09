import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signupSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

// We are creating a type that matches with the signupSchema inorder to reuse it in frontend
export type SignupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

// Schema for post data
export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

// Schema for updateUserProfile
export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

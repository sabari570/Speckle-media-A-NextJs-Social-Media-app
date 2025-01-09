import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { number, string } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hashConfig = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    // This converts the time to something like 23 minutes ago
    // The suffix set to true adds the ago word
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyy");
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/**
 * Creates an enum based on the keys
 * The values will be lowercased version of the keys
 *
 * @param {string[]} keys The keys of enum
 * @returns {Object}
 */
export const createEnum = (keys: string[]): Record<string, string> => {
  const keysValues = keys.reduce<Record<string, string>>((acc, key) => {
    acc[key] = key.toLowerCase();
    return acc;
  }, {});
  return Object.freeze(keysValues);
};

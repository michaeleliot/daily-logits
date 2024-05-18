import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimeDifference(date: Date) {
  // Check if date is a valid Date object
  if (!(date instanceof Date)) {
    throw new Error('Invalid date object provided');
  }

  const now = new Date();
  const millisecondsDiff = now.getTime() - date.getTime();

  // Convert milliseconds to seconds, minutes, hours, etc.
  const seconds = Math.floor(millisecondsDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return an object with the time difference components
  return {
    milliseconds: millisecondsDiff,
    seconds,
    minutes,
    hours,
    days,
  };
}
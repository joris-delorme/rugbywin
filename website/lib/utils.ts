import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function firebaseError (err: Error) {
  if (!err.message) return "Please Try Again"
  if (err.message === "Firebase: Error (auth/wrong-password).") return "Wrong password."
  if (err.message === "Firebase: Error (auth/invalid-email).") return "Please enter a valid email."
  if (err.message === "Firebase: Error (auth/email-already-in-use).") return "Email already in use."
  return err.message
}
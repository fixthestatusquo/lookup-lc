import { createHash } from "crypto";

export const hashEmail = (email: string): Buffer =>
  createHash("md5").update(email.trim().toLowerCase()).digest();

import { createHash } from "crypto";

export const hashEmail = (email: string): string =>
  createHash("md5").update(email.trim().toLowerCase()).digest("hex");

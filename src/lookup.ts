import { captureError } from "./sentry";
import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevoKey = process.env.BREVO_KEY;
if (!brevoKey) {
  throw new Error("BREVO_KEY environment variable is required");
}

const client = new BrevoClient({ apiKey: brevoKey });

export const lookup = async (email: string): Promise<boolean> => {
  try {
    const result = await client.contacts.getContactInfo({ identifier: email });
    return result?.emailBlacklisted === false;
  } catch (err: any) {
    // Brevo returns 404 for contact not found
    if (err.statusCode === 404) return false;
    captureError(err, { email, action: "lookup" });
    throw err;
  }
};

export const formatResult = (found: boolean) => {
  if (found) {
    return {
      customer: { emailStatus: "already_subscribed" },
      action: { customFields: { isSubscribed: true } },
    };
  }
  return {};
};

// lookup("sync+2@proca.app");

export default lookup;

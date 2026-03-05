import { captureError } from "./sentry";
import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const brevoKey = process.env.BREVO_KEY;
if (!brevoKey) throw new Error("BREVO_KEY environment variable is required");

const brevoListId = process.env.BREVO_LIST_ID;
if (!brevoListId)
  throw new Error("BREVO_LIST_ID environment variable is required");

const LIST_ID = parseInt(brevoListId, 10);
if (isNaN(LIST_ID)) throw new Error("BREVO_LIST_ID must be a valid number");

const client = new BrevoClient({ apiKey: brevoKey });

export const lookup = async (email: string): Promise<boolean> => {
  try {
    const result = await client.contacts.getContactInfo({ identifier: email });

    console.log(`Lookup result for ${email}:`, result);
    return (
      result?.emailBlacklisted === false &&
      result?.listIds?.includes(LIST_ID) === true
    );
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

// lookup("brucewayne@example.com");

export default lookup;

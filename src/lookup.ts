import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

// email subscribed to newsletter = 'robin.halfkann@lobbycontrol.de';

const brevoKey = process.env.BREVO_KEY;
if (!brevoKey) {
  throw new Error("BREVO_KEY environment variable is required");
}

const client = new BrevoClient({ apiKey: brevoKey });

export const lookup = async (email: string): Promise<boolean> => {
  try {
    const result = await client.contacts.getContactInfo({ identifier: email });
    console.log("Brevo Lookup Result:", result);
    return result.emailBlacklisted === false;
  } catch (err: any) {
    // Brevo returns 404 for contact not found
    console.log("Brevo Lookup Error:", err?.status, err?.response?.data);
    if (err?.status === 404) return false;
    console.error("Brevo Lookup Error:", err);
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

import { BrevoClient } from "@getbrevo/brevo";
import { captureError } from "../sentry.ts";

let client: BrevoClient | null = null;
let listId: number | null = null;

const getClient = () => {
  if (client) return { client, listId: listId! };

  const key = process.env.BREVO_KEY;
  if (!key) throw new Error("BREVO_KEY environment variable is required");

  const rawListId = process.env.BREVO_LIST_ID;
  if (!rawListId) throw new Error("BREVO_LIST_ID environment variable is required");

  const parsed = parseInt(rawListId, 10);
  if (isNaN(parsed)) throw new Error("BREVO_LIST_ID must be a valid number");

  client = new BrevoClient({ apiKey: key });
  listId = parsed;
  return { client, listId };
};

export const brevoLookup = async (email: string): Promise<boolean> => {
  const { client, listId } = getClient();
  try {
    const result = await client.contacts.getContactInfo({ identifier: email });
    return (
      result?.emailBlacklisted === false &&
      result?.listIds?.includes(listId) === true &&
      (result?.attributes as Record<string, string>)?.["DOUBLE_OPT-IN"] === "1"
    );
  } catch (err) {
    if ((err as Record<string, number | undefined>).statusCode === 404) return false;
    captureError(err, { email, action: "lookup", crm: "brevo" });
    throw err;
  }
};

import { captureError } from "../sentry.ts";

const getConfig = () => {
  const key = process.env.API_KEY;
  if (!key) throw new Error("API_KEY environment variable is required");

  const url = process.env.API_URL;
  if (!url) throw new Error("API_URL environment variable is required");

  const rawListId = process.env.API_LIST_ID;
  let listId: number | null = null;
  if (!rawListId) {
    console.warn("API_LIST_ID not set — will check contact existence only, not list membership");
  } else {
    const parsed = parseInt(rawListId, 10);
    if (isNaN(parsed)) throw new Error("API_LIST_ID must be a valid number");
    listId = parsed;
  }

  return { key, baseUrl: url.replace(/\/$/, ""), listId };
};

export const activeCampaignLookup = async (email: string): Promise<boolean> => {
  const { key, baseUrl, listId } = getConfig();
  const headers = {
    "Api-Token": key,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    const contactRes = await fetch(
      `${baseUrl}/api/3/contacts?email=${encodeURIComponent(email)}`,
      { method: "GET", headers },
    );
    if (contactRes.status === 404) return false;
    const contactData = await contactRes.json();

    const contacts: any[] = contactData.contacts ?? [];
    if (contacts.length === 0) return false;

    if (!listId) return true;

    const contactId = contacts[0].id;

    const listRes = await fetch(
      `${baseUrl}/api/3/contacts/${contactId}/contactLists`,
      { headers },
    );
    if (listRes.status === 404) return false;
    const listData = await listRes.json();

    const memberships: any[] = listData.contactLists ?? [];
    return memberships.some(
      (m) => m.list === String(listId) && m.status === "1",
    );
  } catch (err: any) {
    captureError(err, { email, action: "lookup", crm: "activecampaign" });
    throw err;
  }
};

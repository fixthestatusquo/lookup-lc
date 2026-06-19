import { brevoLookup } from "./brevo";
import { activeCampaignLookup } from "./activecampaign";

const getType = () => {
  const type = process.env.TYPE;
  if (!type) throw new Error("TYPE environment variable is required");
  return type;
};

export const lookup = async (email: string): Promise<boolean> => {
  const type = getType();
  switch (type) {
    case "brevo":
      return brevoLookup(email);
    case "activecampaign":
      return activeCampaignLookup(email);
    default:
      throw new Error(`Unknown TYPE "${type}". Supported: brevo, activecampaign`);
  }
};

export const formatResult = (found: boolean) => {
  if (found) {
    return {
      customer: { emailStatus: "already_subscribed" },
      action: {
        customFields: { isSubscribed: true },
        privacy: { optIn: true },
      },
    };
  }
  return {};
};

export default lookup;

const getType = () => {
  const type = process.env.TYPE;
  if (!type) throw new Error("TYPE environment variable is required");
  return type;
};

export const lookup = async (email: string): Promise<boolean> => {
  const type = getType();
  switch (type) {
    case "brevo": {
      const { brevoLookup } = await import("./brevo");
      return brevoLookup(email);
    }
    case "activecampaign": {
      const { activeCampaignLookup } = await import("./activecampaign");
      return activeCampaignLookup(email);
    }
    case "local": {
      const { localLookup } = await import("./local");
      return localLookup(email);
    }
    default:
      throw new Error(`Unknown TYPE "${type}". Supported: brevo, activecampaign, local`);
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

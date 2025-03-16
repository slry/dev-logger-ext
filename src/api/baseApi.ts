import { getApiInfo } from "../lib/getApiInfo";

export const baseApi = async (...args: Parameters<typeof fetch>) => {
  const { apiToken, apiUrl } = getApiInfo();

  if (!apiToken || !apiUrl) {
    throw new Error("API URL or Token is missing in devLogger configuration.");
  }

  const [url, options] = args;

  return fetch(`${apiUrl}${url}?token=${apiToken}`, options);
};

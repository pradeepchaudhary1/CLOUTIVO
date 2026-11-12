export function cleanProductUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
    // Strip UTM parameters, affiliate IDs, and ref tags
    const paramsToStrip = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref", "aff", "affiliate"];
    paramsToStrip.forEach((param) => url.searchParams.delete(param));
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export function extractHostname(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return rawUrl;
  }
}
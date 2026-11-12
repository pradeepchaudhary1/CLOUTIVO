import { SITE } from "./config";

/**
 * IndexNow tells Bing (and engines that share it) about changed URLs within seconds.
 * Needs INDEXNOW_KEY; the key file is served automatically at /<key>.txt.
 */
export async function pingIndexNow(paths: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || SITE.url.includes("localhost")) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE.url).host,
        key,
        keyLocation: `${SITE.url}/${key}.txt`,
        urlList: paths.map((p) => `${SITE.url}${p}`),
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (e) {
    console.error("[indexnow]", e instanceof Error ? e.message : e);
  }
}

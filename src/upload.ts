import type { JsonValue, UploadFile } from "@tau/plugins";
import { readConfig, objectKey, encodedPath, publicUrl } from "./config";

export const validate = (value: JsonValue) =>
  readConfig(value, ["token", "owner", "repo", "branch"]);

export async function upload(
  fetch: typeof globalThis.fetch,
  file: UploadFile,
  value: JsonValue,
): Promise<string> {
  const config = validate(value);
  const key = objectKey(config.pathPrefix, file.name);
  let binary = "";
  for (let start = 0; start < file.content.length; start += 8192)
    binary += String.fromCharCode(
      ...file.content.subarray(start, start + 8192),
    );
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath(key)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: config.branch,
        message: `upload resource ${file.name} from Tau`,
        content: btoa(binary),
        ...(config.email
          ? { committer: { name: config.owner, email: config.email } }
          : {}),
      }),
    },
  );
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`GitHub 上传失败（HTTP ${response.status}）`);
  }
  const result = (await response.json()) as {
    content?: { download_url?: string };
  };
  const url = config.publicBaseUrl
    ? publicUrl(config.publicBaseUrl, key)
    : result.content?.download_url;
  if (!url)
    throw new Error("GitHub 未返回可用的下载地址，请检查仓库公开访问设置");
  return url;
}

import { expect, it, vi } from "vitest";
import { upload } from "./upload";
const config = {
  token: "test-only",
  owner: "owner",
  repo: "resources",
  branch: "main",
  pathPrefix: "图 片",
};
const file = {
  name: "a b.bin",
  mimeType: "application/octet-stream",
  content: new Uint8Array([0, 255, 128]),
};
it("发送准确字节与编码路径，不修改仓库权限", async () => {
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(
      new Response(
        JSON.stringify({ content: { download_url: "https://raw.test/a" } }),
      ),
    );
  await expect(upload(fetch, file, config)).resolves.toBe("https://raw.test/a");
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toContain("%E5%9B%BE%20%E7%89%87/a%20b.bin");
  const body = JSON.parse(fetch.mock.calls[0][1]!.body as string);
  expect(body).toMatchObject({ branch: "main", content: "AP+A" });
  expect(body).not.toHaveProperty("sha");
});
it("公开域名包含对象路径，失败不返回伪地址", async () => {
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(new Response("{}"));
  await expect(
    upload(fetch, file, { ...config, publicBaseUrl: "https://cdn.test/base/" }),
  ).resolves.toBe("https://cdn.test/base/%E5%9B%BE%20%E7%89%87/a%20b.bin");
  fetch.mockResolvedValue(new Response("", { status: 403 }));
  await expect(upload(fetch, file, config)).rejects.toThrow("403");
});

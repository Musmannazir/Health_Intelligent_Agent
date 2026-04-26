import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";

const port = Number.parseInt(process.env.PORT ?? "8080", 10);
const host = process.env.HOST ?? "0.0.0.0";
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(rootDir, "dist", "client");

const { default: serverEntry } = await import("./dist/server/index.js");

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".css": return "text/css; charset=utf-8";
    case ".js": return "text/javascript; charset=utf-8";
    case ".mjs": return "text/javascript; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".svg": return "image/svg+xml";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    case ".ico": return "image/x-icon";
    case ".map": return "application/json; charset=utf-8";
    default: return "application/octet-stream";
  }
}

async function tryServeStatic(req, res, pathname) {
  if (!pathname.startsWith("/assets/") && pathname !== "/favicon.ico" && pathname !== "/robots.txt") {
    return false;
  }

  const relativePath = pathname === "/favicon.ico" || pathname === "/robots.txt"
    ? pathname.slice(1)
    : pathname.slice(1);
  const filePath = path.join(clientDir, relativePath);

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) return false;

    res.statusCode = 200;
    res.setHeader("content-type", contentType(filePath));
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
    createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const method = req.method ?? "GET";
    const protocol = req.socket.encrypted ? "https" : "http";
    const requestUrl = new URL(req.url ?? "/", `${protocol}://${req.headers.host ?? `localhost:${port}`}`);

    if (method === "GET" || method === "HEAD") {
      const served = await tryServeStatic(req, res, requestUrl.pathname);
      if (served) return;
    }

    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        headers.set(key, value.join(", "));
      }
    }

    const body = method === "GET" || method === "HEAD" ? undefined : Readable.toWeb(req);

    const request = body
      ? new Request(requestUrl, { method, headers, body, duplex: "half" })
      : new Request(requestUrl, { method, headers });

    const response = await serverEntry.fetch(request);

    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    if (response.body) {
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      res.end(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))));
    } else {
      res.end();
    }
  } catch (error) {
    console.error("Server error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});

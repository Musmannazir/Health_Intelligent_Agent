import http from "node:http";
import { Readable } from "node:stream";

const port = Number.parseInt(process.env.PORT ?? "8080", 10);
const host = process.env.HOST ?? "0.0.0.0";

const { default: serverEntry } = await import("./dist/server/index.js");

const server = http.createServer(async (req, res) => {
  try {
    const method = req.method ?? "GET";
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        headers.set(key, value.join(", "));
      }
    }

    const protocol = req.socket.encrypted ? "https" : "http";
    const requestUrl = new URL(req.url ?? "/", `${protocol}://${req.headers.host ?? `localhost:${port}`}`);

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

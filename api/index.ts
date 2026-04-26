import serverEntry from "@tanstack/react-start/server-entry";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  return serverEntry.fetch(request);
}

import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-teal">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold">Signal lost</h2>
        <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          The agent could not resolve this route.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md border border-[var(--color-border-strong)] bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-wider text-teal hover:bg-[oklch(0.79_0.14_188/0.1)]"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AyuGraph — Agentic Reasoning for Equitable Healthcare" },
      { name: "description", content: "AyuGraph is an agentic reasoning layer for equitable healthcare access — discovery, validation, and crisis mapping for India's 10,000-facility health network." },
      { name: "author", content: "AyuGraph" },
      { property: "og:title", content: "AyuGraph — Agentic Reasoning for Equitable Healthcare" },
      { property: "og:description", content: "Agentic intelligence for healthcare facility discovery, trust validation, and crisis mapping." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen text-foreground scanlines">
      <AppSidebar />
      <div className="ml-16 flex min-h-screen flex-col">
        <TopHeader />
        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

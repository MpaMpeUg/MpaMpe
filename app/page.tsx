import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MpaMpe || Reach More || Raise More || Do More",
  description: "MpaMpe Crowdfunding platform",
};

function readStaticHomepage() {
  const htmlPath = path.join(
    process.cwd(),
    "public",
    "legacy-home",
    "index.html",
  );
  const html = readFileSync(htmlPath, "utf8");
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const links = head.match(/<link\b[^>]*>/gi)?.join("\n") ?? "";

  return `${links}\n${body}`;
}

export default function Home() {
  return (
    <div
      className="legacy-home-root"
      dangerouslySetInnerHTML={{ __html: readStaticHomepage() }}
      suppressHydrationWarning
    />
  );
}

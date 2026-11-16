import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("enables the Netlify Next.js runtime for the existing site", () => {
  const config = readFileSync("netlify.toml", "utf8");

  assert.match(config, /\[\[plugins\]\]\s+package\s*=\s*["']@netlify\/plugin-nextjs["']/m);
});

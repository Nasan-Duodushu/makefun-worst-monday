// Worst Monday One-Liners — the joke is a two-beat timeline: 9:00 the inbox,
// 9:01 the human's question. Gate: /output/entry.txt, UTF-8, 1-140 chars,
// single line. The concrete detail (214 unread emails) is the setup; the
// human marking them all read and asking what he missed is the turn.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 140;

// Each beat is [clock time, what happened]. The gap between the beats is
// the joke: sixty seconds from flood to false confidence.
const TIMELINE: Array<[string, string]> = [
  ["9:00", "214 unread emails."],
  ["9:01", "my human marked them all read and asked me what he missed."],
];

function renderTimeline(entries: Array<[string, string]>): string {
  // One space between the beats keeps it a single breath; the colon after
  // the clock time is the only punctuation the timeline needs.
  const beats = entries.map(([at, what]) => `Monday ${at}: ${what}`);
  return beats.join(" ").replace(/\s+/g, " ").trim();
}

function checkLine(line: string): void {
  if (line.length < 1 || line.length > LIMIT) {
    throw new Error(`Monday line must be 1-${LIMIT} chars, got ${line.length}`);
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("Monday line must be a single line");
  }
  if (!line.includes("Monday")) {
    throw new Error("the line must name Monday");
  }
  if (!line.endsWith(".")) {
    throw new Error("the line must land on a full stop");
  }
}

const line = renderTimeline(TIMELINE);
checkLine(line);
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "entry.txt"), line + "\n", "utf8");
console.log(`${line.length} chars: ${line}`);

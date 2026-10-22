/**
 * Audits that every class name referenced in the source is present in the
 * compiled stylesheet. Catches silently-dead styling (a class that Tailwind
 * never generated) which is the most common way a restyle rots.
 *
 * Usage: npm run build && node scripts/audit-classes.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = join(process.cwd(), "src");
const DIST = join(process.cwd(), "dist", "assets");

const walk = (dir, files = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(jsx?|tsx?)$/.test(entry)) files.push(full);
  }
  return files;
};

const cssFile = readdirSync(DIST).find((f) => f.endsWith(".css"));
if (!cssFile) {
  console.error(
    "No compiled CSS found in dist/assets — run `npm run build` first."
  );
  process.exit(1);
}
const css = readFileSync(join(DIST, cssFile), "utf8");

/** Extract the value expression of a `className` / `class` attribute. */
const readClassExpressions = (source) => {
  const expressions = [];
  const attribute = /class(?:Name)?\s*=\s*/g;
  let match;

  while ((match = attribute.exec(source)) !== null) {
    let index = match.index + match[0].length;

    // Skip whitespace
    while (index < source.length && /\s/.test(source[index])) index += 1;

    if (source[index] === '"' || source[index] === "'") {
      const quote = source[index];
      const end = source.indexOf(quote, index + 1);
      expressions.push(source.slice(index + 1, end === -1 ? source.length : end));
      attribute.lastIndex = end === -1 ? source.length : end + 1;
      continue;
    }

    if (source[index] === "{") {
      // Read the balanced expression
      let depth = 0;
      let cursor = index;
      for (; cursor < source.length; cursor += 1) {
        const char = source[cursor];
        if (char === "{") depth += 1;
        else if (char === "}") {
          depth -= 1;
          if (depth === 0) break;
        } else if (char === '"' || char === "'" || char === "`") {
          // Skip over string literals so braces inside them do not count
          const quote = char;
          cursor += 1;
          while (cursor < source.length && source[cursor] !== quote) {
            if (source[cursor] === "\\") cursor += 1;
            cursor += 1;
          }
        }
      }
      expressions.push(source.slice(index + 1, cursor));
      attribute.lastIndex = cursor + 1;
    }
  }

  return expressions;
};

/** Pull every class-like token out of a class expression. */
const tokensFrom = (expression) => {
  const tokens = new Set();
  const add = (raw) => {
    const token = raw.replace(/[`'"]/g, "").trim();
    if (token) tokens.add(token);
  };

  // Template literal holes hold conditional class strings — read them too.
  const stringLiterals = expression.matchAll(/"([^"]*)"|'([^']*)'/g);
  for (const literal of stringLiterals) {
    const value = literal[1] ?? literal[2] ?? "";
    for (const token of value.split(/\s+/)) add(token);
  }

  // Everything outside of quoted strings (plain class attributes / template text)
  const withoutStrings = expression.replace(/"[^"]*"|'[^']*'/g, " ");
  for (const token of withoutStrings.split(/\s+/)) {
    if (!token) continue;
    if (token.includes("${") || token.includes("}")) continue;
    add(token);
  }

  return tokens;
};

/** Bare (non-dashed) utility names that are legitimate classes. */
const BARE_UTILITIES = new Set([
  "block", "inline", "inline-block", "flex", "inline-flex", "grid",
  "inline-grid", "contents", "hidden", "table", "flow-root", "relative",
  "absolute", "fixed", "sticky", "static", "isolate", "truncate", "uppercase",
  "lowercase", "capitalize", "italic", "underline", "overline", "antialiased",
  "tabular-nums", "sr-only", "not-sr-only", "container", "list-none",
  "appearance-none", "resize", "cursor-pointer", "select-none", "italic",
]);

/** Reject tokens that are clearly JavaScript rather than class names. */
const isClassLike = (token) => {
  if (!token) return false;
  if (/^[-+]?\d/.test(token)) return false;
  if (/[(){},?=<>|&;]/.test(token)) return false;
  if (token.includes("=") || token.includes("=>")) return false;
  if (/^\!/.test(token)) return true;
  if (token.includes("-")) return true;
  if (BARE_UTILITIES.has(token)) return true;
  return false;
};

const classTokens = new Map();

for (const file of walk(SRC)) {
  const source = readFileSync(file, "utf8");
  for (const expression of readClassExpressions(source)) {
    for (const token of tokensFrom(expression)) {
      if (!isClassLike(token)) continue;
      if (!classTokens.has(token)) classTokens.set(token, new Set());
      classTokens.get(token).add(relative(process.cwd(), file));
    }
  }
}

/** Escape a class name the way Tailwind escapes it in a CSS selector. */
const cssEscape = (name) =>
  name.replace(/[^a-zA-Z0-9_-]/g, (char) => "\\" + char);

const isGenerated = (name) => {
  const escaped = cssEscape(name);
  const pattern = new RegExp(
    "\\." + escaped.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![a-zA-Z0-9_-])"
  );
  return pattern.test(css);
};

const missing = [...classTokens.entries()]
  .filter(([name]) => !isGenerated(name))
  .map(([name, files]) => ({ name, files: [...files] }))
  .sort((a, b) => a.name.localeCompare(b.name));

const total = classTokens.size;
console.log(`Checked ${total} distinct class names against ${cssFile}`);
console.log(
  `Generated: ${total - missing.length}   Missing: ${missing.length}`
);

if (missing.length) {
  console.log("\nClasses with no generated CSS:");
  for (const { name, files } of missing) {
    console.log(`  ${name}  (${[...new Set(files)].join(", ")})`);
  }
  process.exitCode = 1;
}

import fs from "fs";
import path from "path";

const cwd = process.cwd();

// Par défaut ~80k caractères par fichier texte (souvent “safe” pour coller en chat).
// Tu peux ajuster via: node export_for_ai.mjs --max 120000
const args = process.argv.slice(2);
const maxArgIndex = args.indexOf("--max");
const MAX_CHARS = maxArgIndex !== -1 ? Number(args[maxArgIndex + 1]) : 80000;

const OUT_DIR = path.join(cwd, "_ai_export");

// Dossiers à exclure (lourds / inutiles pour comprendre le code)
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "dist",
  "build",
  "out",
  "coverage",
  ".turbo",
  ".cache",
  ".idea",
  ".vscode",
]);

// Fichiers à exclure (secrets, binaires, locks trop gros)
const EXCLUDE_FILES = new Set([
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.test",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
]);

// Extensions utiles (ajuste si besoin)
const INCLUDE_EXT = new Set([
  ".js", ".jsx", ".ts", ".tsx",
  ".mjs", ".cjs",
  ".json", ".yaml", ".yml",
  ".css", ".scss",
  ".md",
  ".prisma",
  ".sql",
  ".graphql", ".gql",
]);

// On privilégie ces “zones” si elles existent (Next.js / app router / pages router)
const PREFERRED_TOP_DIRS = [
  "app",
  "pages",
  "src",
  "components",
  "lib",
  "server",
  "api",
  "prisma",
];

function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

function isBinaryLike(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  // Garde simple: on ne prend que les extensions whitelists.
  return !INCLUDE_EXT.has(ext);
}

function shouldExclude(relPath) {
  const base = path.basename(relPath);

  if (EXCLUDE_FILES.has(base)) return true;

  const parts = relPath.split(path.sep);
  for (const p of parts) {
    if (EXCLUDE_DIRS.has(p)) return true;
  }

  // Exclure toute variation de .env*
  if (base.startsWith(".env")) return true;

  return false;
}

function listFilesRecursively(startDir) {
  const results = [];
  const stack = [startDir];

  while (stack.length) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const ent of entries) {
      const full = path.join(current, ent.name);
      const rel = path.relative(cwd, full);

      if (shouldExclude(rel)) continue;

      if (ent.isDirectory()) {
        stack.push(full);
      } else if (ent.isFile()) {
        if (isBinaryLike(full)) continue;
        results.push(full);
      }
    }
  }
  return results;
}

function pickRoots() {
  const roots = [];
  for (const d of PREFERRED_TOP_DIRS) {
    const full = path.join(cwd, d);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
      roots.push(full);
    }
  }
  // Si rien trouvé, fallback: tout le projet
  if (!roots.length) roots.push(cwd);
  return roots;
}

function readTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function writeChunk(index, content) {
  const name = `techstratix_export_${String(index).padStart(2, "0")}.txt`;
  const outPath = path.join(OUT_DIR, name);
  fs.writeFileSync(outPath, content, "utf8");
  return name;
}

function main() {
  ensureOutDir();

  const roots = pickRoots();

  // Toujours inclure certains fichiers racine si présents
  const alwaysTry = [
    "package.json",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "tsconfig.json",
    "jsconfig.json",
    "vercel.json",
    "middleware.ts",
    "middleware.js",
    "tailwind.config.js",
    "tailwind.config.ts",
    "postcss.config.js",
    "postcss.config.mjs",
    "eslint.config.js",
    ".eslintrc",
    ".eslintrc.json",
    "README.md",
    "prisma/schema.prisma",
  ];

  const files = new Set();

  for (const f of alwaysTry) {
    const full = path.join(cwd, f);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      const rel = path.relative(cwd, full);
      if (!shouldExclude(rel) && !isBinaryLike(full)) files.add(full);
    }
  }

  for (const r of roots) {
    for (const f of listFilesRecursively(r)) files.add(f);
  }

  const sorted = Array.from(files).sort((a, b) => a.localeCompare(b));

  let chunkIndex = 1;
  let chunk = "";
  const indexLines = [];
  indexLines.push(`MAX_CHARS=${MAX_CHARS}`);
  indexLines.push(`ROOTS=${roots.map(r => path.relative(cwd, r) || ".").join(", ")}`);
  indexLines.push(`TOTAL_FILES=${sorted.length}`);
  indexLines.push("");

  for (const filePath of sorted) {
    const rel = path.relative(cwd, filePath);
    const text = readTextFile(filePath);
    if (text == null) continue;

    // Petit garde-fou: si un seul fichier est énorme, on le tronque (sinon ça explose tout).
    // Tu peux augmenter si besoin.
    const MAX_SINGLE_FILE = 250000;
    const safeText = text.length > MAX_SINGLE_FILE
      ? text.slice(0, MAX_SINGLE_FILE) + `\n\n/* [TRUNCATED: file too large (${text.length} chars)] */\n`
      : text;

    const block =
`\n\n===== FILE: ${rel} =====
${safeText}
`;

    if ((chunk.length + block.length) > MAX_CHARS && chunk.length > 0) {
      const writtenName = writeChunk(chunkIndex, chunk);
      indexLines.push(`${writtenName}  (${chunk.length} chars)`);
      chunkIndex++;
      chunk = "";
    }

    chunk += block;
  }

  if (chunk.length > 0) {
    const writtenName = writeChunk(chunkIndex, chunk);
    indexLines.push(`${writtenName}  (${chunk.length} chars)`);
  }

  fs.writeFileSync(path.join(OUT_DIR, "INDEX.txt"), indexLines.join("\n"), "utf8");

  console.log(`\n✅ Export terminé.`);
  console.log(`📁 Dossier: ${OUT_DIR}`);
  console.log(`🧾 Ouvre _ai_export/INDEX.txt pour voir la liste des fichiers générés.\n`);
  console.log(`⚠️ Vérifie rapidement qu'aucun secret (clé API, token) n'a été exporté avant de me coller le contenu ici.`);
}

main();
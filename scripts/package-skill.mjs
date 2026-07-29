import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { validateSkill } from "./validate-skill.mjs";
import { packageEntries, verifyPackage } from "./verify-package.mjs";
import { createStoreZip } from "./zip-format.mjs";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const packageRoot = "funilix-quiz-skill";
const archiveName = "funilix-quiz.skill";

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

export function packageSkill(rootPath = root) {
  const errors = validateSkill(rootPath, { checkArchive: false });
  if (errors.length) return { errors };
  const packageJson = JSON.parse(readFileSync(resolve(rootPath, "package.json"), "utf8"));
  const sourceEntries = packageEntries.map((entry) => ({
    path: `${packageRoot}/${entry}`,
    data: readFileSync(resolve(rootPath, entry))
  }));
  const archiveData = createStoreZip(sourceEntries);
  const dist = resolve(rootPath, "dist");
  const archive = resolve(dist, archiveName);
  mkdirSync(dist, { recursive: true });
  writeFileSync(archive, archiveData);
  const manifest = {
    skillVersion: packageJson.version,
    contractVersion: packageJson.contractVersion,
    zip: { path: `dist/${archiveName}`, sha256: sha256(archiveData), size: statSync(archive).size },
    entries: sourceEntries.map((entry) => ({ path: entry.path, sha256: sha256(entry.data), size: entry.data.length }))
  };
  writeFileSync(resolve(dist, "funilix-quiz.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return { archive, manifest, errors: verifyPackage(archiveData, manifest) };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const result = packageSkill(root);
  if (result.errors.length) {
    console.error(`Empacotamento falhou: validacao encontrou ${result.errors.length} erro(s).`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Pacote gerado: dist/${archiveName}`);
    console.log(`SHA256: ${result.manifest.zip.sha256}`);
  }
}

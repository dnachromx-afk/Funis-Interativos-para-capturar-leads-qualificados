import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseStoreZip, crc32, zipConstants } from "./zip-format.mjs";

const packageRoot = "funilix-quiz-skill";
export const packageEntries = [
  "CHANGELOG.md",
  "README.md",
  "SKILL.md",
  "references/blueprints.md",
  "references/brief-and-strategy.md",
  "references/component-recipes/diagnosis-and-feedback.md",
  "references/component-recipes/input-and-capture.md",
  "references/component-recipes/media-and-custom-layouts.md",
  "references/component-recipes/proof-and-conversion.md",
  "references/component-selection.md",
  "references/contracts-and-validation.md",
  "references/copy-accessibility-and-ethics.md",
  "references/editing-and-recovery.md",
  "references/gamification.md",
  "references/header-and-step-architecture.md",
  "references/theme-system.md",
  "references/workflow.md"
].sort();

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

export function verifyPackage(archiveData, manifest) {
  const errors = [];
  let entries;
  try {
    entries = parseStoreZip(archiveData);
  } catch (error) {
    return [`ZIP invalido (${error.message}).`];
  }
  const expectedPaths = packageEntries.map((entry) => `${packageRoot}/${entry}`);
  if (JSON.stringify(entries.map((entry) => entry.path)) !== JSON.stringify(expectedPaths)) {
    errors.push("ZIP: entradas fora da lista permitida ou ordem incorreta.");
  }
  for (const entry of entries) {
    if (entry.compression !== zipConstants.STORE || entry.flags !== zipConstants.UTF8_FLAG || entry.dosDate !== zipConstants.DOS_DATE || entry.dosTime !== zipConstants.DOS_TIME || entry.attributes !== zipConstants.FILE_MODE) {
      errors.push(`ZIP: metadados instaveis em ${entry.path}.`);
    }
    if (entry.size !== entry.compressedSize || entry.size !== entry.data.length || entry.checksum !== crc32(entry.data)) {
      errors.push(`ZIP: dados invalidos em ${entry.path}.`);
    }
  }
  if (typeof manifest?.skillVersion !== "string" || !/^\d+\.\d+\.\d+$/u.test(manifest.skillVersion) || manifest.contractVersion !== "2026-07-10") {
    errors.push("manifest: versao da skill ou contrato invalido.");
  }
  if (manifest?.zip?.path !== "dist/funilix-quiz.skill" || manifest.zip.sha256 !== sha256(archiveData) || manifest.zip.size !== archiveData.length) {
    errors.push("manifest: checksum ou tamanho do ZIP divergente.");
  }
  if (!Array.isArray(manifest?.entries) || manifest.entries.length !== entries.length) {
    errors.push("manifest: entries invalidas.");
  } else {
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const manifestEntry = manifest.entries[index];
      if (manifestEntry?.path !== entry.path || manifestEntry?.sha256 !== sha256(entry.data) || manifestEntry?.size !== entry.size) {
        errors.push(`manifest: entrada divergente no indice ${index}.`);
      }
    }
  }
  return errors;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  if (process.argv.length !== 4) {
    console.error("Uso: node scripts/verify-package.mjs <arquivo.skill> <manifest.json>");
    process.exitCode = 2;
  } else {
    try {
      const errors = verifyPackage(readFileSync(process.argv[2]), JSON.parse(readFileSync(process.argv[3], "utf8")));
      if (errors.length) {
        console.error(`Verificacao falhou com ${errors.length} erro(s):`);
        for (const error of errors) console.error(`- ${error}`);
        process.exitCode = 1;
      } else {
        console.log("Verificacao de pacote aprovada.");
      }
    } catch (error) {
      console.error(`Verificacao falhou: ${error.message}`);
      process.exitCode = 2;
    }
  }
}

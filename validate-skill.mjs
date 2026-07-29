import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { verifyPackage } from "./verify-package.mjs";

const defaultRoot = resolve(dirname(new URL(import.meta.url).pathname), "..");
const documentationFiles = ["SKILL.md", "README.md", "CHANGELOG.md"];
const expectedReferences = [
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
];
const canonicalComponents = [
  "text", "button", "image", "video", "form", "layoutContainer", "level", "timer",
  "argument", "progressArgument", "comparison", "carousel", "faq", "pricingCard",
  "cartesianChart", "weightSlider", "heightSlider", "testimonial", "notification",
  "countdown", "audioPlayer", "gamifiedModal", "iphoneToast", "audioCall", "spacer",
  "options", "codeBlock"
];
const legacyBrand = new RegExp(["funnel", "x"].join(""), "iu");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function validateFrontmatter(skill, fail) {
  const match = skill.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return fail("SKILL.md: frontmatter YAML ausente ou invalido.");
  const fields = new Map();
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/);
    if (field) fields.set(field[1], field[2]);
  }
  if (fields.get("name") !== "funilix-quiz") fail("SKILL.md: frontmatter name deve ser funilix-quiz.");
  if (!fields.get("description")?.startsWith("Use when")) {
    fail("SKILL.md: frontmatter description deve iniciar com Use when.");
  }
}

function validateLinks(root, file, content, fail) {
  const pattern = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g;
  for (const match of content.matchAll(pattern)) {
    const target = match[1].replace(/^<|>$/g, "");
    if (/^(?:https?:|mailto:|#)/iu.test(target)) continue;
    const path = target.split("#", 1)[0];
    if (path && !existsSync(resolve(dirname(file), path))) {
      const line = content.slice(0, match.index).split("\n").length;
      fail(`${relative(root, file)}:${line}: link relativo quebrado para ${target}.`);
    }
  }
}

function validateJsonFences(root, file, content, fail) {
  const lines = content.split(/\r?\n/);
  let start = null;
  let json = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (start === null && /^```json\s*$/iu.test(lines[index])) {
      start = index + 1;
      json = [];
    } else if (start !== null && /^```\s*$/.test(lines[index])) {
      try {
        JSON.parse(json.join("\n"));
      } catch (error) {
        fail(`${relative(root, file)}:${start}: JSON fence invalido (${error.message}).`);
      }
      start = null;
    } else if (start !== null) {
      json.push(lines[index]);
    }
  }
  if (start !== null) fail(`${relative(root, file)}:${start}: JSON fence sem fechamento.`);
}

function validatePackage(root, fail) {
  let packageJson;
  try {
    packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
  } catch (error) {
    fail(`package.json: invalido (${error.message}).`);
    return null;
  }
  if (packageJson.name !== "funilix-quiz-skill") fail("package.json: name deve ser funilix-quiz-skill.");
  if (packageJson.private !== true) fail("package.json: private deve ser true.");
  if (typeof packageJson.version !== "string" || !/^\d+\.\d+\.\d+$/u.test(packageJson.version)) fail("package.json: version explicita invalida.");
  if (packageJson.contractVersion !== "2026-07-10") fail("package.json: contractVersion deve ser 2026-07-10.");
  for (const script of ["test", "package", "evaluate:traces", "verify:package"]) {
    if (typeof packageJson.scripts?.[script] !== "string") fail(`package.json: script ausente: ${script}.`);
  }
  return packageJson;
}

function validateArchive(root, packageJson, fail) {
  const archive = resolve(root, "dist/funilix-quiz.skill");
  const manifestPath = resolve(root, "dist/funilix-quiz.manifest.json");
  if (!existsSync(archive) && !existsSync(manifestPath)) return;
  if (!existsSync(archive) || !existsSync(manifestPath)) {
    fail("dist/: ZIP e manifest devem existir juntos.");
    return;
  }
  let manifest;
  let entries;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    entries = verifyPackage(readFileSync(archive), manifest);
  } catch (error) {
    fail(`dist/: pacote ou manifest invalido (${error.message}).`);
    return;
  }
  for (const error of entries) fail(error);
  if (manifest.skillVersion !== packageJson?.version || manifest.contractVersion !== packageJson?.contractVersion) fail("manifest: versoes divergentes.");
}

export function validateSkill(root = defaultRoot, { checkArchive = true } = {}) {
  const errors = [];
  const fail = (message) => errors.push(message);
  const active = [
    ...documentationFiles,
    ...expectedReferences,
    "package.json",
    "scripts/validate-skill.mjs",
    "scripts/package-skill.mjs",
    "scripts/evaluate-agent-traces.mjs",
    "scripts/zip-format.mjs",
    "scripts/verify-package.mjs"
  ].map((path) => resolve(root, path));

  for (const file of active) {
    if (!existsSync(file)) {
      fail(`${relative(root, file)}: arquivo ativo ausente.`);
      continue;
    }
    const content = readFileSync(file, "utf8");
    if (legacyBrand.test(content)) fail(`${relative(root, file)}: marca anterior encontrada em superficie ativa.`);
    if (/references\/(?:components|themes)\.md/iu.test(content)) fail(`${relative(root, file)}: referencia legada encontrada.`);
    if (file.endsWith(".md")) {
      validateLinks(root, file, content, fail);
      validateJsonFences(root, file, content, fail);
    }
  }

  const skill = readFileSync(resolve(root, "SKILL.md"), "utf8");
  validateFrontmatter(skill, fail);
  if (Buffer.byteLength(skill, "utf8") > 8192) fail("SKILL.md: excede o limite de 8192 bytes.");
  const actualReferences = walk(resolve(root, "references")).map((file) => relative(root, file).split(sep).join("/")).sort();
  if (JSON.stringify(actualReferences) !== JSON.stringify(expectedReferences.slice().sort())) fail("references/: arquivos nao correspondem ao contrato exato.");
  const matrix = readFileSync(resolve(root, "references/component-selection.md"), "utf8").split("## Componentes internos", 1)[0];
  const listed = [...matrix.matchAll(/^\|\s*`([^`]+)`\s*\|/gmu)].map((match) => match[1]);
  const actualComponents = new Set(listed);
  if (listed.length !== canonicalComponents.length || actualComponents.size !== canonicalComponents.length || canonicalComponents.some((component) => !actualComponents.has(component)) || [...actualComponents].some((component) => !canonicalComponents.includes(component))) {
    fail("references/component-selection.md: matriz publica deve conter exatamente os 27 componentes canonicos.");
  }
  const packageJson = validatePackage(root, fail);
  if (checkArchive) validateArchive(root, packageJson, fail);
  return errors;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const errors = validateSkill();
  if (errors.length) {
    console.error(`Validacao falhou com ${errors.length} erro(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Validacao da skill aprovada.");
  }
}

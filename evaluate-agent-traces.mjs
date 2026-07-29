import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const scenarioFile = resolve(root, "tests/scenarios/authoring-scenarios.json");
const writeTools = new Set(["append_quiz_steps", "create_blank_funnel", "create_quiz_component", "delete_quiz_component", "delete_quiz_step", "reorder_quiz_components", "reorder_quiz_steps", "replace_quiz_structure", "update_component_settings", "update_funnel_global_presets", "update_funnel_metadata", "update_quiz_step"]);
const independentComponents = new Set(["image", "video", "testimonial", "gamifiedModal", "iphoneToast", "audioCall"]);
const explicitIntentComponents = new Set(["countdown", "gamifiedModal", "iphoneToast", "audioCall"]);
const metadataFields = new Set(["explicitIntentReason", "overrideReason", "externalMediaConfirmed", "gamificationMode", "operationId", "metadata"]);

function walk(value, callback, path = "") {
  if (!value || typeof value !== "object") return;
  callback(value, path);
  if (Array.isArray(value)) value.forEach((item, index) => walk(item, callback, `${path}[${index}]`));
  else for (const [key, child] of Object.entries(value)) walk(child, callback, path ? `${path}.${key}` : key);
}

function matchingValues(value, predicate) {
  const found = [];
  walk(value, (object, path) => {
    if (Array.isArray(object)) return;
    for (const [key, child] of Object.entries(object)) {
      if (predicate(key, child, object, path ? `${path}.${key}` : key)) found.push({ key, value: child, parent: object, path });
    }
  });
  return found;
}

function componentObjects(payload) {
  const components = [];
  walk(payload, (object, path) => {
    if (!Array.isArray(object) && typeof object.type === "string" && object.settings && typeof object.settings === "object") components.push({ component: object, path });
  });
  return components;
}

function operationsFor(scenario) {
  return [
    ...(Array.isArray(scenario.toolCalls) ? scenario.toolCalls : []).map((call, index) => ({ source: "toolCalls", index, operationId: call?.operationId, tool: call?.tool, payload: call?.arguments ?? {} })),
    ...(Array.isArray(scenario.writes) ? scenario.writes : []).map((write, index) => ({ source: "writes", index, operationId: write?.operationId, tool: write?.tool, payload: write?.payload ?? {} }))
  ];
}

function metadataOperation(scenario, operation) {
  if (operation.source !== "writes") return operation;
  const call = (scenario.toolCalls ?? []).find((item) => item?.operationId === operation.operationId && item.tool === operation.tool);
  return { ...operation, metadataPayload: call?.arguments ?? operation.payload };
}

function hasMetadata(operation, component, key) {
  return [operation?.metadataPayload?.[key] ?? operation?.payload?.[key], component?.[key], component?.metadata?.[key]].some((value) => typeof value === "string" && value.trim());
}

function hasBooleanMetadata(operation, component, key) {
  return (operation?.metadataPayload?.[key] ?? operation?.payload?.[key]) === true || component?.[key] === true || component?.metadata?.[key] === true;
}

function enabledFeatures(scenario) {
  const payloads = operationsFor(scenario).map((operation) => operation.payload);
  return {
    gamification: payloads.some((payload) => matchingValues(payload, (key) => key === "gamification").some(({ value }) => value?.enabled === true)),
    score: payloads.some((payload) => matchingValues(payload, (key) => key === "gamification").some(({ value }) => value?.score?.enabled === true))
  };
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function persistedMatches(persisted, called, depth = 0) {
  if (persisted === null || typeof persisted !== "object") return Object.is(persisted, called);
  if (called === null || typeof called !== "object" || Array.isArray(persisted) !== Array.isArray(called)) return false;
  if (Array.isArray(persisted)) return persisted.length === called.length && persisted.every((item, index) => persistedMatches(item, called[index], depth + 1));
  return Object.entries(persisted).every(([key, value]) => {
    if (depth === 0 && metadataFields.has(key)) return true;
    return Object.hasOwn(called, key) && persistedMatches(value, called[key], depth + 1);
  });
}

function snapshotValue(scenario, phase, key, readTool) {
  const phaseEvidence = scenario.evidence?.[phase];
  const snapshots = Array.isArray(phaseEvidence) ? phaseEvidence : Array.isArray(phaseEvidence?.snapshots) ? phaseEvidence.snapshots : [phaseEvidence];
  for (const snapshot of snapshots) {
    if (snapshot?.[key] === undefined || typeof snapshot.operationId !== "string") continue;
    const call = (scenario.toolCalls ?? []).find((item) => item?.operationId === snapshot.operationId && item.tool === readTool);
    if (call && sameJson(call.result?.[key], snapshot[key])) return snapshot[key];
  }
  return undefined;
}

function evidenceUnchanged(scenario, key, readTool = "get_funnel_global_presets") {
  const before = snapshotValue(scenario, "before", key, readTool);
  const after = snapshotValue(scenario, "after", key, readTool);
  return before !== undefined && after !== undefined && sameJson(before, after);
}

function finalStepWritesOnly(scenario) {
  const finalStepId = snapshotValue(scenario, "before", "finalStepId", "get_quiz_blueprint");
  const componentTools = new Set(["create_quiz_component", "delete_quiz_component", "reorder_quiz_components", "update_component_settings"]);
  return typeof finalStepId === "string" && operationsFor(scenario)
    .filter((operation) => writeTools.has(operation.tool))
    .every((operation) => componentTools.has(operation.tool) && operation.payload.stepId === finalStepId);
}

function finalCondition(condition, scenario) {
  const finalState = scenario.finalState ?? {};
  const calls = Array.isArray(scenario.toolCalls) ? scenario.toolCalls : [];
  const writes = Array.isArray(scenario.writes) ? scenario.writes : [];
  const operations = operationsFor(scenario);
  const features = enabledFeatures(scenario);
  if (condition === "themeAppliedBeforeSteps=true") {
    const theme = calls.findIndex((call) => call?.tool === "update_funnel_global_presets");
    const steps = calls.findIndex((call) => call?.tool === "append_quiz_steps");
    return theme >= 0 && steps >= 0 && theme < steps;
  }
  if (condition === "gamificationEnabled=false") return !features.gamification;
  if (condition === "gamificationEnabled=true") return features.gamification;
  if (condition === "scoreEnabled=false") return !features.score;
  if (condition === "scoreEnabled=true") return features.score;
  if (condition === "soundEnabled=false") {
    const sounds = matchingValues(operations.map((operation) => operation.payload), (key) => key === "soundEnabled");
    return sounds.length > 0 && sounds.every(({ value }) => value === false);
  }
  if (condition === "status=awaiting_clarification") {
    const clarification = scenario.evidence?.clarification;
    const missingFields = clarification?.missingFields;
    const text = clarification?.text?.toLocaleLowerCase();
    return writes.length === 0 && Array.isArray(missingFields) && missingFields.length > 0 && /\b(informe|envie|forne[cç]a|indique|compartilhe|qual|quais|preciso)\b/iu.test(text ?? "") && missingFields.every((field) => typeof field === "string" && field.trim() && text?.includes(field.trim().toLocaleLowerCase()));
  }
  const equality = condition.match(/^(questionStepCount|captureStepCount)=(\d+)$/u);
  if (equality) {
    const steps = snapshotValue(scenario, "after", "steps", "get_quiz_blueprint");
    const expected = Number(equality[2]);
    return Array.isArray(steps) && steps.filter((step) => (step.kind ?? step.type ?? step.category) === (equality[1] === "questionStepCount" ? "question" : "capture")).length === expected;
  }
  switch (condition) {
    case "no local overrides without justification":
    case "no unjustified local overrides":
      return !operations.some((operation) => matchingValues(operation.payload, (key) => ["headerOverride", "backgroundOverride", "gamificationOverride"].includes(key)).length > 0);
    case "score deltas are explicit": {
      const deltas = matchingValues(operations.map((operation) => operation.payload), (key, value) => key === "scoreDeltaEnabled" && value === true);
      return deltas.length > 0 && deltas.every(({ parent }) => Number.isFinite(parent.scoreDelta));
    }
    case "componentTypes includes iphoneToast": return operations.some((operation) => componentObjects(operation.payload).some(({ component }) => component.type === "iphoneToast"));
    case "existing presets unchanged": return evidenceUnchanged(scenario, "globalPresets");
    case "one question added": {
      const before = snapshotValue(scenario, "before", "steps", "get_quiz_blueprint");
      const after = snapshotValue(scenario, "after", "steps", "get_quiz_blueprint");
      return Array.isArray(before) && Array.isArray(after) && after.filter((step) => (step.kind ?? step.type ?? step.category) === "question").length === before.filter((step) => (step.kind ?? step.type ?? step.category) === "question").length + 1;
    }
    case "gamification and score unchanged": return evidenceUnchanged(scenario, "gamification") && evidenceUnchanged(scenario, "score");
    case "gamification and score preserved": return evidenceUnchanged(scenario, "gamification") && evidenceUnchanged(scenario, "score");
    case "capture headerOverride.showProgress=false": return operations.some((operation) => operation.tool === "update_quiz_step" && operation.payload.stepId === snapshotValue(scenario, "before", "captureStepId", "get_quiz_blueprint") && operation.payload.headerOverride?.showProgress === false);
    case "no component writes": return !operations.some((operation) => /(?:quiz_component|component_settings|reorder_quiz_components)/u.test(operation.tool));
    case "theme inheritance for standard components": return operations.every((operation) => componentObjects(operation.payload).every(({ component }) => independentComponents.has(component.type) || component.settings.useTheme !== false));
    case "only final-step component writes": return finalStepWritesOnly(scenario);
    case "global theme unchanged": return evidenceUnchanged(scenario, "globalPresets");
    case "step structure unchanged": return evidenceUnchanged(scenario, "steps", "get_quiz_blueprint");
    case "writes.allowed=[]": return writes.length === 0;
    case "no write until missing replacement content is clarified":
    case "no write until funnel, price, and checkout are supplied": return writes.length === 0 && !calls.some((call) => writeTools.has(call.tool));
    default: return false;
  }
}

function sensitiveMatches(declaration, operation) {
  const payload = operation.payload;
  if (declaration === operation.tool) return true;
  if (declaration === "settings.gamification") return matchingValues(payload, (key) => key === "gamification").length > 0;
  if (declaration === "options.items[].scoreDeltaEnabled") return matchingValues(payload, (key, value) => key === "scoreDeltaEnabled" && value === true).length > 0;
  if (["gamificationOverride", "headerOverride", "backgroundColor", "customCSS", "soundUrl"].includes(declaration)) return matchingValues(payload, (key, value) => key === declaration && (declaration === "soundUrl" ? typeof value === "string" && value.trim() : true)).length > 0;
  if (declaration === "useTheme:false") return componentObjects(payload).some(({ component }) => component.settings.useTheme === false);
  if (declaration === "pricingCard") return componentObjects(payload).some(({ component }) => component.type === "pricingCard");
  if (declaration === "button.actionType:url") return componentObjects(payload).some(({ component }) => component.type === "button" && component.settings.actionType === "url");
  if (declaration === "checkout URL") return matchingValues(payload, (key, value) => /(?:checkout|redirect)?url/iu.test(key) && typeof value === "string" && value.trim()).length > 0;
  return false;
}

function sensitiveAllowed(declaration, policy, scenario, operation) {
  const conditions = policy.finalConditions ?? [];
  if (declaration === "settings.gamification" || declaration === "options.items[].scoreDeltaEnabled") return conditions.includes("gamificationEnabled=true") || conditions.includes("scoreEnabled=true");
  if (declaration === "headerOverride") return conditions.includes("capture headerOverride.showProgress=false");
  if (declaration === "useTheme:false") return componentObjects(operation.payload).every(({ component }) => component.settings.useTheme !== false || independentComponents.has(component.type));
  if (["backgroundColor", "customCSS", "gamificationOverride"].includes(declaration)) return !conditions.includes("no local overrides without justification") && !conditions.includes("no unjustified local overrides");
  if (["pricingCard", "button.actionType:url", "checkout URL"].includes(declaration)) return !conditions.includes("status=awaiting_clarification") && (operation.metadataPayload?.checkoutConfirmed ?? operation.payload.checkoutConfirmed) === true;
  if (writeTools.has(declaration)) return policy.toolOrdering.includes(declaration) || conditions.includes("only final-step component writes");
  return declaration === "soundUrl" && operation.payload.externalMediaConfirmed === true;
}

function evaluateSensitiveWrites(policy, scenario, errors) {
  const operations = operationsFor(scenario);
  const featuresOff = policy.finalConditions.includes("gamificationEnabled=false") || policy.finalConditions.includes("scoreEnabled=false");
  const sensitive = new Set(policy.sensitiveWrites ?? []);
  for (const rawOperation of operations) {
    const operation = metadataOperation(scenario, rawOperation);
    if (!writeTools.has(operation.tool)) continue;
    const payload = operation.payload;
    const metadataPayload = operation.metadataPayload ?? payload;
    const scoreDeltas = matchingValues(payload, (key, value) => key === "scoreDeltaEnabled" && value === true);
    const gamification = matchingValues(payload, (key) => key === "gamification").some(({ value }) => value?.enabled === true || value?.score?.enabled === true);
    if ((gamification || scoreDeltas.length > 0) && (!hasMetadata(operation, null, "explicitIntentReason") || metadataPayload.gamificationMode !== "explicit")) errors.push(`${operation.source}[${operation.index}]: gamificacao ou score exige explicitIntentReason e gamificationMode=explicit.`);
    if (featuresOff && gamification && sensitive.has("settings.gamification")) errors.push(`${operation.source}[${operation.index}]: escrita sensivel settings.gamification indevida.`);
    if (featuresOff && scoreDeltas.length > 0 && sensitive.has("options.items[].scoreDeltaEnabled")) errors.push(`${operation.source}[${operation.index}]: escrita sensivel scoreDelta indevida.`);
    for (const declaration of sensitive) {
      if (sensitiveMatches(declaration, operation) && !sensitiveAllowed(declaration, policy, scenario, operation)) errors.push(`${operation.source}[${operation.index}]: escrita sensivel sem permissao: ${declaration}.`);
    }
    for (const { component } of componentObjects(payload)) {
      if (explicitIntentComponents.has(component.type) && !hasMetadata(operation, component, "explicitIntentReason")) errors.push(`${operation.source}[${operation.index}]: ${component.type} exige metadata explicitIntentReason.`);
      if (component.type === "notification" && ["socialProof", "urgency"].includes(component.settings.componentIntent) && !hasMetadata(operation, component, "explicitIntentReason")) errors.push(`${operation.source}[${operation.index}]: notification ${component.settings.componentIntent} exige metadata explicitIntentReason.`);
      if (component.settings.useTheme === false && !independentComponents.has(component.type)) errors.push(`${operation.source}[${operation.index}]: ${component.type} nao pode usar useTheme:false.`);
    }
    if (matchingValues(payload, (key, value) => (key === "audioUrl" || key === "soundUrl") && typeof value === "string" && value.trim()).length > 0 && (!hasBooleanMetadata(operation, null, "externalMediaConfirmed") || !hasMetadata(operation, null, "explicitIntentReason"))) errors.push(`${operation.source}[${operation.index}]: audio URL exige externalMediaConfirmed e explicitIntentReason.`);
    for (const key of ["headerOverride", "backgroundOverride", "gamificationOverride"]) {
      if (matchingValues(payload, (candidate) => candidate === key).length > 0 && !hasMetadata(operation, null, "overrideReason")) errors.push(`${operation.source}[${operation.index}]: ${key} exige metadata overrideReason.`);
    }
    for (const delta of scoreDeltas) if (!Number.isFinite(delta.parent.scoreDelta)) errors.push(`${operation.source}[${operation.index}]: scoreDeltaEnabled exige scoreDelta numerico explicito.`);
  }
}

function validateVersions(scenario, errors) {
  const calls = Array.isArray(scenario.toolCalls) ? scenario.toolCalls : [];
  const writes = Array.isArray(scenario.writes) ? scenario.writes : [];
  let observedVersion = null;
  const callsById = new Map();
  for (const call of calls) {
    if (writeTools.has(call?.tool) && (typeof call.operationId !== "string" || !call.operationId)) errors.push(`${call.tool}: operationId obrigatorio ausente.`);
    if (typeof call?.operationId === "string" && call.operationId) {
      if (callsById.has(call.operationId)) errors.push(`toolCalls: operationId duplicado: ${call.operationId}.`);
      callsById.set(call.operationId, call);
    }
    if (["get_quiz_blueprint", "get_funnel_global_presets"].includes(call?.tool) && Number.isInteger(call.result?.version) && call.result.version > 0) observedVersion = call.result.version;
    if (!writeTools.has(call?.tool)) continue;
    if (call.tool === "create_blank_funnel") {
      if (!Number.isInteger(call.result?.version) || call.result.version <= 0) errors.push("create_blank_funnel: result.version inteiro positivo ausente.");
      else observedVersion = call.result.version;
      continue;
    }
    const version = call.arguments?.version;
    if (!Number.isInteger(version) || version <= 0) errors.push(`${call.tool}: escrita sem versionamento inteiro positivo.`);
    else if (observedVersion === null) errors.push(`${call.tool}: nenhuma versao observada antes da escrita.`);
    else if (version !== observedVersion) errors.push(`${call.tool}: versao stale; esperada ${observedVersion}, recebida ${version}.`);
    if (Number.isInteger(call.result?.version) && call.result.version > 0) observedVersion = call.result.version;
    else observedVersion = null;
  }
  for (const write of writes) {
    if (!write || !writeTools.has(write.tool)) continue;
    const version = write.payload?.version;
    if (write.tool !== "create_blank_funnel" && (!Number.isInteger(version) || version <= 0)) {
      errors.push(`writes: ${write.tool} sem versionamento inteiro positivo.`);
      continue;
    }
    if (typeof write.operationId !== "string" || !write.operationId) {
      errors.push(`writes: ${write.tool} sem operationId.`);
      continue;
    }
    const call = callsById.get(write.operationId);
    if (!call) errors.push(`writes: ${write.tool} orfao: operationId ${write.operationId}.`);
    else if (call.tool !== write.tool) errors.push(`writes: ${write.tool} nao corresponde inequivocamente a ${write.operationId}.`);
    else {
      if (write.tool !== "create_blank_funnel" && version !== call.arguments?.version) errors.push(`writes: ${write.tool} usa versao stale; esperada ${call.arguments?.version}, recebida ${version}.`);
      if (!persistedMatches(write.payload ?? {}, call.arguments ?? {})) errors.push(`writes: ${write.tool} possui payload persistido divergente de ${write.operationId}.`);
    }
  }
}

export function evaluateScenario(policyScenario, traceScenario) {
  const errors = [];
  if (!traceScenario || typeof traceScenario !== "object") return ["trace do cenario ausente ou invalido."];
  const calls = Array.isArray(traceScenario.toolCalls) ? traceScenario.toolCalls : null;
  const writes = Array.isArray(traceScenario.writes) ? traceScenario.writes : null;
  if (!calls) errors.push("toolCalls deve ser um array.");
  if (!writes) errors.push("writes deve ser um array.");
  if (!traceScenario.finalState || typeof traceScenario.finalState !== "object") errors.push("finalState ausente.");
  if (!calls || !writes) return errors;
  let previous = -1;
  for (const required of policyScenario.expectedPolicy.toolOrdering) {
    const index = calls.findIndex((call, callIndex) => callIndex > previous && call?.tool === required);
    if (index === -1) errors.push(`tool obrigatoria ausente ou fora de ordem: ${required}.`);
    else previous = index;
  }
  for (const forbidden of policyScenario.expectedPolicy.forbiddenTools) {
    if (operationsFor(traceScenario).some((operation) => operation.tool === forbidden)) errors.push(`tool proibida usada: ${forbidden}.`);
  }
  for (const condition of policyScenario.expectedPolicy.finalConditions) if (!finalCondition(condition, traceScenario)) errors.push(`condicao final nao atendida: ${condition}.`);
  validateVersions(traceScenario, errors);
  evaluateSensitiveWrites(policyScenario.expectedPolicy, traceScenario, errors);
  return errors;
}

export function validateTraceMetadata(contract, trace) {
  const errors = [];
  const execution = contract.execution ?? {};
  const expectedGlobal = { contractVersion: contract.contractVersion, evaluationDate: contract.evaluationDate, executionMode: execution.mode, model: execution.model, provider: execution.provider, seed: execution.seed };
  for (const [key, expected] of Object.entries(expectedGlobal)) if (!Object.is(trace?.[key], expected)) errors.push(`metadata global divergente: ${key}.`);
  for (const scenario of Array.isArray(trace?.scenarios) ? trace.scenarios : []) {
    for (const [key, expected] of Object.entries({ executionMode: execution.mode, model: execution.model, provider: execution.provider, seed: execution.seed })) {
      if (!Object.is(scenario?.[key], expected)) errors.push(`cenario ${scenario?.scenarioId}: metadata divergente: ${key}.`);
    }
  }
  return errors;
}

function validateAttempts(trace, ids, active) {
  const errors = [];
  if (!trace.attemptsByScenario || !Array.isArray(trace.discardedAttempts)) return ["attemptsByScenario ou discardedAttempts invalido."];
  for (const id of ids) {
    const attempt = trace.attemptsByScenario[String(id)];
    if (!Number.isInteger(attempt) || attempt < 1 || active.get(id)?.attempt !== attempt) errors.push(`cenario ${id}: attemptsByScenario divergente.`);
    for (let number = 1; number < attempt; number += 1) if (!trace.discardedAttempts.some((item) => item?.scenarioId === id && item.attempt === number && item.reason?.trim())) errors.push(`cenario ${id}: rerun ${number} nao foi preservado.`);
  }
  return errors;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  if (process.argv.length !== 3) {
    console.error("Uso: node scripts/evaluate-agent-traces.mjs <arquivo-de-traces.json>");
    process.exitCode = 2;
  } else {
  try {
    const contract = JSON.parse(readFileSync(scenarioFile, "utf8"));
    const trace = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
    const ids = contract.scenarios.map((scenario) => scenario.id);
    const active = new Map((Array.isArray(trace.scenarios) ? trace.scenarios : []).filter((scenario) => Number.isInteger(scenario?.scenarioId)).map((scenario) => [scenario.scenarioId, scenario]));
    const globalErrors = validateTraceMetadata(contract, trace);
    if (active.size !== ids.length || ids.some((id) => !active.has(id)) || [...active.keys()].some((id) => !ids.includes(id))) globalErrors.push("sao exigidos exatamente os 10 scenarioIds canonicos.");
    for (const scenario of contract.scenarios) {
      const errors = evaluateScenario(scenario, active.get(scenario.id));
      if (errors.length) {
        console.error(`Cenario ${scenario.id}: FALHOU`);
        for (const error of errors) console.error(`- ${error}`);
      } else console.log(`Cenario ${scenario.id}: OK`);
      globalErrors.push(...errors);
    }
    globalErrors.push(...validateAttempts(trace, ids, active));
    if (globalErrors.length) {
      console.error(`Avaliacao falhou com ${globalErrors.length} erro(s).`);
      process.exitCode = 1;
    } else console.log("Avaliacao de traces aprovada.");
  } catch (error) {
    console.error(`Avaliacao falhou: ${error.message}`);
    process.exitCode = 2;
  }
  }
}

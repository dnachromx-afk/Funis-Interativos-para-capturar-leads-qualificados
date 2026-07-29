import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { evaluateScenario, validateTraceMetadata } from "../scripts/evaluate-agent-traces.mjs";
import { packageSkill } from "../scripts/package-skill.mjs";
import { verifyPackage } from "../scripts/verify-package.mjs";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const policy = {
  expectedPolicy: {
    toolOrdering: ["create_blank_funnel", "update_funnel_global_presets", "append_quiz_steps"],
    forbiddenTools: [],
    sensitiveWrites: ["settings.gamification", "options.items[].scoreDeltaEnabled"],
    finalConditions: ["themeAppliedBeforeSteps=true", "gamificationEnabled=false", "scoreEnabled=false"]
  }
};
const base = {
  toolCalls: [
    { operationId: "create", tool: "create_blank_funnel", arguments: {}, result: { version: 1 } },
    { operationId: "presets", tool: "update_funnel_global_presets", arguments: { version: 1 }, result: { version: 2 } },
    { operationId: "steps", tool: "append_quiz_steps", arguments: { version: 2 }, result: { version: 3 } }
  ],
  writes: [],
  finalState: { themeAppliedBeforeSteps: true, gamificationEnabled: false, scoreEnabled: false }
};

const autoAsserted = structuredClone(base);
autoAsserted.writes.push({ operationId: "presets", tool: "update_funnel_global_presets", payload: { version: 1, settings: { gamification: { enabled: true, score: { enabled: true } } } } });
const autoAssertedErrors = evaluateScenario(policy, autoAsserted);
assert(autoAssertedErrors.some((error) => error.includes("writes[0]")), "writes[].payload deve receber a mesma validacao sensivel");
assert(autoAssertedErrors.some((error) => error.includes("condicao final nao atendida: gamificationEnabled=false")), "finalState autoafirmado nao pode ocultar gamificacao");

const stale = structuredClone(base);
stale.toolCalls[2].arguments.version = 1;
const staleErrors = evaluateScenario(policy, stale);
assert(staleErrors.some((error) => error.includes("versao stale")), "versao anterior deve falhar");

const staleWrite = structuredClone(base);
staleWrite.writes.push({ operationId: "steps", tool: "append_quiz_steps", payload: { version: 1 } });
const staleWriteErrors = evaluateScenario(policy, staleWrite);
assert(staleWriteErrors.some((error) => error.includes("writes: append_quiz_steps usa versao stale")), "writes[].payload com versao anterior deve falhar");

const noWritesFlag = structuredClone(base);
noWritesFlag.finalState = { status: "awaiting_clarification" };
const clarificationPolicy = { expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: ["writes.allowed=[]"] } };
assert.deepEqual(evaluateScenario(clarificationPolicy, noWritesFlag), [], "writes.allowed=[] deve depender somente de writes");

const assertedFinalOnly = structuredClone(base);
assertedFinalOnly.finalState = { onlyFinalStepComponentWrites: true, globalThemeUnchanged: true, stepStructureUnchanged: true };
const finalOnlyPolicy = { expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: ["only final-step component writes", "global theme unchanged", "step structure unchanged"] } };
const assertedFinalOnlyErrors = evaluateScenario(finalOnlyPolicy, assertedFinalOnly);
assert(assertedFinalOnlyErrors.length === 3, "flags autoafirmadas sem evidence devem falhar");

const compoundFive = {
  toolCalls: [
    { operationId: "blueprint-before", tool: "get_quiz_blueprint", arguments: {}, result: { version: 1, steps: [{ kind: "question" }] } },
    { operationId: "presets-before", tool: "get_funnel_global_presets", arguments: {}, result: { version: 1, gamification: { enabled: false }, score: { enabled: false } } },
    { operationId: "append", tool: "append_quiz_steps", arguments: { version: 1 }, result: { version: 2 } },
    { operationId: "move", tool: "update_quiz_step", arguments: { version: 2 }, result: { version: 3 } },
    { operationId: "blueprint-after", tool: "get_quiz_blueprint", arguments: {}, result: { version: 3, steps: [{ kind: "question" }, { kind: "question" }] } },
    { operationId: "presets-after", tool: "get_funnel_global_presets", arguments: {}, result: { version: 3, gamification: { enabled: false }, score: { enabled: false } } }
  ],
  writes: [],
  finalState: {},
  evidence: {
    before: [{ operationId: "blueprint-before", steps: [{ kind: "question" }] }, { operationId: "presets-before", gamification: { enabled: false }, score: { enabled: false } }],
    after: [{ operationId: "blueprint-after", steps: [{ kind: "question" }, { kind: "question" }] }, { operationId: "presets-after", gamification: { enabled: false }, score: { enabled: false } }]
  }
};
const compoundFivePolicy = { expectedPolicy: { toolOrdering: ["get_quiz_blueprint", "append_quiz_steps", "update_quiz_step"], forbiddenTools: [], sensitiveWrites: ["append_quiz_steps", "update_quiz_step"], finalConditions: ["one question added", "gamification and score unchanged"] } };
assert.deepEqual(evaluateScenario(compoundFivePolicy, compoundFive), [], "evidence composta deve provar blueprint e presets no cenario 5");

const compoundTen = {
  toolCalls: [
    { operationId: "blueprint-before", tool: "get_quiz_blueprint", arguments: {}, result: { version: 1, finalStepId: "final", steps: [{ id: "start", kind: "question" }, { id: "final", kind: "result" }] } },
    { operationId: "presets-before", tool: "get_funnel_global_presets", arguments: {}, result: { version: 1, globalPresets: { theme: "stable" }, gamification: { enabled: false }, score: { enabled: false } } },
    { operationId: "patch-final", tool: "update_component_settings", arguments: { version: 1, stepId: "final" }, result: { version: 2 } },
    { operationId: "blueprint-after", tool: "get_quiz_blueprint", arguments: {}, result: { version: 2, finalStepId: "final", steps: [{ id: "start", kind: "question" }, { id: "final", kind: "result" }] } },
    { operationId: "presets-after", tool: "get_funnel_global_presets", arguments: {}, result: { version: 2, globalPresets: { theme: "stable" }, gamification: { enabled: false }, score: { enabled: false } } }
  ],
  writes: [],
  finalState: {},
  evidence: {
    before: [{ operationId: "blueprint-before", finalStepId: "final", steps: [{ id: "start", kind: "question" }, { id: "final", kind: "result" }] }, { operationId: "presets-before", globalPresets: { theme: "stable" }, gamification: { enabled: false }, score: { enabled: false } }],
    after: [{ operationId: "blueprint-after", steps: [{ id: "start", kind: "question" }, { id: "final", kind: "result" }] }, { operationId: "presets-after", globalPresets: { theme: "stable" }, gamification: { enabled: false }, score: { enabled: false } }]
  }
};
const compoundTenPolicy = { expectedPolicy: { toolOrdering: ["get_quiz_blueprint", "get_funnel_global_presets", "update_component_settings"], forbiddenTools: [], sensitiveWrites: ["update_component_settings"], finalConditions: ["only final-step component writes", "global theme unchanged", "step structure unchanged", "gamification and score preserved"] } };
assert.deepEqual(evaluateScenario(compoundTenPolicy, compoundTen), [], "evidence composta deve provar escopo final, estrutura e presets no cenario 10");

const forgedCounts = structuredClone(base);
forgedCounts.toolCalls.push({ operationId: "blueprint-after", tool: "get_quiz_blueprint", arguments: {}, result: { steps: [{ kind: "question" }, { kind: "question" }, { kind: "question" }, { kind: "question" }, { kind: "capture" }] } });
forgedCounts.evidence = { after: [{ operationId: "blueprint-after", steps: [{ kind: "question" }, { kind: "question" }, { kind: "question" }, { kind: "question" }, { kind: "capture" }] }] };
forgedCounts.finalState = { questionStepCount: 5, captureStepCount: 1 };
assert(evaluateScenario({ expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: ["questionStepCount=5", "captureStepCount=1"] } }, forgedCounts).some((error) => error.includes("questionStepCount=5")), "contagem deve vir do blueprint, nao de finalState");

const clarification = structuredClone(base);
clarification.finalState = {};
clarification.evidence = { clarification: { missingFields: ["pergunta", "opcoes"], text: "Informe a pergunta e as opcoes desejadas." } };
assert.deepEqual(evaluateScenario({ expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: ["status=awaiting_clarification", "writes.allowed=[]"] } }, clarification), [], "clarification objetiva sem writes deve ser aceita");
clarification.evidence.clarification = { missingFields: ["preco"], text: "Forneça o preco para continuar." };
assert.deepEqual(evaluateScenario({ expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: ["status=awaiting_clarification"] } }, clarification), [], "clarification deve aceitar verbo acentuado");
clarification.evidence.clarification = { missingFields: ["pergunta"], text: "A pergunta esta ausente." };
assert(evaluateScenario({ expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: ["status=awaiting_clarification"] } }, clarification).length > 0, "clarification sem solicitacao acionavel deve falhar");
delete clarification.evidence.clarification;
assert(evaluateScenario({ expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: ["status=awaiting_clarification"] } }, clarification).length > 0, "status sem clarification objetiva deve falhar");

const metadataToast = {
  toolCalls: [
    { operationId: "blueprint", tool: "get_quiz_blueprint", arguments: {}, result: { version: 1 } },
    { operationId: "toast", tool: "create_quiz_component", arguments: { version: 1, explicitIntentReason: "toast solicitado", component: { type: "iphoneToast", settings: { soundEnabled: false, useTheme: false } } }, result: { version: 2 } }
  ],
  writes: [{ operationId: "toast", tool: "create_quiz_component", payload: { version: 1, component: { type: "iphoneToast", settings: { soundEnabled: false, useTheme: false } } } }],
  finalState: {}
};
const toastPolicy = { expectedPolicy: { toolOrdering: ["get_quiz_blueprint", "create_quiz_component"], forbiddenTools: [], sensitiveWrites: ["create_quiz_component", "useTheme:false"], finalConditions: ["componentTypes includes iphoneToast"] } };
assert.deepEqual(evaluateScenario(toastPolicy, metadataToast), [], "iphoneToast deve aceitar metadata somente na toolCall");

const metadataGamification = {
  toolCalls: [
    { operationId: "create", tool: "create_blank_funnel", arguments: {}, result: { version: 1 } },
    { operationId: "presets", tool: "update_funnel_global_presets", arguments: { version: 1, gamificationMode: "explicit", explicitIntentReason: "pontos solicitados", settings: { gamification: { enabled: true, score: { enabled: true } } } }, result: { version: 2 } }
  ],
  writes: [{ operationId: "presets", tool: "update_funnel_global_presets", payload: { version: 1, settings: { gamification: { enabled: true, score: { enabled: true } } } } }],
  finalState: {}
};
const gamificationPolicy = { expectedPolicy: { toolOrdering: ["create_blank_funnel", "update_funnel_global_presets"], forbiddenTools: [], sensitiveWrites: ["settings.gamification"], finalConditions: ["gamificationEnabled=true", "scoreEnabled=true"] } };
assert.deepEqual(evaluateScenario(gamificationPolicy, metadataGamification), [], "gamificacao deve aceitar metadata somente na toolCall");

const metadataOverride = {
  toolCalls: [
    { operationId: "blueprint", tool: "get_quiz_blueprint", arguments: {}, result: { version: 1, captureStepId: "capture" } },
    { operationId: "header", tool: "update_quiz_step", arguments: { version: 1, stepId: "capture", overrideReason: "captura sem progresso", headerOverride: { showProgress: false } }, result: { version: 2 } }
  ],
  writes: [{ operationId: "header", tool: "update_quiz_step", payload: { version: 1, stepId: "capture", headerOverride: { showProgress: false } } }],
  finalState: {},
  evidence: { before: [{ operationId: "blueprint", captureStepId: "capture" }] }
};
const overridePolicy = { expectedPolicy: { toolOrdering: ["get_quiz_blueprint", "update_quiz_step"], forbiddenTools: [], sensitiveWrites: ["headerOverride"], finalConditions: ["capture headerOverride.showProgress=false"] } };
assert.deepEqual(evaluateScenario(overridePolicy, metadataOverride), [], "override deve aceitar overrideReason somente na toolCall");

const persistedMismatch = structuredClone(metadataToast);
persistedMismatch.writes[0].payload.component.settings.soundEnabled = true;
assert(evaluateScenario(toastPolicy, persistedMismatch).some((error) => error.includes("payload persistido divergente")), "valor persistido alterado deve ser rejeitado");

const missingMutationId = structuredClone(base);
delete missingMutationId.toolCalls[2].operationId;
assert(evaluateScenario(policy, missingMutationId).some((error) => error.includes("operationId obrigatorio ausente")), "toolCall mutante sem operationId deve falhar");

const forgedSnapshots = structuredClone(base);
forgedSnapshots.evidence = { before: { operationId: "create", globalPresets: { theme: "a" } }, after: { operationId: "create", globalPresets: { theme: "a" } } };
assert(evaluateScenario({ expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: ["global theme unchanged"] } }, forgedSnapshots).length > 0, "snapshot sem resultado de leitura correspondente deve falhar");

const premiumPolicy = { expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: ["backgroundColor", "customCSS"], finalConditions: ["no local overrides without justification"] } };
const premiumTrace = structuredClone(base);
premiumTrace.toolCalls[2] = { operationId: "steps", tool: "append_quiz_steps", arguments: { version: 2, steps: [{ components: [{ type: "text", settings: { backgroundColor: "#000", customCSS: ".x{}" } }] }] }, result: { version: 3 } };
const premiumErrors = evaluateScenario(premiumPolicy, premiumTrace);
assert(premiumErrors.some((error) => error.includes("backgroundColor")) && premiumErrors.some((error) => error.includes("customCSS")), "backgroundColor e customCSS sensiveis devem falhar");

const checkoutPolicy = { expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: ["checkout URL", "pricingCard", "button.actionType:url"], finalConditions: ["status=awaiting_clarification"] } };
const checkoutTrace = structuredClone(base);
checkoutTrace.finalState = { status: "awaiting_clarification" };
checkoutTrace.toolCalls[2] = { operationId: "steps", tool: "append_quiz_steps", arguments: { version: 2, steps: [{ components: [{ type: "pricingCard", settings: { checkoutUrl: "https://checkout.example" } }, { type: "button", settings: { actionType: "url", url: "https://checkout.example" } }] }] }, result: { version: 3 } };
const checkoutErrors = evaluateScenario(checkoutPolicy, checkoutTrace);
assert(checkoutErrors.some((error) => error.includes("checkout URL")) && checkoutErrors.some((error) => error.includes("pricingCard")), "checkout e pricing sensiveis devem falhar sem dados confirmados");

const explicitGamification = structuredClone(base);
explicitGamification.toolCalls[1] = { operationId: "presets", tool: "update_funnel_global_presets", arguments: { version: 1, gamificationMode: "explicit", explicitIntentReason: "pontos solicitados", settings: { gamification: { enabled: true, score: { enabled: true } } } }, result: { version: 2 } };
explicitGamification.toolCalls[2] = { operationId: "steps", tool: "append_quiz_steps", arguments: { version: 2, gamificationMode: "explicit", explicitIntentReason: "pontos solicitados", steps: [{ components: [{ type: "options", settings: { items: [{ scoreDeltaEnabled: true, scoreDelta: 10 }] } }] }] }, result: { version: 3 } };
explicitGamification.finalState = {};
const explicitPolicy = { expectedPolicy: { toolOrdering: ["create_blank_funnel", "update_funnel_global_presets", "append_quiz_steps"], forbiddenTools: [], sensitiveWrites: ["settings.gamification", "options.items[].scoreDeltaEnabled"], finalConditions: ["themeAppliedBeforeSteps=true", "gamificationEnabled=true", "scoreEnabled=true", "score deltas are explicit"] } };
assert.deepEqual(evaluateScenario(explicitPolicy, explicitGamification), [], "gamificacao explicitamente solicitada deve permanecer permitida");

const orphanWrite = structuredClone(base);
orphanWrite.writes.push({ operationId: "missing", tool: "append_quiz_steps", payload: { version: 2 } });
assert(evaluateScenario(policy, orphanWrite).some((error) => error.includes("orfao")), "write sem tool call correspondente deve falhar");

const existingWithoutRead = { toolCalls: [{ operationId: "write", tool: "update_component_settings", arguments: { version: 1 }, result: { version: 2 } }], writes: [], finalState: {} };
assert(evaluateScenario({ expectedPolicy: { toolOrdering: [], forbiddenTools: [], sensitiveWrites: [], finalConditions: [] } }, existingWithoutRead).some((error) => error.includes("nenhuma versao observada")), "primeira escrita existente exige versao observada");

const ambiguousWrite = structuredClone(base);
ambiguousWrite.toolCalls[1].operationId = "duplicate";
ambiguousWrite.toolCalls[2].operationId = "duplicate";
ambiguousWrite.writes.push({ operationId: "duplicate", tool: "append_quiz_steps", payload: { version: 2 } });
assert(evaluateScenario(policy, ambiguousWrite).some((error) => error.includes("operationId duplicado")), "pareamento ambiguo deve falhar");

const metadataErrors = validateTraceMetadata(
  { contractVersion: "1.0.0", evaluationDate: "2026-07-10", execution: { mode: "dry-run", model: "model", provider: "provider", seed: null } },
  { contractVersion: "0.0.0", evaluationDate: "2026-07-10", executionMode: "dry-run", model: "model", provider: "provider", seed: null, scenarios: [] }
);
assert(metadataErrors.some((error) => error.includes("contractVersion")), "metadata global divergente deve falhar");

const temporaryRoot = mkdtempSync(resolve(tmpdir(), "funilix-quiz-task18-"));
try {
  cpSync(root, temporaryRoot, { recursive: true });
  writeFileSync(resolve(temporaryRoot, "dist/funilix-quiz.skill"), "stale");
  writeFileSync(resolve(temporaryRoot, "dist/funilix-quiz.manifest.json"), "{}");
  const packaged = packageSkill(temporaryRoot);
  assert.deepEqual(packaged.errors, [], "reempacotamento deve ignorar dist stale e gerar novo pacote");

  const archive = readFileSync(packaged.archive);
  const manifest = JSON.parse(readFileSync(resolve(temporaryRoot, "dist/funilix-quiz.manifest.json"), "utf8"));
  const ciOnly = resolve(temporaryRoot, "ci-only");
  mkdirSync(ciOnly);
  writeFileSync(resolve(ciOnly, "funilix-quiz.skill"), archive);
  writeFileSync(resolve(ciOnly, "funilix-quiz.manifest.json"), JSON.stringify(manifest));
  assert.deepEqual(
    verifyPackage(readFileSync(resolve(ciOnly, "funilix-quiz.skill")), JSON.parse(readFileSync(resolve(ciOnly, "funilix-quiz.manifest.json"), "utf8"))),
    [],
    "verificador standalone deve validar ZIP e manifest sem fontes irmas"
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log("Testes adversariais da Tarefa 18 aprovados.");

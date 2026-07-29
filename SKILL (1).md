---
name: funilix-quiz
description: Use when creating, editing, auditing, or optimizing quizzes and conversion funnels in Funilix through the platform MCP, including themes, steps, components, offers, navigation, and optional gamification.
---

# Funilix Quiz: Workflow Operacional

Opere o funil pela MCP com somente as chamadas necessárias, preserve o que funciona e carregue
referências sob demanda.

## 1. Classifique o pedido

- **Criar:** não existe funil-alvo; defina um novo funil a partir do brief.
- **Editar:** existe um funil e uma alteração específica, como copy, etapa, componente ou tema.
- **Auditar:** inspecione e recomende sem mutar até receber autorização para aplicar mudanças.
- **Corrigir:** há falha, warning ou comportamento indesejado conhecido; isole e altere somente o alvo afetado.
- Se a intenção ou o funil-alvo estiver ambíguo, esclareça antes de criar, editar ou corrigir.

## 2. Resolva o brief mínimo e a gamificação

Confirme objetivo, público, promessa/oferta, CTA, dados de captura, tom, restrições de
marca, duração desejada e hipótese de conversão. Quando faltar informação não crítica,
declare a suposição antes de executar. Leia [brief-and-strategy](references/brief-and-strategy.md)
para criação, reposicionamento ou brief incompleto.

Decida explicitamente se a gamificação foi solicitada e qual comportamento ela deve ter.
Ela é opcional e não deve ser inferida de uma variável numérica, de um nicho ou de uma
preferência visual.

- Sem pedido explícito de gamificação, mantenha gamification, score, música e interaction effects desligados.
- Não crie score deltas, placar, gamifiedModal, iphoneToast ou audioCall por iniciativa própria.
- Lógica de variável numérica não implica placar visual.

Leia [gamification](references/gamification.md) somente quando ela for solicitada. Para
copy, acessibilidade, consentimento e alegações, consulte
[copy-accessibility-and-ethics](references/copy-accessibility-and-ethics.md) quando o
conteúdo exigir essa decisão.

## 3. Chame o contexto correto

- Em **criar**, chame `get_quiz_authoring_context` primeiro; só então crie o funil.
- Em **editar**, **auditar** ou **corrigir** com alvo conhecido, chame
  `get_quiz_blueprint({ detail: "summary" })` primeiro.
- Com alvo ambíguo, chame `list_funnels` e depois o blueprint summary do funil escolhido.
- Consulte `get_funnel_global_presets` antes de modificar tema, header, formulário,
  navegação ou settings existentes.
- Use `list_supported_step_kinds` e `list_supported_component_types` com `detail: "summary"`
  apenas para orientar uma decisão ainda aberta.

## 4. Configure ou preserve o tema global

Em criação, estabeleça o tema, header, layout, formulário e comportamento de navegação
antes das etapas. Em edição, preserve os presets efetivos e faça patch apenas do que foi
solicitado. Leia [theme-system](references/theme-system.md) para tokens e contrato de tema
e [header-and-step-architecture](references/header-and-step-architecture.md) para header,
background e exceções por etapa.

- Em criação nova, configure o tema global antes da primeira etapa.
- Use `useTheme: true` em componentes compatíveis.
- Não aplique cores, fontes, bordas ou backgrounds locais apenas para “variar” etapas.
- Omita overrides de step; use-os somente quando o usuário pedir uma exceção visual específica.

Registre o motivo de cada override explícito. Não recrie header, progresso ou navegação
global dentro de componentes de etapa.

## 5. Crie a espinha dorsal em blocos

Em criação, use `create_blank_funnel`, aplique os presets globais e acrescente etapas em
blocos pequenos com `append_quiz_steps`. Modele apenas a progressão necessária ao brief:
entrada, descoberta, valor, captura quando justificada, resultado e conversão quando
existirem. Não imponha quantidade fixa de etapas, sequência fixa ou composição fixa de oferta.

Use placeholders mínimos somente se o contrato da etapa exigir componentes. Após cada
bloco estrutural, obtenha `get_quiz_blueprint({ detail: "summary" })`, confirme IDs, ordem,
kind e warnings antes do próximo bloco. Leia [workflow](references/workflow.md) para a ordem
de autoria e [blueprints](references/blueprints.md) para arquiteturas adequadas ao objetivo.

## 6. Consulte schemas sob demanda

Escolha o componente pela intenção e compatibilidade da etapa, não por um catálogo decorativo.
Leia [component-selection](references/component-selection.md) para a escolha. Quando houver
uma decisão concreta, carregue apenas a receita pertinente em
[diagnosis-and-feedback](references/component-recipes/diagnosis-and-feedback.md),
[input-and-capture](references/component-recipes/input-and-capture.md),
[media-and-custom-layouts](references/component-recipes/media-and-custom-layouts.md) ou
[proof-and-conversion](references/component-recipes/proof-and-conversion.md). Chame
`get_component_schema` somente para o tipo que será criado ou alterado. Não solicite schemas
de todos os componentes.

## 7. Enriqueça uma etapa por vez

Crie, atualize e reordene componentes somente na etapa atual. Valide conteúdo, CTA,
acessibilidade, herança do tema e intenção única antes de passar à próxima. Em troca de tipo,
crie o novo componente, posicione-o e só depois remova o antigo; não deixe uma etapa sem o
mínimo exigido pelo contrato.

Para edição ou recuperação, leia [editing-and-recovery](references/editing-and-recovery.md).
Não regenere a estrutura inteira para resolver um componente, warning ou override localizado.
Se houver áudio explicitamente solicitado, consulte os assets disponíveis antes de usar uma URL.

## 8. Valide checkpoints e o estado final

Nos checkpoints durante a montagem, use `get_quiz_blueprint({ detail: "summary" })` para
confirmar IDs e estrutura. Use `detail: "validation"` para validar fluxo, captura, conversão,
tema, gamificação e warnings com resposta compacta; combine com `stepId` para isolar uma etapa.
Solicite `detail: "full"` somente antes de alterar settings, diagnosticar warning ou quando a
projeção compacta não mostrar o trecho necessário. Resolva erros no menor escopo. Consulte
[contracts-and-validation](references/contracts-and-validation.md) para contratos e critérios.

Na validação final, use obrigatoriamente `get_quiz_blueprint({ detail: "validation" })`. Recorra
ao `full` apenas para investigar uma falha concreta.

## 9. Relate a entrega

Informe concisamente o que foi criado, editado, auditado ou corrigido e quais suposições foram
usadas. Relate o tema global, a etapa e os campos de captura, a etapa/CTA de conversão, o estado
da gamificação e todos os overrides locais com seus motivos. Em auditoria, separe achados,
riscos e ações recomendadas das mudanças efetivamente aplicadas.

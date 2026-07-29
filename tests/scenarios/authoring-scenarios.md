# Authoring Scenarios

Contract version: 1.0.0
Evaluation date: 2026-07-10
Execution: dry-run, one attempt per scenario, model `gpt-5.6-sol`, provider `openai`, seed `null`.

## Cenário 1

- Prompt: Crie um quiz para captar leads de consultoria nutricional.
- Critérios: criar quiz de captura; aplicar tema antes das etapas; nao habilitar gamificacao, score ou efeitos sem pedido; evitar descoberta excessiva.
- Politica: `create_blank_funnel` -> `update_funnel_global_presets` -> `append_quiz_steps`; `list_audio_assets` proibida; escritas sensiveis incluem gamificacao, score, overrides e `useTheme:false`.
- Condição final: tema antes das etapas, gamificacao e score desabilitados, sem override local injustificado.

## Cenário 2

- Prompt: Crie um desafio gamificado de sete dias com pontos por resposta.
- Critérios: criar desafio de sete dias; habilitar gamificacao e score solicitados; registrar pontos por resposta; aplicar tema antes das etapas.
- Politica: `create_blank_funnel` -> `update_funnel_global_presets` -> `append_quiz_steps`; escritas sensiveis incluem gamificacao e score por opcao.
- Condição final: tema antes das etapas, gamificacao e score habilitados, deltas explicitos.

## Cenário 3

- Prompt: Monte um quiz simples para uma imobiliária, com cinco perguntas e captura.
- Critérios: cinco perguntas e uma captura; tema antes das etapas; sem gamificacao, score ou efeitos nao pedidos; sem expandir para funil de oferta.
- Politica: `create_blank_funnel` -> `update_funnel_global_presets` -> `append_quiz_steps`; `list_audio_assets` proibida; gamificacao, score e `useTheme:false` sao sensiveis.
- Condição final: tema antes das etapas, gamificacao e score desabilitados, cinco `question` e uma `capture`.

## Cenário 4

- Prompt: No funil `diagnostico-capilar`, troque a pergunta de objetivo.
- Critérios: inspecionar antes de escrever; pedir nova pergunta e opcoes ausentes; preservar estrutura e identidade.
- Politica atual: somente `get_quiz_blueprint`; criacao, append, preset global e `update_component_settings` sao proibidos enquanto faltar a nova pergunta ou as opcoes. Depois da clarificacao, `update_component_settings` pode ser usado para a substituicao solicitada.
- Condição final: `awaiting_clarification`, com nenhuma escrita permitida ate esclarecer o novo conteudo.

## Cenário 5

- Prompt: Ache meu funil de emagrecimento e adicione uma pergunta de rotina.
- Critérios: localizar e desambiguar funil; inspecionar antes de inserir; adicionar uma pergunta nativa; preservar presets.
- Politica: `list_funnels` -> `get_quiz_blueprint` -> `append_quiz_steps` -> `update_quiz_step`; proibidos criacao, preset global e audio.
- Condição final: uma pergunta adicionada, gamificacao e score inalterados, sem override local injustificado.

## Cenário 6

- Prompt: Use `iphoneToast` na etapa de oferta.
- Critérios: identificar funil e oferta; consultar schema; adicionar somente o componente; nao inventar audio.
- Politica: `list_funnels` -> `get_quiz_blueprint` -> `get_component_schema` -> `create_quiz_component`; proibidos criacao, preset global e audio.
- Condição final: `iphoneToast` criado, som desligado e presets preservados.

## Cenário 7

- Prompt: Deixe o header da captura sem barra de progresso.
- Critérios: identificar captura; usar override local justificado; nao alterar componentes nem header global.
- Politica: `list_funnels` -> `get_quiz_blueprint` -> `update_quiz_step`; proibidos criacao, append e preset global.
- Condição final: `headerOverride.showProgress=false` somente na captura, sem escrita de componente.

## Cenário 8

- Prompt: Crie um quiz visualmente consistente para uma marca premium.
- Critérios: tema antes das etapas; heranca consistente do tema; sem gamificacao, score, efeitos ou estilos locais nao pedidos; descoberta proporcional.
- Politica: `create_blank_funnel` -> `update_funnel_global_presets` -> `append_quiz_steps`; `list_audio_assets` proibida; gamificacao, score, `useTheme:false`, cores locais e `customCSS` sao sensiveis.
- Condição final: tema antes das etapas, gamificacao e score desabilitados, sem override ou estilo local injustificado.

## Cenário 9

- Prompt: Adicione uma oferta com preço e CTA para o checkout informado.
- Critérios: identificar alvo; exigir preco e checkout reais se ausentes; usar `pricingCard` e CTA URL somente apos dados; nao inventar checkout.
- Politica atual: somente `list_funnels`; `get_quiz_blueprint` e `get_component_schema` podem ser usados depois de resolver ou esclarecer o alvo, mas nao sao obrigatorios agora. `create_quiz_component` e proibido enquanto faltarem funil, preco ou checkout; depois da clarificacao, pode criar apenas a oferta solicitada.
- Condição final: `awaiting_clarification`, com nenhuma escrita permitida sem funil, preco e checkout.

## Cenário 10

- Prompt: Melhore apenas a etapa final sem mudar estrutura nem identidade visual.
- Critérios: identificar alvo e etapa final; preservar tema e estrutura; limitar escritas aos componentes finais; nao inventar dados.
- Politica: `list_funnels` -> `get_quiz_blueprint` -> `get_funnel_global_presets` -> `update_component_settings`; proibidos criacao, append, replace, presets, etapa e metadata.
- Condição final: apenas componentes finais mudam, tema e etapas inalterados, gamificacao e score preservados.

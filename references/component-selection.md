# Seleção de Componentes

Este catálogo cobre exatamente os 27 componentes públicos do manifesto de autoria `2026-07-10`. Antes de criar ou alterar qualquer componente, consulte `get_component_schema` para o tipo escolhido. A ferramenta é a fonte operacional para settings aceitos no momento da escrita; esta referência não reproduz schemas completos.

`themeBehavior` descreve o comportamento visual em runtime: `inherits` herda o tema, `partial` herda parte dele e pode combinar estilos locais, e `independent` possui apresentação própria. Quando suportado pelo schema, `inherits` e `partial` usam `useTheme: true` por padrão; `independent` usa `useTheme: false` por padrão. Só altere esse default com solicitação explícita e justificada.

| Tipo | Objetivo | Use quando | Evite quando | themeBehavior | Intenção explícita | Confirmação |
|---|---|---|---|---|---|---|
| `text` | Headings e copy explicativa. | Há título, instrução ou contexto textual. | É necessário coletar uma resposta estruturada. | `inherits` | Não. | `get_component_schema("text")` |
| `button` | CTA e navegação. | Há uma ação primária para continuar, ir a uma etapa ou abrir um destino informado. | A pessoa deve selecionar uma opção de resposta. | `inherits` | Não. | `get_component_schema("button")` |
| `image` | Mídia ilustrativa. | Uma imagem fornecida reforça a mensagem. | O texto é essencial e não tem alternativa textual. | `independent` | Não. | `get_component_schema("image")` |
| `video` | Explicação em vídeo. | O material fornecido precisa de demonstração ou explicação longa. | Texto curto resolve a necessidade. | `independent` | Não. | `get_component_schema("video")` |
| `form` | Captura de lead. | Há dados mínimos a coletar em uma etapa `capture`. | Uma única escolha é suficiente. | `inherits` | Não. | `get_component_schema("form")` |
| `layoutContainer` | Agrupamento estrutural. | Módulos relacionados precisam de grid ou flex. | A etapa linear já é suficiente. | `inherits` | Não. | `get_component_schema("layoutContainer")` |
| `level` | Nível diagnóstico. | É preciso apresentar um nível calculado ou percebido. | O resultado exige um gráfico preciso. | `inherits` | Não. | `get_component_schema("level")` |
| `timer` | Estado curto de processamento. | Há uma transição real, como análise de respostas. | O objetivo é criar urgência artificial. | `inherits` | Não. | `get_component_schema("timer")` |
| `argument` | Explicação de benefícios. | Há razões, benefícios ou objeções para organizar. | É necessário receber respostas do visitante. | `partial` | Não. | `get_component_schema("argument")` |
| `progressArgument` | Evidência visual de apoio. | Indicadores comparáveis podem ser apresentados por progresso. | A medição precisa ser precisa. | `partial` | Não. | `get_component_schema("progressArgument")` |
| `comparison` | Comparação visual antes/depois. | Há duas imagens reais com contraste relevante. | Não existe contraste visual significativo. | `inherits` | Não. | `get_component_schema("comparison")` |
| `carousel` | Sequência curta de conteúdo visual. | Alguns slides ajudam a explicar uma prova ou conceito. | O primeiro item já contém toda a informação necessária. | `inherits` | Não. | `get_component_schema("carousel")` |
| `faq` | Resposta a objeções. | Há dúvidas recorrentes que podem ser respondidas no fluxo. | A resposta precisa levar a uma ação imediata. | `partial` | Não. | `get_component_schema("faq")` |
| `pricingCard` | Comparação de oferta ou plano. | Há preço concreto e próximo passo definido. | Não há preço ou ação concreta. | `partial` | Não. | `get_component_schema("pricingCard")` |
| `cartesianChart` | Distribuição diagnóstica. | Pontos numéricos ajudam a explicar o diagnóstico. | Um resultado verbal simples é mais claro. | `inherits` | Não. | `get_component_schema("cartesianChart")` |
| `weightSlider` | Captura de faixa de peso. | Peso aproximado é um dado de entrada apropriado. | É exigido um campo numérico exato. | `inherits` | Não. | `get_component_schema("weightSlider")` |
| `heightSlider` | Captura de faixa de altura. | Altura aproximada é um dado de entrada apropriado. | É exigido um campo numérico exato. | `inherits` | Não. | `get_component_schema("heightSlider")` |
| `testimonial` | Prova social verificável. | Existem depoimentos substanciados do cliente. | Os depoimentos não podem ser comprovados. | `independent` | Não. | `get_component_schema("testimonial")` |
| `notification` | Aviso informativo, prova social ou urgência. | Uma mensagem breve deve entrar na fila da etapa. | Prova social ou urgência não tem evidência. | `inherits` | `componentIntent` é obrigatório em `settings`; `socialProof` e `urgency` também exigem `explicitIntentReason` no MCP. | `get_component_schema("notification")` |
| `countdown` | Prazo regressivo. | Há uma data-limite genuína. | O prazo é artificial. | `partial` | Sim, via metadado MCP fora de `settings`. | `get_component_schema("countdown")` |
| `audioPlayer` | Conteúdo de áudio opcional. | O usuário forneceu um áudio que complementa a etapa. | Ouvir o áudio é requisito para avançar. | `inherits` | Não. | `get_component_schema("audioPlayer")` |
| `gamifiedModal` | Momento de recompensa solicitado. | A pessoa pediu explicitamente conquista ou desbloqueio. | O fluxo normal do quiz resolve a interação. | `independent` | Sim, via metadado MCP fora de `settings`. | `get_component_schema("gamifiedModal")` |
| `iphoneToast` | Simulação de notificação solicitada. | Foi solicitada explicitamente uma notificação contextual. | É um fluxo normal ou a alegação não é comprovada. | `independent` | Sim, via metadado MCP fora de `settings`. | `get_component_schema("iphoneToast")` |
| `audioCall` | Experiência de chamada de áudio solicitada. | Foi solicitada explicitamente uma chamada e o áudio está disponível, se usado. | É um fluxo normal ou não há áudio disponível. | `independent` | Sim, via metadado MCP fora de `settings`. | `get_component_schema("audioCall")` |
| `spacer` | Separação vertical pequena. | Um respiro intencional entre módulos basta. | O problema requer agrupamento estrutural. | `inherits` | Não. | `get_component_schema("spacer")` |
| `options` | Perguntas e ramificações. | A etapa `question` precisa de escolhas. | A resposta deve ser livre. | `partial` | Não. | `get_component_schema("options")` |
| `codeBlock` | Layout customizado aprovado. | Os módulos padrão não atendem ao layout necessário. | Um componente padrão atende ao requisito. | `inherits` | Não. | `get_component_schema("codeBlock")` |

## Componentes internos

`scoreCounter` e `backgroundMusic` são internos e não fazem parte dos 27 tipos públicos. Não os crie como componentes e não consulte seus schemas para autoria de etapa. Ambos pertencem a presets globais de gamificação: placar em `settings.gamification.score` e música em `settings.gamification.backgroundMusic`.

Score, deltas de score, música de fundo, vibração e sons também são recursos sensíveis. Só os habilite quando forem solicitados de forma explícita e registre a justificativa no metadado MCP `explicitIntentReason`, fora de `settings` do componente.

## Intenção e mídia

Para `countdown`, `gamifiedModal`, `iphoneToast` e `audioCall`, o backend exige `explicitIntentReason` no payload MCP da operação, nunca dentro de `component.settings`. `notification` sempre recebe `componentIntent` dentro de `settings`; quando o valor for `socialProof` ou `urgency`, inclua também `explicitIntentReason` no payload MCP.

Não invente URLs de imagem, vídeo, áudio, checkout ou destino externo. Se a receita exigir uma URL, obtenha o valor literal do usuário ou o ativo permitido pela biblioteca antes de chamar MCP. Para áudio externo, confirme também a mídia externa conforme o schema da operação.

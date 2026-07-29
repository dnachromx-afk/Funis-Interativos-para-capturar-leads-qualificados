# Gamificação por Intenção

Gamificação é opt-in. Escolha o gate antes de montar qualquer payload e mantenha uma mecânica principal para cada objetivo da etapa. Feedback deve reforçar uma ação já compreensível, nunca ser a única forma de informar resultado, erro, avanço ou ação necessária.

## Gates

| Gate | Quando usar | Permitido | Não permitido |
|---|---|---|---|
| `off` | Padrão, quando não há pedido de gamificação ou feedback | Fluxo, tema e conteúdo normais | Score, deltas, efeitos, música, vibração, som, modais de conquista, toasts de feedback e override de gamificação |
| `light` | O usuário pediu feedback discreto e pontual | Uma confirmação visual sutil ou vibração solicitada, sem pontuação nem progressão competitiva | Score, barra de placar, deltas, música, som e conjunto de mecânicas |
| `explicit` | O usuário pediu pontos, score, desafio, recompensa, progresso gamificado ou mecânicas completas | Score, deltas, barra de score, conquistas, regras de interação, áudio e overrides justificados | Mecânicas sem objetivo declarado, mídia sem origem confirmada ou múltiplas mecânicas principais para o mesmo objetivo |

Defina `gamificationMode` como `off`, `light` ou `explicit` nos metadados da chamada MCP. Ele não é persistido no funil. Para `explicit`, registre também `explicitIntentReason` com a intenção expressa pelo usuário antes de gravar recursos gamificados. Pelo contrato backend, `gamifiedModal`, `iphoneToast`, `audioCall` e `countdown` sempre exigem `explicitIntentReason` no metadado da operação.

## Escolha da Mecânica

Use uma mecânica principal por objetivo:

| Objetivo | Mecânica principal | Gate mínimo |
|---|---|---|
| Confirmar uma escolha sem alterar o fluxo | Feedback visual sutil ou vibração solicitada | `light` |
| Mostrar um diagnóstico ou progresso de conteúdo | Barra semântica, `level` ou `progressArgument` | `off` |
| Acumular pontos ou desbloquear recompensa | Score e deltas explícitos | `explicit` |
| Marcar uma conquista com copy e CTA | `gamifiedModal` | `explicit` |
| Mostrar uma notificação contextual curta solicitada | `iphoneToast` sem som | `explicit` |
| Reproduzir mensagem ou chamada de áudio | `audioCall` | `explicit` |
| Tocar trilha, som de interação ou toast sonoro | Música ou som | `explicit` |

Não trate valores numéricos de diagnóstico, formulário, gráfico, régua ou barra como placar. Eles só viram score quando a solicitação pede pontos ou acúmulo e o payload habilita explicitamente essa mecânica.

## Recursos Separados

### Score

Score representa pontos acumulados, não uma medida numérica comum. Habilite `score`, `scoreDeltaEnabled`, `scoreDelta` ou valores equivalentes somente no gate `explicit`, com `explicitIntentReason`. Declare a regra de ganho de cada resposta ou ação; não infira pontos a partir de valores numéricos existentes.

### Barra

Uma barra de diagnóstico, progresso de leitura ou resultado pode ser usada no gate `off` quando comunica conteúdo sem pontos, ranking, recompensa ou evolução competitiva. Uma barra que exibe score ou progresso de recompensa exige `explicit`.

### `gamifiedModal`

`gamifiedModal` é uma conquista ou desbloqueio com copy editável. Use apenas em `explicit`, com saída clara por botão, fechar ou backdrop. Não use modal como único aviso de resultado nem como bloqueio sem alternativa acessível.

### `iphoneToast`

`iphoneToast` serve para feedback contextual curto somente no gate `explicit`, com `explicitIntentReason`. Mantenha som desligado por padrão, permita dispensar e repita a informação importante em texto persistente na etapa. Não o sugira no gate `light`; para feedback discreto solicitado, prefira um efeito visual sutil ou vibração solicitada.

### `audioCall`

`audioCall` é conteúdo de áudio, não feedback decorativo. Exige `explicit`, `explicitIntentReason`, transcrição ou resumo textual equivalente e controles de reprodução. Não habilite autoplay como única forma de entregar informação necessária.

### Música

Música de fundo exige `explicit`, motivo registrado e controle visível para pausar ou silenciar. Comece desabilitada quando não houver pedido inequívoco e não use música como confirmação de avanço.

### Vibração

Vibração exige pedido de feedback discreto ou intenção explícita. No gate `light`, limite-a a uma confirmação pontual. Ela deve ser opcional e nunca comunicar algo que também não esteja disponível visualmente e em texto.

### Som

Som de interação ou de toast exige `explicit`, origem de áudio válida e controle de som. Não use som no gate `light` apenas para tornar o feedback mais chamativo.

### Efeitos Visuais

Efeitos visuais podem atender a um pedido de feedback discreto no gate `light`; use um único efeito curto e não bloqueante. Sequências, celebrações, flashes repetidos ou efeitos combinados exigem `explicit` e uma razão ligada ao objetivo do fluxo.

### Override por Etapa

`gamificationOverride` é exceção local, não padrão de composição. Use apenas quando a etapa tiver objetivo diferente do preset global, preserve o restante do funil e registre `overrideReason` nos metadados MCP. O override segue o gate do recurso que altera: por exemplo, um efeito discreto solicitado pode ser `light`; score, som ou recompensa exigem `explicit`.

## Áudio e Mídia Externa

Antes de habilitar qualquer áudio em `audioCall`, música, som de interação, toast ou outro componente, chame `list_audio_assets` e use somente um asset retornado. Uma URL fornecida diretamente pelo usuário é a única alternativa e exige, nos metadados MCP, `externalMediaConfirmed: true` e `explicitIntentReason` preenchido.

Nunca invente, deduza, complete ou use URL de exemplo em `audioUrl` ou `soundUrl`. Sem asset listado ou URL confirmada pelo usuário, mantenha o recurso desabilitado e os campos de URL vazios.

## Payload de Efeitos de Interação

Envie `interactionEffects` somente quando o usuário solicitou efeitos e o gate for compatível. Cada regra deve declarar `enabled`, `trigger`, `vibration`, `sound` e `visual`, inclusive com subobjetos explicitamente desabilitados quando não usados.

```json
{
  "interactionEffects": {
    "enabled": true,
    "rules": [
      {
        "enabled": true,
        "trigger": "optionSelect",
        "vibration": {
          "enabled": false,
          "preset": "light"
        },
        "sound": {
          "enabled": false,
          "audioUrl": "",
          "volume": 0.45
        },
        "visual": {
          "enabled": true,
          "effect": "successPulse",
          "color": "#2563eb"
        }
      }
    ]
  }
}
```

Não envie regras parciais, nem um objeto de efeitos habilitado com regras implícitas. Quando efeitos não foram solicitados, não envie `interactionEffects`.

## Acessibilidade e Controles

- Mantenha o resultado e a próxima ação em texto visível; vibração, som, toast, modal e animação são complementares.
- Respeite `prefers-reduced-motion`: reduza ou desative animações, flash, shake e celebrações; não dependa de movimento para comunicar estado.
- Ofereça controles visíveis para pausar música, silenciar sons e dispensar modais ou toasts quando esses recursos estiverem habilitados.
- Não bloqueie avanço, captura ou conclusão até que o usuário perceba um feedback sensorial.
- Preserve foco, forneça rótulos acessíveis e evite autoplay para conteúdo essencial.

## Metadados MCP Não Persistidos

Os campos abaixo orientam a decisão da chamada MCP e não pertencem ao payload persistido do funil ou da etapa:

| Campo | Uso |
|---|---|
| `gamificationMode` | Registra o gate escolhido: `off`, `light` ou `explicit`. |
| `explicitIntentReason` | Registra o pedido explícito que autoriza score, áudio, recompensa ou mecânicas completas; é obrigatório para `gamifiedModal`, `iphoneToast`, `audioCall` e `countdown`. |
| `overrideReason` | Justifica por que uma etapa precisa divergir da configuração global. |
| `externalMediaConfirmed` | Confirma que uma URL de mídia veio diretamente do usuário. |

Esses metadados devem ser verificados antes da escrita e omitidos de `settings.gamification`, `gamificationOverride` e configurações de componentes persistidas.

# Receitas: Diagnóstico e Feedback

Consulte `get_component_schema` antes de cada escrita. Use diagnóstico para explicar respostas já obtidas, sem apresentar dados como fatos quando não forem sustentados.

## Nível de diagnóstico

```json
{
  "type": "level",
  "settings": {
    "title": "Seu nível atual",
    "percentage": 60,
    "indicatorText": "Resultado do questionário",
    "labels": "Inicial,Intermediário,Avançado",
    "stylePreset": "default",
    "useTheme": true
  }
}
```

## Argumento com progresso

```json
{
  "type": "progressArgument",
  "settings": {
    "items": [
      {
        "content": "<p>Próximo passo recomendado</p>",
        "percentage": 60
      }
    ],
    "useTheme": true
  }
}
```

## Gráfico cartesiano

Use pontos numéricos que possam ser explicados. Um gráfico não substitui uma avaliação profissional.

```json
{
  "type": "cartesianChart",
  "settings": {
    "title": "Distribuição das respostas",
    "points": [
      {
        "label": "Seu resultado",
        "value": 60
      }
    ],
    "stylePreset": "theme",
    "showArea": true,
    "showGrid": true,
    "useTheme": true
  }
}
```

## Processamento curto

Use `timer` para uma transição real de processamento. Não o use para urgência artificial; para uma data-limite genuína, use `countdown` com intenção explícita.

```json
{
  "type": "timer",
  "settings": {
    "duration": 5,
    "title": "Organizando suas respostas",
    "stylePreset": "default",
    "actionType": "nextStep",
    "useTheme": true
  }
}
```

## Notificação informativa

`componentIntent` pertence obrigatoriamente a `settings`. Para `socialProof` ou `urgency`, envie ainda `explicitIntentReason` como metadado MCP no nível da operação, fora de `settings`; use esses valores somente quando a alegação for comprovada.

```json
{
  "type": "notification",
  "settings": {
    "content": "<p>Suas respostas foram registradas.</p>",
    "componentIntent": "informational",
    "useTheme": true
  }
}
```

## Recompensa gamificada

`gamifiedModal` é intrusivo. Crie-o somente por solicitação explícita e inclua `explicitIntentReason` no metadado MCP da operação, nunca em `settings`. Mantenha uma saída clara.

```json
{
  "type": "gamifiedModal",
  "settings": {
    "content": "<p>Você concluiu esta etapa.</p>",
    "showButton": true,
    "useTheme": false
  }
}
```

## Toast contextual

`iphoneToast` é intrusivo. Só o use no gate `explicit`, por solicitação explícita e com `explicitIntentReason` no metadado MCP fora de `settings`. Não use para simular prova social sem evidência.

```json
{
  "type": "iphoneToast",
  "settings": {
    "items": [
      {
        "trigger": "stepEnter",
        "title": "Etapa concluída",
        "description": "Você pode continuar quando quiser."
      }
    ],
    "useTheme": false
  }
}
```

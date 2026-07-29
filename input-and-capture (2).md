# Receitas: Entrada e Captura

Consulte `get_component_schema` imediatamente antes de escrever. Os objetos abaixo são exemplos mínimos e parseáveis; acrescente somente campos exigidos pelo schema consultado ou pela necessidade real da etapa. Todos preservam o tema quando o componente aceita `useTheme`.

## Pergunta de escolha

Use `options` em etapa `question`. Para múltipla seleção, desative `autoAdvance` e ofereça um `button` na mesma etapa.

```json
{
  "type": "options",
  "settings": {
    "items": [
      {
        "label": "Quero entender meu resultado",
        "value": "resultado"
      }
    ],
    "autoAdvance": true,
    "multiSelect": false,
    "useTheme": true
  }
}
```

## Opções 2x2 com imagem

Em `layout: "2-columns"` com `mediaPosition: "media-top"`, declare `mediaWidth`, `mediaHeight` e `mediaObjectFit` em cada item. Sem altura explícita, a imagem pode virar uma faixa baixa no builder e no viewer. Use cerca de `96px` a `120px` em cards compactos e confirme o resultado no mobile. Ao atualizar `items`, reenvie também `layout`, `mediaPosition`, `gap`, `itemPadding` e `itemBorderRadius`, pois a normalização pode restaurar defaults para campos visuais omitidos.

```json
{
  "type": "options",
  "settings": {
    "items": [
      {
        "label": "Mais energia",
        "value": "energia",
        "mediaType": "image",
        "imageUrl": "https://example.com/energia.jpg",
        "mediaWidth": "100%",
        "mediaHeight": "104px",
        "mediaObjectFit": "cover"
      }
    ],
    "layout": "2-columns",
    "mediaPosition": "media-top",
    "autoAdvance": true,
    "multiSelect": false,
    "useTheme": true
  }
}
```

## Captura com continuidade

Um `form` só é submetido pelo fluxo atual quando há um `button` na mesma etapa `capture`.

```json
{
  "type": "form",
  "settings": {
    "fields": [
      {
        "type": "email",
        "name": "email",
        "label": "Seu e-mail",
        "required": true
      }
    ],
    "useTheme": true
  }
}
```

```json
{
  "type": "button",
  "settings": {
    "text": "Ver meu resultado",
    "actionType": "nextStep",
    "useTheme": true
  }
}
```

## Peso

Use `weightSlider` para faixa de peso, não para uma medição que precisa ser exata. O `variableName` permite reutilizar a resposta depois.

```json
{
  "type": "weightSlider",
  "settings": {
    "value": 70,
    "min": 30,
    "max": 200,
    "step": 1,
    "unit": "kg",
    "allowUnitToggle": true,
    "showValue": true,
    "valueSize": "xl",
    "variableName": "peso",
    "useTheme": true
  }
}
```

## Altura

Use `heightSlider` para faixa de altura, não para uma medição que precisa ser exata.

```json
{
  "type": "heightSlider",
  "settings": {
    "value": 170,
    "min": 100,
    "max": 250,
    "step": 1,
    "unit": "cm",
    "allowUnitToggle": true,
    "showValue": true,
    "valueSize": "xl",
    "variableName": "altura",
    "useTheme": true
  }
}
```

## Espaçamento intencional

Use `spacer` apenas para respiro pequeno; use `layoutContainer` quando a necessidade for estrutural.

```json
{
  "type": "spacer",
  "settings": {
    "height": 24,
    "useTheme": true
  }
}
```

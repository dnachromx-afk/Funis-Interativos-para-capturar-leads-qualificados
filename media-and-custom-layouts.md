# Receitas: Mídia e Layouts Customizados

Consulte `get_component_schema` antes de escrever. Não substitua URL de mídia, embed, avatar, som, checkout ou imagem por domínio de exemplo. Quando o componente exigir mídia, aguarde o valor literal fornecido pelo usuário ou um ativo permitido pela biblioteca.

## Copy e argumentos

```json
{
  "type": "text",
  "settings": {
    "content": "<h2>Entenda seu resultado</h2><p>Veja os próximos passos recomendados.</p>",
    "useTheme": true
  }
}
```

```json
{
  "type": "argument",
  "settings": {
    "items": [
      {
        "content": "<p>Uma razão clara para avançar.</p>"
      }
    ],
    "useTheme": true
  }
}
```

## Container estrutural

`layoutContainer` organiza filhos. A mutation layer preenche `settings.children`; envie os filhos no payload estrutural aceito pela operação MCP consultada.

```json
{
  "type": "layoutContainer",
  "settings": {
    "defaultConfig": {
      "mode": "grid",
      "columns": 2,
      "gap": "16px"
    },
    "useTheme": true
  },
  "children": [
    {
      "type": "text",
      "settings": {
        "content": "<p>Primeiro bloco</p>",
        "useTheme": true
      }
    },
    {
      "type": "text",
      "settings": {
        "content": "<p>Segundo bloco</p>",
        "useTheme": true
      }
    }
  ]
}
```

## Carousel sem URL inventada

O catálogo atual exige suas configurações visuais no payload. Esta receita usa um slide textual e navegação sequencial, sem mídia nem destino externo inventado.

```json
{
  "type": "carousel",
  "settings": {
    "slides": [
      {
        "contentType": "imageText",
        "imageObjectFit": "cover",
        "title": "Primeiro ponto",
        "description": "Explicação curta."
      }
    ],
    "variant": "slider",
    "autoplay": false,
    "autoplayInterval": 4000,
    "showArrows": true,
    "arrowStyle": "default",
    "showDots": true,
    "dotStyle": "dots",
    "loop": false,
    "dragFree": false,
    "slidesPerView": 1,
    "slideGap": "16px",
    "height": "auto",
    "imageSizeMode": "aspectRatio",
    "imageWidth": "100%",
    "imageHeight": "240px",
    "textPosition": "below",
    "imageBorderRadius": "0px",
    "backgroundColor": "transparent",
    "borderRadius": "12px",
    "arrowColor": "#ffffff",
    "arrowBackgroundColor": "#000000",
    "dotColor": "#d1d5db",
    "dotActiveColor": "#1f2937",
    "titleColor": "#1f2937",
    "titleFontSize": "20px",
    "titleFontWeight": "600",
    "titleAlignment": "left",
    "descriptionColor": "#6b7280",
    "descriptionFontSize": "14px",
    "descriptionAlignment": "left",
    "ctaBackgroundColor": "#3b82f6",
    "ctaTextColor": "#ffffff",
    "ctaBorderRadius": "8px",
    "ctaPadding": "8px 20px",
    "ctaFontSize": "14px",
    "ctaFontWeight": "600",
    "ctaAlignment": "flex-start",
    "overlayBackgroundColor": "#000000",
    "overlayOpacity": 50,
    "useTheme": true
  }
}
```

## Mídia fornecida pelo usuário

`image`, `video` e `audioPlayer` dependem de uma URL real, e por isso não recebem JSON de criação sem mídia fornecida. Para `audioPlayer`, chame a descoberta de ativos aplicável e use uma URL autorizada; áudio é opcional para avançar. Para `video`, escolha o tipo compatível com a origem real. Para `image`, inclua alternativa textual. Consulte o schema de cada tipo antes de montar o payload.

## Pitch timer

`pitchTimer` pode revelar componentes da mesma etapa conforme o tempo da mídia. Em áudio, ele pertence a `audioPlayer`; em vídeo, só faz sentido com `videoType: "embed"`. `targetModuleId` deve ser o identificador real de outro módulo da mesma etapa, obtido do blueprint. O objeto abaixo é o valor de `settings.pitchTimer`, depois que a mídia real tiver sido informada.

```json
{
  "enabled": true,
  "rules": [
    {
      "targetModuleId": "id-real-do-modulo-da-etapa",
      "timeInSeconds": 30,
      "animation": "fadeIn"
    }
  ]
}
```

## Chamada de áudio

`audioCall` é intrusivo. Só o crie por solicitação explícita e envie `explicitIntentReason` como metadado MCP fora de `settings`. Se houver áudio ou toque, use exclusivamente mídia real fornecida pelo usuário. Mantenha `vibrationEnabled: false`, salvo pedido explícito de vibração. Recusar, encerrar, fim do áudio e erro de reprodução compartilham uma única navegação: `advanceOnEnd`, `endActionType` e `endTargetStepId`. Não crie ações separadas para cada evento.

```json
{
  "type": "audioCall",
  "settings": {
    "contactName": "Especialista",
    "advanceOnEnd": false,
    "endTargetStepId": "",
    "vibrationEnabled": false,
    "useTheme": false
  }
}
```

## Bloco customizado

Use `codeBlock` somente quando os componentes nativos não atendem ao layout. Mantenha HTML, CSS e ações separados. Não recrie header, barra de progresso ou navegação paralela.

```json
{
  "type": "codeBlock",
  "settings": {
    "html": "<section class=\"resumo\"><p>Resumo personalizado</p></section>",
    "customCSS": ".resumo{padding:16px;border-radius:8px}",
    "useTheme": true,
    "minHeight": "auto"
  }
}
```

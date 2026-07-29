# Sistema de Tema

## Contrato atual e baseline

O tema tem exatamente oito blocos: `colors`, `typography`, `spacing`, `layout`, `animations`, `header`, `background` e `form`. Os settings tratados por esta skill têm exatamente quatro blocos: `analytics`, `embed`, `navigation` e `gamification`.

`DEFAULT_THEME` e os defaults de settings do backend são o baseline para campos não enviados. Em criação, aplique tema e settings antes das etapas. Em edição, leia os presets existentes e envie patch parcial com `replaceTheme: false` e `replaceSettings: false`; use substituição completa apenas com um objeto completo e conhecido.

## Tokens, densidade e acessibilidade

`colors` define `primary`, `primaryText`, `background`, `text` e `border`. `typography`, `spacing`, `layout` e `animations` preservam tokens globais; componentes compatíveis devem usar `useTheme: true`. Resolva identidade pelo tema antes de recorrer a cor local, `customCSS` ou override.

Em telas pequenas, mantenha `containerMaxWidth` e `contentMaxWidth` em `448px`, com `pagePaddingX` de `16px`. Use densidade baixa ou média: uma decisão principal por etapa, labels visíveis, campos de ao menos `48px` e respiro consistente. Reduza elementos concorrentes antes de reduzir fonte ou área de toque.

Verifique contraste entre texto, fundo, botões, bordas, foco e progresso. Não use cor como único sinal. Animações não devem comunicar estado sozinhas e a transição de etapa deve continuar desabilitada quando não houver motivo explícito.

## Temas completos

Os exemplos são objetos completos para criação ou substituição intencional. Todos replicam a estrutura de `DEFAULT_THEME`, usam somente os quatro settings documentados e mantêm gamificação, placar, música, feedback e efeitos desligados.

### Premium

Direção mineral, precisa e discreta para serviços de alto valor e decisão consultiva.

```json
{
  "theme": {
    "colors": { "primary": "#18352d", "primaryText": "#ffffff", "background": "#f5f3ee", "text": "#17231e", "border": "#c8c7bb" },
    "typography": { "fontFamily": "Inter, system-ui, sans-serif", "headingFont": "Inter, system-ui, sans-serif", "fontSize": { "xs": "12px", "sm": "14px", "base": "16px", "lg": "18px", "xl": "20px", "2xl": "24px", "3xl": "30px" }, "lineHeight": { "tight": "1.25", "normal": "1.5", "relaxed": "1.75" }, "fontWeight": { "normal": "400", "medium": "500", "semibold": "600", "bold": "700" } },
    "spacing": { "xs": "8px", "sm": "12px", "md": "16px" },
    "layout": { "borderRadius": "12px", "shadowLevel": 2, "containerMaxWidth": "448px", "contentMaxWidth": "448px", "pagePaddingX": "16px", "contentGap": "22px", "breakpoints": { "mobile": "448px", "mobileLarge": "512px", "tabletSmall": "640px", "tablet": "768px", "desktopSmall": "896px", "desktopMedium": "1024px", "desktopLarge": "1280px" }, "gridPresets": { "columns": [1, 2, 3, 4, 6], "gaps": ["8px", "12px", "16px", "24px", "32px"] } },
    "animations": { "enabled": true, "duration": "200ms", "easing": "ease-in-out", "stepTransition": { "enabled": false, "preset": "none", "durationMs": 220, "easing": "cubic-bezier(.4,0,.2,1)" } },
    "header": { "enabled": true, "showProgress": true, "progressBarStyle": "default", "showBackButton": true, "contentType": "text", "content": "EXPERIÊNCIA PRIVADA", "fontSize": "12px", "height": "auto", "marginBottom": "0px", "backgroundColor": "#18352d", "textColor": "#ffffff", "progressColor": "#b68a3a", "backButtonColor": "#ffffff", "imageWidth": "200px", "imageHeight": "auto", "imageObjectFit": "contain", "imageBorderRadius": "0px" },
    "background": { "enabled": false, "imageUrl": "", "imageFit": "cover", "imagePosition": "center", "imageRepeat": "no-repeat", "applyToHeader": true, "overlayEnabled": true, "overlayColor": "#0f172a", "overlayOpacity": 0.5 },
    "form": { "fieldHeight": "52px", "fieldPadding": "14px 16px", "fieldFontSize": "16px", "fieldBorderRadius": "12px", "fieldSpacing": "14px", "labelSpacing": "8px", "fieldBorderColor": "#c8c7bb", "fieldFocusBorderColor": "#b68a3a", "fieldBackgroundColor": "#ffffff", "fieldTextColor": "#17231e", "fieldPlaceholderColor": "#6f766f", "labelColor": "#17231e", "labelFontSize": "14px", "labelFontWeight": "600" }
  },
  "settings": {
    "analytics": { "enabled": true },
    "embed": { "iframe": { "autoResize": true }, "widget": { "position": "bottom-right", "color": "#18352d", "size": 60, "icon": "chat", "iconUrl": "", "tooltip": "" } },
    "navigation": { "backRedirectEnabled": false, "backRedirectUrl": "", "queryParamForwardingEnabled": false, "resumeProgressEnabled": true, "resumeProgressMode": "prompt", "resumeProgressStorage": "local", "resumeProgressModalTemplate": "fullscreen", "resumeProgressModalIcon": "↺", "resumeProgressModalTitle": "Continuar de onde parou?", "resumeProgressModalDescription": "Encontramos um progresso salvo neste quiz. Você quer continuar da última etapa respondida?", "resumeProgressContinueLabel": "Continuar", "resumeProgressRestartLabel": "Começar do início", "resumeProgressModalBackgroundColor": "#ffffff", "resumeProgressModalTextColor": "#17231e", "resumeProgressModalPrimaryColor": "#18352d" },
    "gamification": { "enabled": false, "persistSession": true, "score": { "enabled": false, "scoreKey": "saldo", "label": "Saldo desbloqueado", "prefix": "R$", "suffix": "", "decimals": 2, "initialValue": 0, "position": "aboveHeader", "variant": "neon", "backgroundColor": "#10151f", "textColor": "#22e06f", "accentColor": "#22e06f", "fontSize": 16, "progressMax": 100, "progressLabel": "Meta" }, "backgroundMusic": { "enabled": false, "audioUrl": "", "volume": 0.45, "loop": true, "autoPlay": true, "showControl": false, "label": "Música de fundo" }, "feedback": { "vibrateOnInteraction": false, "vibrationPattern": [18], "clickFeedback": false, "soundOnInteraction": false, "soundUrl": "", "soundVolume": 0.5 }, "interactionEffects": { "enabled": false, "rules": [] }, "modalPreset": { "icon": "🔓", "title": "FASE DESBLOQUEADA", "description": "Você avançou. Cada passo certo libera uma nova recompensa.", "buttonText": "Continuar", "borderColor": "#facc15", "buttonColor": "#22e06f" }, "toastPreset": { "title": "Venda aprovada!", "description": "Valor:", "valueText": "R$ 37,00", "imageUrl": "", "timeText": "agora", "duration": 3, "delay": 0.5 } }
  }
}
```

### Editorial

Direção de papel, tinta e ritmo tipográfico para conteúdo autoral, educação e curadoria.

```json
{
  "theme": {
    "colors": { "primary": "#263c59", "primaryText": "#ffffff", "background": "#fbf8f2", "text": "#20252d", "border": "#d7d0c3" },
    "typography": { "fontFamily": "Georgia, serif", "headingFont": "Georgia, serif", "fontSize": { "xs": "12px", "sm": "14px", "base": "16px", "lg": "18px", "xl": "20px", "2xl": "24px", "3xl": "30px" }, "lineHeight": { "tight": "1.25", "normal": "1.5", "relaxed": "1.75" }, "fontWeight": { "normal": "400", "medium": "500", "semibold": "600", "bold": "700" } },
    "spacing": { "xs": "8px", "sm": "12px", "md": "16px" },
    "layout": { "borderRadius": "8px", "shadowLevel": 1, "containerMaxWidth": "448px", "contentMaxWidth": "448px", "pagePaddingX": "16px", "contentGap": "24px", "breakpoints": { "mobile": "448px", "mobileLarge": "512px", "tabletSmall": "640px", "tablet": "768px", "desktopSmall": "896px", "desktopMedium": "1024px", "desktopLarge": "1280px" }, "gridPresets": { "columns": [1, 2, 3, 4, 6], "gaps": ["8px", "12px", "16px", "24px", "32px"] } },
    "animations": { "enabled": true, "duration": "200ms", "easing": "ease-in-out", "stepTransition": { "enabled": false, "preset": "none", "durationMs": 220, "easing": "cubic-bezier(.4,0,.2,1)" } },
    "header": { "enabled": true, "showProgress": true, "progressBarStyle": "default", "showBackButton": true, "contentType": "text", "content": "CADERNO DE DESCOBERTA", "fontSize": "12px", "height": "auto", "marginBottom": "0px", "backgroundColor": "#263c59", "textColor": "#ffffff", "progressColor": "#b5553d", "backButtonColor": "#ffffff", "imageWidth": "200px", "imageHeight": "auto", "imageObjectFit": "contain", "imageBorderRadius": "0px" },
    "background": { "enabled": false, "imageUrl": "", "imageFit": "cover", "imagePosition": "center", "imageRepeat": "no-repeat", "applyToHeader": true, "overlayEnabled": true, "overlayColor": "#0f172a", "overlayOpacity": 0.5 },
    "form": { "fieldHeight": "52px", "fieldPadding": "14px 16px", "fieldFontSize": "16px", "fieldBorderRadius": "8px", "fieldSpacing": "14px", "labelSpacing": "8px", "fieldBorderColor": "#d7d0c3", "fieldFocusBorderColor": "#b5553d", "fieldBackgroundColor": "#ffffff", "fieldTextColor": "#20252d", "fieldPlaceholderColor": "#69707a", "labelColor": "#20252d", "labelFontSize": "14px", "labelFontWeight": "600" }
  },
  "settings": {
    "analytics": { "enabled": true },
    "embed": { "iframe": { "autoResize": true }, "widget": { "position": "bottom-right", "color": "#263c59", "size": 60, "icon": "chat", "iconUrl": "", "tooltip": "" } },
    "navigation": { "backRedirectEnabled": false, "backRedirectUrl": "", "queryParamForwardingEnabled": false, "resumeProgressEnabled": true, "resumeProgressMode": "prompt", "resumeProgressStorage": "local", "resumeProgressModalTemplate": "fullscreen", "resumeProgressModalIcon": "↺", "resumeProgressModalTitle": "Continuar de onde parou?", "resumeProgressModalDescription": "Encontramos um progresso salvo neste quiz. Você quer continuar da última etapa respondida?", "resumeProgressContinueLabel": "Continuar", "resumeProgressRestartLabel": "Começar do início", "resumeProgressModalBackgroundColor": "#ffffff", "resumeProgressModalTextColor": "#20252d", "resumeProgressModalPrimaryColor": "#263c59" },
    "gamification": { "enabled": false, "persistSession": true, "score": { "enabled": false, "scoreKey": "saldo", "label": "Saldo desbloqueado", "prefix": "R$", "suffix": "", "decimals": 2, "initialValue": 0, "position": "aboveHeader", "variant": "neon", "backgroundColor": "#10151f", "textColor": "#22e06f", "accentColor": "#22e06f", "fontSize": 16, "progressMax": 100, "progressLabel": "Meta" }, "backgroundMusic": { "enabled": false, "audioUrl": "", "volume": 0.45, "loop": true, "autoPlay": true, "showControl": false, "label": "Música de fundo" }, "feedback": { "vibrateOnInteraction": false, "vibrationPattern": [18], "clickFeedback": false, "soundOnInteraction": false, "soundUrl": "", "soundVolume": 0.5 }, "interactionEffects": { "enabled": false, "rules": [] }, "modalPreset": { "icon": "🔓", "title": "FASE DESBLOQUEADA", "description": "Você avançou. Cada passo certo libera uma nova recompensa.", "buttonText": "Continuar", "borderColor": "#facc15", "buttonColor": "#22e06f" }, "toastPreset": { "title": "Venda aprovada!", "description": "Valor:", "valueText": "R$ 37,00", "imageUrl": "", "timeText": "agora", "duration": 3, "delay": 0.5 } }
  }
}
```

### Vibrante

Direção de energia controlada, alto contraste e feedback claro para campanhas com permissão explícita para dinamismo.

```json
{
  "theme": {
    "colors": { "primary": "#5b2cbf", "primaryText": "#ffffff", "background": "#fbfaff", "text": "#211c31", "border": "#d8cff0" },
    "typography": { "fontFamily": "Inter, system-ui, sans-serif", "headingFont": "Inter, system-ui, sans-serif", "fontSize": { "xs": "12px", "sm": "14px", "base": "16px", "lg": "18px", "xl": "20px", "2xl": "24px", "3xl": "30px" }, "lineHeight": { "tight": "1.25", "normal": "1.5", "relaxed": "1.75" }, "fontWeight": { "normal": "400", "medium": "500", "semibold": "600", "bold": "700" } },
    "spacing": { "xs": "8px", "sm": "12px", "md": "16px" },
    "layout": { "borderRadius": "16px", "shadowLevel": 2, "containerMaxWidth": "448px", "contentMaxWidth": "448px", "pagePaddingX": "16px", "contentGap": "20px", "breakpoints": { "mobile": "448px", "mobileLarge": "512px", "tabletSmall": "640px", "tablet": "768px", "desktopSmall": "896px", "desktopMedium": "1024px", "desktopLarge": "1280px" }, "gridPresets": { "columns": [1, 2, 3, 4, 6], "gaps": ["8px", "12px", "16px", "24px", "32px"] } },
    "animations": { "enabled": true, "duration": "200ms", "easing": "ease-in-out", "stepTransition": { "enabled": false, "preset": "none", "durationMs": 220, "easing": "cubic-bezier(.4,0,.2,1)" } },
    "header": { "enabled": true, "showProgress": true, "progressBarStyle": "full-top", "showBackButton": true, "contentType": "text", "content": "SEU PRÓXIMO PASSO", "fontSize": "12px", "height": "auto", "marginBottom": "0px", "backgroundColor": "#5b2cbf", "textColor": "#ffffff", "progressColor": "#f08a4b", "backButtonColor": "#ffffff", "imageWidth": "200px", "imageHeight": "auto", "imageObjectFit": "contain", "imageBorderRadius": "0px" },
    "background": { "enabled": false, "imageUrl": "", "imageFit": "cover", "imagePosition": "center", "imageRepeat": "no-repeat", "applyToHeader": true, "overlayEnabled": true, "overlayColor": "#0f172a", "overlayOpacity": 0.5 },
    "form": { "fieldHeight": "52px", "fieldPadding": "14px 16px", "fieldFontSize": "16px", "fieldBorderRadius": "16px", "fieldSpacing": "14px", "labelSpacing": "8px", "fieldBorderColor": "#d8cff0", "fieldFocusBorderColor": "#5b2cbf", "fieldBackgroundColor": "#ffffff", "fieldTextColor": "#211c31", "fieldPlaceholderColor": "#706b80", "labelColor": "#211c31", "labelFontSize": "14px", "labelFontWeight": "600" }
  },
  "settings": {
    "analytics": { "enabled": true },
    "embed": { "iframe": { "autoResize": true }, "widget": { "position": "bottom-right", "color": "#5b2cbf", "size": 60, "icon": "chat", "iconUrl": "", "tooltip": "" } },
    "navigation": { "backRedirectEnabled": false, "backRedirectUrl": "", "queryParamForwardingEnabled": false, "resumeProgressEnabled": true, "resumeProgressMode": "prompt", "resumeProgressStorage": "local", "resumeProgressModalTemplate": "fullscreen", "resumeProgressModalIcon": "↺", "resumeProgressModalTitle": "Continuar de onde parou?", "resumeProgressModalDescription": "Encontramos um progresso salvo neste quiz. Você quer continuar da última etapa respondida?", "resumeProgressContinueLabel": "Continuar", "resumeProgressRestartLabel": "Começar do início", "resumeProgressModalBackgroundColor": "#ffffff", "resumeProgressModalTextColor": "#211c31", "resumeProgressModalPrimaryColor": "#5b2cbf" },
    "gamification": { "enabled": false, "persistSession": true, "score": { "enabled": false, "scoreKey": "saldo", "label": "Saldo desbloqueado", "prefix": "R$", "suffix": "", "decimals": 2, "initialValue": 0, "position": "aboveHeader", "variant": "neon", "backgroundColor": "#10151f", "textColor": "#22e06f", "accentColor": "#22e06f", "fontSize": 16, "progressMax": 100, "progressLabel": "Meta" }, "backgroundMusic": { "enabled": false, "audioUrl": "", "volume": 0.45, "loop": true, "autoPlay": true, "showControl": false, "label": "Música de fundo" }, "feedback": { "vibrateOnInteraction": false, "vibrationPattern": [18], "clickFeedback": false, "soundOnInteraction": false, "soundUrl": "", "soundVolume": 0.5 }, "interactionEffects": { "enabled": false, "rules": [] }, "modalPreset": { "icon": "🔓", "title": "FASE DESBLOQUEADA", "description": "Você avançou. Cada passo certo libera uma nova recompensa.", "buttonText": "Continuar", "borderColor": "#facc15", "buttonColor": "#22e06f" }, "toastPreset": { "title": "Venda aprovada!", "description": "Valor:", "valueText": "R$ 37,00", "imageUrl": "", "timeText": "agora", "duration": 3, "delay": 0.5 } }
  }
}
```

### Sóbrio

Direção neutra, serena e funcional para serviços institucionais, formulários e decisões sensíveis.

```json
{
  "theme": {
    "colors": { "primary": "#344054", "primaryText": "#ffffff", "background": "#f8f9fb", "text": "#182230", "border": "#d0d5dd" },
    "typography": { "fontFamily": "Inter, system-ui, sans-serif", "headingFont": "Inter, system-ui, sans-serif", "fontSize": { "xs": "12px", "sm": "14px", "base": "16px", "lg": "18px", "xl": "20px", "2xl": "24px", "3xl": "30px" }, "lineHeight": { "tight": "1.25", "normal": "1.5", "relaxed": "1.75" }, "fontWeight": { "normal": "400", "medium": "500", "semibold": "600", "bold": "700" } },
    "spacing": { "xs": "8px", "sm": "12px", "md": "16px" },
    "layout": { "borderRadius": "10px", "shadowLevel": 1, "containerMaxWidth": "448px", "contentMaxWidth": "448px", "pagePaddingX": "16px", "contentGap": "22px", "breakpoints": { "mobile": "448px", "mobileLarge": "512px", "tabletSmall": "640px", "tablet": "768px", "desktopSmall": "896px", "desktopMedium": "1024px", "desktopLarge": "1280px" }, "gridPresets": { "columns": [1, 2, 3, 4, 6], "gaps": ["8px", "12px", "16px", "24px", "32px"] } },
    "animations": { "enabled": true, "duration": "200ms", "easing": "ease-in-out", "stepTransition": { "enabled": false, "preset": "none", "durationMs": 220, "easing": "cubic-bezier(.4,0,.2,1)" } },
    "header": { "enabled": true, "showProgress": true, "progressBarStyle": "default", "showBackButton": true, "contentType": "text", "content": "CONSULTA GUIADA", "fontSize": "12px", "height": "auto", "marginBottom": "0px", "backgroundColor": "#344054", "textColor": "#ffffff", "progressColor": "#667085", "backButtonColor": "#ffffff", "imageWidth": "200px", "imageHeight": "auto", "imageObjectFit": "contain", "imageBorderRadius": "0px" },
    "background": { "enabled": false, "imageUrl": "", "imageFit": "cover", "imagePosition": "center", "imageRepeat": "no-repeat", "applyToHeader": true, "overlayEnabled": true, "overlayColor": "#0f172a", "overlayOpacity": 0.5 },
    "form": { "fieldHeight": "52px", "fieldPadding": "14px 16px", "fieldFontSize": "16px", "fieldBorderRadius": "10px", "fieldSpacing": "14px", "labelSpacing": "8px", "fieldBorderColor": "#d0d5dd", "fieldFocusBorderColor": "#344054", "fieldBackgroundColor": "#ffffff", "fieldTextColor": "#182230", "fieldPlaceholderColor": "#667085", "labelColor": "#182230", "labelFontSize": "14px", "labelFontWeight": "600" }
  },
  "settings": {
    "analytics": { "enabled": true },
    "embed": { "iframe": { "autoResize": true }, "widget": { "position": "bottom-right", "color": "#344054", "size": 60, "icon": "chat", "iconUrl": "", "tooltip": "" } },
    "navigation": { "backRedirectEnabled": false, "backRedirectUrl": "", "queryParamForwardingEnabled": false, "resumeProgressEnabled": true, "resumeProgressMode": "prompt", "resumeProgressStorage": "local", "resumeProgressModalTemplate": "fullscreen", "resumeProgressModalIcon": "↺", "resumeProgressModalTitle": "Continuar de onde parou?", "resumeProgressModalDescription": "Encontramos um progresso salvo neste quiz. Você quer continuar da última etapa respondida?", "resumeProgressContinueLabel": "Continuar", "resumeProgressRestartLabel": "Começar do início", "resumeProgressModalBackgroundColor": "#ffffff", "resumeProgressModalTextColor": "#182230", "resumeProgressModalPrimaryColor": "#344054" },
    "gamification": { "enabled": false, "persistSession": true, "score": { "enabled": false, "scoreKey": "saldo", "label": "Saldo desbloqueado", "prefix": "R$", "suffix": "", "decimals": 2, "initialValue": 0, "position": "aboveHeader", "variant": "neon", "backgroundColor": "#10151f", "textColor": "#22e06f", "accentColor": "#22e06f", "fontSize": 16, "progressMax": 100, "progressLabel": "Meta" }, "backgroundMusic": { "enabled": false, "audioUrl": "", "volume": 0.45, "loop": true, "autoPlay": true, "showControl": false, "label": "Música de fundo" }, "feedback": { "vibrateOnInteraction": false, "vibrationPattern": [18], "clickFeedback": false, "soundOnInteraction": false, "soundUrl": "", "soundVolume": 0.5 }, "interactionEffects": { "enabled": false, "rules": [] }, "modalPreset": { "icon": "🔓", "title": "FASE DESBLOQUEADA", "description": "Você avançou. Cada passo certo libera uma nova recompensa.", "buttonText": "Continuar", "borderColor": "#facc15", "buttonColor": "#22e06f" }, "toastPreset": { "title": "Venda aprovada!", "description": "Valor:", "valueText": "R$ 37,00", "imageUrl": "", "timeText": "agora", "duration": 3, "delay": 0.5 } }
  }
}
```

Em funil existente, derive um patch dos presets retornados em vez de substituir objetos inteiros.

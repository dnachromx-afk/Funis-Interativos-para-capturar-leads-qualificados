# Receitas: Prova e Conversão

Consulte `get_component_schema` antes de escrever. Prova social, preços, prazos e comparações precisam corresponder a informações reais fornecidas pelo usuário.

## Depoimento verificável

```json
{
  "type": "testimonial",
  "settings": {
    "items": [
      {
        "name": "Cliente identificado",
        "rating": 5,
        "text": "<p>Depoimento aprovado pelo cliente.</p>"
      }
    ],
    "autoplay": false,
    "useTheme": false
  }
}
```

Mantenha o depoimento estático: não configure rotação, transição ou outro movimento automático.

## Objeção respondida

```json
{
  "type": "faq",
  "settings": {
    "items": [
      {
        "question": "<p>Como funciona o próximo passo?</p>",
        "answer": "<p>Você receberá as instruções após confirmar a escolha.</p>"
      }
    ],
    "useTheme": true
  }
}
```

## Oferta ilustrativa

Use `illustrative` enquanto não houver checkout real. Para redirecionar, obtenha primeiro a URL literal do checkout fornecida pelo usuário e então consulte o schema; nunca invente esse destino.

```json
{
  "type": "pricingCard",
  "settings": {
    "items": [
      {
        "title": "Plano recomendado",
        "discountPrice": "R$ 0,00"
      }
    ],
    "actionType": "illustrative",
    "useTheme": true
  }
}
```

## Prazo genuíno

`countdown` é intrusivo e exige `explicitIntentReason` no metadado MCP da operação, fora de `settings`. Use-o apenas quando o prazo for genuíno e informado pelo usuário.

```json
{
  "type": "countdown",
  "settings": {
    "content": "<p>Prazo informado: <strong>{{timer}}</strong></p>",
    "duration": 600,
    "format": "mm:ss",
    "actionType": "none",
    "placementMode": "normal",
    "useTheme": true
  }
}
```

## Comparação com ativos reais

`comparison` requer duas imagens com contraste relevante. Não há receita de URL nesta referência porque nenhuma mídia foi fornecida. Depois de receber as duas URLs literais ou uploads do usuário, consulte `get_component_schema("comparison")` e envie as origens, alternativas e imagens correspondentes; não use URLs fictícias.

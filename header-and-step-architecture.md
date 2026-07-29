# Header e Arquitetura de Etapas

## Header global primeiro

O header global pertence a `theme.header`. Ele concentra identidade, progresso e retorno; etapas nao devem recriar logo, barra de progresso, botao voltar ou topo fixo com componentes.

Escolha o modo pelo objetivo:

| Modo | Quando usar | Regra |
|---|---|---|
| Global textual | Padrao para experiencias de marca e diagnostico. | Definir uma vez em `theme.header`. |
| Global com imagem | Quando existir logo ou ativo aprovado. | Usar `contentType: "image"` e dimensoes adequadas ao ativo. |
| `full-top` | Fluxos imersivos que precisam de progresso discreto no topo. | Nao duplicar progresso dentro da etapa. |
| Heranca parcial | Uma etapa precisa mudar um aspecto isolado, como ocultar progresso na captura. | Aplicar `headerOverride` minimo e justificado. |
| Background completo | A etapa exige uma composicao visual realmente diferente. | Declarar o override completo, pois ele substitui o background herdado. |

## Heranca parcial

`headerOverride` e uma excecao de etapa. Use-o para um unico comportamento que nao deve alterar o restante do funil. Exemplo documentado para a captura:

```json
{
  "headerOverride": {
    "showProgress": false
  }
}
```

Antes de escrever, confirme no blueprint o `stepId`, a versao atual e que a etapa e mesmo a captura. Depois valide que nenhum componente ou header global mudou.

## Background override completo

Background local nao e um merge seguro. Ao substituir background, envie um objeto completo com todos os campos atuais, inclusive os que ficam desabilitados, para nao herdar uma combinacao visual inesperada.

```json
{
  "backgroundOverride": {
    "enabled": false,
    "imageUrl": "",
    "imageFit": "cover",
    "imagePosition": "center",
    "imageRepeat": "no-repeat",
    "applyToHeader": true,
    "overlayEnabled": false,
    "overlayColor": "",
    "overlayOpacity": 0
  }
}
```

Quando um background com imagem for necessário, obtenha uma URL real e autorizada do usuário antes de preencher `imageUrl`. Se a identidade pode ser resolvida pelo tema global, nao introduza override local.

## Arquitetura de etapas

Construa uma etapa para uma decisao. Uma sequencia frequente e: introducao, perguntas de baixa friccao, contexto ou transicao, captura consentida, resultado e proximo passo. Isso e uma estrutura adaptavel, nao uma obrigacao de quantidade fixa.

- `intro`: promessa, contexto e CTA de inicio.
- `question`: uma pergunta por decisao; em multisselecao, forneca uma acao explicita para avancar.
- `content`: explica mecanismo, criterio ou proximo passo sem fingir ser diagnostico clinico.
- `capture`: informa finalidade, pede dados minimos e oferece labels visiveis.
- `result`: sintetiza apenas o que as respostas permitem afirmar e encaminha para uma proxima acao real.

Use os kinds e componentes aceitos pelo contrato atual. Para escolher o tipo, consulte [Seleção de Componentes](./component-selection.md); para um componente de mídia ou layout, consulte [Receitas: Mídia e Layouts Customizados](./component-recipes/media-and-custom-layouts.md).

# Contratos e Validacao

## Fonte de verdade

O contrato backend de 2026-07-10 e a resposta atual das tools sao a fonte de verdade. Esta referencia descreve comportamento de integracao; ela nao cria campos, tipos ou defaults. Para um componente novo, consulte seu schema sob demanda. Para kinds e tipos disponiveis, consulte os catalogos atuais apenas quando a tarefa precisar deles.

## Leitura `summary` e `full`

Use `summary` nos checkpoints para localizar alvos, contar etapas, ver ordem, IDs, versao e warnings. Solicite `full` sob demanda antes de alterar settings, para diagnosticar warning, recuperar uma falha ou comparar um trecho que o summary nao mostra. A validacao final exige `full`. Nao use leitura completa por habito em pedidos de baixo risco.

| Situacao | Leitura recomendada |
|---|---|
| Localizar um funil ou confirmar escopo | `summary` |
| Editar copy ou ordem de um componente | `full` da etapa alvo, quando o resumo nao trouxer os settings necessarios |
| Ajustar tema, header ou formulario | Presets globais atuais e trecho relevante em `full` |
| Corrigir validacao | Schema do tipo afetado e estado `full` do alvo |
| Confirmar entrega | `full` obrigatorio na validacao final |

## Defaults reais e schemas sob demanda

Nao reconstrua defaults de memoria. Leia os presets atuais antes de alterar um funil existente e use `DEFAULT_THEME` apenas como baseline do backend quando ele estiver retornado ou explicitamente documentado pelo contrato atual. Em criacao, envie somente os campos necessarios para a identidade aprovada; em patch, mantenha `replaceTheme` e `replaceSettings` como `false` quando a intencao for parcial.

Nao copie schemas de um catalogo para todo payload. Consulte `get_component_schema` para o tipo que vai criar ou configurar. Isso reduz chamadas, evita campos obsoletos e mantem a escrita aderente ao backend.

## Budgets de operacao

Defina antes de escrever limites proporcionais ao pedido:

| Pedido | Budget inicial |
|---|---|
| Copy em componente existente | 1 leitura do alvo, 1 patch, 1 validacao. |
| Uma pergunta nova | Localizacao se necessaria, 1 blueprint, 1 append ou update, 1 validacao. |
| Tipo de componente novo | Leitura do alvo, 1 schema do tipo, 1 criacao, 1 validacao. |
| Criacao simples | Criacao, presets, um ou poucos blocos de etapas, validacao por bloco. |
| Reestruturacao | Snapshot, blocos pequenos, validacao a cada limite estrutural. |

O budget e um limite de seguranca, nao meta de chamadas. Se ele for excedido por ambiguidades, conflito ou warnings, pare, releia o estado e explique a proxima acao.

## Warnings e erros

Warnings nao sao ruído. Classifique-os antes de seguir:

- Critico ou estrutural: bloquear proxima escrita e corrigir.
- De contrato: consultar schema ou tipo/kind atual e corrigir payload.
- De conteudo: corrigir dados ausentes, URL, copy ou consentimento antes de publicar.
- De escopo: remover mudanca nao solicitada ou pedir autorizacao.

Trate erros em um envelope operacional consistente no relatorio, sem inventar formato de resposta da tool:

```json
{
  "operation": "update_component_settings",
  "target": {
    "funnel": "slug-confirmado",
    "stepId": "step-confirmado",
    "componentId": "component-confirmado"
  },
  "version": "versao-usada",
  "status": "failed",
  "error": {
    "kind": "validation",
    "message": "Campo recusado pelo contrato atual.",
    "retryable": true
  },
  "recovery": "Ler schema do tipo afetado e reaplicar apenas o patch valido."
}
```

O envelope acima e somente registro interno de operacao, nao payload do backend.

## Checklist final

- [ ] Alvo, IDs e versao vieram de uma leitura atual.
- [ ] O escopo escrito corresponde ao pedido e preserva dados nao relacionados.
- [ ] Schemas foram consultados apenas para tipos novos ou configuracoes incertas.
- [ ] Tema, header e formulario existentes foram preservados quando fora de escopo.
- [ ] Recursos opcionais continuam desabilitados se nao foram solicitados.
- [ ] URLs, preco, prazo, prova social e consentimento foram fornecidos e verificaveis quando usados.
- [ ] Warnings criticos sao zero ou estao explicitamente bloqueando a entrega.
- [ ] A validacao final usa `get_quiz_blueprint({ detail: "validation" })`; `full` fica reservado para investigar uma falha concreta ou settings.
- [ ] O relato inclui suposicoes, pendencias, recovery aplicado e estado preservado.

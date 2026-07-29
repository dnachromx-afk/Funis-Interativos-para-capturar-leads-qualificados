# Workflow Complementar

Este guia complementa o fluxo obrigatorio de [`SKILL.md`](../SKILL.md). Ele nao repete schemas nem substitui a consulta ao contrato atual retornado pelas tools.

## 1. Classificar o pedido

Classifique primeiro: criacao, edicao localizada, ajuste visual, troca de componente, insercao de etapa, oferta ou auditoria. A classe define o menor conjunto de leituras e escritas necessario.

- Criacao: criar, aplicar presets globais, montar uma espinha dorsal pequena e validar antes de enriquecer.
- Edicao: localizar o alvo e ler blueprint antes de alterar qualquer coisa.
- Troca de tipo: consultar o schema do novo tipo, criar, reordenar, validar e so entao remover o antigo.
- Oferta: confirmar alvo, preco, condicoes e URL antes de criar componentes comerciais.

## 2. Descoberta proporcional

Use catalogo, playbook, schemas e audio sob demanda. Nao descubra todo o catalogo para uma alteracao de copy, nem consulte audio se nenhum recurso de audio sera usado.

| Necessidade | Leitura minima |
|---|---|
| Criar estrutura simples | Contexto do pedido e kinds necessarios. |
| Inserir ou editar em funil existente | Lista de funis, se o alvo for ambiguo, e blueprint. |
| Usar tipo novo | Schema daquele tipo, apos confirmar que ele e necessario. |
| Alterar tema existente | Presets globais atuais. |
| Habilitar audio | Biblioteca de audio imediatamente antes da configuracao. |

## 3. Escrever em pequenos limites

Crie etapas antes dos componentes finais. Em uma estrutura longa, envie blocos pequenos, recupere IDs reais pelo blueprint e complete uma etapa por vez. Use a versao retornada pela ultima leitura ou mutacao em cada nova escrita.

Evite `replace_quiz_structure` para reparos locais. Um patch de configuracao preserva dados nao relacionados; uma substituicao exige a estrutura completa conhecida e validada.

## 4. Tratar recursos como opt-in

Por padrao, mantenha desabilitados gamificacao, placar, deltas, efeitos de interacao, musica, sons, notificacoes de venda e estilos locais. Ative-os somente quando o pedido ou a hipotese documentada os exigir.

Audio exige URL retornada pela biblioteca. Uma URL vazia com recurso desabilitado e preferivel a uma URL inventada. Quando o recurso usa movimento ou som, ofereca controle e mantenha o fluxo utilizavel sem ele.

## 5. Validar e relatar

Depois de cada mudanca estrutural ou etapa complexa, leia o blueprint. Na entrega, informe o que mudou, o que foi preservado, warnings relevantes, suposicoes e pendencias. Nao declare sucesso se a validacao final nao foi executada.

## Sequencia de decisao

1. Ler [brief e estrategia](./brief-and-strategy.md).
2. Escolher um [blueprint](./blueprints.md) proporcional ao objetivo.
3. Aplicar tema global antes das etapas novas, conforme [tema](./theme-system.md).
4. Usar a arquitetura de [header e etapas](./header-and-step-architecture.md).
5. Escrever o menor patch ou bloco de etapas possivel.
6. Validar contrato, warnings, escopo e acessibilidade conforme [contratos](./contracts-and-validation.md).
7. Recuperar falhas sem apagar trabalho valido, conforme [edicao e recovery](./editing-and-recovery.md).

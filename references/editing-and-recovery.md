# Edicao e Recovery

## Ler antes de escrever

Em funil existente, primeiro localize o alvo quando necessario e leia o blueprint. Confirme nome ou slug, `stepId`, `componentId`, posicao, versao, warnings e componentes dependentes. Para preservar identidade, leia tambem os presets globais antes de alterar tema, header ou formulario.

Nao preencha lacunas de uma solicitacao de edicao. Se a nova pergunta nao inclui texto ou opcoes, se a oferta nao inclui preco ou URL, ou se ha mais de um alvo plausivel, pare para esclarecer.

## Patches pequenos

- Atualize settings com patch parcial e somente os campos solicitados.
- Use a versao retornada pela ultima leitura ou escrita em toda mutacao subsequente.
- Ao trocar tipo de componente, crie o novo, reordene, valide e depois remova o antigo.
- Nunca remova o unico componente de uma etapa antes de garantir uma substituicao valida.
- Reordene com a lista completa de IDs atual, nao com uma lista presumida.
- Preserve presets, gamificacao, score, URLs e estrutura quando o escopo nao pede altera-los.

## Versionamento operacional

Trate a versao como controle de concorrencia. Uma falha de versao indica que o estado mudou desde a sua leitura. Nao repita cegamente a escrita: leia o blueprint novamente, compare o alvo e reaplique apenas o patch ainda necessario.

Antes de uma mudanca estrutural maior, registre um snapshot de leitura com data, alvo, versao, ordem de etapas, IDs de componentes e presets relevantes. O snapshot e referencia de recovery, nao uma autorizacao para sobrescrever o estado atual.

## Recovery por falha

| Falha | Recuperacao segura |
|---|---|
| Schema ou campo invalido | Ler o schema apenas do tipo envolvido, corrigir o menor payload e repetir a etapa. |
| Conflito de versao | Relendo blueprint, comparar mudancas e usar a versao nova. |
| Warning novo | Isolar etapa ou componente causador, corrigir localmente e validar de novo. |
| Componente errado | Criar substituto valido, reordenar, validar e remover o componente errado. |
| Escrita parcial | Ler estado real antes de qualquer compensacao; nao supor que a operacao falhou por completo. |
| Copy ou destino ausente | Nao escrever placeholder persistente; pedir o dado bloqueante. |

## Preservacao e limites

Nao use substituicao integral para corrigir copy, uma etapa, um componente ou um override. Nao apague estrutura valida para refazer o fluxo por causa de um warning local. Se a recuperacao exigir perda de dados, URLs, identidade ou respostas de producao, suspenda a operacao e solicite autorizacao explicita com o impacto descrito.

Finalize toda recuperacao com blueprint e relato curto: estado anterior relevante, patch aplicado, estado preservado e warnings restantes.

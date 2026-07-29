# Brief e Estrategia

## Brief minimo viavel

Antes de criar ou alterar estrutura, registre o que e conhecido. Pergunte apenas o que bloqueia uma escrita segura; o restante pode virar suposicao declarada e reversivel.

| Campo | Decisao necessaria |
|---|---|
| Objetivo | Captura, qualificacao, agendamento, venda, desafio ou pesquisa. |
| Publico | Quem responde, contexto, maturidade e principal necessidade. |
| Oferta | Produto, servico, proximo passo ou resultado entregue. |
| CTA | Acao, destino e URL real quando houver saida externa. |
| Captura | Dados minimos, momento de pedido e finalidade. |
| Tom | Formalidade, energia, vocabulario permitido e limites de linguagem. |
| Marca | Nome, ativos autorizados, cores, tipografia e referencias. |
| Duracao | Faixa de minutos e numero maximo de etapas aceitavel. |
| Hipotese | Relacao que sera testada entre perfil, mensagem e proximo passo. |

Nao trate falta de dados como permissao para inventar checkout, preco, depoimento, prazo, beneficio clinico ou segmentacao sensivel.

## Hipotese e suposicoes

Escreva uma hipotese observavel antes da arquitetura: "Para [publico], uma sequencia que [mecanismo] deve aumentar [sinal] porque [razao]." Defina tambem o sinal minimo, por exemplo conclusao, captura consentida ou clique no CTA.

Declare suposicoes em linguagem direta, separadas de fatos fornecidos:

```json
{
  "fatosFornecidos": [
    "O objetivo e captar contatos para consultoria nutricional.",
    "A captura deve pedir nome e e-mail."
  ],
  "suposicoesReversiveis": [
    "A experiencia tera de 5 a 7 etapas e durara menos de 3 minutos.",
    "A captura ocorrera depois de uma transicao que explique o valor da analise."
  ],
  "pendenciasBloqueantes": [
    "URL de agendamento ou checkout, caso a etapa final use CTA externo.",
    "Preco e condicoes, caso haja oferta comercial."
  ]
}
```

O JSON acima e um registro de decisao, nao payload de uma tool.

## Decisoes de estrategia

- Comece pela menor sequencia que responde ao objetivo. Nao transforme captura em oferta nem pesquisa em diagnostico comercial sem pedido.
- Organize perguntas da menor para a maior friccao. Perguntas sensiveis, longas ou de contato entram depois de contexto e valor.
- Mantenha uma intencao principal por etapa. Uma etapa pode informar, perguntar, capturar ou encaminhar, mas nao competir por varias decisoes.
- Use personalizacao apenas quando as respostas realmente alteram a mensagem, encaminhamento ou segmentacao declarada.
- Habilite score, gamificacao, efeitos, audio, notificacoes ou estilos locais somente se o brief pedir ou justificar esse mecanismo.
- Trate claims de saude, financeiro, juridico ou resultado individual como conteudo de alto risco: use fatos aprovados e linguagem proporcional.

## Dados que bloqueiam escrita

Pare e esclareca antes de escrever quando faltar:

- o alvo, se houver mais de um funil possivel;
- o texto e as opcoes de uma pergunta que sera substituida;
- a URL de destino, o preco ou as condicoes de uma oferta;
- o consentimento e a finalidade de dados alem do minimo necessario;
- um ativo de marca que o pedido diz ser obrigatorio.

## Medicao responsavel

Associe cada hipotese a poucos indicadores: inicio, conclusao, abandono por etapa, envio consentido e clique no proximo passo. Nao colete campos extras para tornar a analise mais interessante. Revise abandono e erros de formulario antes de concluir que a copy e o problema.

Consulte tambem [blueprints](./blueprints.md), [copy, acessibilidade e etica](./copy-accessibility-and-ethics.md) e [contratos e validacao](./contracts-and-validation.md).

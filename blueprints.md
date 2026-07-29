# Blueprints Flexiveis

Blueprints sao faixas de arquitetura, nao receitas fechadas. Escolha o menor fluxo que resolve o objetivo e adapte-o ao brief, aos kinds permitidos e aos dados realmente disponiveis.

## 1. Captura qualificada

- Objetivo: entender necessidade e obter um contato consentido.
- Faixa de etapas: 4 a 7.
- Componentes: `text`, `button`, `options`, `form` e prova somente quando real e relevante.
- Quando evitar: se a pessoa so pediu uma pesquisa anonima ou uma pagina de destino sem perguntas.

## 2. Qualificacao comercial

- Objetivo: separar perfis para encaminhamento humano ou agenda adequada.
- Faixa de etapas: 5 a 9.
- Componentes: `text`, `options`, `form`, `button` e `result` com proximo passo.
- Quando evitar: se nao ha criterio de qualificacao, equipe de retorno ou destino definido.

## 3. Agendamento consultivo

- Objetivo: preparar a pessoa para uma conversa e direcionar a agenda real.
- Faixa de etapas: 4 a 8.
- Componentes: `text`, `options`, `content`, `form`, `button` e `result`.
- Quando evitar: se a URL de agenda, capacidade ou condicoes do atendimento nao foram fornecidas.

## 4. Diagnostico orientativo

- Objetivo: devolver uma sintese educacional baseada nas respostas e sugerir um proximo passo.
- Faixa de etapas: 6 a 10.
- Componentes: `text`, `options`, `content`, `form` opcional, `level` ou `progressArgument` apenas quando a visualizacao for honesta, `result`.
- Quando evitar: em contexto clinico, juridico ou financeiro que exigiria diagnostico, prognostico ou recomendacao individual nao aprovada.

## 5. Oferta validada

- Objetivo: apresentar uma oferta com condicoes e destino verificaveis.
- Faixa de etapas: 3 a 7, ou uma etapa final apos qualificacao existente.
- Componentes: `text`, `argument`, `pricingCard`, `testimonial`, `faq`, `button` e `countdown` somente para prazo verdadeiro.
- Quando evitar: sem preco, condicoes, prova autorizada, URL real ou justificativa para urgencia.

## 6. Desafio de engajamento

- Objetivo: orientar pequenas acoes recorrentes e registrar progresso declarado.
- Faixa de etapas: 3 a 10, conforme duracao e retorno entre sessao.
- Componentes: `text`, `options`, `button`, `result`; score e efeitos apenas se pedidos.
- Quando evitar: se pontos, recompensas, persistencia ou regras de participacao nao foram definidos.

## 7. Pesquisa e descoberta

- Objetivo: coletar opinioes ou preferencias com baixa friccao.
- Faixa de etapas: 3 a 8.
- Componentes: `text`, `options`, `form` opcional e `button`.
- Quando evitar: se o pedido real e captar ou vender, pois a pesquisa mascara a finalidade e prejudica o consentimento.

## Escolha rapida

| Se o pedido prioriza | Comece por |
|---|---|
| Contato para retorno | Captura qualificada |
| Roteamento de oportunidade | Qualificacao comercial |
| Conversa marcada | Agendamento consultivo |
| Entendimento guiado | Diagnostico orientativo |
| Decisao de compra com dados completos | Oferta validada |
| Acoes repetidas | Desafio de engajamento |
| Aprendizado sem conversao | Pesquisa e descoberta |

Em qualquer blueprint, remova etapas que nao produzam decisao, valor ou informacao necessaria. Consulte [brief e estrategia](./brief-and-strategy.md) antes de escolher a arquitetura.

# Funilix Quiz Skill

Skill para criar, editar e otimizar funis de quiz de conversão na plataforma Funilix usando as tools MCP.

## Instalação

Esta skill ainda está em migração local. A instalação via Skills CLI será documentada após a publicação de uma versão remota validada e autorizada. Não use uma URL ou comando de instalação antes dessa publicação.

## Estrutura

- `SKILL.md` - instruções principais, frontmatter e workflow obrigatório.
- `references/brief-and-strategy.md`, `workflow.md` e `blueprints.md` - descoberta, estratégia e arquiteturas de fluxo.
- `references/theme-system.md` e `header-and-step-architecture.md` - tema global, settings, header, background e exceções por etapa.
- `references/component-selection.md` - catálogo dos 27 componentes públicos, por finalidade e comportamento de tema.
- `references/component-recipes/` - receitas mínimas separadas por entrada, diagnóstico, mídia/layout e prova/conversão.
- `references/gamification.md` - recursos opcionais de gamificação, carregados apenas quando solicitados.
- `references/copy-accessibility-and-ethics.md`, `editing-and-recovery.md` e `contracts-and-validation.md` - qualidade de conteúdo, recuperação e validação.

## Quando Usar

Use esta skill quando o usuário pedir para:

- criar um funil ou quiz na Funilix;
- adicionar, remover ou reorganizar etapas;
- editar componentes e settings;
- montar funis de forma granular, criando etapas antes dos componentes finais;
- ajustar tema global;
- configurar `theme.header` global sem criar header paralelo nas etapas;
- configurar gamificação global, placar, música, efeitos por gatilho e gamificação por etapa;
- usar áudios enviados pelo usuário em música, efeitos, toast ou `audioPlayer`;
- melhorar copy, oferta, diagnóstico ou conversão;
- validar estrutura do funil via blueprint e warnings.

## Requisitos

A skill presume que o agente tenha acesso às tools MCP da Funilix, como:

- `create_blank_funnel`
- `get_quiz_authoring_context`
- `get_theme_schema`
- `list_supported_step_kinds`
- `list_supported_component_types`
- `get_component_schema`
- `list_audio_assets`
- `append_quiz_steps`
- `update_funnel_global_presets`
- `update_funnel_metadata`
- `get_quiz_blueprint`

## Compatibilidade com skills.sh

Este repositório segue o formato esperado pelo ecossistema `skills.sh`:

- `SKILL.md` na raiz;
- frontmatter YAML com `name` e `description`;
- referências em diretório versionado;
- conteúdo auto-contido e sem segredos.

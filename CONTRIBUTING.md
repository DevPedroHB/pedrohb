# Contribuindo

Obrigado por considerar contribuir com este projeto. Este repositório é um monorepo dos pacotes `@pedrohb/*`, usando `pnpm`, Turborepo, Biome, Vitest e Changesets.

## Requisitos

- Node.js `>=26` para trabalhar no workspace.
- `pnpm` `11.13.1`, conforme definido em `package.json`.
- Git.

## Preparando o Ambiente

1. Faça um fork do repositório.
2. Clone o seu fork localmente.
3. Instale as dependências:

```sh
pnpm install
```

4. Crie uma branch a partir da `main`:

```sh
git checkout -b minha-contribuicao
```

## Estrutura do Repositório

- `packages/*`: pacotes publicáveis do workspace, como `@pedrohb/ddd` e `@pedrohb/errors`.
- `configs/*`: pacotes internos de configuração compartilhada.
- `.changeset/*`: configuração e arquivos de versionamento do Changesets.
- `.github/workflows/*`: automações de CI e release.

## Comandos Úteis

- `pnpm build`: compila os pacotes.
- `pnpm test`: executa os testes.
- `pnpm typecheck`: valida os tipos TypeScript.
- `pnpm check`: executa verificações do Biome com correções quando aplicável.
- `pnpm format`: formata o código.
- `pnpm lint`: executa o lint com correções quando aplicável.
- `pnpm changeset`: cria um changeset para alterações que devem gerar release.

Para rodar comandos em um pacote específico, use filtros do `pnpm`. Exemplo:

```sh
pnpm --filter @pedrohb/errors test
```

## Padrões de Código

- Use TypeScript.
- Siga a formatação do Biome configurada no repositório.
- Prefira mudanças pequenas, focadas e fáceis de revisar.
- Mantenha APIs públicas simples e bem tipadas.
- Atualize ou adicione testes quando alterar comportamento.
- Atualize a documentação do pacote quando adicionar, remover ou alterar APIs públicas.

## Antes de Abrir um Pull Request

Rode as mesmas validações principais do CI:

```sh
pnpm exec biome ci .
pnpm typecheck
pnpm test
pnpm build
```

O CI também executa essas etapas em pull requests e em pushes para a `main`.

## Changesets e Releases

Use `pnpm changeset` quando a alteração afetar um pacote publicável e precisar entrar em release.

Ao criar um changeset:

- Selecione apenas os pacotes publicáveis afetados.
- Escolha `patch`, `minor` ou `major` de acordo com o impacto da mudança.
- Escreva uma descrição curta e clara para o changelog.

Não edite versões manualmente, não crie tags e não publique pacotes localmente. O fluxo de release é automatizado pelo Changesets e GitHub Actions após merge na `main`.

Pacotes internos de configuração em `configs/*` são ignorados pelo Changesets e não são publicados.

## Pull Requests

- Descreva o problema e a solução proposta.
- Inclua testes ou explique por que eles não se aplicam.
- Relacione issues relevantes, quando existirem.
- Mantenha o PR focado em uma única mudança lógica.
- Não inclua alterações geradas desnecessárias, como artefatos de build ou arquivos de cache.

## Reportando Problemas

Ao abrir uma issue, inclua:

- O pacote afetado.
- Uma descrição clara do problema.
- Passos para reproduzir.
- Comportamento esperado e comportamento atual.
- Versões relevantes de Node.js, `pnpm` e do pacote, quando aplicável.

## Licença

Ao contribuir, você concorda que sua contribuição será licenciada sob a licença MIT deste repositório.

# @pedrohb/errors

Um sistema de erros tipado para aplicações TypeScript. Defina catálogos imutáveis de códigos, associe mensagens parametrizadas a erros e serialize causas com segurança.

## Instalação

```sh
pnpm add @pedrohb/errors
```

## Catálogo e erros tipados

```ts
import { BaseError, defineErrorCatalog } from "@pedrohb/errors";

const errors = defineErrorCatalog({
  USER_NOT_FOUND: "Usuário {userId} não encontrado.",
  INVALID_CREDENTIALS: "Credenciais inválidas.",
});

class UserNotFoundError extends BaseError<typeof errors, "USER_NOT_FOUND"> {
  public constructor(userId: string, options?: ErrorOptions) {
    super(errors.USER_NOT_FOUND, {
      ...options,
      params: { userId },
    });
  }
}

const error = new UserNotFoundError("user-123");
console.log(error.code, error.message);
```

Os códigos devem estar em `UPPER_SNAKE_CASE`. Os placeholders entre chaves são inferidos pelo TypeScript e usados para tipar os parâmetros da mensagem.

## Serialização

`BaseError` preserva `code`, `message` e parâmetros. `serialize()` retorna uma representação apropriada para logs e transporte; a pilha é omitida por padrão e pode ser incluída chamando `serialize(true)`. Causas nativas, erros da biblioteca, datas, valores não serializáveis por JSON e referências circulares são tratadas pela serialização.

## Resultado `Either`

O pacote também exporta `Either`, `Ok`, `Err`, `ok` e `err` para representar resultados de sucesso ou falha sem lançar exceções. Os métodos `map`, `mapErr`, `flatMap`, `orElse` e `match` permitem compor e consumir esses resultados.

## Imports por subpath

```ts
import { InvalidErrorCode } from "@pedrohb/errors/errors";
import { serializeBaseError } from "@pedrohb/errors/functions";
import type { ErrorCatalog } from "@pedrohb/errors/types";
```

O pacote fornece formatos ESM e CommonJS, com declarações TypeScript correspondentes.

# @pedrohb/errors

Um sistema de erros tipado para aplicações TypeScript. Defina catálogos imutáveis de códigos, associe mensagens parametrizadas a erros e serialize causas com segurança.

## Instalação

```sh
pnpm add @pedrohb/errors
```

```sh
npm install @pedrohb/errors
```

```sh
yarn @pedrohb/errors
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

## Traduções

Para oferecer as mensagens em outros idiomas, crie as traduções com `defineErrorTranslations`. O catálogo continua sendo o idioma padrão e cada idioma deve traduzir **todos** os códigos, usando os mesmos placeholders da mensagem original. Faltar um código, traduzir um código inexistente ou trocar um placeholder gera um erro de tipo (e `InvalidErrorTranslation` em tempo de execução).

```ts
import {
  BaseError,
  defineErrorCatalog,
  type DefaultParamDelimiters,
  defineErrorTranslations,
  type ErrorTranslationLocale,
} from "@pedrohb/errors";

const errors = defineErrorCatalog({
  USER_NOT_FOUND: "Usuário {userId} não encontrado.",
  INVALID_CREDENTIALS: "Credenciais inválidas.",
});

const translations = defineErrorTranslations(errors, {
  en: {
    USER_NOT_FOUND: "User {userId} not found.",
    INVALID_CREDENTIALS: "Invalid credentials.",
  },
  es: {
    USER_NOT_FOUND: "Usuario {userId} no encontrado.",
    INVALID_CREDENTIALS: "Credenciales inválidas.",
  },
});

class UserNotFoundError extends BaseError<
  typeof errors,
  "USER_NOT_FOUND",
  DefaultParamDelimiters,
  ErrorTranslationLocale<typeof translations>
> {
  protected override get translations() {
    return translations;
  }

  public constructor(userId: string, options?: ErrorOptions) {
    super(errors.USER_NOT_FOUND, { ...options, params: { userId } });
  }
}

const error = new UserNotFoundError("user-123");
error.message; // "Usuário user-123 não encontrado."
error.translate("en"); // "User user-123 not found."
error.translate("es"); // "Usuario user-123 no encontrado."
error.translate("fr"); // erro de tipo: "fr" não foi definido
```

`translate` não altera o erro: `message`, `serialize()` e `toJSON()` seguem no idioma do catálogo, e o idioma é escolhido apenas entre os definidos em `translations`. Se a classe não tiver traduções, ou o idioma não existir em tempo de execução, `translate` retorna `message`. Se o erro usa delimitadores personalizados, informe-os também como terceiro argumento de `defineErrorTranslations`.

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

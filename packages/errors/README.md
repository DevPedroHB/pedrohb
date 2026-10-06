# @pedrohb/errors

Um pacote TypeScript para modelar erros de aplicação com códigos tipados, mensagens parametrizadas, traduções e serialização segura. Também inclui `Either` para representar resultados de sucesso ou falha sem depender de exceções.

## Sumário

- [@pedrohb/errors](#pedrohberrors)
  - [Sumário](#sumário)
  - [Instalação](#instalação)
  - [Começando: catálogo e erro tipado](#começando-catálogo-e-erro-tipado)
    - [Uma classe reutilizável para o catálogo](#uma-classe-reutilizável-para-o-catálogo)
  - [Mensagens parametrizadas](#mensagens-parametrizadas)
  - [Criando classes de erro](#criando-classes-de-erro)
  - [Causas e opções do Error](#causas-e-opções-do-error)
  - [Traduções](#traduções)
  - [Delimitadores personalizados](#delimitadores-personalizados)
  - [Type guards e identificação](#type-guards-e-identificação)
  - [Serialização](#serialização)
  - [Resultados com Either](#resultados-com-either)
    - [Criação, leitura e narrowing](#criação-leitura-e-narrowing)
    - [Transformações e composição](#transformações-e-composição)
    - [Extração inválida](#extração-inválida)
  - [API exportada](#api-exportada)
  - [Imports por subpath](#imports-por-subpath)

## Instalação

```sh
pnpm add @pedrohb/errors
```

```sh
npm install @pedrohb/errors
```

```sh
yarn add @pedrohb/errors
```

O pacote oferece builds ESM e CommonJS com declarações de tipos TypeScript.

## Começando: catálogo e erro tipado

Defina os códigos e as mensagens padrão com `defineErrorCatalog`. O catálogo e seus descritores são somente leitura e congelados em runtime. Os códigos devem seguir `UPPER_SNAKE_CASE`.

```ts
import { BaseError, defineErrorCatalog } from "@pedrohb/errors";

const ERROR_CODES = defineErrorCatalog({
  USER_NOT_FOUND: "Usuário '{userId}' não foi encontrado.",
  INVALID_CREDENTIALS: "Credenciais inválidas.",
  METHOD_NOT_IMPLEMENTED: "O método '{method}' não está implementado.",
  INTERNAL_SERVER_ERROR: "Ocorreu um erro interno no servidor.",
});

ERROR_CODES.USER_NOT_FOUND.code; // "USER_NOT_FOUND"
ERROR_CODES.USER_NOT_FOUND.message; // "Usuário '{userId}' não foi encontrado."
```

Cada entrada se torna um descritor com `code` e `message`. Os tipos literais são preservados, permitindo que `BaseError` vincule a instância a um catálogo e a um código específico.

Para um caso simples, crie uma classe para cada código:

```ts
class UserNotFoundError extends BaseError<
  typeof ERROR_CODES,
  "USER_NOT_FOUND"
> {
  public constructor(userId: string, options?: ErrorOptions) {
    super(ERROR_CODES.USER_NOT_FOUND, {
      params: { userId },
      ...options,
    });
  }
}

const error = new UserNotFoundError("user-123");

error.code; // "USER_NOT_FOUND"
error.message; // "Usuário 'user-123' não foi encontrado."
error.name; // "UserNotFoundError"
```

### Uma classe reutilizável para o catálogo

Para evitar uma classe por código, use uma classe genérica que receba o código e as opções. `BaseErrorOptionsArgs` adapta a assinatura: `options` é obrigatório se a mensagem tiver placeholders e opcional se não tiver.

```ts
import {
  BaseError,
  type BaseErrorOptionsArgs,
  type CatalogCode,
} from "@pedrohb/errors";

type ErrorCodes = typeof ERROR_CODES;
type ErrorCode = CatalogCode<ErrorCodes>;

class AppError<Code extends ErrorCode = ErrorCode> extends BaseError<
  ErrorCodes,
  Code
> {
  public constructor(
    code: Code,
    ...args: BaseErrorOptionsArgs<ErrorCodes, Code>
  ) {
    super(ERROR_CODES[code], ...args);
  }
}

const notFound = new AppError("USER_NOT_FOUND", {
  params: { userId: "user-123" },
});

const invalidCredentials = new AppError("INVALID_CREDENTIALS");
```

O parâmetro `Code` mantém o relacionamento entre o código selecionado e os parâmetros exigidos pela mensagem. Códigos inexistentes, parâmetros ausentes ou propriedades adicionais são rejeitados pelo TypeScript:

```ts
// Erro de tipo: falta o parâmetro `userId`.
// new AppError("USER_NOT_FOUND", { params: {} });

// Erro de tipo: `sessionId` não aparece na mensagem desse código.
// new AppError("USER_NOT_FOUND", {
//   params: { userId: "user-123", sessionId: "session-1" },
// });

// Erro de tipo: código fora do catálogo.
// new AppError("ORDER_NOT_FOUND");
```

## Mensagens parametrizadas

Por padrão, placeholders usam chaves: `{nomeDoParametro}`. O pacote extrai seus nomes da mensagem e os usa para inferir os campos obrigatórios de `params`.

```ts
const ERROR_CODES = defineErrorCatalog({
  VALIDATION_FAILED: "O campo '{field}' recebeu o valor '{value}'.",
});

class ValidationError extends BaseError<
  typeof ERROR_CODES,
  "VALIDATION_FAILED"
> {
  public constructor(field: string, value: unknown) {
    super(ERROR_CODES.VALIDATION_FAILED, {
      params: { field, value },
    });
  }
}

const error = new ValidationError("email", "inválido");

error.message; // "O campo 'email' recebeu o valor 'inválido'."
error.params; // { field: "email", value: "inválido" }
```

Um mesmo nome de placeholder pode aparecer mais de uma vez; o parâmetro correspondente continua sendo informado uma única vez. Mensagens sem placeholders não aceitam `params` e não exigem opções.

`BaseErrorOptions<Catalog, Code>` representa o objeto de opções, enquanto `BaseErrorOptionsArgs<Catalog, Code>` representa a tupla de argumentos apropriada para uma assinatura rest:

```ts
import {
  type BaseErrorOptions,
  type BaseErrorOptionsArgs,
} from "@pedrohb/errors";

type UserNotFoundOptions = BaseErrorOptions<
  typeof ERROR_CODES,
  "USER_NOT_FOUND"
>;
type UserNotFoundArgs = BaseErrorOptionsArgs<
  typeof ERROR_CODES,
  "USER_NOT_FOUND"
>;
```

## Criando classes de erro

O construtor de `BaseError` é `protected`: estenda a classe para escolher o descritor e repassar as opções. A assinatura da subclasse pode ser adaptada à API da sua aplicação:

```ts
class MethodNotImplementedError extends BaseError<
  typeof ERROR_CODES,
  "METHOD_NOT_IMPLEMENTED"
> {
  public constructor(method: string, options?: ErrorOptions) {
    super(ERROR_CODES.METHOD_NOT_IMPLEMENTED, {
      params: { method },
      ...options,
    });
  }
}

class InternalServerError extends BaseError<
  typeof ERROR_CODES,
  "INTERNAL_SERVER_ERROR"
> {
  public constructor(options?: ErrorOptions) {
    super(ERROR_CODES.INTERNAL_SERVER_ERROR, options);
  }
}
```

O primeiro construtor recebe o parâmetro necessário separadamente; o segundo mostra que erros sem placeholders podem receber apenas `ErrorOptions` opcionalmente.

## Causas e opções do Error

As opções estendem `ErrorOptions` da plataforma, incluindo `cause`. Assim, erros anteriores ou valores arbitrários podem ser mantidos como causa:

```ts
const databaseError = new Error("Conexão recusada");

const error = new AppError("USER_NOT_FOUND", {
  params: { userId: "user-123" },
  cause: databaseError,
});

error.cause === databaseError; // true
```

`name` recebe o nome da classe concreta e o protótipo é configurado para que `instanceof` funcione nas subclasses.

## Traduções

As mensagens do catálogo são o idioma padrão. `defineErrorTranslations` recebe esse catálogo e as mensagens para cada locale. Cada idioma deve incluir todos os códigos e preservar os nomes dos placeholders. A ordem e a quantidade de ocorrências dos placeholders podem mudar.

```ts
import {
  BaseError,
  type BaseErrorOptionsArgs,
  type CatalogCode,
  type DefaultParamDelimiters,
  defineErrorCatalog,
  defineErrorTranslations,
  type ErrorTranslationLocale,
} from "@pedrohb/errors";

const ERROR_CODES = defineErrorCatalog({
  USER_NOT_FOUND: "Usuário '{userId}' não encontrado.",
  INVALID_CREDENTIALS: "Credenciais inválidas.",
});

const ERROR_TRANSLATIONS = defineErrorTranslations(ERROR_CODES, {
  en: {
    USER_NOT_FOUND: "User '{userId}' not found.",
    INVALID_CREDENTIALS: "Invalid credentials.",
  },
  es: {
    USER_NOT_FOUND: "Usuario '{userId}' no encontrado.",
    INVALID_CREDENTIALS: "Credenciales inválidas.",
  },
});

type ErrorCodes = typeof ERROR_CODES;
type ErrorCode = CatalogCode<ErrorCodes>;
type Locale = ErrorTranslationLocale<typeof ERROR_TRANSLATIONS>;

class LocalizedError<Code extends ErrorCode = ErrorCode> extends BaseError<
  ErrorCodes,
  Code,
  DefaultParamDelimiters,
  Locale
> {
  public constructor(
    code: Code,
    ...args: BaseErrorOptionsArgs<ErrorCodes, Code>
  ) {
    super(ERROR_CODES[code], ...args);
  }

  protected override get translations() {
    return ERROR_TRANSLATIONS;
  }
}

const error = new LocalizedError("USER_NOT_FOUND", {
  params: { userId: "user-123" },
});

error.message; // "Usuário 'user-123' não encontrado."
error.translate("en"); // "User 'user-123' not found."
error.translate("es"); // "Usuario 'user-123' no encontrado."
// error.translate("fr"); // Erro de tipo: locale não declarado.
```

`ErrorTranslationLocale<typeof ERROR_TRANSLATIONS>` deriva a união dos locales disponíveis. O tipo `Locale` da classe deve corresponder ao getter `translations`.

Chamar `translate(locale)` produz uma mensagem traduzida e interpolada sem alterar `message`, `serialize()` ou `toJSON()`. Se a tradução não estiver disponível em runtime, o método retorna a mensagem padrão. Sem o getter de traduções, a instância não oferece locales aceitos pelo tipo.

As traduções também são cópias imutáveis. Em runtime, definições com traduções ausentes, códigos desconhecidos ou placeholders diferentes lançam `InvalidErrorTranslation`; delimitadores inválidos podem lançar `InvalidParamDelimitersError`.

## Delimitadores personalizados

É possível usar delimitadores diferentes de `{` e `}`. Passe o mesmo objeto ao terceiro argumento de `defineErrorTranslations` e às opções de `BaseError` (ou use-o como terceiro parâmetro genérico da classe):

```ts
import {
  BaseError,
  type BaseErrorOptionsArgs,
  type CatalogCode,
  defineErrorCatalog,
  defineErrorTranslations,
  type ErrorParamDelimiters,
  type ErrorTranslationLocale,
} from "@pedrohb/errors";

const delimiters = {
  open: "<",
  close: ">",
} as const satisfies ErrorParamDelimiters;

const CODES = defineErrorCatalog({
  RESOURCE_NOT_FOUND: "Recurso <resource> não encontrado no tenant <tenant>.",
  OPERATION_FAILED: "A operação falhou.",
});

const TRANSLATIONS = defineErrorTranslations(
  CODES,
  {
    en: {
      RESOURCE_NOT_FOUND:
        "Resource <resource> was not found in tenant <tenant>.",
      OPERATION_FAILED: "The operation failed.",
    },
  },
  delimiters,
);

type Codes = typeof CODES;
type Code = CatalogCode<Codes>;
type Locale = ErrorTranslationLocale<typeof TRANSLATIONS>;

class ResourceError<ErrorCode extends Code = Code> extends BaseError<
  Codes,
  ErrorCode,
  typeof delimiters,
  Locale
> {
  public constructor(
    code: ErrorCode,
    ...args: BaseErrorOptionsArgs<Codes, ErrorCode, typeof delimiters>
  ) {
    super(CODES[code], ...args);
  }

  protected override get translations() {
    return TRANSLATIONS;
  }
}

const error = new ResourceError("RESOURCE_NOT_FOUND", {
  params: { resource: "invoice-8", tenant: "acme" },
});

error.message; // "Recurso invoice-8 não encontrado no tenant acme."
error.translate("en"); // "Resource invoice-8 was not found in tenant acme."
```

`ErrorParamDelimiters` tipa o objeto `{ open, close }`. Delimitadores personalizados também são usados para validar os placeholders das traduções.

## Type guards e identificação

`BaseError.is(value)` identifica erros derivados de `BaseError` usando uma marca interna. O type guard é útil ao tratar valores `unknown` e funciona mesmo quando há mais de uma cópia do pacote carregada:

```ts
function inspectError(value: unknown) {
  if (BaseError.is(value)) {
    return {
      code: value.code,
      message: value.message,
      serialized: value.serialize(),
    };
  }

  return undefined;
}
```

Uma classe própria também pode oferecer um guard mais restrito:

```ts
class AppError<Code extends ErrorCode = ErrorCode> extends BaseError<
  ErrorCodes,
  Code
> {
  // ...construtor

  public static is(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}
```

## Serialização

`serialize()` retorna um objeto simples com `code`, `message` e `name`. Inclui `params` e `cause` quando disponíveis. O stack trace é omitido por padrão; use `serialize(true)` para incluí-lo. `JSON.stringify` chama `toJSON()` automaticamente, que equivale a `serialize()` sem stack trace.

```ts
const error = new AppError("USER_NOT_FOUND", {
  params: { userId: "user-123" },
  cause: new Error("Registro ausente no banco de dados"),
});

const plainObject = error.serialize();
const objectWithStack = error.serialize(true);
const json = JSON.stringify(error); // sem stack trace
```

As causas e os parâmetros passam por uma serialização segura que trata erros nativos e da biblioteca, datas, arrays, objetos, funções, `bigint`, `symbol` e referências circulares. Para serializar isoladamente o valor de uma causa, use `BaseError.serializeCauseError(cause, includeStack?)`.

## Resultados com Either

`Either<OkValue, ErrValue>` representa uma operação com dois resultados possíveis sem lançar exceções para comunicar falhas. Use `ok` e `err` para criar os valores; os métodos de transformação retornam novos `Either` e não modificam a instância original.

```ts
import { type Either, err, ok } from "@pedrohb/errors";

function divide(a: number, b: number): Either<number, string> {
  return b === 0 ? err("Divisão por zero") : ok(a / b);
}

const message = divide(10, 2)
  .map((result) => result * 3)
  .match({
    onOk: (value) => `Resultado: ${value}`,
    onErr: (error) => `Falha: ${error}`,
  });

message; // "Resultado: 15"
```

### Criação, leitura e narrowing

`ok<O, E>(value)` e `err<O, E>(value)` retornam o tipo união `Either<O, E>`. Informe os genéricos quando não puderem ser inferidos do contexto, por exemplo, `ok<number, string>(42)`. Quando há um tipo de retorno explícito, TypeScript pode inferi-los:

```ts
function parseCount(input: string): Either<number, string> {
  const value = Number(input);

  return Number.isNaN(value) ? err("Valor inválido") : ok(value);
}

const success = ok<number, string>(42);

success.tag; // "Ok"
success.unwrap(); // 42

const failure = err<number, string>("Não encontrado");

failure.tag; // "Err"
failure.unwrapErr(); // "Não encontrado"
```

`isOk()` e `isErr()` funcionam como type guards. `match` chama exatamente o handler da variante presente e combina os dois caminhos em um único valor:

```ts
function describe(result: Either<number, string>): string {
  if (result.isOk()) {
    return `Sucesso: ${result.unwrap()}`;
  }

  return `Falha: ${result.unwrapErr()}`;
}

const text = failure.match({
  onOk: (value) => `Sucesso: ${value}`,
  onErr: (error) => `Falha: ${error}`,
});
```

### Transformações e composição

| Método            | Aplica a função em                                 | Preserva                       |
| ----------------- | -------------------------------------------------- | ------------------------------ |
| `map(fn)`         | valor de sucesso (`Ok`)                            | erro (`Err`)                   |
| `mapErr(fn)`      | valor de erro (`Err`)                              | sucesso (`Ok`)                 |
| `flatMap(fn)`     | valor de sucesso (`Ok`), encadeando outro `Either` | erro anterior                  |
| `orElse(fn)`      | valor de erro (`Err`), tentando recuperação        | sucesso (`Ok`)                 |
| `match(handlers)` | handler da variante atual                          | retorna o resultado do handler |

```ts
const doubled = ok<number, string>(2)
  .map((value) => value * 2)
  .unwrap(); // 4

const errorLength = err<number, string>("falhou")
  .mapErr((error) => error.length)
  .unwrapErr(); // 7

function toNumber(input: string): Either<number, string> {
  const value = Number(input);
  return Number.isNaN(value) ? err("Não é número") : ok(value);
}

const parsed = ok<string, string>("42").flatMap(toNumber).unwrap(); // 42

const recovered = err<number, string>("cache miss")
  .orElse(() => ok(0))
  .unwrap(); // 0
```

`flatMap` une os tipos de erro dos passos encadeados (`E | E2`); `orElse` une os tipos de sucesso (`O | O2`). Exceções lançadas pelas funções passadas a `map`, `mapErr`, `flatMap` ou `orElse` não são capturadas pelo `Either`.

### Extração inválida

`unwrap()` em um `Err` ou `unwrapErr()` em um `Ok` lança `EitherUnwrapError`. A causa (`cause`) contém o valor disponível na variante, independentemente de ser uma instância de `Error`:

```ts
import { EitherUnwrapError } from "@pedrohb/errors";

try {
  err<number, string>("falhou").unwrap();
} catch (error) {
  if (error instanceof EitherUnwrapError) {
    error.message; // "Chamado unwrap() em Err."
    error.cause; // "falhou"
  }
}
```

Prefira `match` ou os type guards quando ambos os casos precisam ser tratados explicitamente. Use `unwrap` quando a extração direta fizer sentido no fluxo e o caso incompatível representar uma falha excepcional.

As classes `Ok` e `Err` também podem ser construídas diretamente com `Ok.create<O, E>(value)` e `Err.create<O, E>(value)`. Seus construtores são protegidos; as funções `ok` e `err` são a forma recomendada para a maioria dos usos.

## API exportada

O ponto de entrada principal exporta:

- **Erros:** `BaseError`, `BaseErrorOptions`, `BaseErrorOptionsArgs`.
- **Catálogos e tipos:** `defineErrorCatalog`, `CatalogCode`, `ErrorCatalog`, `ErrorDescriptor`.
- **Traduções e tipos:** `defineErrorTranslations`, `ErrorTranslationLocale`, `ErrorTranslations`.
- **Placeholders:** `DefaultParamDelimiters`, `ErrorParamDelimiters`, `ErrorParams`.
- **Resultados:** `Either`, `Ok`, `Err`, `ok`, `err`, `EitherUnwrapError`.
- **Utilitários e erros específicos:** exports de `errors`, `functions` e `types`.

## Imports por subpath

Para importar diretamente grupos específicos da API:

```ts
import { InvalidErrorCode } from "@pedrohb/errors/errors";
import { serializeBaseError } from "@pedrohb/errors/functions";
import type { ErrorCatalog } from "@pedrohb/errors/types";
```

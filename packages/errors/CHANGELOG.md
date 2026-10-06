# @pedrohb/errors

## 1.1.0

### Minor Changes

- 2604b3f: Adiciona traduções de mensagens de erro: `defineErrorTranslations` cria traduções imutáveis e validadas (códigos e placeholders) para um catálogo, e `BaseError.translate(locale)` retorna a mensagem interpolada no idioma escolhido. Também adiciona `InvalidErrorTranslation`, `extractPlaceholderNames` e os tipos `ErrorTranslations`, `ErrorTranslationMessages`, `ErrorTranslationLocale` e `ValidateErrorTranslations`. `BaseError` ganha o parâmetro de tipo `Locale`, e `serializeBaseError` passa a aceitar `Readonly<BaseError>`.

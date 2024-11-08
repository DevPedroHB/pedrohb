# 🚀 PedroHB

Bem-vindo ao repositório do portfólio PedroHB! Este monorepo é organizado com Turborepo e contém dois aplicativos principais: a API e o front-end Web, projetados para uma integração eficiente e flexível.

## 🔥 Funcionalidades

### 🌐 API

A API está organizada em módulos para facilitar a integração e o uso de seus recursos. Abaixo, listamos as principais funcionalidades atualmente implementadas e futuras adições.

#### 👤 Conta (Account)

- [x] Deve ser possível criar um usuário;
- [x] Deve ser possível obter o usuário pelo ID;
- [x] Deve ser possível obter o usuário pelo email;
- [x] Deve ser possível buscar a conta com o usuário pelo ID da conta do provedor;
- [ ] Deve ser possível atualizar um usuário; updateUser(user)
- [ ] Deve ser possível excluir um usuário; deleteUser(userId)
- [ ] Deve ser possível criar uma conta e vinculá-la ao usuário; linkAccount(account)
- [ ] Deve ser possível excluir uma conta pelo ID da conta do provedor e desvinculá-la do usuário; unlinkAccount(providerAccountId)
- [ ] Deve ser possível criar uma sessão; createSession(session)
- [ ] Deve ser possível obter a sessão com o usuário pelo token da sessão; getSessionAndUser(sessionToken)
- [ ] Deve ser possível atualizar uma sessão; updateSession(session)
- [ ] Deve ser possível excluir uma sessão pelo token da sessão; deleteSession(sessionToken)
- [ ] Deve ser possível criar um token de verificação; createVerificationToken(verificationToken)
- [ ] Deve ser possível usar o token de verificação; useVerificationToken(params)
- [ ] Deve ser possível obter a conta pelo ID da conta do provedor e pelo provedor; getAccount(providerAccountId, provider)
- [ ] Deve ser possível obter o autenticador pelo ID da credencial; getAuthenticator(credentialID)
- [ ] Deve ser possível criar um autenticador; createAuthenticator(authenticator)
- [ ] Deve ser possível buscar todos os autenticadores de um usuário; listAuthenticatorsByUserId(userId)
- [ ] Deve ser possível atualizar o contador do autenticador pelo ID da credencial; updateAuthenticatorCounter(credentialID newCounter)

### 🖥️ WEB

A aplicação Web é a interface de usuário para interação com os recursos e funcionalidades disponibilizados pela API.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ❤️ por Pedro Henrique Bérgamo 🚀 [Nunca pare de aprender!](https://github.com/DevPedroHB)

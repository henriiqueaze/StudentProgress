# StudentProgress

<p align="center">
  <img src="frontend/public/student-progress-logo.png" alt="StudentProgress Logo" width="260">
</p>

**StudentProgress** é uma aplicação completa para gerenciamento e acompanhamento de alunos. O repositório reúne o frontend em React e a API em Spring Boot, com autenticação, cadastro de estudantes, atualização de notas, métricas acadêmicas e documentação da API.

## Visão geral

- Frontend em [frontend](frontend) com React, TypeScript e Vite.
- Backend em [backend](backend) com Spring Boot, MySQL e Flyway.
- Logo centralizada em `frontend/public/student-progress-logo.png`.

## Como executar

### Backend

1. Configure as variáveis de ambiente do banco e do CORS.
2. Crie o banco `student_progress` no MySQL.
3. Entre na pasta `backend` e rode:

```bash
./mvnw clean package
./mvnw spring-boot:run
```

### Frontend

1. Entre na pasta `frontend`.
2. Instale as dependências e inicie a interface:

```bash
npm install
npm run dev
```

## Variáveis principais

- Backend: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `CORS_ALLOWED_ORIGINS`.
- Frontend: `VITE_API_BASE_URL`.

## Documentação útil

- [README do frontend](frontend/README.md)
- [README do backend](backend/README.md)

## Estrutura do projeto

```text
StudentProgress/
├── backend/
└── frontend/
```
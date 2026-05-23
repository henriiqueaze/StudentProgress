# StudentProgress API

<p align="center">
  <img src="../frontend/public/student-progress-logo.png" alt="StudentProgress Logo" width="260">
</p>

API REST do projeto **StudentProgress**, desenvolvida com Spring Boot para cadastro, consulta, atualização e acompanhamento de estudantes. A aplicação também oferece autenticação, cálculo de médias, filtros por status e documentação interativa.

## Funcionalidades

- Cadastro, consulta, atualização e remoção de alunos.
- Atualização parcial de informações.
- Cálculo automático de média por aluno.
- Filtro por status acadêmico.
- Paginação e ordenação nos listamentos.
- Autenticação com JWT.
- Migrações de banco com Flyway.
- Documentação Swagger/OpenAPI.

## Tecnologias

- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- MySQL
- Flyway
- HATEOAS
- Docker e Docker Compose

## Requisitos

- Java 17.
- Maven ou o wrapper `mvnw`.
- MySQL disponível localmente ou em ambiente remoto.

## Variáveis de ambiente

O backend lê a configuração principal por variáveis de ambiente:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `CORS_ALLOWED_ORIGINS`
- `JWT_SECRET` opcional
- `JWT_EXPIRATION` opcional

Exemplo:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/student_progress?useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=senha
CORS_ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=student-progress-development-secret-key-please-change-32chars
JWT_EXPIRATION=86400000
```

## Como executar

### Com Maven

```bash
./mvnw clean package
./mvnw spring-boot:run
```

### Com Docker Compose

```bash
docker-compose up --build
```

## Banco de dados

Antes de subir a aplicação, crie o schema no MySQL:

```sql
CREATE DATABASE student_progress;
```

As migrações ficam em `src/main/resources/db/migration` e são aplicadas automaticamente pelo Flyway.

## Documentação

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Endpoints principais

- `GET /student/{id}`: busca um aluno por id.
- `GET /student`: lista alunos com paginação e ordenação.
- `POST /student`: cadastra um novo aluno.
- `PUT /student`: atualiza um aluno.
- `PATCH /student/{id}`: atualiza parcialmente um aluno.
- `DELETE /student/{id}`: remove um aluno.
- `GET /student/average/{id}`: retorna a média do aluno.
- `GET /student/filter/{status}`: filtra alunos por status.

## Estrutura principal

- `src/main/java/.../controllers`: camada de entrada da API.
- `src/main/java/.../services`: regras de negócio.
- `src/main/java/.../model`: entidades e enums.
- `src/main/java/.../transfer`: DTOs.
- `src/main/resources/db/migration`: scripts do Flyway.

## Contato

Projeto mantido por Henrique Azevedo. Para suporte ou contribuições, use os canais já indicados no projeto.

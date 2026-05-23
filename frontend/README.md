# StudentProgress Frontend

<p align="center">
  <img src="public/student-progress-logo.png" alt="StudentProgress Logo" width="260">
</p>

Interface web do projeto **StudentProgress**, construída com React, TypeScript, Vite e Tailwind. O app concentra autenticação, cadastro de alunos, atualização parcial de notas, listagem e métricas acadêmicas em uma experiência única.

## Funcionalidades

- Autenticação com login e cadastro de usuários.
- Cadastro completo de alunos.
- Atualização parcial de dados e notas.
- Listagem paginada com filtros.
- Cálculo de médias e indicadores acadêmicos.
- Tratamento de sessões com token e logout em caso de acesso inválido.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Ant Design

## Pré-requisitos

- Node.js 20 ou superior.
- Backend do StudentProgress disponível localmente ou em ambiente remoto.

## Configuração

Se precisar apontar o front para uma API diferente da padrão, crie um arquivo `.env` na raiz do frontend:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Scripts

Na pasta `frontend`:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Como executar

1. Instale as dependências.
2. Inicie o backend.
3. Execute `npm run dev`.
4. Acesse a aplicação no endereço exibido pelo Vite.

## Estrutura principal

- `src/App.tsx`: composição principal da aplicação.
- `src/components/`: componentes de interface.
- `src/utils/`: helpers de formatação e transformação.
- `public/student-progress-logo.png`: logo usada no projeto.

## Observações

- O build é feito com TypeScript e Vite.
- O frontend consome a API do backend via `VITE_API_BASE_URL`.

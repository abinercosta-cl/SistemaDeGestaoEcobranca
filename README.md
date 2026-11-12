# Sistema de Gestão — Estúdio Zênite Fotografia (Fase 1)

Next.js (App Router) + TypeScript + Tailwind + Prisma (SQLite) + JWT (`jose`) em cookie HTTP-Only.
Escopo e diretrizes: ver `CLAUDE.md`.

## Rodando localmente

```bash
npm install            # instala dependências e gera o Prisma Client
cp .env.example .env   # só na primeira vez; gere um JWT_SECRET próprio
npm run db:migrate     # aplica as migrations (cria prisma/dev.db)
npm run db:seed        # cria usuário de teste e produtos de exemplo
npm run dev            # http://localhost:3000
```

Login de teste: `admin@zenite.local` / `zenite123`

## Outros comandos

| Comando              | O que faz                                     |
| -------------------- | --------------------------------------------- |
| `npm run db:migrate` | Cria/aplica migration após mudar o schema     |
| `npm run db:reset`   | Apaga o banco, reaplica migrations e o seed   |
| `npm run db:studio`  | Abre o Prisma Studio para ver os dados        |
| `npm run build`      | Build de produção                             |
| `npm run lint`       | ESLint                                        |

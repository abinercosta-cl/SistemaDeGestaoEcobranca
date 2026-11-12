// Seed de desenvolvimento: cria um usuário admin de teste e um catálogo de
// produtos de exemplo por tipo de evento. Pode ser rodado várias vezes.
//
//   npm run db:seed
//
// Login de teste:  admin@zenite.local  /  zenite123

import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, TipoEvento } from "../lib/generated/prisma/client";
import { gerarHashSenha } from "../lib/auth/senha";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
});

const ADMIN = {
  nome: "Administrador",
  email: "admin@zenite.local",
  senha: "zenite123",
};

// Preços em centavos (R$ 1.500,00 => 150000)
const PRODUTOS: {
  nome: string;
  descricao: string;
  precoCentavos: number;
  tipoEvento: TipoEvento;
}[] = [
  // Formatura
  {
    nome: "Pacote Formatura Básico",
    descricao: "Cobertura da colação de grau + 30 fotos tratadas em arquivo digital",
    precoCentavos: 45000,
    tipoEvento: TipoEvento.Formatura,
  },
  {
    nome: "Pacote Formatura Completo",
    descricao: "Colação + baile, 80 fotos tratadas e álbum impresso 20x30",
    precoCentavos: 120000,
    tipoEvento: TipoEvento.Formatura,
  },
  {
    nome: "Foto de Turma",
    descricao: "Foto oficial da turma impressa em 30x40",
    precoCentavos: 8000,
    tipoEvento: TipoEvento.Formatura,
  },
  // Casamento
  {
    nome: "Pacote Casamento Essencial",
    descricao: "Cerimônia + recepção (6h), 300 fotos tratadas em arquivo digital",
    precoCentavos: 350000,
    tipoEvento: TipoEvento.Casamento,
  },
  {
    nome: "Pacote Casamento Premium",
    descricao: "Making of + cerimônia + recepção, 500 fotos e álbum de luxo",
    precoCentavos: 650000,
    tipoEvento: TipoEvento.Casamento,
  },
  {
    nome: "Ensaio Pré-Casamento",
    descricao: "Ensaio externo de 2h com 40 fotos tratadas",
    precoCentavos: 90000,
    tipoEvento: TipoEvento.Casamento,
  },
  // 15 anos
  {
    nome: "Pacote 15 Anos Festa",
    descricao: "Cobertura da festa (5h), 250 fotos tratadas em arquivo digital",
    precoCentavos: 280000,
    tipoEvento: TipoEvento.QuinzeAnos,
  },
  {
    nome: "Book 15 Anos",
    descricao: "Ensaio em estúdio + externo, 50 fotos tratadas",
    precoCentavos: 120000,
    tipoEvento: TipoEvento.QuinzeAnos,
  },
  {
    nome: "Álbum 15 Anos 30x30",
    descricao: "Álbum impresso com 30 lâminas",
    precoCentavos: 75000,
    tipoEvento: TipoEvento.QuinzeAnos,
  },
];

async function main() {
  const senhaHash = await gerarHashSenha(ADMIN.senha);
  await prisma.usuario.upsert({
    where: { email: ADMIN.email },
    update: { nome: ADMIN.nome, senhaHash },
    create: { nome: ADMIN.nome, email: ADMIN.email, senhaHash },
  });
  console.log(`✔ Usuário de teste: ${ADMIN.email} / ${ADMIN.senha}`);

  let criados = 0;
  for (const produto of PRODUTOS) {
    const existente = await prisma.produto.findFirst({
      where: { nome: produto.nome, tipoEvento: produto.tipoEvento },
    });
    if (!existente) {
      await prisma.produto.create({ data: produto });
      criados++;
    }
  }
  console.log(`✔ Produtos de exemplo: ${criados} criados, ${PRODUTOS.length - criados} já existiam`);
}

main()
  .catch((erro) => {
    console.error("Falha ao rodar o seed:", erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

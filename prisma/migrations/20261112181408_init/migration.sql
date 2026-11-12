-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "local" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "clienteId" INTEGER NOT NULL,
    CONSTRAINT "Evento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "precoCentavos" INTEGER NOT NULL,
    "tipoEvento" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "protocolo" TEXT NOT NULL,
    "valorTotalCentavos" INTEGER NOT NULL,
    "fechadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    CONSTRAINT "Contrato_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrato_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContratoItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "valorUnitarioCentavos" INTEGER NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    CONSTRAINT "ContratoItem_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContratoItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cobranca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valorCentavos" INTEGER NOT NULL,
    "formaPagamento" TEXT NOT NULL DEFAULT 'Pix',
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "pagoEm" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "contratoId" INTEGER NOT NULL,
    CONSTRAINT "Cobranca_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Cliente_nome_idx" ON "Cliente"("nome");

-- CreateIndex
CREATE INDEX "Evento_clienteId_idx" ON "Evento"("clienteId");

-- CreateIndex
CREATE INDEX "Evento_data_idx" ON "Evento"("data");

-- CreateIndex
CREATE INDEX "Produto_tipoEvento_ativo_idx" ON "Produto"("tipoEvento", "ativo");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_protocolo_key" ON "Contrato"("protocolo");

-- CreateIndex
CREATE INDEX "Contrato_clienteId_idx" ON "Contrato"("clienteId");

-- CreateIndex
CREATE INDEX "Contrato_eventoId_idx" ON "Contrato"("eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "ContratoItem_contratoId_produtoId_key" ON "ContratoItem"("contratoId", "produtoId");

-- CreateIndex
CREATE INDEX "Cobranca_contratoId_idx" ON "Cobranca"("contratoId");

-- CreateIndex
CREATE INDEX "Cobranca_status_idx" ON "Cobranca"("status");

-- CreateIndex
CREATE INDEX "Cobranca_pagoEm_idx" ON "Cobranca"("pagoEm");

-- CreateEnum
CREATE TYPE "public"."DemandType" AS ENUM ('DIAGNOSTICO', 'MANUTENCAO', 'CONFIGURACAO', 'INSTALACAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."DemandStatus" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "public"."DemandPriority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'CONSULTOR', 'ATENDENTE');

-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('ANALISE', 'CONFIGURACAO', 'MANUTENCAO', 'COMUNICACAO', 'RESOLUCAO');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'ATENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Provider" (
    "id" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Demand" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "public"."DemandType" NOT NULL,
    "status" "public"."DemandStatus" NOT NULL DEFAULT 'PENDENTE',
    "prioridade" "public"."DemandPriority" NOT NULL DEFAULT 'BAIXA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "providerId" TEXT NOT NULL,
    "atendenteId" TEXT,

    CONSTRAINT "Demand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Action" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "public"."ActionType" NOT NULL,
    "executadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "demandId" TEXT NOT NULL,
    "tecnicoId" TEXT,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_email_key" ON "public"."Provider"("email");

-- CreateIndex
CREATE INDEX "Provider_nomeFantasia_idx" ON "public"."Provider"("nomeFantasia");

-- CreateIndex
CREATE INDEX "Demand_providerId_idx" ON "public"."Demand"("providerId");

-- CreateIndex
CREATE INDEX "Demand_status_idx" ON "public"."Demand"("status");

-- CreateIndex
CREATE INDEX "Demand_tipo_idx" ON "public"."Demand"("tipo");

-- CreateIndex
CREATE INDEX "Demand_prioridade_idx" ON "public"."Demand"("prioridade");

-- CreateIndex
CREATE INDEX "Action_demandId_idx" ON "public"."Action"("demandId");

-- CreateIndex
CREATE INDEX "Action_tipo_idx" ON "public"."Action"("tipo");

-- AddForeignKey
ALTER TABLE "public"."Demand" ADD CONSTRAINT "Demand_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Demand" ADD CONSTRAINT "Demand_atendenteId_fkey" FOREIGN KEY ("atendenteId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Action" ADD CONSTRAINT "Action_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "public"."Demand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Action" ADD CONSTRAINT "Action_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

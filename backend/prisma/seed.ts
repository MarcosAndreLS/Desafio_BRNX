import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando seed...");

  const saltRounds = 10;
  const senhaPadrao = "123456";

  // Hasheie as senhas antes de criar os usuários
  const hashedPasswordAdmin = await bcrypt.hash(senhaPadrao, saltRounds);
  const hashedPasswordConsultor = await bcrypt.hash(senhaPadrao, saltRounds);

  // cria usuários básicos
  await prisma.user.createMany({
    data: [
      {
        name: "Administrador",
        email: "admin@teste.com",
        password: hashedPasswordAdmin, // em produção deve ser hasheada
        role: "ADMIN",
      },
      {
        name: "Consultor João",
        email: "joao@teste.com",
        password: hashedPasswordConsultor,
        role: "CONSULTOR",
      },
    ],
    skipDuplicates: true,
  });

  // lista de provedores fictícios
  const provedores = [
    { nomeFantasia: "Tech Solutions", responsavel: "Maria Silva", email: "contato@tech.com", telefone: "11999990001" },
    { nomeFantasia: "HealthCare Plus", responsavel: "Carlos Souza", email: "suporte@health.com", telefone: "11999990002" },
    { nomeFantasia: "EducaWeb", responsavel: "Ana Pereira", email: "contato@educa.com", telefone: "11999990003" },
    { nomeFantasia: "AgroData", responsavel: "João Oliveira", email: "atendimento@agro.com", telefone: "11999990004" },
    { nomeFantasia: "BuildSoft", responsavel: "Fernanda Lima", email: "contato@build.com", telefone: "11999990005" },
  ];

  for (const prov of provedores) {
    const provider = await prisma.provider.create({
      data: prov,
    });

    // cria 3 demandas por provedor
    for (let i = 1; i <= 3; i++) {
      const demand = await prisma.demand.create({
        data: {
          titulo: `Demanda ${i} - ${provider.nomeFantasia}`,
          descricao: `Descrição da demanda ${i} para ${provider.nomeFantasia}`,
          tipo: i % 2 === 0 ? "MANUTENCAO" : "CONFIGURACAO", 
          status: i % 2 === 0 ? "EM_ANDAMENTO" : "PENDENTE",
          prioridade: i % 3 === 0 ? "ALTA" : "MEDIA",
          providerId: provider.id,
        },
      });

      // cria 2 a 3 ações por demanda
      const qtdAcoes = Math.floor(Math.random() * 2) + 2; // gera 2 ou 3
      for (let j = 1; j <= qtdAcoes; j++) {
        await prisma.action.create({
          data: {
            descricao: `Ação ${j} da demanda ${demand.titulo}`,
            tipo: j % 2 === 0 ? "ANALISE" : "RESOLUCAO",
            demandId: demand.id,
          },
        });
      }
    }
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
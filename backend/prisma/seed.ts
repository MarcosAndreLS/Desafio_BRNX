import { PrismaClient, UserRole } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando seed...");

  const saltRounds = 10;
  const senhaPadrao = "123456";

  // Hasheie a senha padrão uma única vez para todos os usuários
  const hashedPassword = await bcrypt.hash(senhaPadrao, saltRounds);

  // Remova os dados existentes para evitar duplicação em cada execução
  // Esta etapa é opcional, mas recomendada para ter um estado limpo
  await prisma.action.deleteMany();
  await prisma.demand.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();

  // 1. CRIE OS ATENDENTES E CONSULTORES
  // =========================================================================
  const atendentesData = [
    { name: "Atendente Alice", email: "alice@atendente.com", password: hashedPassword, role: UserRole.ATENDENTE },
    { name: "Atendente Bob", email: "bob@atendente.com", password: hashedPassword, role: UserRole.ATENDENTE },
    { name: "Atendente Carol", email: "carol@atendente.com", password: hashedPassword, role: UserRole.ATENDENTE },
  ];

  const consultoresData = [
    { name: "Consultor Carlos", email: "carlos@consultor.com", password: hashedPassword, role: UserRole.CONSULTOR },
    { name: "Consultor Daniel", email: "daniel@consultor.com", password: hashedPassword, role: UserRole.CONSULTOR },
    { name: "Consultor Eduardo", email: "eduardo@consultor.com", password: hashedPassword, role: UserRole.CONSULTOR },
  ];

  const [alice, bob, carol] = await prisma.user.createManyAndReturn({ data: atendentesData, skipDuplicates: true });
  const [carlos, daniel, eduardo] = await prisma.user.createManyAndReturn({ data: consultoresData, skipDuplicates: true });
  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@teste.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    select: { id: true }
  });

  const atendenteIds = [alice.id, bob.id, carol.id];
  const consultorIds = [carlos.id, daniel.id, eduardo.id];
  
  // 2. CRIE OS PROVEDORES E DEMANDAS, VINCULANDO-AS AOS ATENDENTES
  // =========================================================================
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

    // cria 3 demandas por provedor, atribuindo a um atendente aleatório
    for (let i = 1; i <= 3; i++) {
      const randomAtendenteId = atendenteIds[Math.floor(Math.random() * atendenteIds.length)];

      const demand = await prisma.demand.create({
        data: {
          titulo: `Demanda ${i} - ${provider.nomeFantasia}`,
          descricao: `Descrição da demanda ${i} para ${provider.nomeFantasia}`,
          tipo: i % 2 === 0 ? "MANUTENCAO" : "CONFIGURACAO",
          status: i % 2 === 0 ? "EM_ANDAMENTO" : "PENDENTE",
          prioridade: i % 3 === 0 ? "ALTA" : "MEDIA",
          providerId: provider.id,
          atendenteId: randomAtendenteId, // ATRIBUI O ATENDENTE AQUI
        },
      });

      // 3. CRIE AS AÇÕES, VINCULANDO-AS AOS CONSULTORES
      // =========================================================================
      // Cria 2 a 3 ações por demanda, atribuindo a um consultor aleatório
      const qtdAcoes = Math.floor(Math.random() * 2) + 2; // gera 2 ou 3
      for (let j = 1; j <= qtdAcoes; j++) {
        const randomConsultorId = consultorIds[Math.floor(Math.random() * consultorIds.length)];

        await prisma.action.create({
          data: {
            descricao: `Ação ${j} da demanda ${demand.titulo}`,
            tipo: j % 2 === 0 ? "ANALISE" : "RESOLUCAO",
            demandId: demand.id,
            tecnicoId: randomConsultorId, // ATRIBUI O CONSULTOR AQUI
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
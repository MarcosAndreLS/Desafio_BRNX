# BRNX NetControl

# Introdução

Este documento descreve o desenvolvimento de uma aplicação interna para a gestão de demandas técnicas de provedores de internet (ISPs), atendidos por uma consultoria especializada em redes de computadores.  

Atualmente, os registros de solicitações desses provedores são realizados de forma informal, utilizando planilhas e e-mails, o que dificulta o acompanhamento do histórico, o controle de status e a documentação das ações realizadas. Essa falta de centralização gera problemas de organização e impacta a eficiência da equipe.  

O objetivo do sistema é **centralizar e padronizar a gestão das demandas**, permitindo que qualquer membro da consultoria possa:

- Cadastrar provedores atendidos;
- Registrar novas demandas técnicas associadas a cada provedor;
- Atualizar o status das solicitações;
- Documentar as ações realizadas;
- Consultar todo o histórico de atividades de forma rápida e clara.  

A aplicação será composta por **backend e frontend**, oferecendo uma interface intuitiva para os usuários internos e garantindo integração eficiente com o banco de dados. Embora haja liberdade para escolha das tecnologias, foi utilizado **Node.js com TypeScript** no backend, **React** no frontend e **PostgreSQL** como banco de dados, com suporte a **Docker e Docker Compose** para padronização do ambiente.  

Este documento servirá como guia de desenvolvimento, apresentando as principais decisões técnicas, a arquitetura da solução e os pontos relevantes para a implementação.

# Como rodar o projeto

Este projeto utiliza **Docker** e **Docker Compose** para padronizar o ambiente de desenvolvimento, garantindo que backend, frontend e banco de dados sejam executados de forma integrada.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Passos para executar o projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/MarcosAndreLS/Desafio_BRNX.git
   cd Desafio_BRNX

2. **Configure as variáveis de ambiente**
    - Crie um arquivo chamado .env dentro da pasta backend/.
    - Consulte o arquivo .env.example para entender como configurar o DATABASE_URL

3. **Iniciar a Aplicação**

Com tudo configurado, utilize o Docker Compose para construir as imagens e iniciar os contêineres. Execute o seguinte comando a partir da raiz do projeto (onde o arquivo docker-compose.yml se encontra):

```bash
docker-compose up --build
```

Este comando irá baixar a imagem do PostgreSQL, construir as imagens para o backend e frontend e iniciar todos os serviços. Você verá os logs de cada serviço no seu terminal.

4. **Acesse os serviços**

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Banco de Dados (PostgreSQL): http://localhost:5432

# Tecnologias Utilizadas

O sistema foi desenvolvido utilizando tecnologias modernas e amplamente adotadas no mercado, garantindo escalabilidade, organização e facilidade de manutenção.  

## Backend
- **Node.js** — Ambiente de execução para JavaScript/TypeScript no lado do servidor.
- **TypeScript** — Superset de JavaScript que adiciona tipagem estática e maior segurança ao código.
- **Express.js** — Framework minimalista para construção de APIs REST.
- **Prisma ORM** — ORM (Object-Relational Mapping) utilizado para modelagem de dados, migrações e acesso simplificado ao banco de dados.
- **Docker** — Padronização do ambiente de desenvolvimento e execução do backend.

## Frontend
- **React.js** — Biblioteca JavaScript para construção de interfaces de usuário dinâmicas e reativas.
- **Vite** — Ferramenta de build rápida e otimizada para projetos React.
- **TailwindCSS** — Framework de utilitários CSS para estilização moderna e responsiva.
- **Axios** — Cliente HTTP para comunicação com o backend.
- **Docker** — Padronização do ambiente de execução do frontend.

## Banco de Dados
- **PostgreSQL** — Banco de dados relacional robusto, open source e altamente confiável.
- **Volumes do Docker** — Utilizados para persistência dos dados entre reinicializações dos containers.

## Orquestração
- **Docker Compose** — Orquestração dos serviços (backend, frontend e banco de dados) em um ambiente unificado.

# Estrutura do Sistema

A aplicação está organizada em duas camadas principais: **Backend** e **Frontend**, cada uma com sua própria estrutura de pastas e responsabilidades.

---

## Backend

O backend é responsável por fornecer a API REST, gerenciar a lógica de negócio, comunicação com o banco de dados e autenticação de usuários.  
Ele está estruturado da seguinte forma:

```
backend/
├── 📁controllers/ # Contém os controladores que processam as requisições e chamam os serviços
├── 📁routes/ # Define as rotas da API e associa cada endpoint ao seu controller
├── 📁services/ # Implementa a lógica de negócio da aplicação
├── 📁repositories/ # Camada de acesso ao banco de dados (Prisma ORM)
├── .env # Variáveis de ambiente
├── server.ts # Arquivo principal que inicia o servidor Express
└── package.json # Dependências e scripts do backend
```

**Fluxo típico de uma requisição:**
1. **Route** recebe a requisição HTTP.
2. **Controller** valida e prepara os dados.
3. **Service** aplica a lógica de negócio.
4. **Repository** acessa ou modifica os dados no banco via Prisma.
5. **Controller** envia a resposta para o frontend.

---

## Frontend

O frontend é responsável pela interface do usuário, comunicação com o backend e apresentação dos dados.  
Ele está estruturado da seguinte forma:

```
frontend/
├── src/
│ ├── 📁components/ # Componentes reutilizáveis da interface (botões, inputs, cards)
│ ├── 📁pages/ # Páginas do sistema (Dashboard, Login, Demandas, Provedores)
│ ├── 📁hooks/ # Custom Hooks do React
│ ├── 📁api/ # Funções de comunicação com a API (axios)
├── public/ # Arquivos públicos (imagens, favicon)
└── package.json # Dependências e scripts do frontend
```

**Fluxo típico de interação:**
1. Usuário interage com **componentes** da interface.
2. Eventos chamam **hooks** ou **services** para comunicação com o backend.
3. Dados recebidos são armazenados em estados locais.
4. A interface é atualizada dinamicamente com os dados.

## 🏗 Arquitetura do Sistema

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    Frontend     │      │     Backend     │      │    Database     │
│    ( React )    │◄────►│ (Node.js + TS)  │◄────►│  (PostgreSQL)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │                        │
         │                        │                        │
  ┌──────▼──────┐          ┌──────▼──────┐          ┌──────▼──────┐
  │  Vite       │          │  Express.js │          │   Tables:   │
  │  Build Tool │          │             │          │- Provider   │
  │  & Dev      │          │  REST API   │          │- Demand     │
  │  Server     │          │  & Auth     │          │- Action     │
  └─────────────┘          └─────────────┘          │- User       │
                                                    └─────────────┘
```

# Melhorias Futuras

O protótipo atual do sistema atende às funcionalidades básicas de cadastro de provedores, registro de demandas e acompanhamento de status.  
No entanto, diversas melhorias podem ser implementadas para evoluir o sistema, tornando-o mais completo, seguro e escalável:

## 1. Autenticação e Controle de Acesso
- Implementar autenticação de usuários com **login e senha**.
- Controle de permissões baseado em papéis (administrador, consultor, atendente).
- Atualmente, os dados são gerados via `seed.ts`, mas ainda não há login real.

## 2. Página de Configurações do Sistema
- Área exclusiva para administradores configurarem o sistema.
- Funcionalidades previstas:
  - Cadastrar e gerenciar funcionários.
  - Personalizar parâmetros do sistema (temas, notificações, preferências).
  - Visualizar métricas gerais do sistema (quantidade de demandas, provedores ativos, tempo médio de resolução, etc.).

## 3. Exportação de Dados
- Possibilitar a exportação de relatórios em **CSV ou PDF** para análise externa.
- Gerar relatórios históricos de demandas por provedor ou período.

## 4. Logs de Atividade
- Implementar registro detalhado de ações realizadas pelos usuários.
- Facilitar auditoria e acompanhamento das alterações feitas no sistema.

## 5. Notificações
- Enviar notificações para usuários sobre alterações de status de demandas ou novos registros.
- Possibilidade de integração com **e-mail ou sistema interno de alertas**.

## 6. Testes Automatizados
- Criar testes unitários e de integração para backend e frontend.
- Garantir maior confiabilidade e reduzir bugs em futuras atualizações.

---
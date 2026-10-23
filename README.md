# 🎵 Vinyl Control

## 📌 Sobre o projeto

O **Vinyl Control** é um sistema de gerenciamento de estoque e vendas de discos de vinil. 💿 O projeto foi desenvolvido para facilitar o cadastro de discos, o controle das quantidades em estoque e o registro das entradas e saídas de produtos.

## ✨ Funcionalidades

- 💿 **Cadastro de discos:** permite cadastrar discos com título, artista, gênero, preço de custo, preço de venda, quantidade em estoque e estoque mínimo.
- 📝 **Gerenciamento de discos:** permite listar, consultar, atualizar e excluir discos cadastrados.
- 📦 **Controle de estoque:** registra entradas de novos discos e saídas relacionadas às vendas.
- 📊 **Histórico de movimentações:** apresenta informações sobre os discos, o tipo de operação, a quantidade, a data e o usuário responsável.
- ⚠️ **Alerta de estoque baixo:** identifica discos cuja quantidade está igual ou abaixo do estoque mínimo definido.
- 🔐 **Login de usuário:** permite acessar o sistema por meio de e-mail e senha.

## 🛠️ Tecnologias utilizadas

- 🌐 HTML
- 🎨 CSS
- ⚙️ JavaScript
- 🟢 Node.js
- 🚀 Express
- 🔗 Prisma ORM
- 🗄️ MySQL

## 📁 Organização do projeto

O projeto está dividido em duas partes principais:

**🖥️ Frontend:** contém as páginas HTML, os estilos CSS e os arquivos JavaScript responsáveis pela interface e pela comunicação com a API.

**⚙️ Backend:** contém o servidor, as rotas, os controllers e a configuração do Prisma para acessar o banco de dados.

Principais arquivos do backend:

- `server.js`: configura e inicia o servidor.
- `controllers/`: contém as funções responsáveis pelas operações do sistema.
- `routes/`: define as rotas da API.
- `data/prisma.js`: configura o acesso ao Prisma Client.
- `prisma/schema.prisma`: define os modelos do banco de dados.

## ▶️ Como executar o projeto

### 1. 🗄️ Configurar o banco de dados

Tenha o MySQL instalado e em execução. Configure a conexão com o banco de dados no arquivo de ambiente do backend, conforme a configuração utilizada no projeto.

### 2. 📦 Instalar as dependências

Abra o terminal na pasta `back` e execute:

```bash
npm install
```

### 3. 🔗 Configurar o Prisma

Gere o Prisma Client e sincronize o banco de dados com o schema do projeto, utilizando os comandos adequados à versão do Prisma configurada.

### 4. 🚀 Iniciar o servidor

Execute o comando configurado no `package.json` do backend. Se houver um script chamado `dev`, utilize:

```bash
npm run dev
```

### 5. 🌐 Abrir o sistema

Abra o arquivo `index.html` do frontend por meio de um servidor local, como a extensão Live Server do Visual Studio Code. Verifique se o endereço da API em `js/config.js` corresponde ao endereço do backend.

## 🎯 Objetivo do projeto

O objetivo do Vinyl Control é aplicar conhecimentos de desenvolvimento web, criação de APIs, integração com banco de dados e operações de cadastro, consulta, atualização e exclusão de informações.

O sistema também utiliza regras de negócio para auxiliar no controle das movimentações e das quantidades disponíveis em estoque.

## 👩‍💻 Desenvolvido por

- **Mirella Brolezi**
- **Maria Eduarda Urbano**


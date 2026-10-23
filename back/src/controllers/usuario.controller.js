const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const data = req.body;

    const item = await prisma.usuario.create({
        data
    });

    res.status(201).json(item).end();
};

const listar = async (req, res) => {
    const lista = await prisma.usuario.findMany();

    res.status(200).json(lista).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.usuario.findUnique({
        where: { idUsuario: Number(id) }
    });

    res.status(200).json(item).end();
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    const item = await prisma.usuario.update({
        where: { idUsuario: Number(id) },
        data: dados
    });

    res.status(200).json(item).end();
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.usuario.delete({
        where: { idUsuario: Number(id) }
    });

    res.status(200).json(item).end();
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({
        where: { email: email }
    });

    if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({
            erro: "E-mail ou senha incorretos."
        });
    }

    res.status(200).json({
        idUsuario: usuario.idUsuario,
        nome: usuario.nome,
        email: usuario.email
    }).end();
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    login
};
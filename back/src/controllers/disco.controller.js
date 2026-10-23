
const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const data = req.body;

    const item = await prisma.disco.create({
        data
    });

    res.status(201).json(item).end();
};

const listar = async (req, res) => {
    const lista = await prisma.disco.findMany({
        orderBy: {
            titulo: "asc"
        }
    });

    res.status(200).json(lista).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.disco.findUnique({
        where: { idDisco: Number(id) }
    });

    res.status(200).json(item).end();
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    const item = await prisma.disco.update({
        where: { idDisco: Number(id) },
        data: dados
    });

    res.status(200).json(item).end();
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.disco.delete({
        where: { idDisco: Number(id) }
    });

    res.status(200).json(item).end();
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};

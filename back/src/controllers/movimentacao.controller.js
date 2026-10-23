
const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const {
            idDisco,
            idUsuario,
            tipoMovimentacao,
            quantidade,
            observacao
        } = req.body;

        if (!idDisco || !idUsuario) {
            return res.status(400).json({
                erro: "Selecione um disco e faça login novamente."
            });
        }

        const qtd = Number(quantidade);

        if (!Number.isInteger(qtd) || qtd <= 0) {
            return res.status(400).json({
                erro: "A quantidade deve ser um número inteiro maior que zero."
            });
        }

        if (tipoMovimentacao !== "entrada" &&
            tipoMovimentacao !== "saida") {
            return res.status(400).json({
                erro: "Tipo de movimentação inválido."
            });
        }

        const resultado = await prisma.$transaction(async (tx) => {
            const disco = await tx.disco.findUnique({
                where: { idDisco: Number(idDisco) }
            });

            if (!disco) {
                throw new Error("Disco não encontrado.");
            }

            const usuario = await tx.usuario.findUnique({
                where: { idUsuario: Number(idUsuario) }
            });

            if (!usuario) {
                throw new Error("Usuário não encontrado. Faça login novamente.");
            }

            let estoque = Number(disco.quantidadeEstoque);

            if (tipoMovimentacao === "entrada") {
                estoque += qtd;
            } else {
                if (estoque < qtd) {
                    throw new Error("Estoque insuficiente.");
                }

                estoque -= qtd;
            }

            const movimentacao = await tx.movimentacaoEstoque.create({
                data: {
                    tipoMovimentacao: tipoMovimentacao,
                    quantidade: qtd,
                    dataMovimentacao: new Date(),
                    observacao: observacao || null,
                    disco: {
                        connect: { idDisco: Number(idDisco) }
                    },
                    usuario: {
                        connect: { idUsuario: Number(idUsuario) }
                    }
                }
            });

            await tx.disco.update({
                where: { idDisco: Number(idDisco) },
                data: {
                    quantidadeEstoque: estoque
                }
            });

            return {
                movimentacao,
                estoqueAtual: estoque,
                alerta: tipoMovimentacao === "saida" &&
                    estoque <= Number(disco.estoqueMinimo)
                    ? "Atenção: estoque abaixo do mínimo!"
                    : null
            };
        });

        return res.status(201).json(resultado);
    } catch (erro) {
        console.error("Erro ao registrar movimentação:", erro);

        return res.status(500).json({
            erro: erro.message || "Erro ao registrar movimentação."
        });
    }
};

const listar = async (req, res) => {
    const lista = await prisma.movimentacaoEstoque.findMany({
        include: {
            disco: true,
            usuario: true
        },
        orderBy: {
            dataMovimentacao: "desc"
        }
    });

    res.status(200).json(lista).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.movimentacaoEstoque.findUnique({
        where: { idMovimentacao: Number(id) },
        include: {
            disco: true,
            usuario: true
        }
    });

    if (!item) {
        return res.status(404).json({
            erro: "Movimentação não encontrada."
        });
    }

    res.status(200).json(item).end();
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.movimentacaoEstoque.findUnique({
        where: { idMovimentacao: Number(id) }
    });

    if (!item) {
        return res.status(404).json({
            erro: "Movimentação não encontrada."
        });
    }

    await prisma.$transaction([
        prisma.disco.update({
            where: { idDisco: item.idDisco },
            data: {
                quantidadeEstoque: {
                    increment: item.tipoMovimentacao === "entrada"
                        ? -item.quantidade
                        : item.quantidade
                }
            }
        }),
        prisma.movimentacaoEstoque.delete({
            where: { idMovimentacao: Number(id) }
        })
    ]);

    res.status(200).json({
        mensagem: "Movimentação excluída."
    }).end();
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    excluir
};

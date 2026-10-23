async function requisicao(url, opcoes = {}) {
    let resposta;

    try {
        resposta = await fetch(CONFIG.API_URL + url, {
            ...opcoes,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (erro) {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const dados = await resposta.json().catch(() => null);

    if (!resposta.ok) {
        if (dados && dados.erro) {
            throw new Error(dados.erro);
        }

        throw new Error("Erro ao realizar a operação.");
    }

    return dados;
}

function apiLogin(email, senha) {
    return requisicao("/usuarios/login", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    });
}

function apiListarDiscos() {
    return requisicao("/discos/listar");
}

function apiCriarDisco(disco) {
    return requisicao("/discos/cadastrar", {
        method: "POST",
        body: JSON.stringify(disco)
    });
}

function apiAtualizarDisco(id, disco) {
    return requisicao("/discos/atualizar/" + id, {
        method: "PUT",
        body: JSON.stringify(disco)
    });
}

function apiExcluirDisco(id) {
    return requisicao("/discos/excluir/" + id, {
        method: "DELETE"
    });
}


function apiRegistrarMovimentacao(movimentacao) {
    const usuario = getUsuario();

    if (!usuario || !usuario.idUsuario) {
        throw new Error("Faça login novamente.");
    }

    if (!movimentacao.discoId) {
        throw new Error("Selecione um disco.");
    }

    const dados = {
        idDisco: Number(movimentacao.discoId),
        idUsuario: Number(usuario.idUsuario),
        tipoMovimentacao: movimentacao.tipo,
        quantidade: Number(movimentacao.quantidade),
        observacao: movimentacao.observacao
    };

    return requisicao("/movimentacoes/cadastrar", {
        method: "POST",
        body: JSON.stringify(dados)
    });
}

function apiListarMovimentacoes() {
    return requisicao("/movimentacoes/listar");
}

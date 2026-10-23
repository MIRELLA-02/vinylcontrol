let discos = [];
let idEmEdicao = null;

const form = document.getElementById("formDisco");
const corpoTabela = document.getElementById("corpoTabela");
const campoBusca = document.getElementById("busca");

function lerFormulario() {
    return {
        titulo: document.getElementById("titulo").value.trim(),
        artista: document.getElementById("artista").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        precoCusto: document.getElementById("precoCusto").value,
        precoVenda: document.getElementById("precoVenda").value,
        quantidadeEstoque: document.getElementById("quantidade").value,
        estoqueMinimo: document.getElementById("estoqueMinimo").value
    };
}

function validar(disco) {
    let erros = [];

    if (disco.titulo == "") {
        erros.push("Informe o título.");
    }

    if (disco.artista == "") {
        erros.push("Informe o artista ou banda.");
    }

    if (disco.genero == "") {
        erros.push("Informe o gênero.");
    }

    if (disco.precoCusto == "" || Number(disco.precoCusto) <= 0) {
        erros.push("O preço de custo deve ser maior que zero.");
    }

    if (disco.precoVenda == "" || Number(disco.precoVenda) <= 0) {
        erros.push("O preço de venda deve ser maior que zero.");
    }

    if (disco.quantidadeEstoque == "" ||
        Number(disco.quantidadeEstoque) < 0 ||
        Number(disco.quantidadeEstoque) % 1 != 0) {
        erros.push("Informe uma quantidade inteira e não negativa.");
    }

    if (disco.estoqueMinimo == "" ||
        Number(disco.estoqueMinimo) < 0 ||
        Number(disco.estoqueMinimo) % 1 != 0) {
        erros.push("Informe um estoque mínimo inteiro e não negativo.");
    }

    return erros;
}

async function carregarDiscos() {
    try {
        discos = await apiListarDiscos();
        renderizarTabela();
    } catch (erro) {
        corpoTabela.innerHTML = '<tr><td colspan="9">Não foi possível carregar os discos.</td></tr>';
        mostrarMensagem("mensagem", "error", erro.message);
    }
}

function renderizarTabela() {
    const termo = campoBusca.value.trim().toLowerCase();
    let linhas = "";

    for (let i = 0; i < discos.length; i++) {
        const disco = discos[i];

        if (
            disco.titulo.toLowerCase().includes(termo) ||
            disco.artista.toLowerCase().includes(termo) ||
            String(disco.genero || "").toLowerCase().includes(termo)
        ) {
            let baixo = Number(disco.quantidadeEstoque) <= Number(disco.estoqueMinimo);

            linhas += `
                <tr>
                    <td>${escapeHtml(disco.idDisco)}</td>
                    <td>${escapeHtml(disco.titulo)}</td>
                    <td>${escapeHtml(disco.artista)}</td>
                    <td>${escapeHtml(disco.genero || "")}</td>
                    <td>${formatarMoeda(disco.precoCusto)}</td>
                    <td>${formatarMoeda(disco.precoVenda)}</td>
                    <td>
                        ${escapeHtml(disco.quantidadeEstoque)}
                        ${baixo ? '<span class="badge badge-low">Baixo</span>' : ""}
                    </td>
                    <td>${escapeHtml(disco.estoqueMinimo)}</td>
                    <td>
                        <button class="btn btn-small btn-outline"
                            data-acao="editar" data-id="${disco.idDisco}">
                            Editar
                        </button>

                        <button class="btn btn-small btn-danger"
                            data-acao="excluir" data-id="${disco.idDisco}">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    if (linhas == "") {
        if (discos.length == 0) {
            linhas = '<tr><td colspan="9" class="empty">Nenhum disco cadastrado.</td></tr>';
        } else {
            linhas = '<tr><td colspan="9" class="empty">Nenhum disco encontrado.</td></tr>';
        }
    }

    corpoTabela.innerHTML = linhas;
}

function limparFormulario() {
    form.reset();
    idEmEdicao = null;

    document.getElementById("tituloForm").textContent = "Novo disco";
    document.getElementById("btnCancelar").hidden = true;
}

function iniciarEdicao(disco) {
    idEmEdicao = disco.idDisco;

    document.getElementById("titulo").value = disco.titulo;
    document.getElementById("artista").value = disco.artista;
    document.getElementById("genero").value = disco.genero || "";
    document.getElementById("precoCusto").value = disco.precoCusto;
    document.getElementById("precoVenda").value = disco.precoVenda;
    document.getElementById("quantidade").value = disco.quantidadeEstoque;
    document.getElementById("estoqueMinimo").value = disco.estoqueMinimo;

    document.getElementById("tituloForm").textContent = "Editar disco";
    document.getElementById("btnCancelar").hidden = false;
}

async function excluirDisco(disco) {
    if (!confirm('Deseja excluir o disco "' + disco.titulo + '"?')) {
        return;
    }

    try {
        await apiExcluirDisco(disco.idDisco);
        mostrarMensagem("mensagem", "success", "Disco excluído com sucesso.");
        await carregarDiscos();
    } catch (erro) {
        mostrarMensagem("mensagem", "error", erro.message);
    }
}

form.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    esconderMensagem("mensagem");

    const dados = lerFormulario();
    const erros = validar(dados);

    if (erros.length > 0) {
        mostrarMensagem("mensagem", "error", erros.join(" "));
        return;
    }

    dados.precoCusto = Number(dados.precoCusto);
    dados.precoVenda = Number(dados.precoVenda);
    dados.quantidadeEstoque = Number(dados.quantidadeEstoque);
    dados.estoqueMinimo = Number(dados.estoqueMinimo);

    try {
        if (idEmEdicao == null) {
            await apiCriarDisco(dados);
            mostrarMensagem("mensagem", "success", "Disco cadastrado com sucesso.");
        } else {
            await apiAtualizarDisco(idEmEdicao, dados);
            mostrarMensagem("mensagem", "success", "Disco atualizado com sucesso.");
        }

        limparFormulario();
        await carregarDiscos();
    } catch (erro) {
        mostrarMensagem("mensagem", "error", erro.message);
    }
});

document.getElementById("btnCancelar").addEventListener("click", limparFormulario);

campoBusca.addEventListener("input", renderizarTabela);

corpoTabela.addEventListener("click", function (evento) {
    const botao = evento.target;

    if (botao.tagName != "BUTTON") {
        return;
    }

    const id = botao.getAttribute("data-id");
    const acao = botao.getAttribute("data-acao");

    for (let i = 0; i < discos.length; i++) {
        if (discos[i].idDisco == id) {
            if (acao == "editar") {
                iniciarEdicao(discos[i]);
            } else if (acao == "excluir") {
                excluirDisco(discos[i]);
            }

            break;
        }
    }
});

if (exigirLogin()) {
    carregarDiscos();
}

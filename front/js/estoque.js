
let discos = [];

const form = document.getElementById("formMov");
const selectDisco = document.getElementById("discoId");
const selectTipo = document.getElementById("tipo");
const campoQtd = document.getElementById("quantidade");


function discoSelecionado() {
    for (let i = 0; i < discos.length; i++) {
        if (discos[i].idDisco == selectDisco.value) {
            return discos[i];
        }
    }

    return null;
}

async function carregarDiscos() {
    try {
        discos = await apiListarDiscos();

        discos.sort(function (a, b) {
            return a.titulo.localeCompare(b.titulo);
        });

        preencherSelect();
        renderizarTabela();
        atualizarDica();
    } catch (erro) {
        document.getElementById("corpoTabela").innerHTML =
            '<tr><td colspan="5" class="empty">Não foi possível carregar os discos.</td></tr>';

        mostrarMensagem("mensagem", "error", erro.message);
    }
}

function preencherSelect() {
    const atual = selectDisco.value;

    selectDisco.innerHTML = '<option value="">Selecione um disco</option>';

    for (let i = 0; i < discos.length; i++) {
        const disco = discos[i];

        selectDisco.innerHTML +=
            '<option value="' + disco.idDisco + '">' +
            escapeHtml(disco.titulo) + " — " +
            escapeHtml(disco.artista) +
            '</option>';
    }

    selectDisco.value = atual;
}

function renderizarTabela() {
    const corpo = document.getElementById("corpoTabela");
    let linhas = "";

    if (discos.length == 0) {
        corpo.innerHTML =
            '<tr><td colspan="5" class="empty">Nenhum disco cadastrado.</td></tr>';
        return;
    }

    for (let i = 0; i < discos.length; i++) {
        const disco = discos[i];
        const baixo = Number(disco.quantidadeEstoque) <= Number(disco.estoqueMinimo);

        let status = '<span class="badge badge-ok">Normal</span>';

        if (baixo) {
            status = '<span class="badge badge-low">Estoque baixo</span>';
        }

        linhas += `
            <tr>
                <td>${escapeHtml(disco.titulo)}</td>
                <td>${escapeHtml(disco.artista)}</td>
                <td>${disco.quantidadeEstoque}</td>
                <td>${disco.estoqueMinimo}</td>
                <td>${status}</td>
            </tr>
        `;
    }

    corpo.innerHTML = linhas;
}

function atualizarDica() {
    const disco = discoSelecionado();
    const dica = document.getElementById("dicaEstoque");

    if (disco) {
        dica.textContent = "Estoque atual: " + disco.quantidadeEstoque +
            " | Estoque mínimo: " + disco.estoqueMinimo;
    } else {
        dica.textContent = "";
    }
}

function validar(mov) {
    let erros = [];
    const disco = discoSelecionado();

    if (!disco) {
        erros.push("Selecione um disco.");
    }

    if (mov.tipo == "") {
        erros.push("Selecione o tipo de movimentação.");
    }

    if (mov.quantidade == "" ||
        Number(mov.quantidade) <= 0 ||
        Number(mov.quantidade) % 1 != 0) {
        erros.push("A quantidade deve ser um número inteiro maior que zero.");
    } else if (disco && mov.tipo == "saida" &&
        Number(mov.quantidade) > Number(disco.quantidadeEstoque)) {
        erros.push("A quantidade é maior que o estoque disponível.");
    }

    if (mov.data == "") {
        erros.push("Informe a data da movimentação.");
    }

    return erros;
}

form.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    esconderMensagem("mensagem");
    esconderMensagem("alertaEstoque");

    const mov = {
        discoId: selectDisco.value,
        tipo: selectTipo.value,
        quantidade: campoQtd.value,
        data: document.getElementById("data").value,
        observacao: document.getElementById("observacao").value.trim()
    };

    const erros = validar(mov);

    if (erros.length > 0) {
        mostrarMensagem("mensagem", "error", erros.join(" "));
        return;
    }

    mov.quantidade = Number(mov.quantidade);

    try {
        await apiRegistrarMovimentacao(mov);

        mostrarMensagem("mensagem", "success", "Movimentação registrada com sucesso.");

        const idDisco = mov.discoId;
        const tipoMovimentacao = mov.tipo;

        form.reset();
        document.getElementById("data").value = hoje();

        await carregarDiscos();
        await carregarHistorico();

        for (let i = 0; i < discos.length; i++) {
            if (discos[i].idDisco == idDisco) {
                const disco = discos[i];

                if (tipoMovimentacao == "saida" &&
                    Number(disco.quantidadeEstoque) <= Number(disco.estoqueMinimo)) {
                    mostrarMensagem(
                        "alertaEstoque",
                        "warning",
                        'Atenção! "' + disco.titulo + '" está com ' +
                        disco.quantidadeEstoque + " unidade(s) em estoque."
                    );
                }

                break;
            }
        }
    } catch (erro) {
        mostrarMensagem("mensagem", "error", erro.message);
    }
});

selectDisco.addEventListener("change", atualizarDica);

async function carregarHistorico() {
    const corpo = document.getElementById("corpoHistorico");

    try {
        const lista = await apiListarMovimentacoes();
        let linhas = "";

        if (lista.length == 0) {
            corpo.innerHTML =
                '<tr><td colspan="5" class="empty">Nenhuma movimentação registrada.</td></tr>';
            return;
        }

        for (let i = 0; i < lista.length; i++) {
            const mov = lista[i];
            let tipo = "Entrada";
            let classe = "badge-in";

            if (mov.tipoMovimentacao == "saida") {
                tipo = "Saída";
                classe = "badge-out";
            }

            linhas += `
                <tr>
                    <td>${formatarData(mov.dataMovimentacao)}</td>
                    <td>${escapeHtml(mov.disco.titulo)}</td>
                    <td><span class="badge ${classe}">${tipo}</span></td>
                    <td>${mov.quantidade}</td>
                    <td>${escapeHtml(mov.usuario.nome)}</td>
                </tr>
            `;
        }

        corpo.innerHTML = linhas;
    } catch (erro) {
        mostrarMensagem("mensagem", "error", erro.message);
    }
}

async function iniciar() {
    if (!exigirLogin()) {
        return;
    }

    document.getElementById("data").value = hoje();

    await carregarDiscos();
    await carregarHistorico();
}

iniciar();

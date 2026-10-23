function getUsuario() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.USER_KEY));
    } catch (erro) {
        return null;
    }
}

function salvarSessao(usuario) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(usuario));
}

function logout() {
    localStorage.removeItem(CONFIG.USER_KEY);
    window.location.href = "index.html";
}

function exigirLogin() {
    const usuario = getUsuario();

    if (!usuario || !usuario.idUsuario) {
        window.location.href = "index.html";
        return false;
    }

    const nome = document.getElementById("nomeUsuario");

    if (nome) {
        nome.textContent = usuario.nome || "Usuário";
    }

    const botaoSair = document.getElementById("btnSair");

    if (botaoSair) {
        botaoSair.addEventListener("click", logout);
    }

    return true;
}

function mostrarMensagem(idElemento, tipo, texto) {
    const elemento = document.getElementById(idElemento);

    if (elemento) {
        elemento.className = "alert alert-" + tipo;
        elemento.textContent = texto;
        elemento.hidden = false;
    }
}

function esconderMensagem(idElemento) {
    const elemento = document.getElementById(idElemento);

    if (elemento) {
        elemento.hidden = true;
    }
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const partes = String(data).slice(0, 10).split("-");

    if (partes.length == 3) {
        return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    return data;
}

function hoje() {
    const data = new Date();

    let mes = data.getMonth() + 1;
    let dia = data.getDate();

    if (mes < 10) {
        mes = "0" + mes;
    }

    if (dia < 10) {
        dia = "0" + dia;
    }

    return data.getFullYear() + "-" + mes + "-" + dia;
}

function escapeHtml(texto) {
    const elemento = document.createElement("div");
    elemento.textContent = texto == null ? "" : texto;
    return elemento.innerHTML;
}
if (getUsuario()) {
    window.location.href = "dashboard.html";
}

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    esconderMensagem("mensagem");

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (email == "" || senha == "") {
        mostrarMensagem("mensagem", "error", "Preencha todos os campos.");
        return;
    }

    try {
        const usuario = await apiLogin(email, senha);

        salvarSessao(usuario);
        window.location.href = "dashboard.html";
    } catch (erro) {
        mostrarMensagem("mensagem", "error", erro.message);
    }
});

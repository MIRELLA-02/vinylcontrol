async function carregarDashboard() {
    if (!exigirLogin()) {
        return;
    }

    try {
        const discos = await apiListarDiscos();

        let totalUnidades = 0;
        let totalBaixo = 0;

        for (let i = 0; i < discos.length; i++) {
            totalUnidades += Number(discos[i].quantidadeEstoque);

            if (Number(discos[i].quantidadeEstoque) <= Number(discos[i].estoqueMinimo)) {
                totalBaixo++;
            }
        }

        document.getElementById("totalTitulos").textContent = discos.length;
        document.getElementById("totalUnidades").textContent = totalUnidades;
        document.getElementById("totalBaixo").textContent = totalBaixo;

        if (totalBaixo > 0) {
            mostrarMensagem(
                "mensagem",
                "warning",
                totalBaixo + " título(s) com estoque baixo. Considere repor."
            );
        }
    } catch (erro) {
        mostrarMensagem("mensagem", "error", erro.message);
    }
}

carregarDashboard();

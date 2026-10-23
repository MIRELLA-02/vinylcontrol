require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const discoRotas = require("./src/routes/disco.routes");
app.use("/discos", discoRotas);

const usuarioRotas = require("./src/routes/usuario.routes");
app.use("/usuarios", usuarioRotas);

const movimentacaoRotas = require("./src/routes/movimentacao.routes");
app.use("/movimentacoes", movimentacaoRotas);

const porta = process.env.PORT_APP || 3000;

app.listen(porta, () => {
    console.log(`Online na porta ${porta}`);
});

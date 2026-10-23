
const express = require("express");

const router = express.Router();

const {
    cadastrar,
    listar,
    buscar,
    excluir
} = require("../controllers/movimentacao.controller");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);
router.get("/buscar/:id", buscar);
router.delete("/excluir/:id", excluir);

module.exports = router;

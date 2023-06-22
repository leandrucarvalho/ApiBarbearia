const express = require("express");
const router = express.Router();
const pool = require("../../../src/service/postgre");

router.get("/", listarServicos);
router.get("/:id", buscarServicoPorId);
router.post("/", cadastrarServico);
router.put("/:id", atualizarServico);
router.delete("/:id", excluirServico);

async function listarServicos(req, res) {
  try {
    const result = await pool.query("SELECT * FROM servicos");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao listar servicos." });
  }
}

async function buscarServicoPorId(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query("SELECT * FROM servicos WHERE id = $1", [
      id,
    ]);
    if (result.rows.length == 0) {
      res.status(404).json({ mensagem: "servico não encontrado." });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao buscar servico." });
  }
}

async function cadastrarServico(req, res) {
  try {
    const servico = req.body;
    const novoServico = await pool.query(
      "INSERT INTO servicos (nome, preco) VALUES ($1, $2) RETURNING *",
      [servico.nome, servico.preco]
    );
    res.status(201).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao cadastrar servico." });
  }
}

async function atualizarServico(req, res) {
  try {
    const id = req.params.id;
    const servico = req.body;
    const servicoAtualizado = await pool.query(
      "UPDATE servicos SET nome = $1, preco = $2 WHERE id = $3 RETURNING *",
      [servico.nome, servico.preco, id]
    );
    if (servicoAtualizado.rows.length == 0) {
      res.status(404).json({ mensagem: "servico não encontrado." });
    } else {
      res.status(200).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar serviços." });
  }
}

async function excluirServico(req, res) {
  try {
    const id = req.params.id;
    const servicoExcluido = await pool.query(
      "DELETE FROM servicos WHERE id = $1 RETURNING *",
      [id]
    );
    if (!servicoExcluido) {
      res.status(404).json({ mensagem: "servico não encontrado." });
    } else {
      res.status(200).json({ mensagem: "servico excluído com sucesso." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao excluir servico." });
  }
}

module.exports = router;

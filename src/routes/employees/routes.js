const express = require("express");
const router = express.Router();
const pool = require("../../../src/service/postgre");

router.get("/", listarFuncionario);
router.get("/:id", buscarFuncionarioPorId);
router.post("/", cadastrarFuncionario);
router.put("/:id", atualizarFuncionario);
router.delete("/:id", excluirFuncionario);

async function listarFuncionario(req, res) {
  try {
    const result = await pool.query("SELECT * FROM funcionarios");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao listar funcionarios." });
  }
}

async function buscarFuncionarioPorId(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT * FROM funcionarios WHERE id = $1",
      [id]
    );
    if (result.rows.length == 0) {
      res.status(404).json({ mensagem: "Funcionário não encontrado." });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao buscar funcionário." });
  }
}

async function cadastrarFuncionario(req, res) {
  try {
    const funcionario = req.body;
    const novoFuncionario = await pool.query(
      "INSERT INTO funcionarios (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *",
      [funcionario.nome, funcionario.email, funcionario.telefone]
    );
    res.status(201).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao cadastrar funcionário." });
  }
}

async function atualizarFuncionario(req, res) {
  try {
    const id = req.params.id;
    const funcionario = req.body;
    const funcionarioAtualizado = await pool.query(
      "UPDATE funcionarios SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *",
      [funcionario.nome, funcionario.email, funcionario.telefone, id]
    );
    if (funcionarioAtualizado.rows.length == 0) {
      res.status(404).json({ mensagem: "funcionarios não encontrado." });
    } else {
      res.status(200).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar funcionario." });
  }
}

async function excluirFuncionario(req, res) {
  try {
    const id = req.params.id;
    const funcionarioExcluido = await pool.query(
      "DELETE FROM funcionarios WHERE id = $1 RETURNING *",
      [id]
    );
    if (!funcionarioExcluido) {
      res.status(404).json({ mensagem: "funcionario não encontrado." });
    } else {
      res.status(200).json({ mensagem: "funcionario excluído com sucesso." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao excluir funcionario." });
  }
}

module.exports = router;

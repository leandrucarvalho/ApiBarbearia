const express = require("express");
const router = express.Router();
const pool = require("../../../src/service/postgre");

router.get("/", listarClientes);
router.get("/:id", buscarClientePorId);
router.post("/", cadastrarCliente);
router.put("/:id", atualizarCliente);
router.delete("/:id", excluirCliente);

async function listarClientes(req, res) {
  try {
    const result = await pool.query("SELECT * FROM clientes");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao listar clientes." });
  }
}

async function buscarClientePorId(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query("SELECT * FROM clientes WHERE id = $1", [
      id,
    ]);
    if (result.rows.length == 0) {
      res.status(404).json({ mensagem: "Cliente não encontrado." });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao buscar cliente." });
  }
}

async function cadastrarCliente(req, res) {
  try {
    const cliente = req.body;
    const novoCliente = await pool.query(
      "INSERT INTO clientes (nome, telefone, email) VALUES ($1, $2, $3) RETURNING *",
      [cliente.nome, cliente.telefone, cliente.email]
    );
    res.status(201).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao cadastrar cliente." });
  }
}

async function atualizarCliente(req, res) {
  try {
    const id = req.params.id;
    const cliente = req.body;
    const clienteAtualizado = await pool.query(
      "UPDATE clientes SET nome = $1, telefone = $2, email = $3 WHERE id = $4 RETURNING *",
      [cliente.nome, cliente.telefone, cliente.email, id]
    );
    if (clienteAtualizado.rows.length == 0) {
      res.status(404).json({ mensagem: "Cliente não encontrado." });
    } else {
      res.status(200).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar cliente." });
  }
}

async function excluirCliente(req, res) {
  try {
    const id = req.params.id;
    const clienteExcluido = await pool.query(
      "DELETE FROM clientes WHERE id = $1 RETURNING *",
      [id]
    );
    if (!clienteExcluido) {
      res.status(404).json({ mensagem: "Cliente não encontrado." });
    } else {
      res.status(200).json({ mensagem: "Cliente excluído com sucesso." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao excluir cliente." });
  }
}

module.exports = router;

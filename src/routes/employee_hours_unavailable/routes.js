const express = require("express");
const router = express.Router();
const pool = require("../../../src/service/postgre");
const moment = require("moment");

router.get("/", listarIndisponibilidadeFuncionario);
router.get("/:id", buscarIndisponibilidadeFuncionarioPorId);
router.post("/", cadastrarIndisponibilidadeFuncionario);
router.put("/:id", atualizarIndisponibilidadeFuncionario);
router.post("/:ids", excluirIndisponibilidadeFuncionario);

async function listarIndisponibilidadeFuncionario(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM funcionario_horarios_indisponiveis"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao listar funcionarios." });
  }
}

async function buscarIndisponibilidadeFuncionarioPorId(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT * FROM funcionario_horarios_indisponiveis WHERE id = $1",
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

async function cadastrarIndisponibilidadeFuncionario(req, res) {
  try {
    const funcionario_horarios_indisponiveis = req.body;
    const novosHorarios = [];
    const mensagens = [];

    // Para cada objeto de horário no corpo da solicitação, insere um novo horário na tabela de funcionario_horarios_indisponiveis
    for (const horario of funcionario_horarios_indisponiveis) {
      const horaInicio = moment(horario.hora_inicio, "HH:mm");
      const horaFim = moment(horario.hora_fim, "HH:mm");

      // Verifica se o horário já existe na tabela de horários
      const existeHorario = await pool.query(
        "SELECT * FROM funcionario_horarios_indisponiveis WHERE funcionario_id = $1 AND data = $2 AND hora_inicio = $3 AND hora_fim = $4",
        [
          horario.funcionario_id,
          horario.data,
          horario.hora_inicio,
          horario.hora_fim,
        ]
      );

      if (existeHorario.rows.length) {
        mensagens.push(
          `Funcionario e horário já está cadastrado: ${horario.funcionario_id}-${horario.hora_inicio}-${horario.hora_fim}`
        );
        continue; // pula este horário e passa para o próximo
      }

      // Insere o novo horário na tabela de horários
      const novoHorario = await pool.query(
        "INSERT INTO funcionario_horarios_indisponiveis (funcionario_id, data, hora_inicio, hora_fim) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          horario.funcionario_id,
          horario.data,
          horario.hora_inicio,
          horario.hora_fim,
        ]
      );

      novosHorarios.push(novoHorario.rows[0]);
      mensagens.push(
        `Dia e horário cadastrado com sucesso: ${horario.funcionario_id}-${horario.data}-${horario.hora_inicio}-${horario.hora_fim}`
      );
    }

    res.status(201).json(mensagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao cadastrar horários." });
  }
}

async function atualizarIndisponibilidadeFuncionario(req, res) {
  try {
    const id = req.params.id;
    const funcionario = req.body;
    const IndisponibilidadefuncionarioAtualizado = await pool.query(
      "UPDATE funcionario_horarios_indisponiveis SET funcionario_id = $1, data = $2, hora_inicio = $3, hora_fim = $4 WHERE id = $5 RETURNING *",
      [
        funcionario.funcionario_id,
        funcionario.data,
        funcionario.hora_inicio,
        funcionario.hora_fim,
        id,
      ]
    );
    if (IndisponibilidadefuncionarioAtualizado.rows.length == 0) {
      res.status(404).json({ mensagem: "funcionarios não encontrado." });
    } else {
      res.status(200).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar funcionario." });
  }
}

async function excluirIndisponibilidadeFuncionario(req, res) {
  try {
    const { ids } = req.body;

    // Busca o horario a ser deletado
    const horario = await pool.query(
      "SELECT * FROM UNNEST($1::int[]) as funcionario_horarios_indisponiveis",
      [ids]
    );

    if (!horario.rows[0]) {
      res
        .status(404)
        .json({ mensagem: "Indisponibilidade do funcionario não encontrado." });
    } else {
      // Remove o horario da tabela de horários
      await pool.query(
        "DELETE FROM funcionario_horarios_indisponiveis WHERE id = ANY($1::int[]) RETURNING *",
        [ids]
      );

      res.status(200).json({
        mensagem: "Indisponibilidade do funcionario removida com sucesso.",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensagem: "Erro ao excluir indisponibilidade do funcionario." });
  }
}

module.exports = router;

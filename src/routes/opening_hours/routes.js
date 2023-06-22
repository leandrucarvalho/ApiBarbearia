const express = require("express");
const router = express.Router();
const pool = require("../../service/postgre");
const moment = require("moment");

router.get("/", listarHorario);
router.get("/:id", buscarHorarioPorId);
router.post("/", cadastrarHorario);
router.post("/:ids", excluirHorario);

async function listarHorario(req, res) {
  try {
    const result = await pool.query("SELECT * FROM horario_funcionamento");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao listar horários." });
  }
}

async function buscarHorarioPorId(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT * FROM horario_funcionamento WHERE id = $1",
      [id]
    );
    if (result.rows.length == 0) {
      res.status(404).json({ mensagem: "horário não encontrado." });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao buscar horário." });
  }
}

async function cadastrarHorario(req, res) {
  try {
    const horario_funcionamento = req.body;
    const novosHorarios = [];
    const mensagens = [];

    // Para cada objeto de horário no corpo da solicitação, insere um novo horário na tabela de horario_funcionamento
    for (const horario of horario_funcionamento) {
      const horaInicio = moment(horario.hora_inicio, "HH:mm");
      const horaFim = moment(horario.hora_fim, "HH:mm");

      // Verifica se o horário já existe na tabela de horários
      const existeHorario = await pool.query(
        "SELECT * FROM horario_funcionamento WHERE dia_semana = $1 AND hora_inicio = $2 AND hora_fim = $3",
        [horario.dia_semana, horario.hora_inicio, horario.hora_fim]
      );

      if (existeHorario.rows.length) {
        mensagens.push(
          `Dia e horário já está cadastrado: ${horario.dia_semana}-${horario.hora_inicio}-${horario.hora_fim}`
        );
        continue; // pula este horário e passa para o próximo
      }

      // Insere o novo horário na tabela de horários
      const novoHorario = await pool.query(
        "INSERT INTO horario_funcionamento (dia_semana, hora_inicio, hora_fim) VALUES ($1, $2, $3) RETURNING *",
        [horario.dia_semana, horario.hora_inicio, horario.hora_fim]
      );

      novosHorarios.push(novoHorario.rows[0]);
      mensagens.push(
        `Dia e horário cadastrado com sucesso: ${horario.dia_semana}-${horario.hora_inicio}-${horario.hora_fim}`
      );
    }

    res.status(201).json(mensagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao cadastrar horários." });
  }
}

async function excluirHorario(req, res) {
  try {
    const { ids } = req.body;

    // Busca o horario a ser deletado
    const horario = await pool.query(
      "SELECT * FROM UNNEST($1::int[]) as horario_funcionamento",
      [ids]
    );

    if (!horario.rows[0]) {
      res.status(404).json({ mensagem: "Dia e horário não encontrado." });
    } else {
      // Remove o horario da tabela de horários
      await pool.query(
        "DELETE FROM horario_funcionamento WHERE id = ANY($1::int[]) RETURNING *",
        [ids]
      );

      res.status(200).json({ mensagem: "Horário excluído com sucesso." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao excluir horários." });
  }
}

module.exports = router;

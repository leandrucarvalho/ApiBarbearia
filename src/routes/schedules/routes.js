const express = require("express");
const router = express.Router();
const pool = require("../../../src/service/postgre");

router.get("/", listarAgendamento);
router.get("/:id", buscarAgendamentoPorId);
router.post("/", cadastrarAgendamento);
router.post("/:ids", cancelarAgendamento);

async function listarAgendamento(req, res) {
  try {
    const result = await pool.query("SELECT * FROM agendamentos");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao listar agendamentos." });
  }
}

async function buscarAgendamentoPorId(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT * FROM agendamentos WHERE id = $1",
      [id]
    );
    if (result.rows.length == 0) {
      res.status(404).json({ mensagem: "agendamento não encontrado." });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao buscar agendamento." });
  }
}

async function cadastrarAgendamento(req, res) {
  try {
    const agendamento = req.body;
    const horario = await pool.query(
      "SELECT * FROM horarios WHERE funcionario_id = $1 AND agendamento_id IS NULL",
      [agendamento.funcionario_id]
    );

    if (!horario.rows[0]) {
      return res.status(200).json({ mensagem: "Horário indisponível." });
    }

    const agendamentoExiste = await pool.query(
      "SELECT * FROM agendamentos WHERE funcionario_id = $1 AND data_hora_agendamento = $2",
      [agendamento.funcionario_id, agendamento.data_hora_agendamento]
    );

    if (agendamentoExiste.rows.length > 0) {
      return res
        .status(200)
        .json({ mensagem: "Já existe um agendamento para este horário" });
    }

    const novoAgendamento = await pool.query(
      "INSERT INTO agendamentos (funcionario_id, cliente_id, servico_id, data, hora_inicio, hora_fim) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        agendamento.funcionario_id,
        agendamento.cliente_id,
        agendamento.servico_id,
        agendamento.data,
        agendamento.hora_inicio,
        agendamento.hora_fim,
      ]
    );

    //ao gerar novo agendamento, pegar o id desse agendamento e atualizar na tabela horários na coluna agendamento_id para que aquele horário fique indisponível.
    //se essa coluna estiver nula, significa que o horário esta disponível
    await pool.query("UPDATE horarios SET agendamento_id = $1 WHERE id = $2", [
      novoAgendamento.rows[0].id,
      horario.rows[0].id,
    ]);

    res.status(201).json(novoAgendamento.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao cadastrar agendamento." });
  }
}

async function cancelarAgendamento(req, res) {
  try {
    const { ids } = req.body;

    // Busca o agendamento a ser cancelado
    const agendamento = await pool.query(
      "SELECT * FROM UNNEST($1::int[]) as agendamentos",
      [ids]
    );

    if (!agendamento.rows[0]) {
      res.status(404).json({ mensagem: "Agendamento não encontrado." });
    } else {
      // Remove o agendamento da tabela de agendamentos
      await pool.query(
        "DELETE FROM agendamentos WHERE id = ANY($1::int[]) RETURNING *",
        [ids]
      );

      // Remove o agendamento da tabela de horários
      const horario = agendamento.rows[0].ids;
      await pool.query(
        "UPDATE horarios SET agendamento_id = NULL WHERE agendamento_id = ANY($1::int[]) RETURNING *",
        [ids]
      );

      res.status(200).json({ mensagem: "Agendamento cancelado com sucesso." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao cancelar agendamento." });
  }
}

module.exports = router;

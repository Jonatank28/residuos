import { AsyncSQLiteConnection } from 'vision-common';
import { IAuditoria } from '../../domain/entities/auditoria';
import { IDadosDispositivo } from '../../domain/entities/dadosDispositivo';
import { IDadosRelatorio } from '../../domain/entities/dadosRelatorio';
import { IDeviceAuditoriaRepositorio } from '../../domain/repositories/device/auditoriaRepositorio';

export default class DeviceAuditoriaRepositorio implements IDeviceAuditoriaRepositorio {

  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaAuditoria() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS AUDITORIA (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_REGISTRO                   INTEGER,
        DS_TIPO                       TEXT,
        DS_ROTINA                     TEXT,
        DS_AUDITORIA                  TEXT,
        DT_CADASTRO                   DATE NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DATE NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME'))
      )`,
      'AUDITORIA'
    );

    return response;
  }

  async verificaAuditoriaGravada(auditoria: IAuditoria) {
    const response = await this._conn.query<IAuditoria>(
      `SELECT
        CD_REGISTRO       AS codigoRegistro,
        DS_TIPO           AS tipo,
        DS_ROTINA         AS rotina,
        DS_AUDITORIA      AS descricao,
        DT_CADASTRO       AS data
       FROM AUDITORIA
       WHERE (STRFTIME('%M', 'now') - STRFTIME('%M', DT_CADASTRO)) < 60
        AND CD_USUARIO = ?
        AND DS_TIPO = ?`,
      [
        this.userID,
        auditoria.tipo ?? '',
      ],
    );

    return response;
  }

  async inserirAuditoria(auditoria: IAuditoria) {
    const response = await this._conn.insert(
      `INSERT INTO AUDITORIA (
        CD_USUARIO,
        CD_REGISTRO,
        DS_TIPO,
        DS_ROTINA,
        DS_AUDITORIA
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        this.userID,
        auditoria.codigoRegistro,
        auditoria.tipo,
        auditoria.rotina,
        auditoria.descricao
      ]
    );

    return response;
  }

  async pegarAuditorias(limite: number, offset: number = 0) {
    const response = await this._conn.query<IAuditoria>(
      `SELECT
        CD_REGISTRO       AS codigoRegistro,
        CD_USUARIO        AS codigoMotorista,
        DS_TIPO           AS tipo,
        DS_ROTINA         AS rotina,
        DS_AUDITORIA      AS descricao,
        DT_CADASTRO       AS data
      FROM AUDITORIA
      WHERE CD_USUARIO = ?
      LIMIT ${limite} OFFSET ${offset}`,
      [this.userID]
    );

    return response;
  }

  async deletarAuditorias() {
    const response = await this._conn.delete(
      'DELETE FROM AUDITORIA',
      []
    );

    return response;
  }

  async pegarDadosTotaisDispositivo(placa: string) {
    const response = await this._conn.queryFisrt<IDadosDispositivo>(
      `SELECT
        IFNULL(COUNT(ORDEM.CD_ORDEM_SERVICO), 0)                                                       AS totalColetasHoje,
        (SELECT
            IFNULL(COUNT(*), 0)
          FROM ORDEM_SERVICO_AGENDADAS_PENDENTES
          WHERE CD_USUARIO = ?
            AND STRFTIME('%d-%m-%Y', DATE(DT_ORDEM)) = STRFTIME('%d-%m-%Y', CURRENT_TIMESTAMP)
          UNION ALL
          SELECT
            IFNULL(COUNT(*), 0)
          FROM ORDEM_SERVICO_COLETADAS
          WHERE CD_USUARIO = ?
            AND STRFTIME('%d-%m-%Y', DATE(DT_ORDEM)) = STRFTIME('%d-%m-%Y', CURRENT_TIMESTAMP))        AS totalColetasRealizadasHoje,
        (SELECT IFNULL(COUNT(*), 0) FROM CLIENTES WHERE CD_USUARIO = ?)                                AS totalClientes,
        (SELECT SUM(TOTAL) FROM (
          SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM ORDEM_SERVICO_AGENDADAS_PENDENTES WHERE CD_USUARIO = ?
          UNION ALL
          SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM NOVAS_COLETAS WHERE CD_USUARIO = ?
        ))                                                       AS totalColetasPendentes,
        (SELECT IFNULL(COUNT(*), 0) FROM RASCUNHOS_ORDEM_SERVICO WHERE CD_USUARIO = ? AND CD_CLIENTE IS NOT NULL)                 AS totalRascunhos
      FROM ORDEM_SERVICO_AGENDADAS ORDEM
      WHERE ORDEM.CD_USUARIO = ?
        AND ORDEM.CD_ORDEM_SERVICO NOT IN (SELECT CD_ORDEM_SERVICO FROM ORDEM_SERVICO_AGENDADAS_PENDENTES)
        AND TRIM(REPLACE(ORDEM.DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))
        AND CAST((JulianDay(CURRENT_TIMESTAMP) - JulianDay(DT_ORDEM)) As Integer) >= 1
      `,
      [this.userID, this.userID, this.userID, this.userID, this.userID, this.userID, this.userID, placa]
    );

    return response;
  }

  async pegarDadosTotaisRelatorio(placa: string) {
    const response = await this._conn.queryFisrt<IDadosRelatorio>(
      `SELECT
      IFNULL(COUNT(ORDEM.CD_ORDEM_SERVICO), 0)                                          							  	  AS totalOS,
      (SELECT SUM(TOTAL) FROM (
          SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM ORDEM_SERVICO_AGENDADAS_PENDENTES WHERE CD_USUARIO = ?
           UNION ALL
          SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM NOVAS_COLETAS WHERE CD_USUARIO = ?
       		UNION ALL
          SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM ORDEM_SERVICO_COLETADAS WHERE CD_USUARIO = ?))				    AS totalOSColetadas,

          (SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM ORDEM_SERVICO_COLETADAS WHERE CD_USUARIO = ?)					  AS totalOSEnviadas,

        (SELECT COUNT(*) FROM ORDEM_SERVICO_AGENDADAS WHERE CD_USUARIO = ?)   									            AS totalOSAgendadas,
        (SELECT SUM(TOTAL) FROM (
          SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM ORDEM_SERVICO_AGENDADAS_PENDENTES WHERE CD_USUARIO = ?
           UNION ALL
          SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM NOVAS_COLETAS WHERE CD_USUARIO = ?))				           		AS historicoEnvioPendentes,
        (SELECT IFNULL(COUNT(*), 0) AS TOTAL FROM NOVAS_COLETAS WHERE CD_USUARIO = ?)				                AS totalPendentesNovaColeta,
        (SELECT count(*) FROM ORDEM_SERVICO_COLETADAS where cd_classificacao = 5)								            AS osExcluidas,
        (SELECT count(*) FROM ORDEM_SERVICO_COLETADAS where cd_classificacao = 2)								            AS osEntrega
          FROM ORDEM_SERVICO_AGENDADAS ORDEM
            LEFT JOIN ENDERECOS E ON E.DS_VINCULO = '@VRCOLETAAGENDADA:' || ORDEM.CD_ORDEM_SERVICO
          WHERE ORDEM.CD_USUARIO = ?
            AND ORDEM.CD_ORDEM_SERVICO NOT IN (SELECT CD_ORDEM_SERVICO FROM ORDEM_SERVICO_AGENDADAS_PENDENTES)
            AND TRIM(REPLACE(ORDEM.DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))

      `,
      [this.userID, this.userID, this.userID, this.userID, this.userID, this.userID, this.userID, this.userID, this.userID, placa]
    );

    return response;
  }
}

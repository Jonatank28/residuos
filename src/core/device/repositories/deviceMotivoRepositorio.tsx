import { AsyncSQLiteConnection } from 'vision-common';
import { IMotivo } from '../../domain/entities/motivo';
import { IMotivoRecusaAssinatura } from '../../domain/entities/motivoRecusaAssinatura';
import { IDeviceMotivoRepositorio } from '../../domain/repositories/device/deviceMotivoRepositorio';

export default class DeviceMotivoRepositorio implements IDeviceMotivoRepositorio {

  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaMotivos() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS MOTIVOS (
        ID                                    INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_MOTIVO                             INTEGER,
        CD_USUARIO                            INTEGER,
        DS_VINCULO                            TEXT,
        DS_MOTIVO                             TEXT,
        DS_OBSERVACAO                         TEXT,
        X_OBRIGAR_NOME_RESPONSAVEL            INTEGER,
        X_OBRIGAR_FUNCAO_RESPONSAVEL          INTEGER,
        X_OBRIGAR_ASSINATURA_RESPONSAVEL      INTEGER,
        DT_CADASTRO                           DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                        DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'MOTIVOS'
    );

    return response;
  }

  async criarTabelaMotivosRecusaAssinatura() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS MOTIVOS_RECUSA_ASSINATURA (
        ID                              INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                      INTEGER,
        DS_VINCULO                      TEXT,
        DS_RESPONSAVEL                  TEXT,
        DT_CADASTRO                     DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                  DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DS_MOTIVO                       TEXT )`,
      'MOTIVOS_RECUSA_ASSINATURA'
    );

    return response;
  }

  async pegarMotivoRecusaAssinatura(codigoVinculo: number | string) {
    const response = await this._conn.queryFisrt<IMotivoRecusaAssinatura>(
      `SELECT
        DS_RESPONSAVEL        AS nomeResponsavel,
        DS_MOTIVO             AS motivo
      FROM MOTIVOS_RECUSA_ASSINATURA
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        codigoVinculo,
        this.userID
      ],
      ''
    );

    return response;
  }

  async inserirMotivo(motivo: IMotivo, codigoVinculo: string | number | null) {
    const response = await this._conn.insert(
      `INSERT INTO MOTIVOS (
        CD_USUARIO,
        CD_MOTIVO,
        DS_MOTIVO,
        DS_OBSERVACAO,
        X_OBRIGAR_NOME_RESPONSAVEL,
        X_OBRIGAR_FUNCAO_RESPONSAVEL,
        X_OBRIGAR_ASSINATURA_RESPONSAVEL,
        DS_VINCULO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        motivo.codigo,
        motivo.descricao,
        motivo.observacao,
        motivo.obrigarNomeResponsavel ? 1 : 0,
        motivo.obrigarFuncaoResponsavel ? 1 : 0,
        motivo.obrigarAssinaturaResponsavel ? 1 : 0,
        codigoVinculo ?? null,
      ]
    );

    return response;
  }

  async inserirMotivoRecusaAssinatura(motivoRecusa: IMotivoRecusaAssinatura, codigoVinculo: string | number) {
    const response = await this._conn.insert(
      `INSERT INTO MOTIVOS_RECUSA_ASSINATURA (
        CD_USUARIO,
        DS_VINCULO,
        DS_RESPONSAVEL,
        DS_MOTIVO
      ) VALUES (?, ?, ?, ?)`,
      [
        this.userID,
        codigoVinculo,
        motivoRecusa.nomeResponsavel,
        motivoRecusa.motivo
      ]
    );

    return response;
  }

  async atualizarMotivo(motivo: IMotivo, codigoVinculo: string | number) {
    const response = await this._conn.update(
      `UPDATE MOTIVOS SET
        CD_MOTIVO                           = ?,
        DS_MOTIVO                           = ?,
        DS_OBSERVACAO                       = ?,
        X_OBRIGAR_NOME_RESPONSAVEL          = ?,
        X_OBRIGAR_FUNCAO_RESPONSAVEL        = ?,
        X_OBRIGAR_ASSINATURA_RESPONSAVEL    = ?,
        DT_ATUALIZACAO                      = (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME'))
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        motivo.codigo !== 0 ? motivo.codigo : null,
        motivo.descricao,
        motivo.observacao,
        motivo.obrigarNomeResponsavel ? 1 : 0,
        motivo.obrigarFuncaoResponsavel ? 1 : 0,
        motivo.obrigarAssinaturaResponsavel ? 1 : 0,
        codigoVinculo,
        this.userID,
      ]
    );

    return response;
  }

  async pegarMotivo(codigoVinculo: number | string) {
    const response = await this._conn.queryFisrt<IMotivo>(
      `SELECT
      CD_MOTIVO                           AS codigo,
      DS_MOTIVO                           AS descricao,
      DS_OBSERVACAO                       AS observacao,
      X_OBRIGAR_NOME_RESPONSAVEL          AS obrigarNomeResponsavel,
      X_OBRIGAR_FUNCAO_RESPONSAVEL        AS obrigarFuncaoResponsavel,
      X_OBRIGAR_ASSINATURA_RESPONSAVEL    AS obrigarAssinaturaResponsavel
      FROM MOTIVOS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        codigoVinculo,
        this.userID
      ],
      ''
    );

    return response;
  }

  async pegarMotivos() {
    const response = await this._conn.query<IMotivo>(
      `SELECT
        CD_MOTIVO                           AS codigo,
        DS_MOTIVO                           AS descricao,
        DS_OBSERVACAO                       AS observacao,
        X_OBRIGAR_NOME_RESPONSAVEL          AS obrigarNomeResponsavel,
        X_OBRIGAR_FUNCAO_RESPONSAVEL        AS obrigarFuncaoResponsavel,
        X_OBRIGAR_ASSINATURA_RESPONSAVEL    AS obrigarAssinaturaResponsavel
      FROM MOTIVOS
      WHERE CD_USUARIO = ? AND DS_VINCULO IS NULL`,
      [this.userID],
    );

    return response;
  }

  async deletarMotivos() {
    const response = await this._conn.delete(
      'DELETE FROM MOTIVOS WHERE CD_USUARIO = ? AND DS_VINCULO IS NULL',
      [this.userID]
    );

    return response;
  }

  async deletarMotivoRecusaAssinatura(codigoVinculo: string | number) {
    const response = await this._conn.delete(
      'DELETE FROM MOTIVOS_RECUSA_ASSINATURA WHERE DS_VINCULO = ? AND CD_USUARIO = ?',
      [
        codigoVinculo,
        this.userID,
      ],
    );

    return response;
  }

  async deletarMotivo(codigoVinculo: string | number) {
    const response = await this._conn.delete(
      'DELETE FROM MOTIVOS WHERE DS_VINCULO = ? AND CD_USUARIO = ?',
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }
}

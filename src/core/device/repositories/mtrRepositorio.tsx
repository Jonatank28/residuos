import { IMtr } from '../../domain/entities/mtr';
import { IEstado } from '../../domain/entities/estado';
import { AsyncSQLiteConnection, timezoneDate } from 'vision-common';
import { IDeviceMtrRepositorio } from '../../domain/repositories/device/mtrRepositorio';

export default class DeviceMtrRepositorio implements IDeviceMtrRepositorio {

  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaMtrs() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS MTRS_SINIR_ORDEM_SERVICO (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        DS_VINCULO                    TEXT,
        MTR                           TEXT,
        MTR_COD_BARRAS                TEXT,
        X_SINIR                       INTEGER,
        DT_EMISSAO                    TEXT,
        CD_ESTADO                     INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'MTRS_SINIR_ORDEM_SERVICO'
    );

    return response;
  }

  async criarTabelaEstadosMtrs() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS MTRS_ESTADOS_SINIR (
        ID                              INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                      INTEGER,
        CD_ESTADO                       INTEGER,
        DS_VINCULO                      TEXT,
        DS_ESTADO                       TEXT,
        X_HABILITA_INTEGRACAO_ESTADUAL  INTEGER,
        X_POSSUI_INTEGRACAO_ESTADUAL    INTEGER,
        DT_CADASTRO                     DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                  DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'MTRS_ESTADOS_SINIR'
    );

    return response;
  }

  async inserirEstadoMtr(estado: IEstado, codigoVinculo: string | number) {
    const response = await this._conn.insert(
      `INSERT INTO MTRS_ESTADOS_SINIR (
        CD_ESTADO,
        CD_USUARIO,
        DS_VINCULO,
        DS_ESTADO,
        X_HABILITA_INTEGRACAO_ESTADUAL,
        X_POSSUI_INTEGRACAO_ESTADUAL
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        estado.codigo,
        this.userID,
        codigoVinculo,
        estado.descricao,
        estado.habilitarIntegracaoEstadual ? 1 : 0,
        estado.possuiIntegracaoEstadual ? 1 : 0,
      ]
    );

    return response;
  }

  async inserirEstadoMtrSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO MTRS_ESTADOS_SINIR (
        CD_ESTADO,
        CD_USUARIO,
        DS_VINCULO,
        DS_ESTADO,
        X_HABILITA_INTEGRACAO_ESTADUAL,
        X_POSSUI_INTEGRACAO_ESTADUAL
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirMtrSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO MTRS_SINIR_ORDEM_SERVICO (
        CD_USUARIO,
        DS_VINCULO,
        CD_ESTADO,
        MTR,
        MTR_COD_BARRAS,
        X_SINIR,
        DT_EMISSAO,
        BASE64_MTR_ONLINE
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async atualizarEstadoMtr(estado: IEstado, codigoVinculo: string | number) {
    const response = await this._conn.update(
      `UPDATE MTRS_ESTADOS_SINIR SET
        CD_ESTADO                             = ?,
        DS_ESTADO                             = ?,
        X_HABILITA_INTEGRACAO_ESTADUAL        = ?,
        X_POSSUI_INTEGRACAO_ESTADUAL          = ?,
        DT_ATUALIZACAO                        = ?
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        estado.codigo,
        estado.descricao,
        estado.habilitarIntegracaoEstadual ? 1 : 0,
        estado.possuiIntegracaoEstadual ? 1 : 0,
        timezoneDate(new Date()),
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async inserirMtr(mtr: IMtr, codigoVinculo: string | number) {
    const response = await this._conn.insert(
      `INSERT INTO MTRS_SINIR_ORDEM_SERVICO (
        CD_USUARIO,
        DS_VINCULO,
        CD_ESTADO,
        MTR,
        MTR_COD_BARRAS,
        X_SINIR,
        DT_EMISSAO,
        BASE64_MTR_ONLINE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        codigoVinculo,
        mtr.estado ? mtr.estado.codigo : 0,
        mtr.mtr,
        mtr.mtrCodBarras,
        mtr.hasSinir ? 1 : 0,
        mtr.dataEmissao ? timezoneDate(mtr.dataEmissao) : timezoneDate(new Date()),
        mtr?.base64MtrOnline ?? null
      ]
    );

    return response;
  }

  async atualizarMtr(mtr: IMtr, codigoVinculo: string | number) {
    const response = await this._conn.insert(
      `UPDATE MTRS_SINIR_ORDEM_SERVICO SET
        CD_ESTADO           = ?,
        MTR                 = ?,
        MTR_COD_BARRAS      = ?,
        X_SINIR             = ?,
        DT_EMISSAO          = ?,
        DT_ATUALIZACAO      = ?
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        mtr?.estado?.codigo ?? 0,
        mtr.mtr,
        mtr.mtrCodBarras,
        mtr.hasSinir ? 1 : 0,
        mtr.dataEmissao ? timezoneDate(mtr.dataEmissao) : timezoneDate(new Date()),
        timezoneDate(new Date()),
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async pegarMtrs(codigoVinculo: string | number) {
    const response = await this._conn.query<IMtr>(
      `SELECT
        CD_ESTADO             AS codigoEstado,
        MTR                   AS mtr,
        MTR_COD_BARRAS        AS mtrCodBarras,
        X_SINIR               AS hasSinir,
        DT_EMISSAO            AS dataEmissao,
        BASE64_MTR_ONLINE     AS base64MtrOnline
      FROM MTRS_SINIR_ORDEM_SERVICO
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async pegarEstadoMtr(codigoEstado: number, vinculo: string | number) {
    const response = await this._conn.queryFisrt<IEstado>(
      `SELECT
        CD_ESTADO                             AS codigo,
        DS_ESTADO                             AS descricao,
        X_HABILITA_INTEGRACAO_ESTADUAL        AS habilitarIntegracaoEstadual,
        X_POSSUI_INTEGRACAO_ESTADUAL          AS possuiIntegracaoEstadual
      FROM MTRS_ESTADOS_SINIR
      WHERE CD_ESTADO = ? AND DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        codigoEstado,
        vinculo,
        this.userID
      ],
      ''
    );

    return response;
  }

  async pegarEstadosMtr() {
    const response = await this._conn.query<IEstado>(
      `SELECT
        CD_ESTADO                             AS codigo,
        DS_ESTADO                             AS descricao,
        X_HABILITA_INTEGRACAO_ESTADUAL        AS habilitarIntegracaoEstadual,
        X_POSSUI_INTEGRACAO_ESTADUAL          AS possuiIntegracaoEstadual
      FROM MTRS_ESTADOS_SINIR
      WHERE DS_VINCULO = 'CONTROLLER' AND CD_USUARIO = ?`,
      [this.userID]
    );

    return response;
  }

  async deletarMtr(codigoVinculo: string | number) {
    const response = await this._conn.delete(
      'DELETE FROM MTRS_SINIR_ORDEM_SERVICO WHERE DS_VINCULO = ? AND CD_USUARIO = ?',
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async deletarEstadosMtr(codigoVinculo: string | number) {
    const response = await this._conn.delete(
      'DELETE FROM MTRS_ESTADOS_SINIR WHERE DS_VINCULO = ? AND CD_USUARIO = ?',
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async deletarEstadosMtrSincronizacao() {
    const response = await this._conn.delete(
      "DELETE FROM MTRS_ESTADOS_SINIR WHERE DS_VINCULO = 'CONTROLLER' AND CD_USUARIO = ?",
      [this.userID]
    );

    return response;
  }
}

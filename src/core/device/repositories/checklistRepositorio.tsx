import { AsyncSQLiteConnection } from 'vision-common';
import { IChecklist } from '../../domain/entities/checklist';
import { IGrupo } from '../../domain/entities/grupo';
import { IPergunta } from '../../domain/entities/pergunta';
import { IDeviceChecklistRepositorio } from '../../domain/repositories/device/checklistRepositorio';

export default class DeviceChecklistRepositorio implements IDeviceChecklistRepositorio {

  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaChecklists() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS CHECKLISTS (
          ID                              INTEGER PRIMARY KEY AUTOINCREMENT,
          CD_CHECKLIST                    INTEGER,
          CD_ORDEM_SERVICO                INTEGER,
          CD_USUARIO                      INTEGER,
          DS_MOMENTO_EXIBICAO             TEXT,
          X_PERMITE_SEGUNDA               INTEGER,
          X_PERMITE_TERCA                 INTEGER,
          X_PERMITE_QUARTA                INTEGER,
          X_PERMITE_QUINTA                INTEGER,
          X_PERMITE_SEXTA                 INTEGER,
          X_PERMITE_SABADO                INTEGER,
          X_PERMITE_DOMINGO               INTEGER,
          DT_CADASTRO                     DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
          DT_ATUALIZACAO                  DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'CHECKLISTS'
    );

    return response;
  }

  async criarTabelaGruposChecklists() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS GRUPOS_CHECKLISTS (
          ID                              INTEGER PRIMARY KEY AUTOINCREMENT,
          CD_GRUPO                        INTEGER,
          CD_USUARIO                      INTEGER,
          DS_VINCULO                      TEXT,
          DS_GRUPO                        TEXT,
          CD_ORDEM                        INTEGER,
          DT_CADASTRO                     DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
          DT_ATUALIZACAO                  DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'GRUPOS_CHECKLISTS'
    );

    return response;
  }

  async criarTabelaPerguntasGruposChecklists() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS PERGUNTAS_GRUPOS_CHECKLISTS (
          ID                                  INTEGER PRIMARY KEY AUTOINCREMENT,
          CD_PERGUNTA                         INTEGER,
          DS_PERGUNTA                         INTEGER,
          CD_USUARIO                          INTEGER,
          DS_VINCULO                          INTEGER,
          DS_CLASSIFICACAO                    TEXT,
          X_HABILITA_OBSERVACAO               INTEGER,
          DS_OBSERVACAO                       INTEGER,
          CD_RESPOSTA                         INTEGER,
          CD_RESPOSTA_ESPERADA                INTEGER,
          DT_CADASTRO                         DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
          DT_ATUALIZACAO                      DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'PERGUNTAS_GRUPOS_CHECKLISTS'
    );

    return response;
  }

  async deletarChecklist(codigoOS: number) {
    const response = await this._conn.delete(
      'DELETE FROM CHECKLISTS WHERE CD_ORDEM_SERVICO = ? AND CD_USUARIO = ?',
      [
        codigoOS,
        this.userID
      ]
    );

    return response;
  }

  async deletarGruposChecklist(codigoVinculo: number | string) {
    const response = await this._conn.delete(
      'DELETE FROM GRUPOS_CHECKLISTS WHERE DS_VINCULO = ? AND CD_USUARIO = ?',
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async deletarPerguntasGruposChecklist(codigoVinculo: number | string) {
    const response = await this._conn.delete(
      'DELETE FROM PERGUNTAS_GRUPOS_CHECKLISTS WHERE DS_VINCULO = ? AND CD_USUARIO = ?',
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async inserirChecklist(checklist: IChecklist, codigoOS: number) {
    const response = await this._conn.insert(
      `INSERT INTO CHECKLISTS (
          CD_CHECKLIST,
          CD_ORDEM_SERVICO,
          CD_USUARIO,
          DS_MOMENTO_EXIBICAO,
          X_PERMITE_SEGUNDA,
          X_PERMITE_TERCA,
          X_PERMITE_QUARTA,
          X_PERMITE_QUINTA,
          X_PERMITE_SEXTA,
          X_PERMITE_SABADO,
          X_PERMITE_DOMINGO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        checklist ? checklist.codigo : 0,
        codigoOS,
        this.userID,
        checklist.momentoExibicao,
        checklist.permiteSegundaFeira,
        checklist.permiteTercaFeira,
        checklist.permiteQuartaFeira,
        checklist.permiteQuintaFeira,
        checklist.permiteSextaFeira,
        checklist.permiteSabado,
        checklist.permiteDomingo
      ]
    );

    return response;
  }

  async inserirChecklistsSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO CHECKLISTS (
        CD_CHECKLIST,
        CD_ORDEM_SERVICO,
        CD_USUARIO,
        DS_MOMENTO_EXIBICAO,
        X_PERMITE_SEGUNDA,
        X_PERMITE_TERCA,
        X_PERMITE_QUARTA,
        X_PERMITE_QUINTA,
        X_PERMITE_SEXTA,
        X_PERMITE_SABADO,
        X_PERMITE_DOMINGO
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirGruposChecklistsSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO GRUPOS_CHECKLISTS (
        CD_GRUPO,
        CD_USUARIO,
        DS_VINCULO,
        DS_GRUPO,
        CD_ORDEM
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirPerguntaGrupoChecklistSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO PERGUNTAS_GRUPOS_CHECKLISTS (
        CD_PERGUNTA,
        DS_PERGUNTA,
        CD_USUARIO,
        DS_VINCULO,
        DS_CLASSIFICACAO,
        X_HABILITA_OBSERVACAO,
        DS_OBSERVACAO,
        CD_RESPOSTA,
        CD_RESPOSTA_ESPERADA
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirGrupoChecklist(grupo: IGrupo, codigoVinculo: number | string) {
    const response = await this._conn.insert(
      `INSERT INTO GRUPOS_CHECKLISTS (
        CD_GRUPO,
        CD_USUARIO,
        DS_VINCULO,
        DS_GRUPO,
        CD_ORDEM
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        grupo.codigo,
        this.userID,
        codigoVinculo,
        grupo.descricao,
        grupo.ordem,
      ]
    );

    return response;
  }

  async inserirPerguntaGrupoChecklist(pergunta: IPergunta, codigoVinculo: number | string) {
    const response = await this._conn.insert(
      `INSERT INTO PERGUNTAS_GRUPOS_CHECKLISTS (
        CD_PERGUNTA,
        DS_PERGUNTA,
        CD_USUARIO,
        DS_VINCULO,
        DS_CLASSIFICACAO,
        X_HABILITA_OBSERVACAO,
        DS_OBSERVACAO,
        CD_RESPOSTA,
        CD_RESPOSTA_ESPERADA
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pergunta.codigo,
        pergunta.descricao,
        this.userID,
        codigoVinculo,
        pergunta.classificacoes,
        pergunta.habilitaObservacao,
        pergunta.observacao,
        pergunta.resposta,
        pergunta.codigoResposta,
      ]
    );

    return response;
  }

  async pegarChecklist(codigoOS: number) {
    const response = await this._conn.queryFisrt<IChecklist>(
      `SELECT
          CD_CHECKLIST                  AS codigo,
          DS_MOMENTO_EXIBICAO           AS momentoExibicao,
          X_PERMITE_SEGUNDA             AS permiteSegundaFeira,
          X_PERMITE_TERCA               AS permiteTercaFeira,
          X_PERMITE_QUARTA              AS permiteQuartaFeira,
          X_PERMITE_QUINTA              AS permiteQuintaFeira,
          X_PERMITE_SEXTA               AS permiteSextaFeira,
          X_PERMITE_SABADO              AS permiteSabado,
          X_PERMITE_DOMINGO             AS permiteDomingo
      FROM CHECKLISTS
      WHERE CD_ORDEM_SERVICO = ? AND CD_USUARIO = ?`,
      [
        codigoOS,
        this.userID
      ]
    );

    return response;
  }

  async pegarGruposChecklist(codigoVinculo: number | string) {
    const response = await this._conn.query<IGrupo>(
      `SELECT
        CD_GRUPO                AS codigo,
        DS_GRUPO                AS descricao,
        CD_ORDEM                AS ordem
      FROM GRUPOS_CHECKLISTS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        codigoVinculo,
        this.userID,
      ]
    );

    return response;
  }

  async pegarPerguntasGrupoChecklist(codigoVinculo: number | string) {
    const response = await this._conn.query<IPergunta>(
      `SELECT
        CD_PERGUNTA                         AS codigo,
        DS_PERGUNTA                         AS descricao,
        DS_CLASSIFICACAO                    AS classificacoes,
        X_HABILITA_OBSERVACAO               AS habilitaObservacao,
        DS_OBSERVACAO                       AS observacao,
        CD_RESPOSTA                         AS resposta,
        CD_RESPOSTA_ESPERADA                AS codigoResposta
      FROM PERGUNTAS_GRUPOS_CHECKLISTS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }
}

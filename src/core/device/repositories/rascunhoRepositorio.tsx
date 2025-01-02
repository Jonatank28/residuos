import { IOrder } from '../../domain/entities/order';
import { AsyncSQLiteConnection, IPaginationParams, timezoneDate } from 'vision-common';
import { IDeviceRascunhoRepositorio } from '../../domain/repositories/device/rascunhoRepositoiro';

export default class DeviceRascunhoRepositorio implements IDeviceRascunhoRepositorio {
  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) {}

  async criarTabelaRascunhos() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS RASCUNHOS_ORDEM_SERVICO (
        ID                          INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                  INTEGER,
        DS_VINCULO                  TEXT,
        CD_ORDEM_SERVICO            INTEGER,
        CD_ORDEM                    INTEGER,
        CD_ROTERIZACAO              INTEGER,
        CD_ROTA                     INTEGER,
        CD_DISPOSITIVO              INTEGER,
        CD_MOTORISTA                INTEGER,
        DS_PLACA                    TEXT,
        DS_ASSINATURA_BASE64        TEXT,
        MTR                         TEXT,
        CD_ORDEM_PENDENTE           INTEGER,
        X_COLETOU_PENDENTE          INTEGER,
        DS_MTR_COD_BARRAS           TEXT,
        CD_CLIENTE                  INTEGER,
        CD_OBRA                     INTEGER,
        CD_CONTRATO                 INTEGER,
        DS_OBRA                     TEXT,
        DS_CLIENTE                  TEXT,
        DS_IMOBILIZADOS             TEXT,
        DS_TELEFONE_CLIENTE         TEXT,
        DS_CPFCNPJ_CLIENTE          TEXT,
        DS_CPFCNPJ_RESPONSAVEL      TEXT,
        DS_RESPONSAVEL              TEXT,
        DS_FUNCAO_RESPONSAVEL       TEXT,
        DS_EMAIL_RESPONSAVEL        TEXT,
        DT_ORDEM                    TEXT,
        DS_OBSERVACAO               TEXT,
        DS_REFERENTE                TEXT,
        CD_CLASSIFICACAO            INTEGER,
        DT_CADASTRO                 DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO              DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'RASCUNHOS_ORDEM_SERVICO',
    );

    return response;
  }

  async pegarRascunhoColeta(codigoVinculo: number | string) {
    const response = await this._conn.queryFisrt<IOrder>(
      `SELECT
        CD_ORDEM_SERVICO                    AS codigoOS,
        CD_ID_UNICO                         AS codigoUnico,
        CD_ORDEM                            AS codigoOrdem,
        CD_ROTERIZACAO                      AS codigoRoterizacao,
        CD_ROTA                             AS codigoRota,
        CD_DISPOSITIVO                      AS codigoDispositivo,
        CD_MOTORISTA                        AS codigoMotorista,
        DS_PLACA                            AS placa,
        DS_ASSINATURA_BASE64                AS assinaturaBase64,
        DS_PERIODICIDADE                    AS periodicidade,
        MTR                                 AS mtr,
        DS_MTR_COD_BARRAS                   AS codigoBarraMTR,
        CD_CLIENTE                          AS codigoCliente,
        CD_OBRA                             AS codigoObra,
        CD_CONTRATO                         AS codigoContratoObra,
        DS_OBRA                             AS nomeObra,
        DS_CLIENTE                          AS nomeCliente,
        DS_CLIENTE_FANTASIA                 AS nomeFantasiaCliente,
        DS_IMOBILIZADOS                     AS imobilizados,
        DS_TELEFONE_CLIENTE                 AS telefoneCliente,
        DS_CPFCNPJ_CLIENTE                  AS CNPJCliente,
        DS_CPFCNPJ_RESPONSAVEL              AS CPFCNPJResponsavel,
        DS_RESPONSAVEL                      AS nomeResponsavel,
        DS_FUNCAO_RESPONSAVEL               AS funcaoResponsavel,
        DS_EMAIL_RESPONSAVEL                AS emailResponsavel,
        DT_ORDEM                            AS dataOS,
        DT_CHEGADA                          AS dataChegada,
        DS_OBSERVACAO                       AS observacaoOS,
        DS_REFERENTE                        AS referenteOS,
        CD_CLASSIFICACAO                    AS classificacaoOS,
        CD_ORDEM_PENDENTE                   AS ordemColetaPendente,
        X_COLETOU_PENDENTE                  AS coletouPendente,
        CD_EMPRESA                          AS codigoEmpresa,
        CD_DESTINADOR                       AS codigoDestinador,
        NR_KM_INICIAL                       AS KMInicial,
        NR_KM_FINAL                         AS KMFinal
      FROM RASCUNHOS_ORDEM_SERVICO
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [codigoVinculo, this.userID],
      '',
    );

    return response;
  }

  async verificaRascunhoExiste(codigoVinculo: number | string) {
    const response = await this._conn.queryFisrt<number>(
      `SELECT
        CD_CLIENTE
      FROM RASCUNHOS_ORDEM_SERVICO
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [codigoVinculo, this.userID],
      'CD_CLIENTE',
    );

    return response;
  }

  async pegarTotalLinhas() {
    const response = await this._conn.queryFisrt<number>(
      `SELECT
        COUNT(CD_ORDEM_SERVICO) AS TOTAL
      FROM RASCUNHOS_ORDEM_SERVICO
      WHERE CD_USUARIO = ?
      AND CD_CLIENTE IS NOT NULL`,
      [this.userID],
      'TOTAL',
    );

    return response;
  }

  async pegarRascunhos(params: IPaginationParams) {
    const response = await this._conn.query<IOrder>(
      `SELECT
        CD_ORDEM_SERVICO                    AS codigoOS,
        CD_ID_UNICO                         AS codigoUnico,
        CD_ORDEM                            AS codigoOrdem,
        CD_ROTERIZACAO                      AS codigoRoterizacao,
        CD_ROTA                             AS codigoRota,
        CD_DISPOSITIVO                      AS codigoDispositivo,
        CD_MOTORISTA                        AS codigoMotorista,
        DS_PLACA                            AS placa,
        DS_ASSINATURA_BASE64                AS assinaturaBase64,
        DS_PERIODICIDADE                    AS periodicidade,
        MTR                                 AS mtr,
        DS_MTR_COD_BARRAS                   AS mtrCodigoBarra,
        CD_CLIENTE                          AS codigoCliente,
        CD_OBRA                             AS codigoObra,
        CD_CONTRATO                         AS codigoContratoObra,
        DS_OBRA                             AS nomeObra,
        DS_CLIENTE                          AS nomeCliente,
        DS_CLIENTE_FANTASIA                 AS nomeFantasiaCliente,
        DS_IMOBILIZADOS                     AS imobilizados,
        DS_TELEFONE_CLIENTE                 AS telefoneCliente,
        DS_CPFCNPJ_CLIENTE                  AS CNPJCliente,
        DS_CPFCNPJ_RESPONSAVEL              AS CPFCNPJResponsavel,
        DS_RESPONSAVEL                      AS nomeResponsavel,
        DS_FUNCAO_RESPONSAVEL               AS funcaoResponsavel,
        DS_EMAIL_RESPONSAVEL                AS emailResponsavel,
        DT_ORDEM                            AS dataOS,
        DT_CHEGADA                          AS dataChegada,
        DS_OBSERVACAO                       AS observacaoOS,
        DS_REFERENTE                        AS referenteOS,
        CD_CLASSIFICACAO                    AS classificacaoOS,
        CD_ORDEM_PENDENTE                   AS ordemColetaPendente,
        X_COLETOU_PENDENTE                  AS coletouPendente,
        DT_CADASTRO                         AS dataCadastro,
        DT_ATUALIZACAO                      AS dataAtualizacao,
        CD_EMPRESA                          AS codigoEmpresa,
        CD_DESTINADOR                       AS codigoDestinador,
        NR_KM_INICIAL                       AS KMInicial,
        NR_KM_FINAL                         AS KMFinal
      FROM RASCUNHOS_ORDEM_SERVICO WHERE (
        DS_CLIENTE LIKE ?
        OR DS_OBRA LIKE ?
      ) AND CD_USUARIO = ?
      AND CD_CLIENTE IS NOT NULL  ORDER BY DT_ORDEM
      LIMIT ? OFFSET ?`,
      [
        params.search?.length > 0 ? `%${params.search}%` : '%',
        params.search?.length > 0 ? `%${params.search}%` : '%',
        this.userID,
        params.amount ?? 10,
        params.page !== 0 ? `${10 * (params.page - 1)}` : params.page ?? 0,
      ],
    );

    return response;
  }

  async pegarTodosRascunhos() {
    const response = await this._conn.query<IOrder>(
      `SELECT
        CD_ORDEM_SERVICO                    AS codigoOS,
        CD_ID_UNICO                         AS codigoUnico,
        CD_ORDEM                            AS codigoOrdem,
        CD_ROTERIZACAO                      AS codigoRoterizacao,
        CD_ROTA                             AS codigoRota,
        CD_DISPOSITIVO                      AS codigoDispositivo,
        CD_MOTORISTA                        AS codigoMotorista,
        DS_PLACA                            AS placa,
        DS_ASSINATURA_BASE64                AS assinaturaBase64,
        DS_PERIODICIDADE                    AS periodicidade,
        MTR                                 AS mtr,
        DS_MTR_COD_BARRAS                   AS mtrCodigoBarra,
        CD_CLIENTE                          AS codigoCliente,
        CD_OBRA                             AS codigoObra,
        CD_CONTRATO                         AS codigoContratoObra,
        DS_OBRA                             AS nomeObra,
        DS_CLIENTE                          AS nomeCliente,
        DS_CLIENTE_FANTASIA                 AS nomeFantasiaCliente,
        DS_IMOBILIZADOS                     AS imobilizados,
        DS_TELEFONE_CLIENTE                 AS telefoneCliente,
        DS_CPFCNPJ_CLIENTE                  AS CNPJCliente,
        DS_CPFCNPJ_RESPONSAVEL              AS CPFCNPJResponsavel,
        DS_RESPONSAVEL                      AS nomeResponsavel,
        DS_FUNCAO_RESPONSAVEL               AS funcaoResponsavel,
        DS_EMAIL_RESPONSAVEL                AS emailResponsavel,
        DT_ORDEM                            AS dataOS,
        DT_CHEGADA                          AS dataChegada,
        DS_OBSERVACAO                       AS observacaoOS,
        DS_REFERENTE                        AS referenteOS,
        CD_CLASSIFICACAO                    AS classificacaoOS,
        CD_ORDEM_PENDENTE                   AS ordemColetaPendente,
        X_COLETOU_PENDENTE                  AS coletouPendente,
        DT_CADASTRO                         AS dataCadastro,
        DT_ATUALIZACAO                      AS dataAtualizacao,
        CD_EMPRESA                          AS codigoEmpresa,
        CD_DESTINADOR                       AS codigoDestinador,
        NR_KM_INICIAL                       AS KMInicial,
        NR_KM_FINAL                         AS KMFinal
      FROM RASCUNHOS_ORDEM_SERVICO
      WHERE CD_USUARIO = ?
      AND CD_CLIENTE IS NOT NULL ORDER BY DT_ORDEM`,
      [this.userID],
    );

    return response;
  }

  async inserirRascunho(rascunho: IOrder, codigoVinculo: number | string) {
    const response = await this._conn.insert(
      `INSERT INTO RASCUNHOS_ORDEM_SERVICO (
        CD_USUARIO,
        CD_ID_UNICO,
        DS_VINCULO,
        CD_ORDEM_SERVICO,
        CD_ORDEM,
        CD_ROTERIZACAO,
        CD_ROTA,
        CD_DISPOSITIVO,
        CD_MOTORISTA,
        DS_PLACA,
        DS_ASSINATURA_BASE64,
        DS_PERIODICIDADE,
        MTR,
        DS_MTR_COD_BARRAS,
        CD_CLIENTE,
        CD_OBRA,
        CD_CONTRATO,
        DS_OBRA,
        DS_CLIENTE,
        DS_CLIENTE_FANTASIA,
        DS_IMOBILIZADOS,
        DS_TELEFONE_CLIENTE,
        DS_CPFCNPJ_CLIENTE,
        DS_CPFCNPJ_RESPONSAVEL,
        DS_RESPONSAVEL,
        DS_FUNCAO_RESPONSAVEL,
        DS_EMAIL_RESPONSAVEL,
        DT_ORDEM,
        DT_CHEGADA,
        DS_OBSERVACAO,
        DS_REFERENTE,
        CD_CLASSIFICACAO,
        CD_ORDEM_PENDENTE,
        X_COLETOU_PENDENTE,
        CD_EMPRESA,
        CD_DESTINADOR,
        NR_KM_INICIAL,
        NR_KM_FINAL
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        rascunho?.codigoUnico ?? null,
        codigoVinculo,
        rascunho.codigoOS,
        rascunho.codigoOrdem,
        rascunho.codigoRoterizacao,
        rascunho.codigoRota,
        rascunho.codigoDispositivo,
        rascunho.codigoMotorista,
        rascunho.placa,
        rascunho.assinaturaBase64,
        rascunho?.periodicidade ?? null,
        rascunho.mtr,
        rascunho.codigoBarraMTR,
        rascunho.codigoCliente,
        rascunho.codigoObra,
        rascunho.codigoContratoObra,
        rascunho.nomeObra,
        rascunho.nomeCliente,
        rascunho.nomeFantasiaCliente,
        rascunho.imobilizados,
        rascunho.telefoneCliente,
        rascunho.CNPJCliente,
        rascunho.CPFCNPJResponsavel,
        rascunho.nomeResponsavel,
        rascunho.funcaoResponsavel,
        rascunho.emailResponsavel,
        rascunho.dataOS ? rascunho.dataOS : timezoneDate(new Date()),
        rascunho?.dataChegada ? String(rascunho.dataChegada) : null,
        rascunho.observacaoOS,
        rascunho.referenteOS,
        rascunho.classificacaoOS,
        rascunho.ordemColetaPendente,
        rascunho.coletouPendente ? 1 : 0,
        rascunho?.codigoEmpresa ?? null,
        rascunho?.codigoDestinador ?? null,
        rascunho?.KMInicial ?? null,
        rascunho?.KMFinal ?? null,
      ],
    );

    return response;
  }

  async atualizarRascunho(rascunho: IOrder, codigoVinculo: number | string) {
    const response = await this._conn.update(
      `UPDATE RASCUNHOS_ORDEM_SERVICO SET
        CD_ORDEM_SERVICO                = ?,
        CD_ORDEM                        = ?,
        CD_ROTERIZACAO                  = ?,
        CD_ROTA                         = ?,
        CD_DISPOSITIVO                  = ?,
        CD_MOTORISTA                    = ?,
        DS_PLACA                        = ?,
        DS_ASSINATURA_BASE64            = ?,
        DS_PERIODICIDADE                = ?,
        MTR                             = ?,
        DS_MTR_COD_BARRAS               = ?,
        CD_CLIENTE                      = ?,
        CD_OBRA                         = ?,
        CD_CONTRATO                     = ?,
        DS_OBRA                         = ?,
        DS_CLIENTE                      = ?,
        DS_CLIENTE_FANTASIA             = ?,
        DS_IMOBILIZADOS                 = ?,
        DS_TELEFONE_CLIENTE             = ?,
        DS_CPFCNPJ_CLIENTE              = ?,
        DS_CPFCNPJ_RESPONSAVEL          = ?,
        DS_RESPONSAVEL                  = ?,
        DS_FUNCAO_RESPONSAVEL           = ?,
        DS_EMAIL_RESPONSAVEL            = ?,
        DT_ORDEM                        = ?,
        DT_CHEGADA                      = ?,
        DS_OBSERVACAO                   = ?,
        DS_REFERENTE                    = ?,
        CD_CLASSIFICACAO                = ?,
        CD_ORDEM_PENDENTE               = ?,
        X_COLETOU_PENDENTE              = ?,
        DT_ATUALIZACAO                  = ?,
        CD_EMPRESA                      = ?,
        CD_DESTINADOR                   = ?,
        NR_KM_INICIAL                   = ?,
        NR_KM_FINAL                     = ?
        WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        rascunho.codigoOS,
        rascunho.codigoOrdem,
        rascunho.codigoRoterizacao,
        rascunho.codigoRota,
        rascunho.codigoDispositivo,
        rascunho.codigoMotorista,
        rascunho.placa,
        rascunho.assinaturaBase64,
        rascunho?.periodicidade ?? null,
        rascunho.mtr,
        rascunho.codigoBarraMTR,
        rascunho.codigoCliente,
        rascunho.codigoObra,
        rascunho.codigoContratoObra,
        rascunho.nomeObra,
        rascunho.nomeCliente,
        rascunho.nomeFantasiaCliente,
        rascunho.imobilizados,
        rascunho.telefoneCliente,
        rascunho.CNPJCliente,
        rascunho.CPFCNPJResponsavel,
        rascunho.nomeResponsavel,
        rascunho.funcaoResponsavel,
        rascunho.emailResponsavel,
        rascunho.dataOS ? rascunho.dataOS : timezoneDate(new Date()),
        rascunho?.dataChegada ? String(rascunho.dataChegada) : null,
        rascunho.observacaoOS,
        rascunho.referenteOS,
        rascunho.classificacaoOS,
        rascunho.ordemColetaPendente,
        rascunho.coletouPendente ? 1 : 0,
        timezoneDate(new Date()),
        rascunho?.codigoEmpresa ?? null,
        rascunho?.codigoDestinador ?? null,
        rascunho?.KMInicial ?? null,
        rascunho?.KMFinal ?? null,
        codigoVinculo,
        this.userID,
      ],
    );

    return response;
  }

  async deletarRascunhoColeta(codigoVinculo: number | string) {
    const response = await this._conn.delete('DELETE FROM RASCUNHOS_ORDEM_SERVICO WHERE DS_VINCULO = ? AND CD_USUARIO = ?', [
      codigoVinculo,
      this.userID,
    ]);

    return response;
  }

  async deletarTodosRascunhosVazios() {
    const response = await this._conn.multipleQuerys(
      [
        'DELETE FROM RASCUNHOS_ORDEM_SERVICO WHERE CD_CLIENTE = NULL OR CD_USUARIO = 0 OR CD_USUARIO IS NULL',
        'DELETE FROM EQUIPAMENTOS WHERE CD_CLIENTE = NULL OR CD_USUARIO = 0 OR CD_USUARIO IS NULL',
        'DELETE FROM IMAGENS WHERE CD_USUARIO = 0 OR CD_USUARIO IS NULL',
        'DELETE FROM RESIDUOS WHERE CD_USUARIO = 0 OR CD_USUARIO IS NULL',
      ],
      [[], [], [], []],
    );

    return response;
  }
}

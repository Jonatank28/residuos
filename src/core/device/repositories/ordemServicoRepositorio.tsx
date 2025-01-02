import { IRota } from '../../domain/entities/rota';
import { IOrder } from '../../domain/entities/order';
import { IFiltro } from '../../domain/entities/filtro';
import { timezoneDate, formatarData, AsyncSQLiteConnection } from 'vision-common';
import { IDeviceOrdemServicoRepositorio } from '../../domain/repositories/device/ordemServicoRepositorio';
import { PegarColetasAgendadasParams } from '../../domain/usecases/device/database/pegarColetasAgendadasUseCase';
import { IVerificarDependenciaOSParams } from '../../domain/usecases/device/database/verificarDependenciaOSUseCase';

export default class DeviceOrdemServicoRepositorio implements IDeviceOrdemServicoRepositorio {
    constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

    async criarTabelaColetasEnviadas() {
        const response = await this._conn.create(
            `CREATE TABLE IF NOT EXISTS ORDEM_SERVICO_COLETADAS (
        ID                          INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                  INTEGER,
        DS_VINCULO                  TEXT,
        CD_ORDEM_SERVICO            INTEGER,
        CD_ORDEM                    INTEGER,
        CD_ROTA                     INTEGER,
        CD_ROTERIZACAO              INTEGER,
        CD_DISPOSITIVO              INTEGER,
        CD_MOTORISTA                INTEGER,
        DS_PLACA                    TEXT,
        DS_ASSINATURA_BASE64        TEXT,
        MTR                         TEXT,
        DS_MTR_COD_BARRAS           TEXT,
        CD_ORDEM_PENDENTE           INTEGER,
        X_COLETOU_PENDENTE          INTEGER,
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
        DT_CADASTRO                 DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO              DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DS_OBSERVACAO               TEXT,
        DS_REFERENTE                TEXT,
        CD_CLASSIFICACAO            INTEGER )`,
            'ORDEM_SERVICO_COLETADAS',
        );

        return response;
    }

    async criarTabelaRotasColetasAgendadas() {
        const response = await this._conn.create(
            `CREATE TABLE IF NOT EXISTS ROTAS_ORDEM_SERVICO_AGENDADAS (
        ID                          INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                  INTEGER,
        CD_ROTA                     INTEGER,
        DS_ROTA                     TEXT,
        DT_CADASTRO                 DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO              DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME'))
      )`,
            'ROTAS_ORDEM_SERVICO_AGENDADAS',
        );

        return response;
    }

    async criarTabelaNovasColetas() {
        const response = await this._conn.create(
            `CREATE TABLE IF NOT EXISTS NOVAS_COLETAS (
        ID                                INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                        INTEGER,
        DS_VINCULO                        TEXT,
        CD_ORDEM_SERVICO                  INTEGER,
        CD_MOTIVO                         INTEGER,
        CD_ORDEM                          INTEGER,
        CD_ROTERIZACAO                    INTEGER,
        CD_ROTA                           INTEGER,
        CD_DISPOSITIVO                    INTEGER,
        CD_MOTORISTA                      INTEGER,
        DS_PLACA                          TEXT,
        DS_ASSINATURA_BASE64              TEXT,
        MTR                               TEXT,
        DS_MTR_COD_BARRAS                 TEXT,
        CD_CLIENTE                        INTEGER,
        CD_OBRA                           INTEGER,
        CD_CONTRATO                       INTEGER,
        DS_OBRA                           TEXT,
        DS_CLIENTE                        TEXT,
        DS_IMOBILIZADOS                   TEXT,
        DS_TELEFONE_CLIENTE               TEXT,
        DS_CPFCNPJ_CLIENTE                TEXT,
        DS_CPFCNPJ_RESPONSAVEL            TEXT,
        DS_RESPONSAVEL                    TEXT,
        DS_FUNCAO_RESPONSAVEL             TEXT,
        DS_EMAIL_RESPONSAVEL              TEXT,
        DT_ORDEM                          TEXT,
        DT_CADASTRO                       DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                    DATE DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DS_OBSERVACAO                     TEXT,
        DS_REFERENTE                      TEXT,
        CD_CLASSIFICACAO                  INTEGER )`,
            'NOVAS_COLETAS',
        );

        return response;
    }

    async criarTabelaColetasAgendadas() {
        const response = await this._conn.create(
            `CREATE TABLE IF NOT EXISTS ORDEM_SERVICO_AGENDADAS (
        ID                              INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                      INTEGER,
        CD_ORDEM_SERVICO                INTEGER,
        CD_ORDEM                        INTEGER,
        CD_ROTA                         INTEGER,
        DS_PLACA                        TEXT,
        MTR                             TEXT,
        DS_MTR_COD_BARRAS               TEXT,
        CD_ORDEM_PENDENTE               INTEGER,
        X_COLETOU_PENDENTE              INTEGER,
        CD_ROTERIZACAO                  INTEGER,
        CD_CLIENTE                      INTEGER,
        CD_MOTORISTA                    INTEGER,
        CD_DISPOSITIVO                  INTEGER,
        DS_CLIENTE                      TEXT,
        DS_TELEFONE_CLIENTE             TEXT,
        DS_CPFCNPJ_CLIENTE              TEXT,
        DS_CPFCNPJ_RESPONSAVEL          TEXT,
        DS_RESPONSAVEL                  TEXT,
        DS_FUNCAO_RESPONSAVEL           TEXT,
        DS_EMAIL_RESPONSAVEL            TEXT,
        DS_ASSINATURA_BASE64            TEXT,
        DS_VERSAO_APP                   TEXT,
        DT_ORDEM                        TEXT,
        DT_CADASTRO                     DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                  DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        CD_OBRA                         INTEGER,
        CD_CONTRATO                     INTEGER,
        DS_OBRA                         TEXT,
        DS_OBSERVACAO                   TEXT,
        DS_REFERENTE                    TEXT,
        CD_CLASSIFICACAO                INTEGER)`,
            'ORDEM_SERVICO_AGENDADAS',
        );

        return response;
    }

    async criarTabelaColetasAgendadasPendente() {
        const response = await this._conn.create(
            `CREATE TABLE IF NOT EXISTS ORDEM_SERVICO_AGENDADAS_PENDENTES (
        ID                                INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                        INTEGER,
        CD_ORDEM_SERVICO                  INTEGER,
        CD_ORDEM                          INTEGER,
        DS_PLACA                          TEXT,
        MTR                               TEXT,
        CD_ORDEM_PENDENTE                 INTEGER,
        X_COLETOU_PENDENTE                INTEGER,
        CD_ROTERIZACAO                    INTEGER,
        CD_ROTA                           INTEGER,
        DS_MTR_COD_BARRAS                 TEXT,
        CD_CLIENTE                        INTEGER,
        CD_MOTORISTA                      INTEGER,
        CD_DISPOSITIVO                    INTEGER,
        DS_CLIENTE                        TEXT,
        DS_TELEFONE_CLIENTE               TEXT,
        DS_CPFCNPJ_CLIENTE                TEXT,
        DS_CPFCNPJ_RESPONSAVEL            TEXT,
        DS_RESPONSAVEL                    TEXT,
        DS_FUNCAO_RESPONSAVEL             TEXT,
        DS_EMAIL_RESPONSAVEL              TEXT,
        DS_ASSINATURA_BASE64              TEXT,
        DS_VERSAO_APP                     TEXT,
        DT_ORDEM                          TEXT,
        DT_CADASTRO                       DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                    DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        CD_OBRA                           INTEGER,
        CD_CONTRATO                       INTEGER,
        DS_OBRA                           TEXT,
        DS_OBSERVACAO                     TEXT,
        DS_REFERENTE                      TEXT,
        DS_IMOBILIZADOS                   TEXT,
        CD_CLASSIFICACAO                  INTEGER )`,
            'ORDEM_SERVICO_AGENDADAS_PENDENTES',
        );

        return response;
    }

    async inserirColetaAgendadaPendente(coleta: IOrder) {
        const response = await this._conn.insert(
            `INSERT INTO ORDEM_SERVICO_AGENDADAS_PENDENTES (
        CD_USUARIO,
        CD_ORDEM_SERVICO,
        CD_ORDEM,
        CD_ROTERIZACAO,
        CD_ROTA,
        CD_PONTO,
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
        CD_DESTINADOR,
        CD_EMPRESA,
        DS_VINCULO,
        NR_KM_INICIAL,
        NR_KM_FINAL,
        CD_ID_UNICO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                this.userID,
                coleta.codigoOS,
                coleta.codigoOrdem,
                coleta.codigoRoterizacao,
                coleta.codigoRota,
                coleta.codigoPonto,
                coleta.codigoDispositivo,
                coleta.codigoMotorista,
                coleta.placa,
                coleta.assinaturaBase64,
                coleta?.periodicidade ?? null,
                coleta.mtr,
                coleta.codigoBarraMTR,
                coleta.codigoCliente,
                coleta.codigoObra,
                coleta.codigoContratoObra,
                coleta.nomeObra,
                coleta.nomeCliente,
                coleta.nomeFantasiaCliente,
                coleta.imobilizados,
                coleta.telefoneCliente,
                coleta.CNPJCliente,
                coleta.CPFCNPJResponsavel,
                coleta.nomeResponsavel,
                coleta.funcaoResponsavel,
                coleta.emailResponsavel,
                timezoneDate(new Date()),
                coleta?.dataChegada ?? null,
                coleta.observacaoOS,
                coleta.referenteOS,
                coleta.classificacaoOS,
                coleta.ordemColetaPendente,
                coleta.coletouPendente ? 1 : 0,
                coleta?.codigoDestinador ?? null,
                coleta?.codigoEmpresa ?? null,
                coleta?.codigoVinculo ?? '',
                coleta?.KMInicial ?? null,
                coleta?.KMFinal ?? null,
                coleta?.codigoUnico ?? null,
            ],
        );

        return response;
    }

    async pegarRotasColetasAgendadas() {
        const response = await this._conn.query<IRota>(
            `SELECT
        CD_ROTA             AS codigo,
        DS_ROTA             AS descricao
      FROM ROTAS_ORDEM_SERVICO_AGENDADAS`,
            [],
        );

        return response;
    }

    async inserirRotaColetaAgendada(rota: IRota) {
        const response = await this._conn.insert(
            `INSERT INTO ROTAS_ORDEM_SERVICO_AGENDADAS (
        CD_USUARIO,
        CD_ROTA,
        DS_ROTA
      ) VALUES (?, ?, ?)`,
            [this.userID, rota.codigo, rota.descricao],
        );

        return response;
    }

    async inserirColetaEnviada(coleta: IOrder, codigoVinculo: number | string) {
        const response = await this._conn.insert(
            `INSERT INTO ORDEM_SERVICO_COLETADAS (
        CD_USUARIO,
        DS_VINCULO,
        CD_ORDEM_SERVICO,
        CD_ORDEM,
        CD_ROTERIZACAO,
        CD_ROTA,
        CD_PONTO,
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
        CD_DESTINADOR,
        CD_EMPRESA,
        DS_VINCULO,
        NR_KM_INICIAL,
        NR_KM_FINAL
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                this.userID,
                codigoVinculo,
                coleta.codigoOS,
                coleta.codigoOrdem,
                coleta.codigoRoterizacao,
                coleta.codigoRota,
                coleta.codigoPonto,
                coleta.codigoDispositivo,
                coleta.codigoMotorista,
                coleta.placa,
                coleta.assinaturaBase64,
                coleta?.periodicidade ?? null,
                coleta.mtr,
                coleta.codigoBarraMTR,
                coleta.codigoCliente,
                coleta.codigoObra,
                coleta.codigoContratoObra,
                coleta.nomeObra,
                coleta.nomeCliente,
                coleta.nomeFantasiaCliente,
                coleta.imobilizados,
                coleta.telefoneCliente,
                coleta.CNPJCliente,
                coleta.CPFCNPJResponsavel,
                coleta.nomeResponsavel,
                coleta.funcaoResponsavel,
                coleta.emailResponsavel,
                coleta?.dataOS ? coleta.dataOS : timezoneDate(new Date()) /*data pega adata atual, nao mudar - douglas*/,
                coleta?.dataChegada ?? null,
                coleta.observacaoOS,
                coleta.referenteOS,
                coleta.classificacaoOS,
                coleta.ordemColetaPendente,
                coleta.coletouPendente ? 1 : 0,
                coleta?.codigoDestinador ?? null,
                coleta?.codigoEmpresa ?? null,
                coleta?.codigoVinculo ?? '',
                coleta?.KMInicial ?? null,
                coleta?.KMFinal ?? null,
            ],
        );

        return response;
    }

    async inserirNovaColeta(coleta: IOrder, codigoVinculo: number | string) {
        const response = await this._conn.insert(
            `INSERT INTO NOVAS_COLETAS (
        CD_USUARIO,
        DS_VINCULO,
        CD_ORDEM_SERVICO,
        CD_ORDEM,
        CD_ROTERIZACAO,
        CD_ROTA,
        CD_DISPOSITIVO,
        CD_MOTORISTA,
        DS_PLACA,
        DS_ASSINATURA_BASE64,
        MTR,
        DS_MTR_COD_BARRAS,
        CD_CLIENTE,
        CD_OBRA,
        CD_CONTRATO,
        DS_OBRA,
        DS_CLIENTE,
        DS_IMOBILIZADOS,
        DS_TELEFONE_CLIENTE,
        DS_CPFCNPJ_CLIENTE,
        DS_CPFCNPJ_RESPONSAVEL,
        DS_RESPONSAVEL,
        DS_FUNCAO_RESPONSAVEL,
        DS_EMAIL_RESPONSAVEL,
        DT_ORDEM,
        DS_OBSERVACAO,
        DS_REFERENTE,
        CD_CLASSIFICACAO,
        CD_EMPRESA,
        CD_DESTINADOR,
        NR_KM_INICIAL,
        NR_KM_FINAL,
        CD_ID_UNICO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                this.userID,
                codigoVinculo,
                coleta.codigoOS,
                coleta.codigoOrdem,
                coleta.codigoRoterizacao,
                coleta.codigoRota,
                coleta.codigoDispositivo,
                coleta.codigoMotorista,
                coleta.placa,
                coleta.assinaturaBase64,
                coleta.mtr,
                coleta.codigoBarraMTR,
                coleta.codigoCliente,
                coleta.codigoObra,
                coleta.codigoContratoObra,
                coleta.nomeObra,
                coleta.nomeCliente,
                coleta.imobilizados,
                coleta.telefoneCliente,
                coleta.CNPJCliente,
                coleta.CPFCNPJResponsavel,
                coleta.nomeResponsavel,
                coleta.funcaoResponsavel,
                coleta.emailResponsavel,
                timezoneDate(new Date()),
                coleta.observacaoOS,
                coleta.referenteOS,
                coleta.classificacaoOS,
                coleta?.codigoEmpresa ?? null,
                coleta?.codigoDestinador ?? null,
                coleta?.KMInicial ?? null,
                coleta?.KMFinal ?? null,
                coleta?.codigoUnico ?? null,
            ],
        );

        return response;
    }

    async deletarRotasColetasAgendadas() {
        const response = await this._conn.delete('DELETE FROM ROTAS_ORDEM_SERVICO_AGENDADAS WHERE CD_USUARIO = ?', [this.userID]);

        return response;
    }

    async pegarColetaEnviada(codigoVinculo: number | string) {
        const response = await this._conn.queryFisrt<IOrder>(
            `SELECT
        CD_ORDEM_SERVICO            AS codigoOS,
        CD_ORDEM                    AS codigoOrdem,
        CD_ROTERIZACAO              AS codigoRoterizacao,
        CD_ROTA                     AS codigoRota,
        DS_VINCULO                  AS codigoVinculo,
        CD_DISPOSITIVO              AS codigoDispositivo,
        CD_MOTORISTA                AS codigoMotorista,
        DS_PLACA                    AS placa,
        DS_ASSINATURA_BASE64        AS assinaturaBase64,
        DS_PERIODICIDADE            AS periodicidade,
        MTR                         AS mtr,
        DS_MTR_COD_BARRAS           AS codigoBarraMTR,
        CD_CLIENTE                  AS codigoCliente,
        CD_OBRA                     AS codigoObra,
        CD_CONTRATO                 AS codigoContratoObra,
        DS_OBRA                     AS nomeObra,
        DS_CLIENTE                  AS nomeCliente,
        DS_CLIENTE_FANTASIA         AS nomeFantasiaCliente,
        DS_IMOBILIZADOS             AS imobilizados,
        DS_TELEFONE_CLIENTE         AS telefoneCliente,
        DS_CPFCNPJ_CLIENTE          AS CNPJCliente,
        DS_CPFCNPJ_RESPONSAVEL      AS CPFCNPJResponsavel,
        DS_RESPONSAVEL              AS nomeResponsavel,
        DS_FUNCAO_RESPONSAVEL       AS funcaoResponsavel,
        DS_EMAIL_RESPONSAVEL        AS emailResponsavel,
        DT_ORDEM                    AS dataOS,
        DT_CHEGADA                  AS dataChegada,
        DS_OBSERVACAO               AS observacaoOS,
        DS_REFERENTE                AS referenteOS,
        CD_CLASSIFICACAO            AS classificacaoOS,
        CD_ORDEM_PENDENTE           AS ordemColetaPendente,
        X_COLETOU_PENDENTE          AS coletouPendente,
        CD_DESTINADOR               AS codigoDestinador,
        CD_EMPRESA                  AS codigoEmpresa,
        DS_VINCULO                  AS codigoVinculo,
        NR_KM_INICIAL               AS KMInicial,
        NR_KM_FINAL                 AS KMFinal
      FROM ORDEM_SERVICO_COLETADAS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
            [codigoVinculo, this.userID],
            '',
        );

        return response;
    }

    async pegarColetasAgendadasPendente(limit?: number, offset: number = 10, search?: string, filtros?: IFiltro) {
        const response = await this._conn.query<IOrder>(
            `SELECT
        CD_ORDEM_SERVICO                    AS codigoOS,
        CD_ORDEM                            AS codigoOrdem,
        CD_ROTERIZACAO                      AS codigoRoterizacao,
        CD_ROTA                             AS codigoRota,
        CD_PONTO                            AS codigoPonto,
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
        CD_DESTINADOR                       AS codigoDestinador,
        CD_EMPRESA                          AS codigoEmpresa,
        DS_VINCULO                          AS codigoVinculo,
        NR_KM_INICIAL                       AS KMInicial,
        NR_KM_FINAL                         AS KMFinal,
        CD_ID_UNICO                         AS codigoUnico
      FROM ORDEM_SERVICO_AGENDADAS_PENDENTES
      WHERE CD_USUARIO = ? AND (
        DS_OBRA LIKE ?
        OR DS_CLIENTE LIKE ?
        OR DT_ORDEM LIKE ?
        OR CD_ORDEM_SERVICO LIKE ?
      )
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_CLIENTE AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_OBRA AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_CLASSIFICACAO AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR (
        CAST(? AS INTEGER) = 1 AND CAST(CD_PONTO AS INTEGER) = 0
      ) OR (
        CAST(? AS INTEGER) = 2 AND CAST(CD_PONTO AS INTEGER) <> 0
      ))
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_ROTA AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR STRFTIME('%d/%m/%Y', DT_ORDEM) = ?)
      ORDER BY DT_ORDEM DESC
      ${limit ? `LIMIT ${limit} OFFSET ${offset}` : ''}
      `,
            [
                this.userID,
                search && search?.length > 0 ? `%${search}%` : '%',
                search && search?.length > 0 ? `%${search}%` : '%',
                search && search?.length > 0 ? `%${search}%` : '%',
                search && search?.length > 0 ? `%${search}%` : '%',
                filtros?.cliente?.codigo ?? 0,
                filtros?.cliente?.codigo ?? 0,
                filtros?.obra?.codigo ?? 0,
                filtros?.obra?.codigo ?? 0,
                filtros?.classificacao ?? 0,
                filtros?.classificacao ?? 0,
                filtros?.roterizacao ?? 0,
                filtros?.roterizacao ?? 0,
                filtros?.roterizacao ?? 0,
                filtros?.rota ?? 0,
                filtros?.rota ?? 0,
                filtros?.xTemData ? 1 : 0,
                formatarData(filtros?.dataColeta, 'DD/MM/YYYY'),
            ],
        );

        return response;
    }

    async deletarColetaAgendadaPendente(codigoOS: number) {
        const response = await this._conn.delete(
            'DELETE FROM ORDEM_SERVICO_AGENDADAS_PENDENTES WHERE CD_ORDEM_SERVICO = ? AND CD_USUARIO = ?',
            [codigoOS, this.userID],
        );

        return response;
    }

    async pegarColetaAgendadaPendente(codigoOS: number) {
        const response = await this._conn.queryFisrt<IOrder>(
            `SELECT
        CD_ORDEM_SERVICO                    AS codigoOS,
        CD_ORDEM                            AS codigoOrdem,
        CD_ROTERIZACAO                      AS codigoRoterizacao,
        CD_ROTA                             AS codigoRota,
        CD_PONTO                            AS codigoPonto,
        DS_VINCULO                          AS codigoVinculo,
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
        CD_DESTINADOR                       AS codigoDestinador,
        CD_EMPRESA                          AS codigoEmpresa,
        DS_VINCULO                          AS codigoVinculo,
        NR_KM_INICIAL                       AS KMInicial,
        NR_KM_FINAL                         AS KMFinal,
        CD_ID_UNICO                         AS codigoUnico
      FROM ORDEM_SERVICO_AGENDADAS_PENDENTES
      WHERE CD_ORDEM_SERVICO = ? AND CD_USUARIO = ?`,
            [codigoOS, this.userID],
            '',
        );

        return response;
    }

    async pegarNovasColetas(search: string, filtros: IFiltro) {
        const response = await this._conn.query<IOrder>(
            `SELECT
        CD_ORDEM_SERVICO                    AS codigoOS,
        CD_ORDEM                            AS codigoOrdem,
        CD_ROTERIZACAO                      AS codigoRoterizacao,
        CD_ROTA                             AS codigoRota,
        CD_DISPOSITIVO                      AS codigoDispositivo,
        CD_MOTORISTA                        AS codigoMotorista,
        DS_PLACA                            AS placa,
        DS_ASSINATURA_BASE64                AS assinaturaBase64,
        MTR                                 AS mtr,
        DS_MTR_COD_BARRAS                   AS codigoBarraMTR,
        CD_CLIENTE                          AS codigoCliente,
        CD_OBRA                             AS codigoObra,
        CD_CONTRATO                         AS codigoContratoObra,
        DS_OBRA                             AS nomeObra,
        DS_CLIENTE                          AS nomeCliente,
        DS_IMOBILIZADOS                     AS imobilizados,
        DS_TELEFONE_CLIENTE                 AS telefoneCliente,
        DS_CPFCNPJ_CLIENTE                  AS CNPJCliente,
        DS_CPFCNPJ_RESPONSAVEL              AS CPFCNPJResponsavel,
        DS_RESPONSAVEL                      AS nomeResponsavel,
        DS_FUNCAO_RESPONSAVEL               AS funcaoResponsavel,
        DS_EMAIL_RESPONSAVEL                AS emailResponsavel,
        DT_ORDEM                            AS dataOS,
        DS_OBSERVACAO                       AS observacaoOS,
        DS_REFERENTE                        AS referenteOS,
        CD_CLASSIFICACAO                    AS classificacaoOS,
        CD_EMPRESA                          AS codigoEmpresa,
        CD_DESTINADOR                       AS codigoDestinador,
        DS_VINCULO                          AS codigoVinculo,
        NR_KM_INICIAL                       AS KMInicial,
        NR_KM_FINAL                         AS KMFinal,
        CD_ID_UNICO                         AS codigoUnico
      FROM NOVAS_COLETAS
      WHERE CD_USUARIO = ? AND (
        DS_OBRA LIKE ?
        OR DS_CLIENTE LIKE ?
        OR DT_ORDEM LIKE ?
      )
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_CLIENTE AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_OBRA AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_CLASSIFICACAO AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR STRFTIME('%d/%m/%Y', DT_ORDEM) = ?)
      ORDER BY DT_ORDEM DESC`,
            [
                this.userID,
                search?.length > 0 ? `%${search}%` : '%',
                search?.length > 0 ? `%${search}%` : '%',
                search?.length > 0 ? `%${search}%` : '%',
                filtros?.cliente?.codigo ?? 0,
                filtros?.cliente?.codigo ?? 0,
                filtros?.obra?.codigo ?? 0,
                filtros?.obra?.codigo ?? 0,
                filtros?.classificacao ?? 0,
                filtros?.classificacao ?? 0,
                filtros?.xTemData ? 1 : 0,
                formatarData(filtros?.dataColeta, 'DD/MM/YYYY'),
            ],
        );

        return response;
    }

    async pegarNovaColeta(codigoVinculo: number | string) {
        const response = await this._conn.queryFisrt<IOrder>(
            `SELECT
        CD_ORDEM_SERVICO                    AS codigoOS,
        CD_ORDEM                            AS codigoOrdem,
        CD_ROTERIZACAO                      AS codigoRoterizacao,
        CD_ROTA                             AS codigoRota,
        CD_DISPOSITIVO                      AS codigoDispositivo,
        CD_MOTORISTA                        AS codigoMotorista,
        DS_PLACA                            AS placa,
        DS_ASSINATURA_BASE64                AS assinaturaBase64,
        MTR                                 AS mtr,
        DS_MTR_COD_BARRAS                   AS codigoBarraMTR,
        CD_CLIENTE                          AS codigoCliente,
        CD_OBRA                             AS codigoObra,
        CD_CONTRATO                         AS codigoContratoObra,
        DS_OBRA                             AS nomeObra,
        DS_CLIENTE                          AS nomeCliente,
        DS_IMOBILIZADOS                     AS imobilizados,
        DS_TELEFONE_CLIENTE                 AS telefoneCliente,
        DS_CPFCNPJ_CLIENTE                  AS CNPJCliente,
        DS_CPFCNPJ_RESPONSAVEL              AS CPFCNPJResponsavel,
        DS_RESPONSAVEL                      AS nomeResponsavel,
        DS_FUNCAO_RESPONSAVEL               AS funcaoResponsavel,
        DS_EMAIL_RESPONSAVEL                AS emailResponsavel,
        DT_ORDEM                            AS dataOS,
        DS_OBSERVACAO                       AS observacaoOS,
        DS_REFERENTE                        AS referenteOS,
        CD_CLASSIFICACAO                    AS classificacaoOS,
        CD_EMPRESA                          AS codigoEmpresa,
        DS_VINCULO                          AS codigoVinculo,
        CD_DESTINADOR                       AS codigoDestinador,
        NR_KM_INICIAL                       AS KMInicial,
        NR_KM_FINAL                         AS KMFinal,
        CD_ID_UNICO                         AS codigoUnico
      FROM NOVAS_COLETAS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
            [codigoVinculo, this.userID],
            '',
        );

        return response;
    }

    async deletarColetaAgendada(codigoOS: number) {
        const response = await this._conn.delete(
            'DELETE FROM ORDEM_SERVICO_AGENDADAS WHERE CD_ORDEM_SERVICO = ? AND CD_USUARIO = ?',
            [codigoOS, this.userID],
        );

        return response;
    }

    async deletarColetasAgendadasSincronizacao() {
        const response = await this._conn.multipleQuerys(
            [
                'DELETE FROM ORDEM_SERVICO_AGENDADAS',
                'DELETE FROM CHECKLISTS WHERE CD_USUARIO = ?',
                "DELETE FROM ENDERECOS WHERE DS_VINCULO LIKE '%VRCOLETAAGENDADA:%' AND CD_USUARIO = ?",
                "DELETE FROM IMAGENS WHERE DS_VINCULO LIKE '%VRCOLETAAGENDADA:%' AND CD_USUARIO = ?",
                "DELETE FROM MTRS_SINIR_ORDEM_SERVICO WHERE DS_VINCULO LIKE '%VRCOLETAAGENDADA:%' AND CD_USUARIO = ?",
                "DELETE FROM MTRS_ESTADOS_SINIR WHERE DS_VINCULO LIKE '%VRCOLETAAGENDADA:%' AND CD_USUARIO = ?",
                "DELETE FROM MOTIVOS_RECUSA_ASSINATURA WHERE DS_VINCULO LIKE '%VRCOLETAAGENDADA:%' AND CD_USUARIO = ?",
                "DELETE FROM MOTIVOS WHERE DS_VINCULO LIKE '%VRCOLETAAGENDADA:%' AND CD_USUARIO = ?",
                "DELETE FROM RESIDUOS WHERE DS_VINCULO LIKE '%VRCOLETAAGENDADA:%'",
                "DELETE FROM EQUIPAMENTOS WHERE DS_VINCULO LIKE '%VRCOLETAAGENDADA:%' AND CD_USUARIO = ?",
            ],
            [
                [],
                [this.userID],
                [this.userID],
                [this.userID],
                [this.userID],
                [this.userID],
                [this.userID],
                [this.userID],
                [],
                [this.userID],
            ],
        );

        return response;
    }

    async deletarNovaColeta(codigoVinculo: number | string) {
        const response = await this._conn.delete('DELETE FROM NOVAS_COLETAS  WHERE DS_VINCULO = ? AND CD_USUARIO = ?', [
            codigoVinculo,
            this.userID,
        ]);

        return response;
    }

    async deletarColetaEnviada(codigoVinculo: number | string) {
        const response = await this._conn.delete('DELETE FROM ORDEM_SERVICO_COLETADAS WHERE DS_VINCULO = ? AND CD_USUARIO = ?', [
            codigoVinculo,
            this.userID,
        ]);

        return response;
    }

    async pegarColetasEnviadas5Dias() {
        const response = await this._conn.query<IOrder>(
            `SELECT
        CD_ORDEM_SERVICO            AS codigoOS,
        CD_CLIENTE                  AS codigoCliente,
        DS_VINCULO                  AS codigoVinculo
      FROM ORDEM_SERVICO_COLETADAS
      WHERE ABS(CAST((JulianDay(DT_ORDEM) - JulianDay(CURRENT_TIMESTAMP)) As Integer) * -1) >= 5`,
            [],
        );

        return response;
    }

    async pegarColetasEnviadas(search: string, filtros: IFiltro) {
        const response = await this._conn.query<IOrder>(
            `SELECT
        CD_ORDEM_SERVICO            AS codigoOS,
        CD_ORDEM                    AS codigoOrdem,
        CD_ROTERIZACAO              AS codigoRoterizacao,
        DS_VINCULO                  AS codigoVinculo,
        CD_ROTA                     AS codigoRota,
        CD_DISPOSITIVO              AS codigoDispositivo,
        CD_MOTORISTA                AS codigoMotorista,
        DS_PLACA                    AS placa,
        DS_ASSINATURA_BASE64        AS assinaturaBase64,
        DS_PERIODICIDADE            AS periodicidade,
        MTR                         AS mtr,
        DS_MTR_COD_BARRAS           AS codigoBarraMTR,
        CD_CLIENTE                  AS codigoCliente,
        CD_OBRA                     AS codigoObra,
        CD_CONTRATO                 AS codigoContratoObra,
        DS_OBRA                     AS nomeObra,
        DS_CLIENTE                  AS nomeCliente,
        DS_CLIENTE_FANTASIA         AS nomeFantasiaCliente,
        DS_IMOBILIZADOS             AS imobilizados,
        DS_TELEFONE_CLIENTE         AS telefoneCliente,
        DS_CPFCNPJ_CLIENTE          AS CNPJCliente,
        DS_CPFCNPJ_RESPONSAVEL      AS CPFCNPJResponsavel,
        DS_RESPONSAVEL              AS nomeResponsavel,
        DS_FUNCAO_RESPONSAVEL       AS funcaoResponsavel,
        DS_EMAIL_RESPONSAVEL        AS emailResponsavel,
        DT_ORDEM                    AS dataOS,
        DT_CHEGADA                  AS dataChegada,
        DS_OBSERVACAO               AS observacaoOS,
        DS_REFERENTE                AS referenteOS,
        CD_CLASSIFICACAO            AS classificacaoOS,
        CD_ORDEM_PENDENTE           AS ordemColetaPendente,
        X_COLETOU_PENDENTE          AS coletouPendente,
        CD_DESTINADOR               AS codigoDestinador,
        CD_EMPRESA                  AS codigoEmpresa,
        DS_VINCULO                  AS codigoVinculo,
        NR_KM_INICIAL               AS KMInicial,
        NR_KM_FINAL                 AS KMFinal
      FROM ORDEM_SERVICO_COLETADAS
      WHERE CD_USUARIO = ? AND (
        DS_OBRA LIKE ?
        OR DS_CLIENTE LIKE ?
        OR DT_ORDEM LIKE ?
        OR CD_ORDEM_SERVICO LIKE ?
      )
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_CLIENTE AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_OBRA AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_CLASSIFICACAO AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR (
        CAST(? AS INTEGER) = 1 AND CAST(CD_PONTO AS INTEGER) = 0
      ) OR (
        CAST(? AS INTEGER) = 2 AND CAST(CD_PONTO AS INTEGER) <> 0
      ))
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_ROTA AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR STRFTIME('%d/%m/%Y', DT_ORDEM) = ?)
      ORDER BY DT_ORDEM DESC`,
            [
                this.userID,
                search?.length > 0 ? `%${search}%` : '%',
                search?.length > 0 ? `%${search}%` : '%',
                search?.length > 0 ? `%${search}%` : '%',
                search?.length > 0 ? `%${search}%` : '%',
                filtros?.cliente?.codigo ?? 0,
                filtros?.cliente?.codigo ?? 0,
                filtros?.obra?.codigo ?? 0,
                filtros?.obra?.codigo ?? 0,
                filtros?.classificacao ?? 0,
                filtros?.classificacao ?? 0,
                filtros?.roterizacao ?? 0,
                filtros?.roterizacao ?? 0,
                filtros?.roterizacao ?? 0,
                filtros?.rota ?? 0,
                filtros?.rota ?? 0,
                filtros?.xTemData ? 1 : 0,
                formatarData(filtros?.dataColeta, 'DD/MM/YYYY'),
            ],
        );

        return response;
    }

    async pegarTotalLinhasColetasAgendadas(params: PegarColetasAgendadasParams) {
        const response = await this._conn.queryFisrt<number>(
            `SELECT
        COUNT(DISTINCT(ORDEM.CD_ORDEM_SERVICO)) AS TOTAL
      FROM ORDEM_SERVICO_AGENDADAS ORDEM
        LEFT JOIN ENDERECOS E ON E.DS_VINCULO = '@VRCOLETAAGENDADA:' || ORDEM.CD_ORDEM_SERVICO
        WHERE (
          ORDEM.DS_CLIENTE LIKE ?
          OR ORDEM.DS_CLIENTE_FANTASIA LIKE ?
          OR ORDEM.DS_OBRA LIKE ?
        ) AND ORDEM.CD_USUARIO = ?
          AND ORDEM.CD_ORDEM_SERVICO NOT IN (SELECT CD_ORDEM_SERVICO FROM ORDEM_SERVICO_AGENDADAS_PENDENTES)
          AND TRIM(REPLACE(ORDEM.DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))
          AND (
            UPPER(E.DS_CIDADE) = UPPER(?)
            OR ? = ''
          )
          AND (CAST(? AS INTEGER) = 0 OR CAST(ORDEM.CD_CLIENTE AS INTEGER) = CAST(? AS INTEGER))
          AND (CAST(? AS INTEGER) = 0 OR CAST(ORDEM.CD_OBRA AS INTEGER) = CAST(? AS INTEGER))
          AND (CAST(? AS INTEGER) = 0 OR CAST(ORDEM.CD_CLASSIFICACAO AS INTEGER) = CAST(? AS INTEGER))
          AND (CAST(? AS INTEGER) = 0 OR (
            CAST(? AS INTEGER) = 1 AND CAST(ORDEM.CD_PONTO AS INTEGER) = 0
          ) OR (
            CAST(? AS INTEGER) = 2 AND CAST(ORDEM.CD_PONTO AS INTEGER) <> 0
          ))
          AND (CAST(? AS INTEGER) = 0 OR CAST(ORDEM.CD_ROTA AS INTEGER) = CAST(? AS INTEGER))
          AND (CAST(? AS INTEGER) = 0 OR STRFTIME('%d/%m/%Y', ORDEM.DT_ORDEM) = ?)`,
            [
                params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
                params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
                params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
                this.userID,
                params.placa ?? '',
                params.cidade ?? '',
                params.cidade ?? '',
                params.filtros?.cliente?.codigo ?? 0,
                params.filtros?.cliente?.codigo ?? 0,
                params.filtros?.obra?.codigo ?? 0,
                params.filtros?.obra?.codigo ?? 0,
                params.filtros?.classificacao ?? 0,
                params.filtros?.classificacao ?? 0,
                params.filtros?.roterizacao ?? 0,
                params.filtros?.roterizacao ?? 0,
                params.filtros?.roterizacao ?? 0,
                params.filtros?.rota ?? 0,
                params.filtros?.rota ?? 0,
                params.filtros?.xTemData ? 1 : 0,
                formatarData(params.filtros?.dataColeta, 'DD/MM/YYYY'),
            ],
            'TOTAL',
        );

        return response;
    }

    async pegarColetasAgendadas(params: PegarColetasAgendadasParams) {
        const response = await this._conn.query<IOrder>(
            `
        SELECT
          DISTINCT(ORDEM.CD_ORDEM_SERVICO)          AS codigoOS,
          ORDEM.CD_ORDEM                            AS codigoOrdem,
          ORDEM.CD_ROTERIZACAO                      AS codigoRoterizacao,
          ORDEM.CD_ROTA                             AS codigoRota,
          ORDEM.CD_PONTO                            AS codigoPonto,
          ORDEM.DS_PLACA                            AS placa,
          ORDEM.MTR                                 AS mtr,
          ORDEM.DS_PERIODICIDADE                    AS periodicidade,
          ORDEM.DS_MTR_COD_BARRAS                   AS mtrCodigoBarra,
          ORDEM.CD_CLIENTE                          AS codigoCliente,
          ORDEM.CD_MOTORISTA                        AS codigoMotorista,
          ORDEM.CD_DISPOSITIVO                      AS codigoDispositivo,
          ORDEM.DS_ASSINATURA_BASE64                AS assinaturaBase64,
          ORDEM.DS_CLIENTE                          AS nomeCliente,
          ORDEM.DS_CLIENTE_FANTASIA                 AS nomeFantasiaCliente,
          ORDEM.DS_TELEFONE_CLIENTE                 AS telefoneCliente,
          ORDEM.DS_CPFCNPJ_CLIENTE                  AS CNPJCliente,
          ORDEM.DS_CPFCNPJ_RESPONSAVEL              AS cpfcnpjResponsavel,
          ORDEM.DS_RESPONSAVEL                      AS nomeResponsavel,
          ORDEM.DS_FUNCAO_RESPONSAVEL               AS funcaoResponsavel,
          ORDEM.DS_EMAIL_RESPONSAVEL                AS emailResponsavel,
          ORDEM.DS_VERSAO_APP                       AS versaoAppSincronizacao,
          ORDEM.DT_ORDEM                            AS dataOS,
          ORDEM.DT_CHEGADA                          AS dataChegada,
          ORDEM.CD_OBRA                             AS codigoObra,
          ORDEM.CD_CONTRATO                         AS codigoContratoObra,
          ORDEM.DS_OBRA                             AS nomeObra,
          ORDEM.DS_OBSERVACAO                       AS observacaoOS,
          ORDEM.DS_REFERENTE                        AS referenteOS,
          ORDEM.CD_CLASSIFICACAO                    AS classificacaoOS,
          ORDEM.CD_ORDEM_PENDENTE                   AS ordemColetaPendente,
          ORDEM.X_COLETOU_PENDENTE                  AS coletouPendente,
          ORDEM.CD_DESTINADOR                       AS codigoDestinador,
          ORDEM.CD_EMPRESA                          AS codigoEmpresa,
          ORDEM.NR_KM_INICIAL                       AS KMInicial,
          ORDEM.NR_KM_FINAL                         AS KMFinal
        FROM ORDEM_SERVICO_AGENDADAS ORDEM
          LEFT JOIN ENDERECOS E ON E.DS_VINCULO = '@VRCOLETAAGENDADA:' || ORDEM.CD_ORDEM_SERVICO
        WHERE (
          ORDEM.DS_CLIENTE LIKE ?
          OR ORDEM.DS_CLIENTE_FANTASIA LIKE ?
          OR ORDEM.DS_OBRA LIKE ?
        ) AND ORDEM.CD_USUARIO = ?
          AND ORDEM.CD_ORDEM_SERVICO NOT IN (SELECT CD_ORDEM_SERVICO FROM ORDEM_SERVICO_AGENDADAS_PENDENTES)
          AND TRIM(REPLACE(ORDEM.DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))
          AND (
            UPPER(E.DS_CIDADE) = UPPER(?)
            OR ? = ''
          )
          AND (CAST(? AS INTEGER) = 0 OR CAST(ORDEM.CD_CLIENTE AS INTEGER) = CAST(? AS INTEGER))
          AND (CAST(? AS INTEGER) = 0 OR CAST(ORDEM.CD_OBRA AS INTEGER) = CAST(? AS INTEGER))
          AND (CAST(? AS INTEGER) = 0 OR CAST(ORDEM.CD_CLASSIFICACAO AS INTEGER) = CAST(? AS INTEGER))
          AND (CAST(? AS INTEGER) = 0 OR (
            CAST(? AS INTEGER) = 1 AND CAST(ORDEM.CD_PONTO AS INTEGER) = 0
          ) OR (
            CAST(? AS INTEGER) = 2 AND CAST(ORDEM.CD_PONTO AS INTEGER) <> 0
          ))
          AND (CAST(? AS INTEGER) = 0 OR CAST(ORDEM.CD_ROTA AS INTEGER) = CAST(? AS INTEGER))
          AND (CAST(? AS INTEGER) = 0 OR STRFTIME('%d/%m/%Y', ORDEM.DT_ORDEM) = ?)
          ORDER BY DATE(ORDEM.DT_ORDEM), CASE WHEN ORDEM.CD_PONTO IS NULL OR ORDEM.CD_PONTO = 0 THEN 1 ELSE 0 END, ORDEM.CD_PONTO, ORDEM.CD_ORDEM
          LIMIT ? OFFSET ?
      `,
            [
                params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
                params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
                params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
                this.userID,
                params.placa ?? '',
                params.cidade ?? '',
                params.cidade ?? '',
                params.filtros?.cliente?.codigo ?? 0,
                params.filtros?.cliente?.codigo ?? 0,
                params.filtros?.obra?.codigo ?? 0,
                params.filtros?.obra?.codigo ?? 0,
                params.filtros?.classificacao ?? 0,
                params.filtros?.classificacao ?? 0,
                params.filtros?.roterizacao ?? 0,
                params.filtros?.roterizacao ?? 0,
                params.filtros?.roterizacao ?? 0,
                params.filtros?.rota ?? 0,
                params.filtros?.rota ?? 0,
                params.filtros?.xTemData ? 1 : 0,
                formatarData(params.filtros?.dataColeta || timezoneDate(new Date())),
                params.pagination.amount ?? 10,
                params.pagination.page !== 0 ? `${params.pagination.amount * (params.pagination.page - 1)}` : params.pagination.page ?? 0,
            ],
        );

        return response;
    }

    async pegarTodasColetasAgendadas() {
        const response = await this._conn.query<IOrder>(
            `SELECT
          ORDEM.CD_ORDEM_SERVICO                    AS codigoOS,
          ORDEM.CD_ORDEM                            AS codigoOrdem,
          ORDEM.CD_ROTERIZACAO                      AS codigoRoterizacao,
          ORDEM.CD_ROTA                             AS codigoRota,
          ORDEM.CD_PONTO                            AS codigoPonto,
          ORDEM.DS_PLACA                            AS placa,
          ORDEM.MTR                                 AS mtr,
          ORDEM.DS_MTR_COD_BARRAS                   AS mtrCodigoBarra,
          ORDEM.DS_PERIODICIDADE                    AS periodicidade,
          ORDEM.CD_CLIENTE                          AS codigoCliente,
          ORDEM.CD_MOTORISTA                        AS codigoMotorista,
          ORDEM.CD_DISPOSITIVO                      AS codigoDispositivo,
          ORDEM.DS_ASSINATURA_BASE64                AS assinaturaBase64,
          ORDEM.DS_CLIENTE                          AS nomeCliente,
          ORDEM.DS_CLIENTE_FANTASIA                 AS nomeFantasiaCliente,
          ORDEM.DS_TELEFONE_CLIENTE                 AS telefoneCliente,
          ORDEM.DS_CPFCNPJ_CLIENTE                  AS CNPJCliente,
          ORDEM.DS_CPFCNPJ_RESPONSAVEL              AS cpfcnpjResponsavel,
          ORDEM.DS_RESPONSAVEL                      AS nomeResponsavel,
          ORDEM.DS_FUNCAO_RESPONSAVEL               AS funcaoResponsavel,
          ORDEM.DS_EMAIL_RESPONSAVEL                AS emailResponsavel,
          ORDEM.DS_VERSAO_APP                       AS versaoAppSincronizacao,
          ORDEM.DT_ORDEM                            AS dataOS,
          ORDEM.DT_CHEGADA                          AS dataChegada,
          ORDEM.CD_OBRA                             AS codigoObra,
          ORDEM.CD_CONTRATO                         AS codigoContratoObra,
          ORDEM.DS_OBRA                             AS nomeObra,
          ORDEM.DS_OBSERVACAO                       AS observacaoOS,
          ORDEM.DS_REFERENTE                        AS referenteOS,
          ORDEM.CD_CLASSIFICACAO                    AS classificacaoOS,
          ORDEM.CD_ORDEM_PENDENTE                   AS ordemColetaPendente,
          ORDEM.X_COLETOU_PENDENTE                  AS coletouPendente,
          ORDEM.CD_DESTINADOR                       AS codigoDestinador,
          ORDEM.CD_EMPRESA                          AS codigoEmpresa,
          ORDEM.NR_KM_INICIAL                       AS KMInicial,
          ORDEM.NR_KM_FINAL                         AS KMFinal
        FROM ORDEM_SERVICO_AGENDADAS ORDEM
          LEFT JOIN ENDERECOS E ON E.DS_VINCULO = '@VRCOLETAAGENDADA:' || ORDEM.CD_ORDEM_SERVICO
        WHERE ORDEM.CD_USUARIO = ?`,
            [this.userID],
        );

        return response;
    }

    async pegarColetaAgendada(codigoOS: number) {
        const response = await this._conn.queryFisrt<IOrder>(
            `SELECT
        CD_ORDEM_SERVICO                    AS codigoOS,
        CD_ORDEM                            AS codigoOrdem,
        CD_ROTERIZACAO                      AS codigoRoterizacao,
        CD_ROTA                             AS codigoRota,
        CD_PONTO                            AS codigoPonto,
        DS_PLACA                            AS placa,
        DS_PERIODICIDADE                    AS periodicidade,
        MTR                                 AS mtr,
        DS_MTR_COD_BARRAS                   AS mtrCodigoBarra,
        CD_CLIENTE                          AS codigoCliente,
        CD_MOTORISTA                        AS codigoMotorista,
        CD_DISPOSITIVO                      AS codigoDispositivo,
        DS_ASSINATURA_BASE64                AS assinaturaBase64,
        DS_CLIENTE                          AS nomeCliente,
        DS_CLIENTE_FANTASIA                 AS nomeFantasiaCliente,
        DS_TELEFONE_CLIENTE                 AS telefoneCliente,
        DS_CPFCNPJ_CLIENTE                  AS CNPJCliente,
        DS_CPFCNPJ_RESPONSAVEL              AS cpfcnpjResponsavel,
        DS_RESPONSAVEL                      AS nomeResponsavel,
        DS_FUNCAO_RESPONSAVEL               AS funcaoResponsavel,
        DS_EMAIL_RESPONSAVEL                AS emailResponsavel,
        DS_VERSAO_APP                       AS versaoAppSincronizacao,
        DT_ORDEM                            AS dataOS,
        DT_CHEGADA                          AS dataChegada,
        CD_OBRA                             AS codigoObra,
        CD_CONTRATO                         AS codigoContratoObra,
        DS_OBRA                             AS nomeObra,
        DS_OBSERVACAO                       AS observacaoOS,
        DS_REFERENTE                        AS referenteOS,
        CD_CLASSIFICACAO                    AS classificacaoOS,
        CD_ORDEM_PENDENTE                   AS ordemColetaPendente,
        X_COLETOU_PENDENTE                  AS coletouPendente,
        CD_DESTINADOR                       AS codigoDestinador,
        CD_EMPRESA                          AS codigoEmpresa,
        NR_KM_INICIAL                       AS KMInicial,
        NR_KM_FINAL                         AS KMFinal
      FROM ORDEM_SERVICO_AGENDADAS
      WHERE CD_ORDEM_SERVICO = ? AND CD_USUARIO = ?`,
            [codigoOS, this.userID],
            '',
        );

        return response;
    }

    async verificarDependenciaOSAgendada(params: IVerificarDependenciaOSParams) {
        const response = await this._conn.queryFisrt<number>(
            `SELECT
        IFNULL(ORDEM.CD_ORDEM_SERVICO, 0) AS CD_ORDEM_SERVICO
       FROM ORDEM_SERVICO_AGENDADAS ORDEM
       WHERE ORDEM.CD_ORDEM = ?
        AND ORDEM.CD_USUARIO = ?
        AND TRIM(REPLACE(ORDEM.DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))`,
            [params.ordemID, this.userID, params.placa],
            'CD_ORDEM_SERVICO',
        );

        return response;
    }

    async verificaExisteColetasPendentes(placa: string) {
        //olhar essa como modelo
        const response = await this._conn.queryFisrt<number>(
            `SELECT
        IFNULL(ORDEM.CD_ORDEM_SERVICO, 0) AS CD_ORDEM_SERVICO
      FROM ORDEM_SERVICO_AGENDADAS_PENDENTES ORDEM
      WHERE ORDEM.CD_USUARIO = ?
        AND TRIM(REPLACE(ORDEM.DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))`,
            [this.userID, placa],
            'CD_ORDEM_SERVICO',
        );

        return response;
    }

    async inserirColetasSincronizacao(sqlParams: string) {
        const response = await this._conn.query<void>(
            `INSERT INTO ORDEM_SERVICO_AGENDADAS (
        CD_USUARIO,
        CD_ORDEM_SERVICO,
        CD_ORDEM,
        CD_ROTERIZACAO,
        CD_ROTA,
        CD_PONTO,
        DS_PLACA,
        DS_PERIODICIDADE,
        MTR,
        DS_MTR_COD_BARRAS,
        CD_CLIENTE,
        CD_MOTORISTA,
        CD_DISPOSITIVO,
        DS_ASSINATURA_BASE64,
        DS_CLIENTE,
        DS_CLIENTE_FANTASIA,
        DS_TELEFONE_CLIENTE,
        DS_CPFCNPJ_CLIENTE,
        DS_CPFCNPJ_RESPONSAVEL,
        DS_RESPONSAVEL,
        DS_FUNCAO_RESPONSAVEL,
        DS_EMAIL_RESPONSAVEL,
        DS_VERSAO_APP,
        DT_ORDEM,
        CD_OBRA,
        CD_CONTRATO,
        DS_OBRA,
        DS_OBSERVACAO,
        DS_REFERENTE,
        CD_CLASSIFICACAO,
        CD_ORDEM_PENDENTE,
        X_COLETOU_PENDENTE,
        CD_DESTINADOR,
        CD_EMPRESA,
        NR_KM_INICIAL,
        NR_KM_FINAL
      ) VALUES ${sqlParams}`,
            [],
        );

        return response;
    }

    async pegarUltimoKmColetado() {
        //validar pois está pegando o ultimo km de qualquer placa.
        const response = await this._conn.queryFisrt<number>(
            `
        SELECT MAX(NR_KM_FINAL) AS NR_KM_FINAL
        FROM (
            SELECT NR_KM_FINAL
            FROM ORDEM_SERVICO_AGENDADAS_PENDENTES
            WHERE CD_USUARIO = ? AND NR_KM_FINAL IS NOT NULL
            UNION ALL
            SELECT NR_KM_FINAL
            FROM ORDEM_SERVICO_COLETADAS
            WHERE CD_USUARIO = ? AND NR_KM_FINAL IS NOT NULL
            UNION ALL
            SELECT NR_KM_FINAL
            FROM NOVAS_COLETAS
            WHERE CD_USUARIO = ? AND NR_KM_FINAL IS NOT NULL
        )
        ORDER BY NR_KM_FINAL DESC LIMIT 1
      `,
            [this.userID, this.userID, this.userID],
            'NR_KM_FINAL',
        );

        return response;
    }
}

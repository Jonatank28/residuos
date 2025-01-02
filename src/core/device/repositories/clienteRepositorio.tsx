import { AsyncSQLiteConnection, IPaginationParams } from 'vision-common';
import { ICliente } from '../../domain/entities/cliente';
import { IClienteCheckIn } from '../../domain/entities/clienteCheckIn';
import { IObra } from '../../domain/entities/obra';
import { IDeviceClienteRepositorio } from '../../domain/repositories/device/clienteRepositorio';
import { IPegarObrasClientesPaginadoDeviceParams } from '../../domain/usecases/device/database/pegarObrasClientesPaginadoDeviceUseCase';
import { IVerificarObrasClienteDeviceUseCaseParams } from '../../domain/usecases/device/database/verificarObrasClienteDeviceUseCase';
import { IGravarCheckInClienteParams } from '../../domain/usecases/device/database/location/gravarCheckInClienteDeviceUseCase';

export default class DeviceClienteRepositorio implements IDeviceClienteRepositorio {
  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) {}

  async criarTabelaClientes() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS CLIENTES (
        ID                      INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_CLIENTE              INTEGER,
        CD_USUARIO              INTEGER,
        DS_CLIENTE              TEXT,
        DS_RAZAO_SOCIAL         TEXT,
        NR_CPFCNPJ              TEXT,
        NR_ESTADUAL             TEXT,
        NR_MUNICIPAL            TEXT,
        DS_TELEFONE             TEXT,
        DT_CADASTRO             DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO          DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'CLIENTES',
    );

    return response;
  }

  async criarTabelaCheckInCheckOut() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS CLIENTES_CHECKIN_CHECKOUT (
        CD_ID								                    INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_CLIENTE                              INTEGER(10) NOT NULL,
        X_ONLINE                                INTEGER(1) NOT NULL DEFAULT 0,
        DT_CHECKIN                 	        	  DATE NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_CHECKOUT               	        	  DATE NULL,
        CD_LOCATION_CHECKIN                     INTEGER NOT NULL,
        CD_LOCATION_CHECKOUT                    INTEGER NULL,
        CD_USUARIO                              INTEGER NOT NULL,
        CONSTRAINT FK_LOCATION_CLIENTES_CHECKIN FOREIGN KEY (CD_LOCATION_CHECKIN) REFERENCES LOCATION(CD_ID),
        CONSTRAINT FK_LOCATION_CLIENTES_CHECKOUT FOREIGN KEY (CD_LOCATION_CHECKOUT) REFERENCES LOCATION(CD_ID)
      )`,
      'CLIENTES_CHECKIN_CHECKOUT',
    );
    return response;
  }

  async criarTabelaObras() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS OBRAS (
        ID                        INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_OBRA                   INTEGER,
        CD_USUARIO                INTEGER,
        CD_CONTRATO               INTEGER,
        CD_CLIENTE                INTEGER,
        DS_OBRA                   TEXT,
        DT_CADASTRO               DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO            DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'OBRAS',
    );

    return response;
  }

  async inserirCliente(cliente: ICliente) {
    const response = await this._conn.insert(
      `INSERT INTO CLIENTES (
        CD_CLIENTE,
        CD_USUARIO,
        DS_CLIENTE,
        DS_RAZAO_SOCIAL,
        NR_CPFCNPJ,
        NR_ESTADUAL,
        NR_MUNICIPAL,
        DS_TELEFONE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente.codigo,
        this.userID,
        cliente.nomeFantasia,
        cliente.razaoSocial,
        cliente.cpfcnpj,
        cliente.inscricaoEstadual,
        cliente.inscricaoMunicipal,
        cliente.telefone,
      ],
    );

    return response;
  }

  async inserirObraCliente(obra: IObra) {
    const response = await this._conn.insert(
      `INSERT INTO OBRAS (
        CD_OBRA,
        CD_USUARIO,
        CD_CLIENTE,
        CD_CONTRATO,
        DS_OBRA,
        CD_DESTINADOR,
        CD_EMPRESA
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        obra.codigo,
        this.userID,
        obra.codigoCliente,
        obra.codigoContrato,
        obra.descricao,
        obra?.codigoDestinador ?? null,
        obra?.codigoEmpresa ?? null,
      ],
    );

    return response;
  }

  async pegarCliente(codigoCliente: number) {
    const response = await this._conn.queryFisrt<ICliente>(
      `SELECT
        CD_CLIENTE          AS codigo,
        DS_CLIENTE          AS nomeFantasia,
        DS_RAZAO_SOCIAL     AS razaoSocial,
        NR_CPFCNPJ          AS cpfcnpj,
        NR_ESTADUAL         AS inscricaoEstadual,
        NR_MUNICIPAL        AS inscricaoMunicipal,
        DS_TELEFONE         AS telefone
      FROM CLIENTES
      WHERE CD_CLIENTE = ? AND CD_USUARIO = ?`,
      [codigoCliente, this.userID],
    );

    return response;
  }

  async pegarObrasCliente(clienteID: number) {
    const response = await this._conn.query<IObra>(
      `SELECT
        CD_OBRA           AS codigo,
        CD_CLIENTE        AS codigoCliente,
        DS_OBRA           AS descricao,
        CD_CONTRATO       AS codigoContrato,
        CD_DESTINADOR     AS codigoDestinador,
        CD_EMPRESA        AS codigoEmpresa
      FROM OBRAS
      WHERE CD_CLIENTE  = ? AND CD_USUARIO = ?
      ORDER BY ID DESC`,
      [clienteID, this.userID],
    );

    return response;
  }

  async pegarObrasClientePaginado(params: IVerificarObrasClienteDeviceUseCaseParams) {
    const response = await this._conn.query<IObra>(
      `SELECT
        CD_OBRA           AS codigo,
        CD_CLIENTE        AS codigoCliente,
        DS_OBRA           AS descricao,
        CD_CONTRATO       AS codigoContrato,
        CD_DESTINADOR     AS codigoDestinador,
        CD_EMPRESA        AS codigoEmpresa
      FROM OBRAS
      WHERE (
        DS_OBRA LIKE ?
        OR CD_OBRA LIKE ?
      ) AND CD_CLIENTE  = ? AND CD_USUARIO = ? ORDER BY ID DESC
      LIMIT ? OFFSET ? `,
      [
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        params.clienteID,
        this.userID,
        params.pagination.amount ?? 10,
        params.pagination.page !== 0 ? `${params.pagination.amount * (params.pagination.page - 1)}` : params.pagination.page ?? 0,
      ],
    );

    return response;
  }

  async deletarCliente(codigoCliente: number) {
    const response = await this._conn.delete('DELETE FROM CLIENTES WHERE CD_CLIENTE = ? AND CD_USUARIO = ?', [
      codigoCliente,
      this.userID,
    ]);

    return response;
  }

  async deletarObrasClientes() {
    const response = await this._conn.multipleQuerys(
      [
        'DELETE FROM OBRAS WHERE CD_USUARIO = ?',
        "DELETE FROM ENDERECOS WHERE DS_VINCULO LIKE '%VROBRACLIENTE%' AND CD_USUARIO = ?",
      ],
      [[this.userID], [this.userID]],
    );

    return response;
  }

  async deletarClientes() {
    const response = await this._conn.delete('DELETE FROM CLIENTES WHERE CD_USUARIO = ?', [this.userID]);

    return response;
  }

  async pegarTotalLinhasClientes() {
    const response = await this._conn.queryFisrt<number>(
      `SELECT
        COUNT(CD_CLIENTE) AS TOTAL
      FROM CLIENTES
      WHERE CD_USUARIO = ?`,
      [this.userID],
      'TOTAL',
    );

    return response;
  }

  async pegarTotalLinhasObras() {
    const response = await this._conn.queryFisrt<number>(
      `SELECT
        COUNT(CD_OBRA) AS TOTAL
      FROM OBRAS
      WHERE CD_USUARIO = ?`,
      [this.userID],
      'TOTAL',
    );

    return response;
  }

  async pegarClientes(params: IPaginationParams) {
    const response = await this._conn.query<ICliente>(
      `SELECT
        CD_CLIENTE          AS codigo,
        DS_CLIENTE          AS nomeFantasia,
        DS_RAZAO_SOCIAL     AS razaoSocial,
        NR_CPFCNPJ          AS cpfcnpj,
        NR_ESTADUAL         AS inscricaoEstadual,
        NR_MUNICIPAL        AS inscricaoMunicipal,
        DS_TELEFONE         AS telefone
      FROM CLIENTES
      WHERE (
        CD_CLIENTE LIKE ?
        OR DS_CLIENTE LIKE ?
        OR DS_RAZAO_SOCIAL LIKE ?
      ) AND CD_USUARIO = ? ORDER BY DS_CLIENTE
      LIMIT ? OFFSET ?`,
      [
        params.search?.length > 0 ? `%${params.search}%` : '%',
        params.search?.length > 0 ? `%${params.search}%` : '%',
        params.search?.length > 0 ? `%${params.search}%` : '%',
        this.userID,
        params.amount ?? 10,
        params.page !== 0 ? `${params.amount * (params.page - 1)}` : params.page ?? 0,
      ],
    );

    return response;
  }

  async pegarObrasPaginado(params: IPegarObrasClientesPaginadoDeviceParams) {
    const response = await this._conn.query<IObra>(
      `SELECT
        DISTINCT(OBRA.CD_OBRA)            AS codigo,
        OBRA.CD_CLIENTE         AS codigoCliente,
        OBRA.DS_OBRA            AS descricao,
        OBRA.CD_CONTRATO        AS codigoContrato,
        OBRA.CD_EMPRESA         AS codigoEmpresa,
        OBRA.CD_DESTINADOR      AS codigoDestinador
      FROM OBRAS OBRA
      WHERE (
        OBRA.CD_OBRA LIKE ?
        OR OBRA.DS_OBRA LIKE ?
      ) AND OBRA.CD_USUARIO = ?
      AND (CAST(? AS INTEGER) = 0 OR CAST(OBRA.CD_CLIENTE AS INTEGER) = CAST(? AS INTEGER))
      AND OBRA.CD_OBRA IN (
        SELECT
          DISTINCT(OS.CD_OBRA)
        FROM ORDEM_SERVICO_AGENDADAS OS
        WHERE TRIM(REPLACE(OS.DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))
        AND OS.CD_CLIENTE = OBRA.CD_CLIENTE
        OR (
          TRIM(REPLACE(?, '-', '')) = '' AND (
            SELECT
              DISTINCT(OS_PENDENTE.CD_OBRA)
            FROM ORDEM_SERVICO_AGENDADAS_PENDENTES OS_PENDENTE
            WHERE OS_PENDENTE.CD_CLIENTE = OBRA.CD_CLIENTE
            UNION ALL
            SELECT
              DISTINCT(OS_COLETADA.CD_OBRA)
            FROM ORDEM_SERVICO_COLETADAS OS_COLETADA
          WHERE OS_COLETADA.CD_CLIENTE = OBRA.CD_CLIENTE
          )
        )
      )
      ORDER BY OBRA.DS_OBRA
      LIMIT ? OFFSET ?`,
      [
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        this.userID,
        params.clienteID,
        params.clienteID,
        params.placa ?? '',
        params.placa ?? '',
        params.pagination.amount ?? 10,
        params.pagination.page !== 0 ? `${params.pagination.amount * (params.pagination.page - 1)}` : params.pagination.page ?? 0,
      ],
    );

    return response;
  }

  async pegarObrasColetasAgendadasPaginado(params: IPegarObrasClientesPaginadoDeviceParams) {
    const response = await this._conn.query<IObra>(
      `SELECT
        DISTINCT(OBRA.CD_OBRA)            AS codigo,
        OBRA.CD_CLIENTE                   AS codigoCliente,
        OBRA.DS_OBRA                      AS descricao,
        OBRA.CD_CONTRATO                  AS codigoContrato,
        OBRA.CD_EMPRESA                   AS codigoEmpresa,
        OBRA.CD_DESTINADOR                AS codigoDestinador
      FROM OBRAS OBRA
      WHERE (
        OBRA.CD_OBRA LIKE ?
        OR OBRA.DS_OBRA LIKE ?
      ) AND OBRA.CD_USUARIO = ?
      AND (CAST(? AS INTEGER) = 0 OR CAST(OBRA.CD_CLIENTE AS INTEGER) = CAST(? AS INTEGER))
      AND OBRA.CD_OBRA IN (
        SELECT
          DISTINCT(OS.CD_OBRA)
        FROM ORDEM_SERVICO_AGENDADAS OS
        WHERE TRIM(REPLACE(OS.DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))
        AND OS.CD_CLIENTE = OBRA.CD_CLIENTE
      )
      ORDER BY OBRA.DS_OBRA
      LIMIT ? OFFSET ?`,
      [
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        this.userID,
        params.clienteID,
        params.clienteID,
        params.placa ?? '',
        params.pagination.amount ?? 10,
        params.pagination.page !== 0 ? `${params.pagination.amount * (params.pagination.page - 1)}` : params.pagination.page ?? 0,
      ],
    );

    return response;
  }

  async pegarObrasHistoricoColetasPaginado(params: IPegarObrasClientesPaginadoDeviceParams) {
    const response = await this._conn.query<IObra>(
      `SELECT
        DISTINCT(OBRA.CD_OBRA)            AS codigo,
        OBRA.CD_CLIENTE                   AS codigoCliente,
        OBRA.DS_OBRA                      AS descricao,
        OBRA.CD_CONTRATO                  AS codigoContrato,
        OBRA.CD_EMPRESA                   AS codigoEmpresa,
        OBRA.CD_DESTINADOR                AS codigoDestinador
      FROM OBRAS OBRA
      WHERE (
        OBRA.CD_OBRA LIKE ?
        OR OBRA.DS_OBRA LIKE ?
      ) AND OBRA.CD_USUARIO = ?
      AND (CAST(? AS INTEGER) = 0 OR CAST(OBRA.CD_CLIENTE AS INTEGER) = CAST(? AS INTEGER))
      AND OBRA.CD_OBRA IN (
        SELECT
              DISTINCT(OS_PENDENTE.CD_OBRA)
            FROM ORDEM_SERVICO_AGENDADAS_PENDENTES OS_PENDENTE
          WHERE OS_PENDENTE.CD_CLIENTE = OBRA.CD_CLIENTE
          UNION ALL
          SELECT
              DISTINCT(OS_COLETADA.CD_OBRA)
            FROM ORDEM_SERVICO_COLETADAS OS_COLETADA
          WHERE OS_COLETADA.CD_CLIENTE = OBRA.CD_CLIENTE
      )
      ORDER BY OBRA.DS_OBRA
      LIMIT ? OFFSET ?`,
      [
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        this.userID,
        params.clienteID,
        params.clienteID,
        params.pagination.amount ?? 10,
        params.pagination.page !== 0 ? `${params.pagination.amount * (params.pagination.page - 1)}` : params.pagination.page ?? 0,
      ],
    );

    return response;
  }

  async inserirCheckIn(params: IGravarCheckInClienteParams, locationId: number) {
    const response = await this._conn.insert(
      `INSERT INTO CLIENTES_CHECKIN_CHECKOUT (
        CD_CLIENTE,
        X_ONLINE,
        CD_LOCATION_CHECKIN,
        CD_USUARIO,
        NR_ORDEM_SERVICO,
        X_SINCRONIZADO
        ) VALUES (?, ?, ?, ?, ?, ?)`,
      [params.clienteID, params.xOnline ? 1 : 0, locationId, this.userID, params.codigoOs, params?.xSincronizado ? 1 : 0],
    );

    return response;
  }

  async verificaCheckInAtivo() {
    const response = await this._conn.queryFisrt<number>(
      `SELECT
        CD_CLIENTE
      FROM CLIENTES_CHECKIN_CHECKOUT
      WHERE DT_CHECKOUT IS NULL
      AND CD_LOCATION_CHECKOUT IS NULL
      AND CD_USUARIO = ?`,
      [this.userID],
      'CD_CLIENTE',
    );

    return response;
  }

  async fazerCheckOut(clienteID: number, locationID: number) {
    const response = await this._conn.update(
      `UPDATE CLIENTES_CHECKIN_CHECKOUT SET
        DT_CHECKOUT = (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        CD_LOCATION_CHECKOUT = ?
        WHERE CD_CLIENTE = ? AND DT_CHECKOUT IS NULL
        AND CD_LOCATION_CHECKOUT IS NULL
        AND CD_USUARIO = ?
      `,
      [locationID, clienteID, this.userID],
    );

    return response;
  }

  async deletarCheckInClientes() {
    const response = await this._conn.delete(
      `DELETE FROM CLIENTES_CHECKIN_CHECKOUT
      WHERE CD_USUARIO = ?
        AND (SELECT COUNT(*) FROM ORDEM_SERVICO_COLETADAS OS_COLETADAS WHERE OS_COLETADAS.CD_ORDEM_SERVICO = NR_ORDEM_SERVICO) = 0`,
      [this.userID],
    );

    await this._conn.update(
      `UPDATE CLIENTES_CHECKIN_CHECKOUT SET
        X_SINCRONIZADO = 1
      WHERE CD_USUARIO = ?`,
      [this.userID],
    );

    return response;
  }

  async deletarAtualizarCheckInsOrdemServico(codigoOS: number) {
    const response = await this._conn.update(
      `UPDATE CLIENTES_CHECKIN_CHECKOUT SET
        X_SINCRONIZADO = 1
      WHERE CD_USUARIO = ? AND NR_ORDEM_SERVICO = ?`,
      [this.userID, codigoOS],
    );

    return response;
  }

  async pegarCheckInClientesDevice() {
    const response = await this._conn.query<IClienteCheckIn>(
      `SELECT
        CLIENTES_CHECKIN.CD_CLIENTE                    AS clienteID,
        CLIENTES_CHECKIN.DT_CHECKIN                    AS dataCheckIn,
        CLIENTES_CHECKIN.DT_CHECKOUT                   AS dataCheckOut,
        CLIENTES_CHECKIN.NR_ORDEM_SERVICO              AS ordemServico,
        CLIENTES_CHECKIN.X_SINCRONIZADO                AS xSincronizado,
        (
          SELECT
            NR_LATITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKIN
        ) AS checkInLatitude,
        (
          SELECT
            NR_LONGITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKIN
        ) AS checkInLongitude,
        (
          SELECT
            NR_LATITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKOUT
        ) AS checkOutLatitude,
        (
          SELECT
            NR_LONGITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKOUT
        ) AS checkOutLongitude
      FROM CLIENTES_CHECKIN_CHECKOUT CLIENTES_CHECKIN
      WHERE CLIENTES_CHECKIN.CD_USUARIO = ?`,
      [this.userID],
    );

    return response;
  }

  async pegarCheckinPorCodigoOSDevice(codigoOS: number) {
    const response = await this._conn.queryFisrt<IClienteCheckIn>(
      `SELECT
        CLIENTES_CHECKIN.CD_CLIENTE                    AS clienteID,
        CLIENTES_CHECKIN.DT_CHECKIN                    AS dataCheckIn,
        CLIENTES_CHECKIN.DT_CHECKOUT                   AS dataCheckOut,
        CLIENTES_CHECKIN.NR_ORDEM_SERVICO              AS ordemServico,
        CLIENTES_CHECKIN.X_SINCRONIZADO                AS xSincronizado,
        (
          SELECT
            NR_LATITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKIN
        ) AS checkInLatitude,
        (
          SELECT
            NR_LONGITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKIN
        ) AS checkInLongitude,
        (
          SELECT
            NR_LATITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKOUT
        ) AS checkOutLatitude,
        (
          SELECT
            NR_LONGITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKOUT
        ) AS checkOutLongitude
      FROM CLIENTES_CHECKIN_CHECKOUT CLIENTES_CHECKIN
      WHERE CLIENTES_CHECKIN.CD_USUARIO = ?
        AND CLIENTES_CHECKIN.NR_ORDEM_SERVICO = ?`,
      [this.userID, codigoOS],
    );

    return response;
  }

  async pegarCheckinsOrdemServicoDevice(codigoOS: number) {
    const response = await this._conn.query<IClienteCheckIn>(
      `SELECT
        CLIENTES_CHECKIN.CD_CLIENTE                    AS clienteID,
        CLIENTES_CHECKIN.DT_CHECKIN                    AS dataCheckIn,
        CLIENTES_CHECKIN.DT_CHECKOUT                   AS dataCheckOut,
        CLIENTES_CHECKIN.NR_ORDEM_SERVICO              AS ordemServico,
        CLIENTES_CHECKIN.X_SINCRONIZADO                AS xSincronizado,
        (
          SELECT
            NR_LATITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKIN
        ) AS checkInLatitude,
        (
          SELECT
            NR_LONGITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKIN
        ) AS checkInLongitude,
        (
          SELECT
            NR_LATITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKOUT
        ) AS checkOutLatitude,
        (
          SELECT
            NR_LONGITUDE
          FROM LOCATION
          WHERE CD_ID = CLIENTES_CHECKIN.CD_LOCATION_CHECKOUT
        ) AS checkOutLongitude
      FROM CLIENTES_CHECKIN_CHECKOUT CLIENTES_CHECKIN
      WHERE CLIENTES_CHECKIN.CD_USUARIO = ?
        AND CLIENTES_CHECKIN.NR_ORDEM_SERVICO = ?`,
      [this.userID, codigoOS],
    );

    return response;
  }

  async atualizarCheckoutClientePorCodigoOSDevice(codigoOS: number, dataCheckout: Date, localizacaoID: number) {
    const response = await this._conn.update(
      `UPDATE CLIENTES_CHECKIN_CHECKOUT SET
        DT_CHECKOUT = ?,
        CD_LOCATION_CHECKOUT = ?
      WHERE CD_USUARIO = ?
      AND NR_ORDEM_SERVICO = ?`,
      [dataCheckout, localizacaoID, this.userID, codigoOS],
    );

    return response;
  }

  async inserirObrasClientesSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO OBRAS (
        CD_OBRA,
        CD_USUARIO,
        CD_CLIENTE,
        CD_CONTRATO,
        DS_OBRA,
        CD_DESTINADOR,
        CD_EMPRESA
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async inserirClientesSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO CLIENTES (
        CD_CLIENTE,
        CD_USUARIO,
        DS_CLIENTE,
        DS_RAZAO_SOCIAL,
        NR_CPFCNPJ,
        NR_ESTADUAL,
        NR_MUNICIPAL,
        DS_TELEFONE,
        DS_CELULAR
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }
}

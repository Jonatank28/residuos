import { AsyncSQLiteConnection } from 'vision-common';
import { IBalanca } from '../../domain/entities/balanca/balanca';
import { IDeviceBalancaRepositorio } from '../../domain/repositories/device/balancaRepositorio';

export default class DeviceBalancaRepositorio implements IDeviceBalancaRepositorio {

  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaBalancas() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS BALANCAS (
        CD_ID                           INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_BALANCA_CONTROLLER           INTEGER NULL,
        CD_USUARIO                      INTEGER NOT NULL,
        DS_BALANCA                      TEXT NOT NULL,
        CD_TIPO_CONEXAO                 INTEGER(1) NOT NULL DEFAULT 0,
        CD_TIPO_BALANCA                 INTEGER(1) NOT NULL,
        TCP_IP                          TEXT NULL,
        TCP_PORTA                       INTEGER NULL,
        BLUETOOTH_MAC_ADDRESS           TEXT NULL,
        DT_CADASTRO                     NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                  NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'BALANCAS'
    );

    return response;
  }

  async pegarBalancas() {
    const response = await this._conn.query<IBalanca>(
      `SELECT
        CD_ID                           AS codigo,
        CD_BALANCA_CONTROLLER           AS codigoBalancaController,
        DS_BALANCA                      AS descricaoBalanca,
        CD_TIPO_CONEXAO                 AS tipoConexao,
        CD_TIPO_BALANCA                 AS tipoBalanca,
        TCP_IP                          AS tcpIP,
        TCP_PORTA                       AS tcpPorta,
        BLUETOOTH_MAC_ADDRESS           AS bluetoothMacAddress
      FROM BALANCAS
      WHERE CD_USUARIO = ?`,
      [this.userID]
    );

    return response;
  }

  async pegarBalancasCadastradasMobile() {
    const response = await this._conn.query<IBalanca>(
      `SELECT
        CD_ID                           AS codigo,
        CD_BALANCA_CONTROLLER           AS codigoBalancaController,
        DS_BALANCA                      AS descricaoBalanca,
        CD_TIPO_CONEXAO                 AS tipoConexao,
        CD_TIPO_BALANCA                 AS tipoBalanca,
        TCP_IP                          AS tcpIP,
        TCP_PORTA                       AS tcpPorta,
        BLUETOOTH_MAC_ADDRESS           AS bluetoothMacAddress
      FROM BALANCAS
      WHERE CD_USUARIO = ? AND CD_BALANCA_CONTROLLER IS NULL`,
      [this.userID]
    );

    return response;
  }

  async inserirBalanca(item: IBalanca) {
    const response = await this._conn.insert(
      `INSERT INTO BALANCAS (
        CD_BALANCA_CONTROLLER,
        CD_USUARIO,
        DS_BALANCA,
        CD_TIPO_CONEXAO,
        CD_TIPO_BALANCA,
        TCP_IP,
        TCP_PORTA,
        BLUETOOTH_MAC_ADDRESS
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item?.codigoBalancaController ?? null,
        this.userID,
        item.descricaoBalanca,
        item.tipoConexao,
        item.tipoBalanca,
        item?.tcpIP ?? null,
        item?.tcpPorta ?? null,
        item?.bluetoothMacAddress ?? null
      ]
    );

    return response;
  }

  async editarBalanca(item: IBalanca) {
    const response = await this._conn.insert(
      `UPDATE BALANCAS SET
        DS_BALANCA                = ?,
        CD_TIPO_CONEXAO           = ?,
        CD_TIPO_BALANCA           = ?,
        TCP_IP                    = ?,
        TCP_PORTA                 = ?,
        BLUETOOTH_MAC_ADDRESS     = ?,
        DT_ATUALIZACAO                      = (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME'))
      WHERE CD_USUARIO = ? AND CD_ID = ?`,
      [
        item.descricaoBalanca,
        item.tipoConexao,
        item.tipoBalanca,
        item.tcpIP,
        item.tcpPorta,
        item.bluetoothMacAddress,
        this.userID,
        item.codigo
      ]
    );

    return response;
  }

  async deletarBalanca(balancaID: number) {
    const response = await this._conn.delete(
      'DELETE FROM BALANCAS WHERE CD_USUARIO = ? AND CD_ID = ?',
      [
        this.userID,
        balancaID
      ]
    );

    return response;
  }

  async deletarBalancasSincronizacao() {
    const response = await this._conn.delete(
      'DELETE FROM BALANCAS WHERE CD_USUARIO = ?',
      [this.userID]
    );

    return response;
  }

}

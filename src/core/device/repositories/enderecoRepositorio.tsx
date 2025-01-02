import { AsyncSQLiteConnection, formatarData, timezoneDate } from 'vision-common';
import { IEndereco } from '../../domain/entities/endereco';
import { IFiltro } from '../../domain/entities/filtro';
import { IDeviceEnderecoRepositorio } from '../../domain/repositories/device/enderecoRepositorio';

export default class DeviceEnderecoRepositorio implements IDeviceEnderecoRepositorio {

  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaEnderecos() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS ENDERECOS (
        ID                        INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                INTEGER,
        DS_VINCULO                TEXT,
        DS_RUA                    TEXT,
        DS_BAIRRO                 TEXT,
        NR_NUMERO                 INTEGER,
        DS_LETRA                  TEXT,
        DS_COMPLEMENTO            TEXT,
        DS_CIDADE                 TEXT,
        DS_UF                     TEXT,
        DS_LATITUDE               TEXT,
        DS_LONGITUDE              TEXT,
        DT_CADASTRO               DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO            DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'ENDERECOS'
    );

    return response;
  }

  async inserirEndereco(codigoVinculo: number | string, endereco: IEndereco) {
    const response = await this._conn.insert(
      `INSERT INTO ENDERECOS (
        CD_USUARIO,
        DS_VINCULO,
        DS_RUA,
        DS_BAIRRO,
        NR_NUMERO,
        DS_LETRA,
        DS_COMPLEMENTO,
        DS_CIDADE,
        DS_UF,
        DS_LATITUDE,
        DS_LONGITUDE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        codigoVinculo,
        endereco.rua ?? '',
        endereco.bairro ?? '',
        endereco.numero ?? '',
        endereco.letra ?? '',
        endereco.complemento ?? '',
        endereco.cidade ?? '',
        endereco.uf ?? '',
        endereco.latLng && endereco.latLng.latitude ? endereco.latLng.latitude : '',
        endereco.latLng && endereco.latLng.longitude ? endereco.latLng.longitude : ''
      ]
    );

    return response;
  }

  async atualizarEndereco(codigoVinculo: number | string, endereco: IEndereco) {
    const response = await this._conn.update(
      `UPDATE ENDERECOS SET
        DS_RUA                 = ?,
        DS_BAIRRO              = ?,
        NR_NUMERO              = ?,
        DS_LETRA               = ?,
        DS_COMPLEMENTO         = ?,
        DS_CIDADE              = ?,
        DS_UF                  = ?,
        DS_LATITUDE            = ?,
        DS_LONGITUDE           = ?,
        DT_ATUALIZACAO         = ?
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        endereco.rua,
        endereco.bairro,
        endereco.numero,
        endereco.letra,
        endereco.complemento,
        endereco.cidade,
        endereco.uf,
        endereco.latLng && endereco.latLng.latitude ? endereco.latLng.latitude : '',
        endereco.latLng && endereco.latLng.longitude ? endereco.latLng.longitude : '',
        timezoneDate(new Date()),
        codigoVinculo,
        this.userID,
      ]
    );

    return response;
  }

  async pegarEndereco(codigoVinculo: number | string) {
    const response = await this._conn.queryFisrt<IEndereco>(
      `SELECT
        CD_USUARIO            AS codigoUsuario,
        DS_VINCULO            AS codigoVinculo,
        DS_RUA                AS rua,
        DS_BAIRRO             AS bairro,
        NR_NUMERO             AS numero,
        DS_LETRA              AS letra,
        DS_COMPLEMENTO        AS complemento,
        DS_CIDADE             AS cidade,
        DS_UF                 AS uf,
        DS_LATITUDE           AS latitude,
        DS_LONGITUDE          AS longitude
      FROM ENDERECOS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        String(codigoVinculo),
        this.userID
      ],
      ''
    );

    return response;
  }

  async deletarEndereco(codigoVinculo: string | number) {
    const response = await this._conn.delete(
      `DELETE FROM ENDERECOS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async pegarCidadesColetasAgendadas(placa: string, filtros?: IFiltro) {
    const response = await this._conn.query<string>(
      `SELECT
        e.DS_CIDADE
      FROM ORDEM_SERVICO_AGENDADAS ORDEM
        JOIN ENDERECOS E ON E.DS_VINCULO = '@VRCOLETAAGENDADA:' || ORDEM.CD_ORDEM_SERVICO
      WHERE ORDEM.CD_USUARIO = ?
        AND TRIM(REPLACE(DS_PLACA, '-', '')) = TRIM(REPLACE(?, '-', ''))
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
        GROUP BY e.DS_CIDADE
        ORDER BY e.DS_CIDADE`,
      [
        this.userID,
        placa ?? '',
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

  async inserirEnderecosSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO ENDERECOS (
        CD_USUARIO,
        DS_VINCULO,
        DS_RUA,
        DS_BAIRRO,
        NR_NUMERO,
        DS_LETRA,
        DS_COMPLEMENTO,
        DS_CIDADE,
        DS_UF,
        DS_LATITUDE,
        DS_LONGITUDE
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }
}

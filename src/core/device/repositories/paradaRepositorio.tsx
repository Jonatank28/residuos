import { AsyncSQLiteConnection } from 'vision-common';

export default class ParadaRepositorio {

  constructor(private readonly id: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaParada() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS PARADA(
        ID                        INTEGER PRIMARY KEY,
        DS_MOTIVO                 TEXT,
        NR_MOTIVO                 INTEGER,
        DS_OBSERVACAO             TEXT`,
      'PARADA'
    );
    return response;
  }

  async criarTabelaParadaDetalhe() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS PARADA_DETALHE(
        ID                        INTEGER PRIMARY KEY
        ID_PARADA                 INTEGER,
        DT_DATA_INICIO            DATE,
        DT_DATA_FIM               DATE,
        HR_INICIO                 TIME,
        HR_FIM                    TIME`,
      'PARADA_DETALHE'
    );
    return response;
  }

  async pegarParadas() {
    const response = await this._conn.query(
      `SELECT * FROM PARADA WHERE ID IN (SELECT ID_PARADA FROM PARADA_DETALHE WHERE ID_PARADA IN (SELECT ID FROM PARADA))`,
      [this.id]
    );
    return response;
  }
}

import { AsyncSQLiteConnection, IPhoto } from 'vision-common';
import { IDeviceImagemRepositorio } from '../../domain/repositories/device/imagemRepositorio';

export default class DeviceImagemRepositorio implements IDeviceImagemRepositorio {

  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaImagens() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS IMAGENS (
        ID                        INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                INTEGER,
        DS_VINCULO                TEXT,
        DS_DESCRICAO              TEXT,
        DS_TIPO                   TEXT,
        DS_ORIGEM                 TEXT,
        DS_URI                    TEXT,
        WIDTH                     NUM,
        HEIGHT                    NUM,
        DS_IMAGEM_BASE64          TEXT,
        BASE64                    TEXT,
        DS_OBSERVACAO             TEXT,
        DT_CADASTRO               DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO            DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'IMAGENS'
    );

    await this._conn.create(
      `create table if not exists IMAGENS_PENDENTES (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        base64 TEXT
        )`,
        'IMAGENS_PENDENTES'
    )

    return response;
  }

  async inserirImagem(foto: IPhoto, codigoVinculo: string | number) {
    const response = await this._conn.insert(
      `INSERT INTO IMAGENS (
        CD_USUARIO,
        DS_VINCULO,
        DS_DESCRICAO,
        DS_TIPO,
        DT_CADASTRO,
        DS_ORIGEM,
        DS_URI,
        WIDTH,
        HEIGHT,
        BASE64,
        DS_OBSERVACAO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        codigoVinculo,
        foto.nome,
        foto.tipo,
        foto.data,
        foto.origem,
        foto.uri,
        foto.width,
        foto.height,
        foto.base64,
        foto.observacao
      ]
    );

    return response;
  }

  async deletarImagem(codigoVinculo: string | number) {
    const _codigoVinculo = String(codigoVinculo).includes('%') ? codigoVinculo : `%${codigoVinculo}%`

    const response = await this._conn.delete(
      'DELETE FROM IMAGENS WHERE DS_VINCULO LIKE ? AND CD_USUARIO = ?',
      [
        _codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async pegarImagemBase64(id:number) {
    const response = await this._conn.queryFisrt<IPhoto>(
      `SELECT BASE64 as base64 FROM IMAGENS WHERE ID = ?`,
      [id]
    );

    return response.base64||'';
  }

  async pegarImagens(codigoVinculo: string | number) {
    const response = await this._conn.query<IPhoto>(
      `SELECT
          DS_DESCRICAO        AS nome,
          DS_TIPO             AS tipo,
          DT_CADASTRO         AS data,
          DS_ORIGEM           AS origem,
          DS_URI              AS uri,
          WIDTH               AS width,
          HEIGHT              AS height,
          BASE64              AS base64,
          DS_OBSERVACAO       AS observacao
      FROM IMAGENS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [
        codigoVinculo,
        this.userID
      ]
    );

    return response;
  }

  async imagemPendente(nome: string, base64?: string) {
    if(base64){
      return this._conn.insert(
        `INSERT INTO IMAGENS_PENDENTES (nome,base64) VALUES (?, ?)`,[nome,base64]
      );
    }else{
      return this._conn.queryFisrt<{nome:string, base64:string}>(
        `SELECT nome, base64 FROM IMAGENS_PENDENTES WHERE nome = ? `,[nome]
      );
    }
  }

  async removerImagemPendente(nome: string) {
    return this._conn.delete(
      `DELETE FROM IMAGENS_PENDENTES WHERE nome = ?`,[nome]
    );
  }

  async pegarImagensPendentes() {
    return (await this._conn.query<{nome:string}>(
      `SELECT nome FROM IMAGENS_PENDENTES `,[]
    ))._array;
  }
}

import { AsyncAxiosConnection } from 'vision-common';
import { IMtrRepositorio } from '../../domain/repositories/mtrRepositorio';

export default class MtrRepositorio implements IMtrRepositorio {

  constructor(private readonly _conn: AsyncAxiosConnection) { }

  async pegarMtrs(codigoOS: number) {
    return this._conn.get(
      `/pegarMTRS?codigoOS=${codigoOS}`
    );
  }

  async pegarMtrsGerados(codigoVinculo: number | string) {
    return this._conn.get(
      `/pegarMTRSGerados?codigoVinculo=${codigoVinculo}`
    );
  }

  async pegarEstadosMtr() {
    return this._conn.get(
      '/pegarEstadosMTR',
    );
  }

  async pegarMtrGerado(codigoOS: number) {
    return this._conn.get(
      `/pegarMtrGerado?codigoOS=${codigoOS ?? 0}`
    );
  }

  async verificarRelacaoMtr(codigoOS: number) {
    return this._conn.get(
      `/verificarRelacaoMTR?codigoOS=${codigoOS}`
    );
  }
}

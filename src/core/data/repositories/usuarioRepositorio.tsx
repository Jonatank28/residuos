import md5 from 'md5';
import { AsyncAxiosConnection } from 'vision-common';
import { IUsuarioRepositorio } from '../../domain/repositories/usuarioRepositorio';
import { IAlterarSenhaUsuarioParams } from '../../domain/usecases/alterarSenhaUsuarioUseCase';
import { IAtualizarLocalizacaoMotoristaParams } from '../../domain/usecases/atualizarLocalizacaoMotoristaUseCase';

export default class UsuarioRepositorio implements IUsuarioRepositorio {

  constructor(private readonly _conn: AsyncAxiosConnection) { }

  async pegarUsuario() {
    return this._conn.get(
      '/usuario'
    );
  }

  async alterarSenha(params: IAlterarSenhaUsuarioParams) {
    return this._conn.put(
      `/alterarSenha?senhaAtual=${md5(params.senhaAtual) ?? ''}&senha=${md5(params.novaSenha) ?? ''}`
    );
  }

  async pegarConfiguracoes() {
    return this._conn.get(
      '/pegarConfiguracoes'
    );
  }

  async alterarFoto(param: string) {
    const response = await this._conn.put(
      '/usuario/alterarFoto',
      { base64: param }
    ).catch((e) => e.response);

    return response;
  }

  async atualizarLocalizacao(params: IAtualizarLocalizacaoMotoristaParams) {
    return this._conn.post(
      `/residuos/atualizarLocalizacaoMotorista?codigoOS=${params.codigoOS}`,
      {
        Latitude: params.location.latitude,
        Longitude: params.location.longitude
      }
    );
  }
}

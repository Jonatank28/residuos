import md5 from 'md5';
import Config from "react-native-config";
import { $TOKEN_KEY, $USER_KEY, $USER_PASSWORD_KEY } from '../../constants';
import { AsyncAxiosConnection, ILocalStorageConnection } from 'vision-common';
import { IAutenticacaoRepositorio } from '../../domain/repositories/autenticacaoRepositorio';
import { IEnviarDadosParams } from '../../domain/usecases/enviarDadosUseCase';
import { IFazerBackupParams } from '../../domain/usecases/fazerBackupUseCase';
import { ILogarUsuarioParams } from '../../domain/usecases/logarUsuarioUseCase';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';

export default class AutenticacaoRepositorio implements IAutenticacaoRepositorio {
  private readonly _localStorage: ILocalStorageConnection;

  constructor(private readonly _conn: AsyncAxiosConnection) {
    this._localStorage = new LocalStorageConnection();
  }

  async logarUsuario({ user, password }: ILogarUsuarioParams) {
    return this._conn.post(
      '/login',
      {
        usuario: user.toLowerCase(),
        senha: md5(password),
        autenticacao: Config.APP_SLUG_KEY
      }
    );
  }

  async pegarUsuarioAtual() {
    const usuario = await this._localStorage.getStorageDataString($USER_KEY);
    const password = await this._localStorage.getStorageDataString($USER_PASSWORD_KEY);

    if (!usuario || !password) { return null; }

    return { usuario, password };
  }

  async pegarTokenAtual() {
    const response = await this._localStorage.getStorageDataString($TOKEN_KEY);

    if (!response) return null;

    return response;
  }

  async pegarVersaoRest() {
    return this._conn.get<{ versao: string }>(
      '/versaoRest'
    );
  }

  async deslogar() {
    return this._conn.post<boolean>(
      '/deslogarMobileResiduos',{}
    );
  }

  async pegarDados(regioes: string, placa: string, placaID: number) {
    return this._conn.get(
      `/residuos/pegarDados?placa=${placa}&placaID=${placaID ?? 0}${regioes ?? ''}`,
    );
  }

  async enviarDados(params: IEnviarDadosParams) {
    return this._conn.post<void>(
      '/residuos/enviarDados',
      {
        auditorias: params.auditorias,
        balancas: params.balancas,
        checkInClientes: params.checkInClientes,
        fotoUsuario: params?.fotoUsuario ?? ''
      }
    );
  }

  async fazerBackup(params: IFazerBackupParams) {
    return this._conn.post<void>(
      `/residuos/backup?senha=${params.senha}`,
      params.formData,
      {
        baseURL: params.servidor,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  };

  async fazerBackupAutomatico(param: FormData) {
    return this._conn.post<void>(
      `residuos/backupAutomatico`,
      param,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  };
}

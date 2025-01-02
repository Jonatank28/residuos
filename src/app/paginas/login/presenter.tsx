import { getAxiosConnection, ILocalStorageConnection } from 'vision-common';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import axiosClient from '../../../core/axios';
import AutenticacaoRepositorio from '../../../core/data/repositories/autenticacaoRepositorio';
import UsuarioRepositorio from '../../../core/data/repositories/usuarioRepositorio';
import { IAutenticacaoRepositorio } from '../../../core/domain/repositories/autenticacaoRepositorio';
import { IUsuarioRepositorio } from '../../../core/domain/repositories/usuarioRepositorio';
import LogarUsuarioUseCase from '../../../core/domain/usecases/logarUsuarioUseCase';
import PegarUsuarioUseCase from '../../../core/domain/usecases/pegarUsuarioUseCase';

export default class LoginPresenter {
  private readonly iUsuarioRepositorio: IUsuarioRepositorio;
  private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;

  private readonly logarUsuarioUseCase: LogarUsuarioUseCase;
  private readonly pegarUsuarioUseCase: PegarUsuarioUseCase;

  constructor() {
    const _connection = getAxiosConnection(axiosClient);
    this.iUsuarioRepositorio = new UsuarioRepositorio(_connection);
    this.iAutenticacaoRepositorio = new AutenticacaoRepositorio(_connection);
    this.iLocalStorageConnection = new LocalStorageConnection();

    this.logarUsuarioUseCase = new LogarUsuarioUseCase(this.iAutenticacaoRepositorio, this.iLocalStorageConnection);
    this.pegarUsuarioUseCase = new PegarUsuarioUseCase(this.iUsuarioRepositorio);
  }

  logarUsuario = async (user: string, password: string) => this.logarUsuarioUseCase.execute({ user, password });

  pegarUsuario = async () => this.pegarUsuarioUseCase.execute();
}

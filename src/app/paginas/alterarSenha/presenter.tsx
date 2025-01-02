import axiosClient from '../../../core/axios';
import { getAxiosConnection, ILocalStorageConnection } from 'vision-common';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import UsuarioRepositorio from '../../../core/data/repositories/usuarioRepositorio';
import { IUsuarioRepositorio } from '../../../core/domain/repositories/usuarioRepositorio';
import AlterarSenhaUsuarioUseCase from '../../../core/domain/usecases/alterarSenhaUsuarioUseCase';

export default class AlterarSenhaPresenter {
  private readonly iUsuarioRepositorio: IUsuarioRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;

  private readonly alterarSenhaUsuarioUseCase: AlterarSenhaUsuarioUseCase;

  constructor() {
    this.iUsuarioRepositorio = new UsuarioRepositorio(getAxiosConnection(axiosClient));
    this.iLocalStorageConnection = new LocalStorageConnection();

    this.alterarSenhaUsuarioUseCase = new AlterarSenhaUsuarioUseCase(
      this.iUsuarioRepositorio,
      this.iLocalStorageConnection
    );
  }

  alterarSenha = async (senhaAtual: string, novaSenha: string) => this.alterarSenhaUsuarioUseCase.execute({
    senhaAtual,
    novaSenha
  });
}

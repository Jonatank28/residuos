import { AsyncAxiosConnection, ILocalStorageConnection, Presenter } from "vision-common";
import LocalStorageConnection from "vision-common/src/app/hooks/asyncStorageConnection";
import axiosClient from "../../../core/axios";
import UsuarioRepositorio from "../../../core/data/repositories/usuarioRepositorio";
import database from "../../../core/database";
import { IUsuario } from "../../../core/domain/entities/usuario";
import { IUsuarioRepositorio } from "../../../core/domain/repositories/usuarioRepositorio";
import AlterarFotoUsuarioUseCase from "../../../core/domain/usecases/alterarFotoUsuarioUseCase";
import SetUsuarioUseCase from "../../../core/domain/usecases/device/setUsuarioUseCase";

export default class MeusDadosPresenter extends Presenter {
  private readonly iUsuarioRepositorio: IUsuarioRepositorio;
  private readonly iLocalStorageConnection: ILocalStorageConnection;

  private readonly alterarFotoUsuarioUseCase: AlterarFotoUsuarioUseCase;
  private readonly setUsuarioUseCase: SetUsuarioUseCase;

  constructor() {
    super(database);
    this.iUsuarioRepositorio = new UsuarioRepositorio(new AsyncAxiosConnection(axiosClient));
    this.iLocalStorageConnection = new LocalStorageConnection();

    this.alterarFotoUsuarioUseCase = new AlterarFotoUsuarioUseCase(this.iUsuarioRepositorio);
    this.setUsuarioUseCase = new SetUsuarioUseCase(this.iLocalStorageConnection);
  }

  alterarFoto = async (imageBase64: string) => this.alterarFotoUsuarioUseCase.execute(imageBase64);

  alterarFotoUsuarioDevice = async (usuario: IUsuario) => this.setUsuarioUseCase.execute(usuario);
}

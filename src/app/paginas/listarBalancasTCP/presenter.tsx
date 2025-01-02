import { Presenter } from "vision-common";
import database from "../../../core/database";
import DeviceBalancaRepositorio from "../../../core/device/repositories/balancaRepositorio";
import { IBalanca } from "../../../core/domain/entities/balanca/balanca";
import { IDeviceBalancaRepositorio } from "../../../core/domain/repositories/device/balancaRepositorio";
import UsecaseAtualizarBalanca from "../../../core/domain/usecases/device/database/balanca/usecaseAtualizarBalanca";
import UsecaseCadastrarBalanca from "../../../core/domain/usecases/device/database/balanca/usecaseCadastrarBalanca";
import UsecaseDeletarBalanca from "../../../core/domain/usecases/device/database/balanca/usecaseDeletarBalanca";
import UsecasePegarBalancas from "../../../core/domain/usecases/device/database/balanca/usecasePegarBalancas";

export class ListarBalancasPresenter extends Presenter {
  private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio;
  private readonly usecasePegarBalancas: UsecasePegarBalancas;
  private readonly usecaseCadastrarBalanca: UsecaseCadastrarBalanca;
  private readonly usecaseAtualizarBalanca: UsecaseAtualizarBalanca;
  private readonly usecaseDeletarBalanca: UsecaseDeletarBalanca;

  constructor(userID: number) {
    super(database);

    this.iDeviceBalancaRepositorio = new DeviceBalancaRepositorio(userID, this._connection);

    this.usecasePegarBalancas = new UsecasePegarBalancas(this.iDeviceBalancaRepositorio);
    this.usecaseCadastrarBalanca = new UsecaseCadastrarBalanca(this.iDeviceBalancaRepositorio);
    this.usecaseAtualizarBalanca = new UsecaseAtualizarBalanca(this.iDeviceBalancaRepositorio);
    this.usecaseDeletarBalanca = new UsecaseDeletarBalanca(this.iDeviceBalancaRepositorio);
  }

  pegarBalancas = () => this.usecasePegarBalancas.execute();

  cadastrarBalanca = (parametro: IBalanca) => this.usecaseCadastrarBalanca.execute(parametro);

  deletarBalanca = (balancaID: number) => this.usecaseDeletarBalanca.execute(balancaID);

  atualizarBalanca = (parametro: IBalanca) => this.usecaseAtualizarBalanca.execute(parametro);
}
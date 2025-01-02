import database from '../../../core/database';
import ResiduosRepositorio from '../../../core/data/repositories/residuosRepositorio';
import DeviceResiduoRepositorio from '../../../core/device/repositories/residuoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../core/domain/repositories/device/residuoRepositorio';
import { IResiduosRepositorio } from '../../../core/domain/repositories/residuosRepositorio';
import PegarTodosResiduosUseCase, {
  IPegarTodosResiduosParams,
} from '../../../core/domain/usecases/device/database/pegarTodosResiduosUseCase';
import PegarResiduosUseCase, { IPegarResiduosParams } from '../../../core/domain/usecases/pegarResiduosUseCase';
import { getAxiosConnection, Presenter } from 'vision-common';
import axiosClient from '../../../core/axios';
import UsecasePegarImobilizadoGenericoPorCodigo from '../../../core/domain/usecases/device/database/pegarImobilizadoGenericoPorCodigo';

export default class ListaResiduosPresenter extends Presenter {
  private readonly iResiduosRepositorio: IResiduosRepositorio;
  private readonly iResiduosDeviceRepositorio: IDeviceResiduoRepositorio;

  private readonly pegarResiduosUseCase: PegarResiduosUseCase;
  private readonly pegarTodosResiduosUseCase: PegarTodosResiduosUseCase;
  private readonly usecasePegarImobilizadoGenericoPorCodigo: UsecasePegarImobilizadoGenericoPorCodigo;

  constructor(userID: number) {
    super(database);
    this.iResiduosRepositorio = new ResiduosRepositorio(getAxiosConnection(axiosClient));
    this.iResiduosDeviceRepositorio = new DeviceResiduoRepositorio(userID, this._connection);

    this.pegarResiduosUseCase = new PegarResiduosUseCase(this.iResiduosRepositorio);
    this.pegarTodosResiduosUseCase = new PegarTodosResiduosUseCase(this.iResiduosDeviceRepositorio);
    this.usecasePegarImobilizadoGenericoPorCodigo = new UsecasePegarImobilizadoGenericoPorCodigo(this.iResiduosDeviceRepositorio);
  }

  pegarResiduos = async (params: IPegarResiduosParams) => this.pegarResiduosUseCase.execute(params);

  pegarResiduosDevice = async (params: IPegarTodosResiduosParams) => this.pegarTodosResiduosUseCase.execute(params);

  pegarImobilizadoGenericoPorCodigo = async (residuoID: number) =>
    this.usecasePegarImobilizadoGenericoPorCodigo.execute(residuoID);
}

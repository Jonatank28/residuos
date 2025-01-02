import { AsyncAxiosConnection, AsyncSQLiteConnection, Presenter } from 'vision-common';
import axiosClient from '../../../core/axios';
import MtrRepositorio from '../../../core/data/repositories/mtrRepositorio';
import database from '../../../core/database';
import DeviceMtrRepositorio from '../../../core/device/repositories/mtrRepositorio';
import { IDeviceMtrRepositorio } from '../../../core/domain/repositories/device/mtrRepositorio';
import { IMtrRepositorio } from '../../../core/domain/repositories/mtrRepositorio';
import PegarEstadosMtrDeviceUseCase from '../../../core/domain/usecases/device/database/mtr/pegarEstadosMtrDeviceUseCase';
import PegarEstadosMtrUseCase from '../../../core/domain/usecases/mtr/pegarEstadosMtrUseCase';

export default class ListaEstadosMtrPresenter extends Presenter {
  private readonly iMtrRepositorio: IMtrRepositorio;
  private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio;

  private readonly pegarEstadosMtrUseCase: PegarEstadosMtrUseCase;
  private readonly pegarEstadosMtrDeviceUseCase: PegarEstadosMtrDeviceUseCase;

  constructor(userID: number) {
    super(database);

    this.iMtrRepositorio = new MtrRepositorio(new AsyncAxiosConnection(axiosClient));
    this.iDeviceMtrRepositorio = new DeviceMtrRepositorio(userID, this._connection);

    this.pegarEstadosMtrUseCase = new PegarEstadosMtrUseCase(this.iMtrRepositorio);
    this.pegarEstadosMtrDeviceUseCase = new PegarEstadosMtrDeviceUseCase(this.iDeviceMtrRepositorio);
  }

  pegarEstadosMtr = async () => this.pegarEstadosMtrUseCase.execute();

  pegarEstadosMtrDevice = async () => this.pegarEstadosMtrDeviceUseCase.execute();
}

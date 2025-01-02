import database from '../../../core/database';
import { IPaginationParams, Presenter } from 'vision-common';
import DeviceEnderecoRepositorio from '../../../core/device/repositories/enderecoRepositorio';
import DeviceRascunhoRepositorio from '../../../core/device/repositories/rascunhoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceRascunhoRepositorio } from '../../../core/domain/repositories/device/rascunhoRepositoiro';
import PegarRascunhosColetasUseCase from '../../../core/domain/usecases/device/database/rascunho/pegarRascunhosColetasUseCase';

export default class RascunhosPresenter extends Presenter {
  private readonly iRascunhoRepositorio: IDeviceRascunhoRepositorio;
  private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio;

  private readonly pegarRascunhosColetasUseCase: PegarRascunhosColetasUseCase;

  constructor(userID: number) {
    super(database);

    this.iRascunhoRepositorio = new DeviceRascunhoRepositorio(userID, this._connection);
    this.iEnderecoRepositorio = new DeviceEnderecoRepositorio(userID, this._connection);

    this.pegarRascunhosColetasUseCase = new PegarRascunhosColetasUseCase(this.iRascunhoRepositorio, this.iEnderecoRepositorio);
  }

  pegarRascunhos = async (params: IPaginationParams) => this.pegarRascunhosColetasUseCase.execute(params);
}

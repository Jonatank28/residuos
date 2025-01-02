import { Presenter } from 'vision-common';
import database from '../../../core/database';
import DeviceBalancaRepositorio from '../../../core/device/repositories/balancaRepositorio';
import { IDeviceBalancaRepositorio } from '../../../core/domain/repositories/device/balancaRepositorio';
import UsecaseVerificarQuantidadeBalancas from '../../../core/domain/usecases/device/database/balanca/usecaseVerificarQuantidadeBalancas';
import { IDeviceResiduoRepositorio } from '../../../core/domain/repositories/device/residuoRepositorio';
import PegarImobilizadoDoResiduoUseCase from '../../../core/domain/usecases/device/database/pegarImobilizadoDoResiduoUseCase';
import DeviceResiduoRepositorio from '../../../core/device/repositories/residuoRepositorio';

export default class ResiduoPresenter extends Presenter {
  private readonly iDeviceBalancaRepositorio: IDeviceBalancaRepositorio;
  private readonly usecaseVerificarQuantidadeBalancas: UsecaseVerificarQuantidadeBalancas;
  private readonly iResiduosDeviceRepositorio: IDeviceResiduoRepositorio;
  private readonly pegarImobilizadoDoResiduoUseCase: PegarImobilizadoDoResiduoUseCase;

  constructor(userID: number) {
    super(database);

    this.iDeviceBalancaRepositorio = new DeviceBalancaRepositorio(userID, this._connection);
    this.usecaseVerificarQuantidadeBalancas = new UsecaseVerificarQuantidadeBalancas(this.iDeviceBalancaRepositorio);
    this.iResiduosDeviceRepositorio = new DeviceResiduoRepositorio(userID, this._connection);
    this.pegarImobilizadoDoResiduoUseCase = new PegarImobilizadoDoResiduoUseCase(this.iResiduosDeviceRepositorio);
  }

  verificarQuantidadeBalancas = () => this.usecaseVerificarQuantidadeBalancas.execute();
  pegarImobilizadoDoResiduo = (vinculo: string | number) => this.pegarImobilizadoDoResiduoUseCase.execute(vinculo);
}

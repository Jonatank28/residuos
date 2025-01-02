import database from "../../../../core/database";
import { IOrder } from '../../../../core/domain/entities/order';
import ResiduosRepositorio from '../../../../core/data/repositories/residuosRepositorio';
import { IEquipamento } from '../../../../core/domain/entities/equipamento';
import { IResiduosRepositorio } from '../../../../core/domain/repositories/residuosRepositorio';
import GetVeiculoUseCase from '../../../../core/domain/usecases/device/getVeiculoUseCase';
import PegarEquipamentosClienteUseCase from '../../../../core/domain/usecases/pegarEquipamentosClienteUseCase';
import PegarEquipamentosClienteDeviceUseCase from '../../../../core/domain/usecases/device/database/pegarEquipamentosClienteUseCase';
import RemoverEquipamentoUseCase from '../../../../core/domain/usecases/removerEquipamentoUseCase';
import { IDeviceResiduoRepositorio } from '../../../../core/domain/repositories/device/residuoRepositorio';
import DeviceResiduoRepositorio from '../../../../core/device/repositories/residuoRepositorio';
import VerificarEquipamentosExisteColetaOffline from '../../../../core/domain/usecases/device/database/coletaPendente/verificarEquipamentosExisteColetaOfflineUseCase';
import { getAxiosConnection, ILocalStorageConnection, Presenter } from "vision-common";
import LocalStorageConnection from "vision-common/src/app/hooks/asyncStorageConnection";
import axiosClient from "../../../../core/axios";
import UsecasePegarImobilizadoGenericoPorCodigo from "../../../../core/domain/usecases/device/database/pegarImobilizadoGenericoPorCodigo";

export default class ColetaEquipamentosPresenter extends Presenter {
  private readonly iLocalStorageConnection: ILocalStorageConnection;
  private readonly iResiduosRepositorio: IResiduosRepositorio;
  private readonly iResiduosDeviceRepositorio: IDeviceResiduoRepositorio;

  private readonly getVeiculoUseCase: GetVeiculoUseCase;
  private readonly verificarEquipamentosExisteColetaOffline: VerificarEquipamentosExisteColetaOffline;
  private readonly pegarEquipamentosClienteUseCase: PegarEquipamentosClienteUseCase;
  private readonly pegarEquipamentosClienteDeviceUseCase: PegarEquipamentosClienteDeviceUseCase;
  private readonly removerEquipamentoUseCase: RemoverEquipamentoUseCase;
  private readonly usecasePegarImobilizadoGenericoPorCodigo: UsecasePegarImobilizadoGenericoPorCodigo;

  constructor(userID: number) {
    super(database);
    this.iLocalStorageConnection = new LocalStorageConnection();
    this.iResiduosRepositorio = new ResiduosRepositorio(getAxiosConnection(axiosClient));
    this.iResiduosDeviceRepositorio = new DeviceResiduoRepositorio(userID, this._connection);

    this.getVeiculoUseCase = new GetVeiculoUseCase(this.iLocalStorageConnection);
    this.verificarEquipamentosExisteColetaOffline = new VerificarEquipamentosExisteColetaOffline(this.iResiduosDeviceRepositorio);
    this.pegarEquipamentosClienteUseCase = new PegarEquipamentosClienteUseCase(this.iResiduosRepositorio);
    this.pegarEquipamentosClienteDeviceUseCase = new PegarEquipamentosClienteDeviceUseCase(this.iResiduosDeviceRepositorio);
    this.removerEquipamentoUseCase = new RemoverEquipamentoUseCase(this.iResiduosRepositorio);
    this.usecasePegarImobilizadoGenericoPorCodigo = new UsecasePegarImobilizadoGenericoPorCodigo(this.iResiduosDeviceRepositorio);
  }

  pegarVeiculo = async () => this.getVeiculoUseCase.execute();

  verificarExisteEquipamentosPendentes = async (coleta: IOrder) => this.verificarEquipamentosExisteColetaOffline.execute(coleta);

  pegarEquipamentos = async (clienteID: number, obraID?: number) => this.pegarEquipamentosClienteUseCase.execute({
    clienteID,
    obraID
  });

  pegarEquipamentosDevice = async (clienteID: number, obraID?: number, semObra?: boolean) => this.pegarEquipamentosClienteDeviceUseCase.execute({
    clienteID,
    obraID,
    semObra
  });

  removerEquipamento = async (equipamento: IEquipamento, placaID: number, codigoOS: number, ordemID: number) => this.removerEquipamentoUseCase.execute({
    equipamento,
    placaID,
    codigoOS,
    ordemID
  });

  pegarImobilizadoGenericoPorCodigo = async (residuoID: number) =>
  this.usecasePegarImobilizadoGenericoPorCodigo.execute(residuoID);
}

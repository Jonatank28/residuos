import { ILocalStorageConnection, Presenter } from "vision-common";
import LocalStorageConnection from "vision-common/src/app/hooks/asyncStorageConnection";
import database from "../../../core/database";
import DeviceAuditoriaRepositorio from "../../../core/device/repositories/auditoriaRepositorio";
import DeviceRascunhoRepositorio from "../../../core/device/repositories/rascunhoRepositorio";
import { IDeviceAuditoriaRepositorio } from "../../../core/domain/repositories/device/auditoriaRepositorio";
import { IDeviceRascunhoRepositorio } from "../../../core/domain/repositories/device/rascunhoRepositoiro";
import PegarDadosRelatorioDeviceUseCase from "../../../core/domain/usecases/sincronizacao/pegarDadosRelatorioDeviceUseCase";

export default class RelatorioPresenter extends Presenter {
    private readonly iDeviceAuditoriaRepositorio: IDeviceAuditoriaRepositorio;
    private readonly iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio;
    private readonly iLocalStorageConnection: ILocalStorageConnection;

    private readonly pegarDadosRelatorioDeviceUseCase: PegarDadosRelatorioDeviceUseCase;

    constructor(userID: number) {
        super(database);

        this.iDeviceAuditoriaRepositorio = new DeviceAuditoriaRepositorio(userID, this._connection);
        this.iDeviceRascunhoRepositorio = new DeviceRascunhoRepositorio(userID, this._connection);
        this.iLocalStorageConnection = new LocalStorageConnection();

        this.pegarDadosRelatorioDeviceUseCase = new PegarDadosRelatorioDeviceUseCase(
            this.iDeviceAuditoriaRepositorio,
            this.iDeviceRascunhoRepositorio,
            this.iLocalStorageConnection
        );
    }


    pegarRelatorio = async (placa: string) => this.pegarDadosRelatorioDeviceUseCase.execute(placa);
}
import axiosClient from '../../../core/axios';
import { getAxiosConnection, ILocalStorageConnection } from 'vision-common';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import AutenticacaoRepositorio from '../../../core/data/repositories/autenticacaoRepositorio';
import { IAutenticacaoRepositorio } from '../../../core/domain/repositories/autenticacaoRepositorio';
import GetBackupUseCase from '../../../core/domain/usecases/device/getBackupUseCase';
import SetBackupUseCase from '../../../core/domain/usecases/device/setBackupUseCase';
import FazerBackupUseCase from '../../../core/domain/usecases/fazerBackupUseCase';

export default class BackupPresenter {
  private readonly iLocalStorageConnection: ILocalStorageConnection;
  private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio;

  private readonly fazerBackupUseCase: FazerBackupUseCase;
  private readonly setBackupUseCase: SetBackupUseCase;
  private readonly getBackupUseCase: GetBackupUseCase;

  constructor() {
    this.iLocalStorageConnection = new LocalStorageConnection();
    this.iAutenticacaoRepositorio = new AutenticacaoRepositorio(getAxiosConnection(axiosClient));

    this.fazerBackupUseCase = new FazerBackupUseCase(this.iAutenticacaoRepositorio);
    this.setBackupUseCase = new SetBackupUseCase(this.iLocalStorageConnection);
    this.getBackupUseCase = new GetBackupUseCase(this.iLocalStorageConnection);
  }

  fazerBackup = async (formData: FormData, servidor: string, senha: string) => this.fazerBackupUseCase.execute({
    formData,
    servidor,
    senha
  });

  setServidorBackup = async (servidor: string) => this.setBackupUseCase.execute(servidor);

  getServidorBackup = async () => this.getBackupUseCase.execute();
}

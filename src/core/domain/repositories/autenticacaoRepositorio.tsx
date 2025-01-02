import { IApiResponse } from 'vision-common';
import { IEnviarDadosParams } from '../usecases/enviarDadosUseCase';
import { IFazerBackupParams } from '../usecases/fazerBackupUseCase';
import { ILogarUsuarioParams } from '../usecases/logarUsuarioUseCase';

export interface IAutenticacaoRepositorio {
  logarUsuario: (params: ILogarUsuarioParams) => IApiResponse;

  pegarUsuarioAtual: () => Promise<{ usuario: string; password: string } | null>

  pegarTokenAtual: () => Promise<string | null>;

  pegarVersaoRest: () => IApiResponse<{ versao: string }>;

  deslogar: () => IApiResponse<boolean>;

  pegarDados: (regioes: string, placa: string, placaID: number) => IApiResponse;

  enviarDados: (params: IEnviarDadosParams) => IApiResponse<void>;

  fazerBackup: (params: IFazerBackupParams) => IApiResponse<void>;

  fazerBackupAutomatico: (param: FormData) => IApiResponse<void>;
}

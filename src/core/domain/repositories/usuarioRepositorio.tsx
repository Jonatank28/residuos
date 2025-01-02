import { IApiResponse } from 'vision-common';
import { IAlterarSenhaUsuarioParams } from '../usecases/alterarSenhaUsuarioUseCase';
import { IAtualizarLocalizacaoMotoristaParams } from '../usecases/atualizarLocalizacaoMotoristaUseCase';

export interface IUsuarioRepositorio {
  pegarUsuario: () => IApiResponse;

  pegarConfiguracoes: () => IApiResponse;

  alterarSenha: (params: IAlterarSenhaUsuarioParams) => IApiResponse;

  alterarFoto: (param: string) => Promise<IApiResponse>;

  atualizarLocalizacao: (params: IAtualizarLocalizacaoMotoristaParams) => IApiResponse;
}

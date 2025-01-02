import { IApiResponse } from 'vision-common';
import { IInserirEquipamentoParams } from '../usecases/inserirEquipamentoUseCase';
import { IPegarEquipamentosClienteUseCaseParams } from '../usecases/pegarEquipamentosClienteUseCase';
import { IPegarEquipamentosUseCaseParams } from '../usecases/pegarEquipamentosUseCase';
import { IPegarResiduosParams } from '../usecases/pegarResiduosUseCase';
import { IRemoverEquipamentoParams } from '../usecases/removerEquipamentoUseCase';
import { ISubstituirEquipamentoParams } from '../usecases/substituirEquipamentoUseCase';
import { IPegarTodosImobilizadosUseCaseParametros } from '../usecases/device/database/pegarTodosImobilizadosUseCase';

export interface IResiduosRepositorio {
  pegarImobilizadosAgendados: (codigosOS: string) => IApiResponse;

  pegarResiduos: (params: IPegarResiduosParams) => IApiResponse;

  pegarEquipamentos: (params: IPegarEquipamentosUseCaseParams) => IApiResponse;

  pegarEquipamentosCliente: (params: IPegarEquipamentosClienteUseCaseParams) => IApiResponse;

  inserirEquipamento: (params: IInserirEquipamentoParams) => IApiResponse;

  removerEquipamento: (params: IRemoverEquipamentoParams) => IApiResponse;

  substituirEquipamento: (params: ISubstituirEquipamentoParams) => IApiResponse;
  
  pegarTodosImobilizados: (params: IPegarTodosImobilizadosUseCaseParametros) => IApiResponse;
}

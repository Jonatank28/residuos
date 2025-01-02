import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IEquipamento } from '../entities/equipamento';
import BadRequestException from '../exceptions/badRequestException';
import { IResiduosRepositorio } from '../repositories/residuosRepositorio';

export interface IPegarEquipamentosClienteUseCaseParams {
  clienteID: number;
  obraID?: number;
}

export default class PegarEquipamentosClienteUseCase implements UseCase<IPegarEquipamentosClienteUseCaseParams, IEquipamento[] | Error> {

  constructor(private readonly iResiduosRepositorio: IResiduosRepositorio) { }

  async execute(params: IPegarEquipamentosClienteUseCaseParams): Promise<IEquipamento[] | Error> {
    try {
      const response = await this.iResiduosRepositorio.pegarEquipamentosCliente(params);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          return response.data;
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}

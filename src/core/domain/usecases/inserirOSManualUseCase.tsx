import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder } from '../entities/order';
import BadRequestException from '../exceptions/badRequestException';
import { IOrdemServicoRepositorio } from '../repositories/ordemServicoRepositorio';

export interface IInserirOSParams {
    coleta: IOrder;
    placaID: number;
}

export default class InserirOSManualUseCase implements UseCase<IInserirOSParams, void | Error> {
    constructor(private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio) { }

    async execute(params: IInserirOSParams): Promise<void | Error> {
        try {
            const response = await this.iOrdemServicoRepositorio.inserirOSManual(params);

            if (!response || response.request?.status === 0) return ApiException(response);

            switch (response.status) {
                case statusCode.OK:
                case statusCode.UNPROCESSABLE_ENTITY: {
          console.log('ORDEM ID NOVA COLETA: ', response.data);
                    break;
                }
                case statusCode.BAD_REQUEST:
                    return BadRequestException();
                default:
                    return ApiUnknownException(response);
            }

            return;
        } catch (e) {
            return ApiException(e);
        }
    }
}

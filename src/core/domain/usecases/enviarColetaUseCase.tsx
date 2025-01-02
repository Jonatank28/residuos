import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IOrder } from '../entities/order';
import { IOrderStatus } from '../entities/orderStatus';
import BadRequestException from '../exceptions/badRequestException';
import { IOrdemServicoRepositorio } from '../repositories/ordemServicoRepositorio';
import { IClienteCheckIn } from '../entities/clienteCheckIn';
import { auditar } from '../../auditoriaHelper';

export interface IEnviarColetaParams {
    coleta: IOrder;
    placaID: number;
    checkinsOS?: IClienteCheckIn[];
}

export default class EnviarColetaUseCase implements UseCase<IEnviarColetaParams, void | IOrderStatus | Error> {
    constructor(private readonly iOrdemServicoRepositorio: IOrdemServicoRepositorio) { }

    async execute(params: IEnviarColetaParams): Promise<void | IOrderStatus | Error> {

        if (!params.coleta.residuos) {
            auditar(`residuos sumiram em enviarcoletausecase->execute${params.coleta.residuos}`);
        }
        try {
            if (params.coleta.fotos && params.coleta.fotos.length > 0) {
                params.coleta.fotos.forEach(foto => {
                    foto.nome = 'Foto da coleta';
                    foto.base64 = foto.base64;
                    foto.origem = 'OS';
                    foto.base64 = foto?.base64 ? foto.base64.replace('data:image/jpg;base64,', '') : '';
                });
            }

            if (params.coleta.residuos && params.coleta.residuos.length > 0) {
                params.coleta.residuos.forEach(residuo => {
                    if (residuo.fotos && residuo.fotos.length > 0) {
                        residuo.fotos.forEach(foto => {
                            foto.nome = `Foto do resíduo ${residuo.codigo}`;
                            foto.base64 = foto.base64;
                            foto.origem = 'OSR';
                            foto.base64 = foto?.base64 ? foto.base64.replace('data:image/jpg;base64,', '') : '';
                        });
                    }
                });
            }

            const response = await this.iOrdemServicoRepositorio.enviarColeta(params);

            if (!response || response.request?.status === 0) return ApiException(response);

            switch (response.status) {
                case statusCode.OK:
                case statusCode.UNPROCESSABLE_ENTITY:
                    break;
                case statusCode.BAD_REQUEST:
                    return BadRequestException();
                case statusCode.MOVED_PERMANENTLY:
                    return response.data;
                default:
                    return ApiUnknownException(response);
            }
        } catch (e) {
            return ApiException(e);
        }
    }
}

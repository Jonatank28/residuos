import { ApiException } from 'vision-common';
import { IOrder } from '../../../../entities/order';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';

export default class DeletarFotosRascunhoDeviceUseCase implements UseCase<IOrder, void | Error> {

  constructor(private readonly iDeviceImagemRepositorio: IDeviceImagemRepositorio) {}

  async execute(rascunho: IOrder): Promise<void | Error> {
    try {
      const codigo = rascunho.codigoOS && rascunho.codigoOS !== 0
        ? `@VRRASCUNHO:${rascunho.codigoOS}`
        : `@VRRASCUNHO$NOVACOLETA:${rascunho.codigoCliente}`;

      await this.iDeviceImagemRepositorio.deletarImagem(codigo);

      if (rascunho?.residuos && rascunho.residuos?.length > 0) {
        for await (const residuo of rascunho.residuos) {
          await this.iDeviceImagemRepositorio.deletarImagem(`${codigo}-${residuo.codigo}`);
        }
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}

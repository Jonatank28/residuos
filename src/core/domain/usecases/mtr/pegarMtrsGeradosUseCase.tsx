import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IMtr, setMtr } from '../../entities/mtr';
import { IMtrRepositorio } from '../../repositories/mtrRepositorio';

export default class PegarMtrsGeradosUseCase implements UseCase<string | number, IMtr[] | Error> {

  constructor(private readonly iMtrRepositorio: IMtrRepositorio) { }

  async execute(codigoVinculo: string | number): Promise<IMtr[] | Error> {
    try {
      const response = await this.iMtrRepositorio.pegarMtrsGerados(codigoVinculo);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const { data } = response;
            const mtrs: IMtr[] = [];

            for await (const mtr of data) {
              mtrs.push(setMtr(mtr));
            }

            return mtrs;
          }
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}

import { ApiException, ApiUnknownException, statusCode } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IMtr, setMtr } from '../../entities/mtr';
import { IMtrRepositorio } from '../../repositories/mtrRepositorio';

export default class PegarMtrsUseCase implements UseCase<number, IMtr[] | Error> {

  constructor(private readonly iMtrRepositorio: IMtrRepositorio) { }

  async execute(codigoOS: number): Promise<IMtr[] | Error> {
    try {
      const response = await this.iMtrRepositorio.pegarMtrs(codigoOS);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK:
          {
            const mtrs: IMtr[] = [];
            const { data } = response;

            if (data && data.length > 0) {
              data.forEach((item: any) => {
                mtrs.push(setMtr(item));
              });
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

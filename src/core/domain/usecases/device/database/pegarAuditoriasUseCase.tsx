import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IAuditoria } from '../../../entities/auditoria';
import { IDeviceAuditoriaRepositorio } from '../../../repositories/device/auditoriaRepositorio';

export default class PegarAuditoriasUseCase implements UseCase<void, IAuditoria[] | Error> {

  constructor(private readonly iAuditoriaRepositorio: IDeviceAuditoriaRepositorio) { }

  async execute(): Promise<IAuditoria[] | Error> {
    try {
      let auditorias: IAuditoria[] = [];
      let xAcabouDados = true;
      const limite = 30;
      let offset = 0;

      while (xAcabouDados) {
        const response = await this.iAuditoriaRepositorio.pegarAuditorias(limite, offset);

        if (response.length === 0) {
          xAcabouDados = false;
          break;
        }

        if (response.length > 0) {
          response._array.forEach(auditoria => {
            auditorias.push(auditoria);
          })
        }

        offset += limite;
      }

      return auditorias;
    } catch (e) {
      return ApiException(e);
    }
  };
}

import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IAuditoria } from '../../../entities/auditoria';
import { IDeviceAuditoriaRepositorio } from '../../../repositories/device/auditoriaRepositorio';

export default class GravarAuditoriaUseCaseUseCase implements UseCase<IAuditoria, void | Error> {

  constructor(private readonly iAuditoriaRepositorio: IDeviceAuditoriaRepositorio) { }

  async execute(auditoria: IAuditoria): Promise<void | Error> {
    try {
      if (auditoria.tipo === 'BLOQUEIO_LIMITE_ARMAZENAMENTO' || auditoria.tipo === 'AVISO_LIMITE_ARMAZENAMENTO') {
        const exist = await this.iAuditoriaRepositorio.verificaAuditoriaGravada(auditoria);

        if (exist.length === 0) {
          await this.iAuditoriaRepositorio.inserirAuditoria(auditoria);
        }
      } else {
        await this.iAuditoriaRepositorio.inserirAuditoria(auditoria);
      }
    } catch (e) {
      return ApiException(e);
    }
  };
}

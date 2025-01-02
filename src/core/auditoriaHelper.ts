import { getConnection } from 'vision-common';
import database from './database';
import { IAuditoria } from './domain/entities/auditoria';
import DeviceAuditoriaRepositorio from './device/repositories/auditoriaRepositorio';
import GravarAuditoriaUseCaseUseCase from './domain/usecases/device/database/gravarAuditoriaUseCase';

export const auditar = async (mensagem: string, rotina='Enviar Coleta API', tipo='COLETA_AGENDADA') => {
  const connection = getConnection(database);
  const auditoria: IAuditoria = {
    codigoRegistro: 0,
    descricao: `${mensagem} `,
    rotina,
    tipo: tipo as IAuditoria['tipo'],
  };
  const deviceAuditoriaRepositorio = new DeviceAuditoriaRepositorio(0, connection);
  new GravarAuditoriaUseCaseUseCase(deviceAuditoriaRepositorio).execute(auditoria);
};

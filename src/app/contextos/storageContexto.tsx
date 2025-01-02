import * as React from 'react';
import * as FileSystem from 'expo-file-system';
import { getConnection, useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import { IAuditoria } from '../../core/domain/entities/auditoria';
import GravarAuditoriaUseCaseUseCase from '../../core/domain/usecases/device/database/gravarAuditoriaUseCase';
import { IDeviceAuditoriaRepositorio } from '../../core/domain/repositories/device/auditoriaRepositorio';
import DeviceAuditoriaRepositorio from '../../core/device/repositories/auditoriaRepositorio';
import { useUser } from './usuarioContexto';
import PegarAuditoriasUseCase from '../../core/domain/usecases/device/database/pegarAuditoriasUseCase';
import database from '../../core/database';

type Props = { children?: React.ReactNode }

interface StorageContextData {
  hasSpace: boolean;
  pegarAuditorias: () => Promise<IAuditoria[]>;
  gravarAuditoria: (param: IAuditoria) => Promise<void>;
}

export const StorageContext = React.createContext<StorageContextData>({} as StorageContextData);

export const StorageProvider: React.FC = ({ children }: Props) => {
  const { usuario } = useUser();
  const { dispatchSnack } = useVSSnack();
  const connection = getConnection(database);
  const iDeviceAuditoriaRepositorio: IDeviceAuditoriaRepositorio = new DeviceAuditoriaRepositorio(usuario?.codigo ?? 0, connection);
  const [hasSpace, setHasSpace] = React.useState<boolean>(true);

  const gravarAuditoriaDevice = async (auditoria: IAuditoria) => new GravarAuditoriaUseCaseUseCase(iDeviceAuditoriaRepositorio).execute(auditoria);

  const pegarAuditoriasDevice = async () => new PegarAuditoriasUseCase(iDeviceAuditoriaRepositorio).execute();

  const gravarAuditoria = async (auditoria: IAuditoria) => {
    const response = await gravarAuditoriaDevice(auditoria);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    }
  };

  const pegarAuditorias = async () => {
    const response = await pegarAuditoriasDevice();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      return response;
    }

    return [];
  };

  const convertToMB = (space: number) => Math.round(space / 1024 / 1024);

  const getDiskFreeSpace = async () => {
    const freeDisk = await FileSystem.getFreeDiskStorageAsync();
    const spaceFreeDiskMB = convertToMB(freeDisk);

    return spaceFreeDiskMB;
  };

  const verifySpaceDiskHasOK = async () => {
    const totalFreeDisk = await getDiskFreeSpace();

    if (totalFreeDisk >= 75 && totalFreeDisk <= 200) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('exceptions.customs.freeSpaceLimit'),
      });

      setHasSpace(true);
      await gravarAuditoria({
        codigoRegistro: 0,
        descricao: `Armazenamento disponível: ${totalFreeDisk} MB`,
        rotina: 'Verificar Limite Armazenamento',
        tipo: 'AVISO_LIMITE_ARMAZENAMENTO',
      });
    } else if (totalFreeDisk < 75) {
      setHasSpace(false);

      await gravarAuditoria({
        codigoRegistro: 0,
        descricao: `Armazenamento disponível: ${totalFreeDisk} MB`,
        rotina: 'Verificar Limite Armazenamento',
        tipo: 'BLOQUEIO_LIMITE_ARMAZENAMENTO',
      });
    } else {
      setHasSpace(true);
    }
  };

  React.useEffect(() => {
    verifySpaceDiskHasOK();

    const interval = setInterval(() => {
      verifySpaceDiskHasOK();
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StorageContext.Provider
      value={{ hasSpace, gravarAuditoria, pegarAuditorias }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => React.useContext(StorageContext);

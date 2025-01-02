import * as React from 'react';
import { getConnection, useVSSnack } from 'vision-common';
import CriarTabelasUseCase from '../../core/domain/usecases/device/database/criarTabelasUseCase';
import { IDeviceOrdemServicoRepositorio } from '../../core/domain/repositories/device/ordemServicoRepositorio';
import { IDeviceImagemRepositorio } from '../../core/domain/repositories/device/imagemRepositorio';
import { IDeviceEnderecoRepositorio } from '../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceResiduoRepositorio } from '../../core/domain/repositories/device/residuoRepositorio';
import { IDeviceClienteRepositorio } from '../../core/domain/repositories/device/clienteRepositorio';
import { IDeviceChecklistRepositorio } from '../../core/domain/repositories/device/checklistRepositorio';
import DeviceOrdemServicoRepositorio from '../../core/device/repositories/ordemServicoRepositorio';
import DeviceImagemRepositorio from '../../core/device/repositories/imagemRepositorio';
import DeviceEnderecoRepositorio from '../../core/device/repositories/enderecoRepositorio';
import DeviceResiduoRepositorio from '../../core/device/repositories/residuoRepositorio';
import DeviceClienteRepositorio from '../../core/device/repositories/clienteRepositorio';
import DeviceChecklistRepositorio from '../../core/device/repositories/checklistRepositorio';
import { IDeviceMtrRepositorio } from '../../core/domain/repositories/device/mtrRepositorio';
import DeviceMtrRepositorio from '../../core/device/repositories/mtrRepositorio';
import DeviceRascunhoRepositorio from '../../core/device/repositories/rascunhoRepositorio';
import { IDeviceRascunhoRepositorio } from '../../core/domain/repositories/device/rascunhoRepositoiro';
import { IDeviceAuditoriaRepositorio } from '../../core/domain/repositories/device/auditoriaRepositorio';
import DeviceAuditoria from '../../core/device/repositories/auditoriaRepositorio';
import { IDeviceMotivoRepositorio } from '../../core/domain/repositories/device/deviceMotivoRepositorio';
import DeviceMotivoRepositorio from '../../core/device/repositories/deviceMotivoRepositorio';
import { IDeviceMtrPortalRepositorio } from '../../core/domain/repositories/device/mtrPortalRepositorio';
import DeviceMtrPortalRepositorio from '../../core/device/repositories/mtrPortalRepositorio';
import { IDeviceLocalizacaoRepositorio } from '../../core/domain/repositories/device/localizacaoRepositorio';
import DeviceLocalizacaoRepositorio from '../../core/device/repositories/localizacaoRepositorio';
import database from '../../core/database';
import { IDeviceBalancaRepositorio } from '../../core/domain/repositories/device/balancaRepositorio';
import DeviceBalancaRepositorio from '../../core/device/repositories/balancaRepositorio';

interface DatabaseContextData {
  loading: boolean;
}

type Props = { children?: React.ReactNode }

const DatabaseContext = React.createContext<DatabaseContextData>({} as DatabaseContextData);

export const DatabaseProvider: React.FC = ({ children }: Props) => {
  const connection = getConnection(database);
  const { dispatchSnack } = useVSSnack();
  const [loading, setLoading] = React.useState<boolean>(true);

  const iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio = new DeviceOrdemServicoRepositorio(0, connection);
  const iDeviceImagemRepositorio: IDeviceImagemRepositorio = new DeviceImagemRepositorio(0, connection);
  const iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio = new DeviceEnderecoRepositorio(0, connection);
  const iDeviceResiduoRepositorio: IDeviceResiduoRepositorio = new DeviceResiduoRepositorio(0, connection);
  const iDeviceClienteRepositorio: IDeviceClienteRepositorio = new DeviceClienteRepositorio(0, connection);
  const iDeviceChecklistRepositorio: IDeviceChecklistRepositorio = new DeviceChecklistRepositorio(0, connection);
  const iDeviceMtrDeviceRepositorio: IDeviceMtrRepositorio = new DeviceMtrRepositorio(0, connection);
  const iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio = new DeviceRascunhoRepositorio(0, connection);
  const iDeviceAuditoriaRepositorio: IDeviceAuditoriaRepositorio = new DeviceAuditoria(0, connection);
  const iDeviceMotivoRepositorio: IDeviceMotivoRepositorio = new DeviceMotivoRepositorio(0, connection);
  const iDeviceMtrPortalRepositorio: IDeviceMtrPortalRepositorio = new DeviceMtrPortalRepositorio(0, connection);
  const iDeviceLocationRepositorio: IDeviceLocalizacaoRepositorio = new DeviceLocalizacaoRepositorio(connection);
  const iDeviceBalancaRepositorio: IDeviceBalancaRepositorio = new DeviceBalancaRepositorio(0, connection);

  const criarTabelas = async () => {
    const response = await new CriarTabelasUseCase(
      iDeviceOrdemServicoRepositorio,
      iDeviceImagemRepositorio,
      iDeviceEnderecoRepositorio,
      iDeviceResiduoRepositorio,
      iDeviceClienteRepositorio,
      iDeviceChecklistRepositorio,
      iDeviceMtrDeviceRepositorio,
      iDeviceRascunhoRepositorio,
      iDeviceAuditoriaRepositorio,
      iDeviceMotivoRepositorio,
      iDeviceMtrPortalRepositorio,
      iDeviceLocationRepositorio,
      iDeviceBalancaRepositorio
    ).execute();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    }

    setLoading(false);
  };

  React.useEffect(() => {
    criarTabelas();
  }, []);

  return (
    <DatabaseContext.Provider value={{ loading }} >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => React.useContext(DatabaseContext);

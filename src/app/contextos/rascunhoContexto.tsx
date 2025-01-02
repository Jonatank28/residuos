import * as React from 'react';
import { getConnection, useVSSnack } from 'vision-common';
import database from '../../core/database';
import DeviceChecklistRepositorio from '../../core/device/repositories/checklistRepositorio';
import DeviceMotivoRepositorio from '../../core/device/repositories/deviceMotivoRepositorio';
import DeviceEnderecoRepositorio from '../../core/device/repositories/enderecoRepositorio';
import DeviceImagemRepositorio from '../../core/device/repositories/imagemRepositorio';
import DeviceMtrRepositorio from '../../core/device/repositories/mtrRepositorio';
import DeviceRascunhoRepositorio from '../../core/device/repositories/rascunhoRepositorio';
import DeviceResiduoRepositorio from '../../core/device/repositories/residuoRepositorio';
import { IOrder } from '../../core/domain/entities/order';
import { IDeviceChecklistRepositorio } from '../../core/domain/repositories/device/checklistRepositorio';
import { IDeviceMotivoRepositorio } from '../../core/domain/repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../core/domain/repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../core/domain/repositories/device/mtrRepositorio';
import { IDeviceRascunhoRepositorio } from '../../core/domain/repositories/device/rascunhoRepositoiro';
import { IDeviceResiduoRepositorio } from '../../core/domain/repositories/device/residuoRepositorio';
import AtualizarRascunhoColetaUseCase from '../../core/domain/usecases/device/database/rascunho/atualizarRascunhoUseCase';
import DeletarRascunhoColetaUseCase from '../../core/domain/usecases/device/database/rascunho/deletarRascunhoColetaUseCase';
import GravarRascunhoColetaUseCase from '../../core/domain/usecases/device/database/rascunho/gravarRascunhoColetaUseCase';
import PegarRascunhoColetaUseCase from '../../core/domain/usecases/device/database/rascunho/pegarRascunhoColetaUseCase';
import VerificaRascunhoExisteUseCase from '../../core/domain/usecases/device/database/rascunho/verificaRascunhoExisteUseCase';
import { useUser } from './usuarioContexto';
import DeletarFotosRascunhoDeviceUseCase from '../../core/domain/usecases/device/database/rascunho/deletarFotosRascunhoDeviceUseCase';

interface RascunhoContextData {
  rascunho: IOrder | null;
  pegarRascunho(rascunhoSelecionado: IOrder, isCheck?: boolean): Promise<IOrder | undefined>;
  atualizarGravarRascunho(rascunhoColeta: IOrder): Promise<void>;
  deletarRascunho(coleta: IOrder): Promise<void>;
  deletarFotosRascunho(coleta: IOrder): Promise<void>;
  setRascunho: React.Dispatch<React.SetStateAction<IOrder | null>>;
}

type Props = { children?: React.ReactNode };

const RascunhoContext = React.createContext<RascunhoContextData>({} as RascunhoContextData);

export const RascunhoProvider: React.FC = ({ children }: Props) => {
  const { usuario } = useUser();
  const { dispatchSnack } = useVSSnack();
  const connection = getConnection(database);
  const [rascunho, setRascunho] = React.useState<IOrder | null>(null);
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const mountedRef = React.useRef<boolean>(true);

  const iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio = new DeviceEnderecoRepositorio(usuario?.codigo ?? 0, connection);
  const iDeviceRascunhoRepositorio: IDeviceRascunhoRepositorio = new DeviceRascunhoRepositorio(usuario?.codigo ?? 0, connection);
  const iDeviceResiduoRepositorio: IDeviceResiduoRepositorio = new DeviceResiduoRepositorio(usuario?.codigo ?? 0, connection);
  const iDeviceImagemRepositorio: IDeviceImagemRepositorio = new DeviceImagemRepositorio(usuario?.codigo ?? 0, connection);
  const iDeviceMtrRepositorio: IDeviceMtrRepositorio = new DeviceMtrRepositorio(usuario?.codigo ?? 0, connection);
  const iDeviceChecklistRepositorio: IDeviceChecklistRepositorio = new DeviceChecklistRepositorio(
    usuario?.codigo ?? 0,
    connection,
  );
  const iDeviceMotivoRepositorio: IDeviceMotivoRepositorio = new DeviceMotivoRepositorio(usuario?.codigo ?? 0, connection);

  React.useEffect(() => {
    return () => {
      // Componente está desmontado, atualize a referência
      mountedRef.current = false;
    };
  }, []);

  const gravarRascunhoColeta = async (coleta: IOrder) =>
    new GravarRascunhoColetaUseCase(
      iDeviceRascunhoRepositorio,
      iDeviceEnderecoRepositorio,
      iDeviceResiduoRepositorio,
      iDeviceImagemRepositorio,
      iDeviceMtrRepositorio,
      iDeviceChecklistRepositorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

  const atualizarRascunhoColeta = async (coleta: IOrder) =>
    new AtualizarRascunhoColetaUseCase(
      iDeviceRascunhoRepositorio,
      iDeviceEnderecoRepositorio,
      iDeviceResiduoRepositorio,
      iDeviceImagemRepositorio,
      iDeviceMtrRepositorio,
      iDeviceChecklistRepositorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

  const deletarFotosRascunhoDevice = async (rascunhoSelecionado: IOrder) =>
    new DeletarFotosRascunhoDeviceUseCase(iDeviceImagemRepositorio).execute(rascunhoSelecionado);

  const deletarRascunho = async (coleta: IOrder) => {
    const response = new DeletarRascunhoColetaUseCase(
      iDeviceRascunhoRepositorio,
      iDeviceEnderecoRepositorio,
      iDeviceResiduoRepositorio,
      iDeviceImagemRepositorio,
      iDeviceMtrRepositorio,
      iDeviceChecklistRepositorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    }
  };

  const pegarRascunho = async (rascunhoSelecionado: IOrder, isCheck?: boolean) => {
    const response = await new PegarRascunhoColetaUseCase(
      iDeviceRascunhoRepositorio,
      iDeviceEnderecoRepositorio,
      iDeviceResiduoRepositorio,
      iDeviceImagemRepositorio,
      iDeviceMtrRepositorio,
      iDeviceChecklistRepositorio,
      iDeviceMotivoRepositorio,
    ).execute(rascunhoSelecionado);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      if (!isCheck) {
        setRascunho(response);
      }

      return response;
    }
  };

  const deletarFotosRascunho = async (rascunhoDeletado: IOrder) => {
    const response = await deletarFotosRascunhoDevice(rascunhoDeletado);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    }
  };

  const verificaRascunhoExiste = async (codigo: string) => {
    const response = await new VerificaRascunhoExisteUseCase(iDeviceRascunhoRepositorio).execute(codigo);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      return response;
    }
  };

  React.useEffect(() => {
    // Limpar a atualização quando o componente é desmontado
    return () => {
      if (mountedRef.current) {
        setIsUpdating(false);
      }
    };
  }, [setIsUpdating]);

  const atualizarGravarRascunho = React.useCallback(
    async (coletaRascunho: IOrder) => {
      if (isUpdating) return;

      try {
        setIsUpdating(true);

        const codigo =
          coletaRascunho?.codigoOS && coletaRascunho?.codigoOS !== 0
            ? `@VRRASCUNHO:${coletaRascunho.codigoOS}`
            : `@VRRASCUNHO$NOVACOLETA:${coletaRascunho.codigoCliente}`;

        const responseExisteRascunho = await verificaRascunhoExiste(codigo);

        if (mountedRef.current) {
          if (responseExisteRascunho) {
            const responseAtualizar = await atualizarRascunhoColeta(coletaRascunho);

            if (responseAtualizar instanceof Error) {
              dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: responseAtualizar.message,
              });
            }
          } else {
            const responseGravar = await gravarRascunhoColeta(coletaRascunho);

            if (responseGravar instanceof Error) {
              dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: responseGravar.message,
              });
            }
          }

          const rascunhoNovo = await pegarRascunho(coletaRascunho);

          if (mountedRef.current) {
            setRascunho(rascunhoNovo as IOrder);
          }
        }
      } finally {
        if (mountedRef.current) {
          setIsUpdating(false);
        }
      }
    },
    [isUpdating, setIsUpdating],
  );

  // const atualizarGravarRascunho = async (coletaRascunho: IOrder) => {
  //   if (isUpdating) return;

  //   try {
  //     setIsUpdating(true);

  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  return (
    <RascunhoContext.Provider
      value={{
        rascunho,
        pegarRascunho,
        atualizarGravarRascunho,
        setRascunho,
        deletarRascunho,
        deletarFotosRascunho,
      }}>
      {children}
    </RascunhoContext.Provider>
  );
};

export const useRascunho = () => React.useContext(RascunhoContext);

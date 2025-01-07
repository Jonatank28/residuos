import I18n from 'i18n-js';
import * as React from 'react';
import {
  getAxiosConnection,
  getConnection,
  ILocalStorageConnection,
  IVeiculo,
  timezoneDate,
  useVSAlert,
  useVSConnection,
  useVSSnack,
} from 'vision-common';
import { IOrder } from '../../core/domain/entities/order';
import { useOffline } from './offilineContexto';
import { useRascunho } from './rascunhoContexto';
import { IDeviceEnderecoRepositorio } from '../../core/domain/repositories/device/enderecoRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../core/domain/repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../core/domain/repositories/device/residuoRepositorio';
import { IDeviceImagemRepositorio } from '../../core/domain/repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../core/domain/repositories/device/mtrRepositorio';
import DeviceEnderecoRepositorio from '../../core/device/repositories/enderecoRepositorio';
import DeviceResiduoRepositorio from '../../core/device/repositories/residuoRepositorio';
import DeviceOrdemServicoRepositorio from '../../core/device/repositories/ordemServicoRepositorio';
import DeviceImagemRepositorio from '../../core/device/repositories/imagemRepositorio';
import DeviceMtrRepositorio from '../../core/device/repositories/mtrRepositorio';
import GravarColetaEnviadaUseCase from '../../core/domain/usecases/device/database/coletaEnviada/gravarColetaEnviadaUseCase';
import EnviarColetaUseCase from '../../core/domain/usecases/enviarColetaUseCase';
import { IOrdemServicoRepositorio } from '../../core/domain/repositories/ordemServicoRepositorio';
import OrdemServicoRepositorio from '../../core/data/repositories/ordemServicoRepositorio';
import InserirOSManualUseCase from '../../core/domain/usecases/inserirOSManualUseCase';
import GravarColetaAgendadaOfflineUseCase from '../../core/domain/usecases/device/database/coletaPendente/gravarColetaAgendadaOfflineUseCase';
import DeletarColetaAgendadaUseCase from '../../core/domain/usecases/device/database/deletarColetaAgendadaUseCase';
import PegarColetasAgendadasOfflineUseCase from '../../core/domain/usecases/device/database/coletaPendente/pegarColetasAgendadasOfflineUseCase';
import DeletarColetaAgendadaOfflineUseCase from '../../core/domain/usecases/device/database/coletaPendente/deletarColetaAgendadaOfflineUseCase';
import { tiposExclusaoOS } from '../utils/enums';
import GetVeiculoUseCase from '../../core/domain/usecases/device/getVeiculoUseCase';
import { IDeviceChecklistRepositorio } from '../../core/domain/repositories/device/checklistRepositorio';
import DeviceChecklistRepositorio from '../../core/device/repositories/checklistRepositorio';
import { useLocation } from './localizacaoContexto';
import { useUser } from './usuarioContexto';
import { IDeviceMotivoRepositorio } from '../../core/domain/repositories/device/deviceMotivoRepositorio';
import DeviceMotivoRepositorio from '../../core/device/repositories/deviceMotivoRepositorio';
import database from '../../core/database';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import axiosClient from '../../core/axios';
import Queue from 'react-native-job-queue';
import { WORKER_COLETAS } from '../../core/constants';
import DeviceClienteRepositorio from '../../core/device/repositories/clienteRepositorio';
import { IDeviceClienteRepositorio } from '../../core/domain/repositories/device/clienteRepositorio';
import { useCheckin } from './checkinContexto';
import { IClienteCheckIn } from '../../core/domain/entities/clienteCheckIn';
import DeletarNovaColetaUseCase from '../../core/domain/usecases/device/database/novaColeta/deletarNovaColetaUseCase';
import GravarNovaColetaUseCase from '../../core/domain/usecases/device/database/novaColeta/gravarNovaColetaUseCase';
import PegarNovasColetasUseCase from '../../core/domain/usecases/device/database/novaColeta/pegarNovasColetasUseCase';
import { auditar } from '../../core/auditoriaHelper';
import { getString } from '../../core/storageHelper';
import { getParadasFromStorage } from '../utils/paradas';

interface ColetaContextData {
  enviarColeta(
    coleta: IOrder,
    isNovaColeta: boolean,
    isSincronizacao?: boolean,
    checkinsOS?: IClienteCheckIn[],
    isSincronizacaoAutomatica?: boolean,
  ): Promise<void | boolean>;
  pegarNovasColetasOffline(): Promise<IOrder[] | undefined>;
  pegarColetasAgendadasOffline(): Promise<IOrder[] | undefined>;
  deletarColetaAgendadaOffline(coleta: IOrder): Promise<void | Error>;
  deletarNovaColeta(coleta: IOrder): Promise<void | Error>;
  setVeiculo: React.Dispatch<React.SetStateAction<IVeiculo>>;
  pegarVeiculo: () => Promise<IVeiculo | undefined>;
  placa: string;
  veiculo: IVeiculo;
}

export type Parada = {
  dataFim: string | null;
  dataInicio: string | null;
  horaFim: string | null;
  horaInicio: string | null;
  id: number | null;
  motivo: string | null;
  motivoId: number | null;
  observacao: string | null;
};

type Props = { children?: React.ReactNode };

const ColetaContext = React.createContext<ColetaContextData>({} as ColetaContextData);

export const ColetaProvider: React.FC = ({ children }: Props) => {
  const connection = getConnection(database);
  const [veiculo, setVeiculo] = React.useState<IVeiculo>({});
  const { configuracoes, usuario } = useUser();
  const { offline } = useOffline();
  const { fazerCheckOut, verificaClienteCheckIn } = useCheckin();
  const { dispatchSnack } = useVSSnack();
  const { deletarRascunho } = useRascunho();
  const { dispatchAlert } = useVSAlert();
  const { pararCompartilhamentoAtivo, localizacao } = useLocation();
  const { connectionState } = useVSConnection();

  const iOrdemServicoRepositorio: IOrdemServicoRepositorio = new OrdemServicoRepositorio(getAxiosConnection(axiosClient));
  const iLocalStorageConnection: ILocalStorageConnection = new LocalStorageConnection();

  const iDeviceEnderecoDeviceRepositorio: IDeviceEnderecoRepositorio = new DeviceEnderecoRepositorio(
    usuario?.codigo ?? 0,
    connection,
  );
  const iDeviceResiduoDeviceRepositorio: IDeviceResiduoRepositorio = new DeviceResiduoRepositorio(
    usuario?.codigo ?? 0,
    connection,
  );
  const iDeviceImagemDeviceRepositorio: IDeviceImagemRepositorio = new DeviceImagemRepositorio(usuario?.codigo ?? 0, connection);
  const iDeviceMtrDeviceRepsitorio: IDeviceMtrRepositorio = new DeviceMtrRepositorio(usuario?.codigo ?? 0, connection);
  const iDeviceChecklistRepositorio: IDeviceChecklistRepositorio = new DeviceChecklistRepositorio(
    usuario?.codigo ?? 0,
    connection,
  );
  const iDeviceOrdemServicoDeviceRepositorio: IDeviceOrdemServicoRepositorio = new DeviceOrdemServicoRepositorio(
    usuario?.codigo ?? 0,
    connection,
  );
  const iDeviceMotivoRepositorio: IDeviceMotivoRepositorio = new DeviceMotivoRepositorio(usuario?.codigo ?? 0, connection);
  const iClienteDeviceRepositorio: IDeviceClienteRepositorio = new DeviceClienteRepositorio(usuario?.codigo ?? 0, connection);

  const pegarVeiculoDevice = async () => new GetVeiculoUseCase(iLocalStorageConnection).execute();

  const pegarVeiculo = async () => {
    const response = await pegarVeiculoDevice();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response && response?.codigo) {
      setVeiculo(() => response);

      return response;
    }
  };

  const deletarNovaColeta = async (coleta: IOrder) =>
    new DeletarNovaColetaUseCase(
      iDeviceOrdemServicoDeviceRepositorio,
      iDeviceEnderecoDeviceRepositorio,
      iDeviceImagemDeviceRepositorio,
      iDeviceResiduoDeviceRepositorio,
      iDeviceMtrDeviceRepsitorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

  const gravarNovaColetaLocal = async (coleta: IOrder) =>
    new GravarNovaColetaUseCase(
      iDeviceOrdemServicoDeviceRepositorio,
      iDeviceEnderecoDeviceRepositorio,
      iDeviceImagemDeviceRepositorio,
      iDeviceResiduoDeviceRepositorio,
      iDeviceMtrDeviceRepsitorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

  const deletarColetaAgendadaLocal = async (coleta: IOrder) =>
    new DeletarColetaAgendadaUseCase(
      iDeviceOrdemServicoDeviceRepositorio,
      iDeviceEnderecoDeviceRepositorio,
      iDeviceImagemDeviceRepositorio,
      iDeviceResiduoDeviceRepositorio,
      iDeviceMtrDeviceRepsitorio,
      iDeviceChecklistRepositorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

  const gravarColetadaEnviada = async (coleta: IOrder) =>
    new GravarColetaEnviadaUseCase(
      iDeviceOrdemServicoDeviceRepositorio,
      iDeviceEnderecoDeviceRepositorio,
      iDeviceImagemDeviceRepositorio,
      iDeviceResiduoDeviceRepositorio,
      iDeviceMtrDeviceRepsitorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

  const gravarColetaAgendadaLocal = async (coleta: IOrder) =>
    new GravarColetaAgendadaOfflineUseCase(
      iDeviceOrdemServicoDeviceRepositorio,
      iDeviceEnderecoDeviceRepositorio,
      iDeviceImagemDeviceRepositorio,
      iDeviceResiduoDeviceRepositorio,
      iDeviceMtrDeviceRepsitorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

  const repovoarFotos: (coleta: IOrder) => Promise<IOrder> = async coleta =>
    new Promise(async resolve => {
      await Promise.all(
        coleta?.fotos?.map?.(async foto => ({
          ...foto,
          base64: foto.id ? await iDeviceImagemDeviceRepositorio.pegarImagemBase64(foto.id) : foto.base64,
        })) || [],
      );
      await Promise.all(
        coleta?.residuos?.flatMap?.(
          async residuo =>
            await Promise.all(
              residuo?.fotos?.map?.(async foto => ({
                ...foto,
                base64: foto.id ? await iDeviceImagemDeviceRepositorio.pegarImagemBase64(foto.id) : foto.base64,
              })) || [],
            ),
        ) || [],
      );
      resolve(coleta);
    });

  const novaColeta = async (coleta: IOrder, codigoPlaca: number) => {
    const res = await repovoarFotos(coleta);

    return new InserirOSManualUseCase(iOrdemServicoRepositorio).execute({
      coleta: res,
      placaID: codigoPlaca,
    });
  };

  const enviarColetaAgendada = async (coleta: IOrder, codigoPlaca: number, checkinsOS?: IClienteCheckIn[]) => {
    if (!coleta.residuos) {
      auditar(`residuos sumiram em ordservrepo->enviarcoleta: ${coleta.residuos}`);
    }
    const res = await repovoarFotos(coleta);

    return new EnviarColetaUseCase(iOrdemServicoRepositorio).execute({
      coleta: res,
      placaID: codigoPlaca,
      checkinsOS,
    });
  };

  const deletarColetaAgendadaOffline = async (coleta: IOrder) =>
    new DeletarColetaAgendadaOfflineUseCase(
      iDeviceOrdemServicoDeviceRepositorio,
      iDeviceEnderecoDeviceRepositorio,
      iDeviceImagemDeviceRepositorio,
      iDeviceResiduoDeviceRepositorio,
      iDeviceMtrDeviceRepsitorio,
      iDeviceMotivoRepositorio,
    ).execute(coleta);

  const pegarNovasColetas = async () =>
    new PegarNovasColetasUseCase(
      iDeviceOrdemServicoDeviceRepositorio,
      iDeviceEnderecoDeviceRepositorio,
      iDeviceImagemDeviceRepositorio,
      iDeviceResiduoDeviceRepositorio,
      iDeviceMtrDeviceRepsitorio,
      iDeviceMotivoRepositorio,
    ).execute({});

  const pegarColetasAgendadas = async () =>
    new PegarColetasAgendadasOfflineUseCase(
      iDeviceOrdemServicoDeviceRepositorio,
      iDeviceEnderecoDeviceRepositorio,
      iDeviceImagemDeviceRepositorio,
      iDeviceResiduoDeviceRepositorio,
      iDeviceMtrDeviceRepsitorio,
      iDeviceMotivoRepositorio,
    ).execute({});

  const validarCheckInCliente = async (clienteID?: number) => {
    const clienteIDCheckin = await verificaClienteCheckIn(iClienteDeviceRepositorio);

    if (clienteIDCheckin && clienteID && Number(clienteIDCheckin) === clienteID) {
      await fazerCheckOut(localizacao, Number(clienteID), offline, iClienteDeviceRepositorio);
    } else if (clienteIDCheckin && Number(clienteIDCheckin) !== 0) {
      dispatchAlert({
        alertType: 'confirm',
        type: 'open',
        title: 'Atenção!',
        message: `Existe um CheckIn Ativo no cliente ${clienteIDCheckin}, deseja finaliza-lo? `,
        onPressRight: async () => await fazerCheckOut(localizacao, Number(clienteIDCheckin), offline, iClienteDeviceRepositorio),
      });
    }
  };

  const pegarColetasAgendadasOffline = async () => {
    const response = await pegarColetasAgendadas();

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

  const pegarNovasColetasOffline = async () => {
    const response = await pegarNovasColetas();

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

  const enviarColeta = async (
    coleta: IOrder,
    isNovaColeta: boolean,
    isSincronizacao?: boolean,
    checkinsOS?: IClienteCheckIn[],
    isSincronizacaoAutomatica?: boolean,
  ) => {
    const veiculoTeste = await pegarVeiculo();
    const codigoOs = coleta?.codigoOS;
    const codigoCliente = coleta?.codigoCliente;
    let paradas: Parada[] = [];

    if (isNovaColeta) {
      const res = await getParadasFromStorage(codigoCliente)
      paradas = JSON.parse(res as string);
    } else {
      const res = await getParadasFromStorage(codigoOs)
      paradas = JSON.parse(res as string);
    }

    const paradasFormatadas = paradas.map(parada => {
      const dataInicio = new Date(`${parada.dataInicio.split('/').reverse().join('-')}T${parada.horaInicio}`);
      const dataFim = new Date(`${parada.dataFim.split('/').reverse().join('-')}T${parada.horaFim}`);

      const formatDate = (date) => {
        return date.toISOString().replace('T', ' ').split('.')[0];
      };

      return {
        ...parada,
        dataInicio: formatDate(dataInicio),
        dataFim: formatDate(dataFim)
      };
    });


    coleta.paradas = paradasFormatadas;

    if (configuracoes.obrigarUmaFotoOS && !coleta?.fotos?.length) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectCheck.photoRequired'),
      });
    } else {
      coleta?.fotos?.forEach?.(async foto => {
        if (foto.id) {
          foto.base64 = await iDeviceImagemDeviceRepositorio.pegarImagemBase64(foto.id);
        }
        if (isNovaColeta) {
          foto.nome = 'Foto da coleta';
          foto.tipo = 'JPG';
          foto.origem = 'OS';
          foto.base64 = foto.base64?.replace('data:image/jpg;base64,', '') || '';
        }
      });

      if (coleta?.residuos?.length) {
        coleta.residuos.forEach(residuo => {
          residuo?.fotos?.forEach?.(async foto => {
            if (foto.id) {
              foto.base64 = await iDeviceImagemDeviceRepositorio.pegarImagemBase64(foto.id);
            }
            if (isNovaColeta) {
              foto.nome = `Foto do resíduo ${residuo.codigo}`;
              foto.tipo = 'JPG';
              foto.origem = 'OSR';
              foto.base64 = foto.base64?.replace('data:image/jpg;base64,', '') || '';
            }
          });
        });
      }

      if (!isNovaColeta && !offline && !isSincronizacao) {
        coleta.dataOS = timezoneDate(new Date());
      }

      const vinculoOSAntigo = coleta.codigoVinculo;

      coleta.codigoVinculo = coleta?.codigoOS
        ? `@VRCOLETAENVIADA:${coleta.codigoOS}`
        : `@VRCOLETAENVIADA$NOVACOLETA:${new Date().getTime()}-${coleta.codigoCliente}`;

      if (!coleta.residuos) {
        auditar(`residuos sumiram em coletacontexto->antesdeenviarcoletaagendada${coleta.residuos}`);
      }


      const response = isNovaColeta
        ? !isSincronizacao && offline
          ? await gravarNovaColetaLocal(coleta)
          : await novaColeta(coleta, veiculoTeste?.codigo ?? 0)
        : !isSincronizacao && offline
          ? await gravarColetaAgendadaLocal(coleta)
          : await enviarColetaAgendada(coleta, veiculoTeste?.codigo ?? 0, checkinsOS);

      let coletaGravadaLocalmente = false;

      if (response instanceof Error) {
        if ((isSincronizacao && !isSincronizacaoAutomatica) || offline) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: response.message,
          });
        }

        if (!isSincronizacao && !offline) {
          const responseOfflineColeta = isNovaColeta
            ? await gravarNovaColetaLocal(coleta)
            : await gravarColetaAgendadaLocal(coleta);

          if (responseOfflineColeta instanceof Error) {
            dispatchSnack({
              type: 'open',
              alertType: 'error',
              message: response.message,
            });

            return false;
          }

          dispatchAlert({
            type: 'open',
            alertType: 'info',
            onPressRight: () => null,
            message:
              'Ops! Não conseguimos enviar a coleta agora. Por motivos de segurança, ela está salva no seu dispositivo, aguardando sincronização.',
          });

          coletaGravadaLocalmente = true;
        } else {
          return false;
        }
      }

      if (!coletaGravadaLocalmente && (isSincronizacao || !offline)) {
        if (isNovaColeta) {
          coleta.classificacaoOS = 1;
          const coletaTeste: IOrder = { ...coleta, codigoVinculo: vinculoOSAntigo };

          await deletarNovaColeta(coletaTeste);
        }

        if (!isSincronizacao) coleta.dataOS = timezoneDate(new Date());

        // 1 - COLETA
        // 2 - ENTREGA
        // 3 - ENVIADA
        // 4 - CANCELADA
        // 5 - EXCLUIDA
        if (!coletaGravadaLocalmente && response && !isNovaColeta) {
          if (response === tiposExclusaoOS.EXC_OS || response === tiposExclusaoOS.EXC_GERENCIADOR) {
            coleta.classificacaoOS = 5;
          } else {
            coleta.classificacaoOS = 4;
          }
        }

        const responseLocal = await gravarColetadaEnviada(coleta);

        if (responseLocal instanceof Error) {
          dispatchSnack({
            type: 'open',
            alertType: 'info',
            message: responseLocal.message,
          });
        }
      }

      await deletarRascunho(coleta);
      await deletarColetaAgendadaLocal(coleta);
      await pararCompartilhamentoAtivo();

      if (configuracoes.checkOutAutomatico && !configuracoes.alertaCheckoutOS) await validarCheckInCliente(coleta.codigoCliente);

      const queueConfig = await getString('queueState');
      // Adiciona na fila
      if (!isSincronizacao && (coletaGravadaLocalmente || offline) && queueConfig === 'true') {
        const runJob = !Queue.isRunning && connectionState;

        // Atualiza data ordem serviço
        coleta.dataOS = timezoneDate(new Date());

        const treatedColeta = {
          ...coleta,
          fotos: coleta.fotos?.map(img => ({ ...img, base64: '' })),
          residuos: coleta.residuos?.map(res => ({ ...res, fotos: res.fotos?.map(img => ({ ...img, base64: '' })) })),
        } as IOrder;

        Queue.addJob(WORKER_COLETAS, treatedColeta, undefined, runJob);
      }

      if (!isSincronizacao) {
        dispatchSnack({
          type: 'open',
          alertType: !coletaGravadaLocalmente && response && !isNovaColeta ? 'info' : 'success',
          message:
            !coletaGravadaLocalmente && response && !isNovaColeta
              ? coleta.classificacaoOS === 5
                ? I18n.t('screens.collectCheck.collectDeleted')
                : I18n.t('screens.collectCheck.collectCanceled')
              : offline || coletaGravadaLocalmente
                ? I18n.t('screens.collectCheck.collectLocallySuccess')
                : I18n.t('screens.collectCheck.sendCollectSuccess'),
        });
      }

      return true;
    }
  };

  React.useEffect(() => {
    pegarVeiculo();
  }, []);

  return (
    <ColetaContext.Provider
      value={{
        placa: veiculo?.placa ?? '',
        veiculo,
        setVeiculo,
        enviarColeta,
        pegarVeiculo,
        pegarNovasColetasOffline,
        pegarColetasAgendadasOffline,
        deletarColetaAgendadaOffline,
        deletarNovaColeta,
      }}>
      {children}
    </ColetaContext.Provider>
  );
};

export const useColeta = () => React.useContext(ColetaContext);

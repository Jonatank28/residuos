import React, { createContext, useContext, ReactNode } from 'react';
import queue from 'react-native-job-queue';
import { usePresenter, useVSConnection, useVSSnack, timezoneDate, useUpdates } from 'vision-common';
import { Platform } from 'react-native';
import { useUser } from './usuarioContexto';
import { useColeta } from './coletaContexto';
import { useAuth } from './authContexto';
import I18n from 'i18n-js';
import HomePresenter from '../paginas/home/presenter';
import { useStorage } from './storageContexto';
import { IOrder } from '../../core/domain/entities/order';

interface SincronizacaoContextoType {
  enviarDados: () => Promise<boolean>;
}

const SincronizacaoContexto = createContext<SincronizacaoContextoType | undefined>(undefined);

interface SincronizacaoProviderProps {
  children: ReactNode;
}

export const SincronizacaoProvider: React.FC<SincronizacaoProviderProps> = ({ children }) => {
  const { connectionState, connectionType } = useVSConnection();
  const { usuario, configuracoes } = useUser();
  const {
    enviarColeta,
    pegarNovasColetasOffline,
    pegarColetasAgendadasOffline,
    deletarColetaAgendadaOffline,
    veiculo,
  } = useColeta();
  const [progress, setProgress] = React.useState<{
    progress: number;
    message: string;
    hasError?: boolean;
  }>({ message: '', progress: 0 });
  const { dispatchSnack } = useVSSnack();
  const [activeAlert, setActiveAlert] = React.useState<boolean>(false);
  const { bloqueio, guardarBloqueio } = useAuth();
  const presenter = usePresenter(() => new HomePresenter(usuario?.codigo ?? 0));
  const { pegarAuditorias, gravarAuditoria } = useStorage();
  const { verificarAtualizacoesApp } = useUpdates();

  const incrementProgress = (message: string) =>
    setProgress(prev => ({
      message: message + '...',
      progress: prev.progress + 0.1,
    }));

  const verificarQuestionario = async () => {
    // PROVISORY - APP CRASH IOS
    if (!connectionState || Platform.OS === 'ios' || !configuracoes?.habilitaFichaInspecao) {
      return true;
    }

    if (veiculo && veiculo?.codigo && veiculo?.placa) {
      const questionario = await presenter.verificarQuestionario(veiculo.placa);

      if (questionario instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: questionario.message,
        });
      } else if (questionario && questionario.codigo !== 0 && questionario.obrigatiorioResponderQuestionario) {
        setActiveAlert(false);
        setProgress({ message: '', progress: 0 });

      } else {
        if (bloqueio && bloqueio.length > 0) {
          return false;
        }

        guardarBloqueio('');
        return true;
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.home.boardError'),
      });
    }

    return false;
  };

  const pegarBalancasCadastradasMobileSincronizacao = async () => {
    const response = await presenter.pegarBalancasCadastradasMobile();

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

  const pegarClientesCheckInSincronizacao = async () => {
    const response = await presenter.pegarCheckInClientesDevice();

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


  const enviarColetasAgendadasOffline = async (coletas: IOrder[]) => {
    let index = 0;

    for await (const coleta of coletas) {
      incrementProgress(`Enviando ${index} de ${coletas.length} coletas pendentes`);

      const response = await enviarColeta(coleta, false, true);

      if (response) {
        const responseDeletar = await deletarColetaAgendadaOffline(coleta);

        if (responseDeletar instanceof Error) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: responseDeletar.message,
          });
        }
      }

      index++;
    }
  };

  const enviarNovasColetasOffline = async (coletas: IOrder[]) => {
    let index = 0;

    for await (const novaColeta of coletas) {
      incrementProgress(`Enviando ${index} de ${coletas.length} coletas pendentes`);
      const isNovaColeta = true;
      const isSincronizacao = true;

      const response = await enviarColeta(novaColeta, isNovaColeta, isSincronizacao);

      if (!response) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: 'Ocorreu um erro ao sincronizar uma OS',
        });
      }

      index++;
    }
  };

  const enviarDados = async () => {
    try {
      if (queue.isRunning) {
        queue.stop();
      }

      setProgress({ message: '', progress: 0 });
      incrementProgress('Verificando questionário');

      const isOK = await verificarQuestionario();

      if (isOK) {
        incrementProgress('Verificando dados dispositivo');

        const listaItensEnviar = await Promise.all([
          pegarAuditorias(),
          pegarBalancasCadastradasMobileSincronizacao(),
          pegarNovasColetasOffline(),
          pegarColetasAgendadasOffline(),
          pegarClientesCheckInSincronizacao(),
        ]);

        const auditorias = listaItensEnviar[0] ?? [];
        const balancas = listaItensEnviar[1] ?? [];
        const novasColetasOffline = listaItensEnviar[2] ?? [];
        const coletasAgendadasOffline = listaItensEnviar[3] ?? [];
        const clientesCheckInDevice = listaItensEnviar[4] ?? [];

        console.log(JSON.stringify(clientesCheckInDevice, null, 2));

        auditorias.push({
          codigoMotorista: usuario?.codigo ?? 0,
          codigoRegistro: usuario?.codigo ?? 0,
          descricao: `Sincronizando aplicativo via: ${connectionType ?? '-'}`,
          rotina: 'Sincronizar',
          tipo: 'CONFIGURACOES',
          data: timezoneDate(new Date()),
        });

        if (coletasAgendadasOffline.length > 0) await enviarColetasAgendadasOffline(coletasAgendadasOffline);
        if (novasColetasOffline.length > 0) await enviarNovasColetasOffline(novasColetasOffline);

        incrementProgress('Enviando dados complementares');

        const response = await presenter.enviarDados(auditorias, balancas, clientesCheckInDevice, usuario?.fotoBase64);

        if (response instanceof Error) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: response.message,
          });

          throw new Error(response.message);
        } else {
          incrementProgress('Limpando dispositivo');
        }
      }

      if (Platform.OS !== 'ios') verificarAtualizacoesApp();
      return true;
    } catch (err: any) {
      setProgress({ message: err?.message ?? '', progress: 0, hasError: true });
      await gravarAuditoria({
        codigoRegistro: 0,
        descricao: err?.message ?? '',
        rotina: 'Erro ao enviar dados',
      });
    }
    return false
  };

  const values: SincronizacaoContextoType = {
    enviarDados,
  };

  return (
    <SincronizacaoContexto.Provider value={values}>
      {children}
    </SincronizacaoContexto.Provider>
  );
};

export const useSincronizacaoContexto = (): SincronizacaoContextoType => {
  const context = useContext(SincronizacaoContexto);
  if (!context) {
    throw new Error('useSincronizacaoContexto deve ser usado dentro de um SincronizacaoProvider');
  }
  return context;
};

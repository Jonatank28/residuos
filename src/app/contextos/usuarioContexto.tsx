import * as React from 'react';
import { getAxiosConnection, ILocalStorageConnection, useVSConnection, useVSSnack } from 'vision-common';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import axiosClient from '../../core/axios';
import UsuarioRepositorio from '../../core/data/repositories/usuarioRepositorio';
import { IConfiguracao } from '../../core/domain/entities/configuracao';
import { IUsuario } from '../../core/domain/entities/usuario';
import { IUsuarioRepositorio } from '../../core/domain/repositories/usuarioRepositorio';
import GetConfiguracoesUseCase from '../../core/domain/usecases/device/getConfiguracoesUseCase';
import GetUsuarioUseCase from '../../core/domain/usecases/device/getUsuarioUseCase';
import SetUsuarioUseCase from '../../core/domain/usecases/device/setUsuarioUseCase';
import PegarConfiguracoesUseCase from '../../core/domain/usecases/pegarConfiguracoesUseCase';
import PegarUsuarioUseCase from '../../core/domain/usecases/pegarUsuarioUseCase';
import { useAuth } from './authContexto';
import { useStorage } from './storageContexto';

interface UserContextData {
  setUsuario: React.Dispatch<React.SetStateAction<IUsuario | null>>,
  usuario: IUsuario | null,
  configuracoes: IConfiguracao;
  pegarConfiguracoes(): Promise<IConfiguracao | undefined>,
  pegarUsuario(): Promise<void>
  pegarUsuarioDevice(): Promise<void>
}

type Props = { children?: React.ReactNode }

const UserContext = React.createContext<UserContextData>({} as UserContextData);

export const UserProvider: React.FC = ({ children }: Props) => {
  const { dispatchSnack } = useVSSnack();
  const { logado } = useAuth();
  const { connectionState } = useVSConnection();
  const [usuario, setUsuario] = React.useState<IUsuario | null>(null);
  const [configuracoes, setConfiguracoes] = React.useState<IConfiguracao>({} as IConfiguracao);

  const iUsuarioRepositorio: IUsuarioRepositorio = new UsuarioRepositorio(getAxiosConnection(axiosClient));
  const iLocalStorageConnection: ILocalStorageConnection = new LocalStorageConnection();

  const pegarDadosUsuario = async () => new PegarUsuarioUseCase(iUsuarioRepositorio).execute();

  const pegarDadosUsuarioDevice = async () => new GetUsuarioUseCase(iLocalStorageConnection).execute();

  const pegarConfiguracoesDevice = async () => new GetConfiguracoesUseCase(iLocalStorageConnection).execute();

  const pegarConfiguracoesOnline = async () => new PegarConfiguracoesUseCase(iUsuarioRepositorio, iLocalStorageConnection).execute();

  const GravarDadosUsuarioDevice = async (dadosUsuario: IUsuario) => new SetUsuarioUseCase(iLocalStorageConnection).execute(dadosUsuario);

  const gravarUsuarioDevice = async (dadosUsuario: IUsuario) => {
    const response = await GravarDadosUsuarioDevice(dadosUsuario);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message
      });
    }
  };

  const pegarUsuarioDevice = async () => {
    const response = await pegarDadosUsuarioDevice();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message
      });
    } else if (response && response?.codigo) {
      setUsuario(response);
    }
  };

  const pegarConfiguracoes = async () => {
    // TODO: TROCAR PARA VERIFICACAO DE MODO OFFLINE E TESTAR COM BLOQUEIO APP - Sugestão Cleiton
    const response = connectionState
      ? await pegarConfiguracoesOnline()
      : await pegarConfiguracoesDevice();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message
      });
    } else if (response) {
      setConfiguracoes(response);

      return response;
    }
  };

  const pegarUsuario = async () => {
    const response = await pegarDadosUsuario();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message
      });
    } else {
      setUsuario(response);

      if (response && response?.codigo) {
        await gravarUsuarioDevice(response);
      }
    }
  };

  React.useEffect(() => {
    (async () => {
      if (logado) {
        await pegarConfiguracoes();

        if (connectionState)
          await pegarUsuario();
        else
          await pegarUsuarioDevice();
      }
    })();
  }, [logado, connectionState]);

  return (
    <UserContext.Provider
      value={{
        usuario,
        configuracoes,
        setUsuario,
        pegarUsuario,
        pegarUsuarioDevice,
        pegarConfiguracoes,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);

import I18n from 'i18n-js';
import * as React from 'react';
import axiosConfig from '../../core/axios';
import { CommonConfig, getAxiosConnection, ILocalStorageConnection, useVSAlert, useVSSnack } from 'vision-common';
import { QuestionarioConfig } from 'vision-questionario';
import AutenticacaoRepositorio from '../../core/data/repositories/autenticacaoRepositorio';
import { IServidor } from '../../core/domain/entities/servidor';
import { IAutenticacaoRepositorio } from '../../core/domain/repositories/autenticacaoRepositorio';
import GetBloqueioUseCase from '../../core/domain/usecases/device/getBloqueioUseCase';
import GetServidorUseCase from '../../core/domain/usecases/device/getServidorUseCase';
import GetTokenUseCase from '../../core/domain/usecases/device/getTokenUseCase';
import SetBloqueioUseCase from '../../core/domain/usecases/device/setBloqueioUseCase';
import RefreshTokenUseCase from '../../core/domain/usecases/refreshTokenUseCase';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import axiosClient from '../../core/axios';

interface AuthContextData {
  logado: boolean;
  bloqueio: string;
  urlServidor: string;
  setBloqueio: React.Dispatch<React.SetStateAction<string>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setServidor: React.Dispatch<React.SetStateAction<IServidor>>;
  guardarBloqueio(hasBloqueio: string): Promise<void>;
}

type Props = { children?: React.ReactNode };

const AuthContext = React.createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }: Props) => {
  const axiosConnection = getAxiosConnection(axiosClient);

  const iAutenticacaoRepositorio: IAutenticacaoRepositorio = new AutenticacaoRepositorio(axiosConnection);
  const iPreferencesRepositorio: ILocalStorageConnection = new LocalStorageConnection();

  const [urlServidor, setUrlServidor] = React.useState<string>('');
  const [token, setToken] = React.useState<string>('');
  const [servidor, setServidor] = React.useState<IServidor>({});
  const [bloqueio, setBloqueio] = React.useState<string>('');
  const { dispatchSnack } = useVSSnack();

  const pegarRefreshToken = async () => new RefreshTokenUseCase(iAutenticacaoRepositorio, iPreferencesRepositorio).execute();

  const pegarTokenStorage = async () => new GetTokenUseCase(iPreferencesRepositorio).execute();

  async function guardarBloqueio(hasBloqueio: string) {
    const storageBloqueio = await new SetBloqueioUseCase(iPreferencesRepositorio).execute(hasBloqueio);

    if (storageBloqueio instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: storageBloqueio.message,
      });
    }
  }

  async function verificarBLoqueioStorage() {
    const storageBloqueio = await new GetBloqueioUseCase(iPreferencesRepositorio).execute();

    if (storageBloqueio instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: storageBloqueio.message,
      });
    } else if (storageBloqueio && storageBloqueio.length > 0) {
      setBloqueio(storageBloqueio);
    }
  }

  async function loadServidor() {
    const storagedServidor = await new GetServidorUseCase(iPreferencesRepositorio).execute();

    if (storagedServidor instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: storagedServidor.message,
      });
    } else if (!storagedServidor?.rota || !storagedServidor.ip) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('serverAlert'),
      });
    } else if (storagedServidor) {
      setServidor(storagedServidor);
    }
  }

  const pegarToken = async () => {
    const response = await pegarTokenStorage();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response?.length > 0) {
      setToken(response);
    }
  };

  React.useEffect(() => {
    (async () => {
      await loadServidor();
      await pegarToken();
      await verificarBLoqueioStorage();
    })();
  }, [token]);

  axiosConfig.interceptors.response.use(
    response => response,
    async error => {
      try {
        const {
          config,
          response: { status },
        } = error;
        if (status === 401 && token && !config._retry) {
          console.log('REFRESH TOKEN...');
          config._retry = true;

          const newToken = await pegarRefreshToken();

          if (newToken instanceof Error) {
            return Promise.reject(error);
          } else if (newToken) {
            // Atualize o token e a configuração do cabeçalho
            setToken(newToken);
            config.headers.Authorization = `Bearer ${newToken}`;

            // Reenvie a solicitação original com o novo token
            return axiosConfig.request(config);
          }
        }

        // Se não conseguirmos obter um novo token ou atingir o limite de tentativas, rejeite a promessa
        return Promise.reject(error);
      } catch (e) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: I18n.t('exceptions.notAuthorized'),
        });

        return Promise.reject(error);
      }
    },
  );

  React.useEffect(() => {
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    if (axiosConfig.defaults.baseURL) {
      CommonConfig(axiosConfig);
      QuestionarioConfig(axiosConfig);
    }
  }, [token]);

  React.useEffect(() => {
    if (servidor && servidor?.ip) {
      const serverURL = `${servidor.ip.includes('ngrok') ? 'https' : 'http'}://${`${servidor?.ip ?? ''}${servidor?.rota ?? ''}`}`;

      axiosConfig.defaults.baseURL = serverURL;
      setUrlServidor(serverURL);
    }
  }, [servidor]);

  return (
    <AuthContext.Provider
      value={{
        logado: !!token,
        bloqueio,
        urlServidor,
        setToken,
        setBloqueio,
        setServidor,
        guardarBloqueio,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

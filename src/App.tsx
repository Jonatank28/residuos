import * as React from 'react';
import * as Fontes from 'expo-font';
import * as Localization from 'expo-localization';
import * as TaskManager from 'expo-task-manager';
import I18n from 'i18n-js';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import { Platform, Text, View } from 'react-native';
import { inicializedDevice } from './core/device/device';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, getAxiosConnection, ILocalStorageConnection, SnackBar, UpdatesAlert } from 'vision-common';
import ContextProvider from './app/contextos';
import Rotas from './app/routes';
import Loading from './app/componentes/loading';
import BloqueioAlert from './app/componentes/bloqueioAlert';
import { IUsuarioRepositorio } from './core/domain/repositories/usuarioRepositorio';
import UsuarioRepositorio from './core/data/repositories/usuarioRepositorio';
import AtualizarLocalizacaoMotoristaUseCase from './core/domain/usecases/atualizarLocalizacaoMotoristaUseCase';
import GetCompartilharLocalizacaoUseCase from './core/domain/usecases/device/getCompartilharLocalizacaoUseCase';
import { $TOKEN_KEY, BACKGROUND_LOCATION_TASK, BACKGROUND_QUEUE_COLETAS_TASK, WORKER_COLETAS } from './core/constants';
import DefaultHeader from './core/data/helpers/headers';
import axiosClient from './core/axios';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import Queue from 'react-native-job-queue';
import NetInfo from '@react-native-community/netinfo';
import * as BackgroundFetch from 'expo-background-fetch';
import { imagensHelper } from './core/imagensHelper';
import { getString, setString } from './core/storageHelper';

getString('queueState').catch(() => {
  setString('queueState', 'true');
})

TaskManager.defineTask(BACKGROUND_QUEUE_COLETAS_TASK, async ({ data, error }: any) => {
  if (error) {
    console.log(error);
    return;
  }

  if (!Queue.registeredWorkers[WORKER_COLETAS]) return;

  const token = await new LocalStorageConnection().getStorageDataString($TOKEN_KEY);
  if (!token) return;

  const unsubscribe = NetInfo.addEventListener(async ({ isConnected }) => {
    const queueConfig = await getString('queueState')
    if (isConnected !== null && isConnected && queueConfig === 'true') {
      const queueList = await Queue.getJobs();
      if (queueList?.length === 0) return;
      if (Queue?.isRunning) return;
      Queue.start();
    }
  });

  unsubscribe();
});

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data: { locations }, error }: any) => {
  if (error) {
    console.log(error);
    return;
  }

  const iLocalStorageConnection: ILocalStorageConnection = new LocalStorageConnection();
  const iUsuarioRepositorio: IUsuarioRepositorio = new UsuarioRepositorio(getAxiosConnection(axiosClient));

  const responseCodigoOS = await new GetCompartilharLocalizacaoUseCase(iLocalStorageConnection).execute();

  if (responseCodigoOS instanceof Error) {
    console.log(responseCodigoOS.message);
  } else if (locations) {
    const [{ coords }] = locations;

    const response = await new AtualizarLocalizacaoMotoristaUseCase(iUsuarioRepositorio).execute({
      location: coords,
      codigoOS: Number(responseCodigoOS),
    });

    if (response instanceof Error) {
      console.log(response.message);
    } else {
      console.log('Localização atualizada com sucesso!');
    }
  }
});

export default function App() {
  const [fontesCarregadas, setfontesCarregadas] = React.useState<boolean>(false);

  const loadTranslations = async () => {
    I18n.translations = {
      pt: require('./app/assets/i18n/pt-BR.json'),
      en: require('./app/assets/i18n/en-US.json'),
    };

    I18n.fallbacks = true;
    I18n.defaultLocale = 'pt-BR';

    if (Platform.OS === 'ios') {
      I18n.locale = Localization.locale;
    } else {
      const { locale } = await Localization.getLocalizationAsync();
      I18n.locale = locale;
    }
  };
  const registerBackgroundTask = async () => {
    try {
      const queueConfig = await getString('queueState');
      if (queueConfig === 'false') return;

      if (!(await TaskManager.isTaskRegisteredAsync(BACKGROUND_QUEUE_COLETAS_TASK))) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_QUEUE_COLETAS_TASK, {
          minimumInterval: 10,
          startOnBoot: false,
          stopOnTerminate: false,
        });
      }

    } catch (err) {
      console.log('Task Register failed:', err);
    }
  };

  const pegarFontes = async () => {
    await Fontes.loadAsync({
      'Proxima-Light': require('./app/assets/fontes/Proxima-Nova-Light.otf'),
      'Proxima-Semibold': require('./app/assets/fontes/Proxima-Nova-Semibold.otf'),
      'Proxima-Bold': require('./app/assets/fontes/Proxima-Nova-Bold.otf'),
    });

    setfontesCarregadas(true);
  };

  React.useEffect(() => {
    (async () => {
      // TODO - como foi deixado até refatorar.
      await inicializedDevice()
      await loadTranslations()
      await pegarFontes()
      await registerBackgroundTask()

      SplashScreen.hide();
      imagensHelper.init();
      axiosClient.defaults.headers.common = DefaultHeader().defaultHeader;

    })();

    //cleitom recomendou comentar pois tinha problema ao inicializar o app.
    //ficava preso na TelaCarregamento sem ijnicializar.
    //TODO - Ajustar ou avaliar se poderá fica como está em cima
    //   await Promise.all([inicializedDevice(), loadTranslations(), pegarFontes(), registerBackgroundTask()]).then(() => {
    //     console.log('init app')
    //     SplashScreen.hide();
    //     imagensHelper.init();
    //     axiosClient.defaults.headers.common = DefaultHeader().defaultHeader;

    //     console.log('init app end')
    //   });
    // })();


  }, []);

  if (!fontesCarregadas) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Ajustando Fontes...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <ContextProvider>
        <Rotas />
        <SnackBar />
        <Alert />
        <Loading />
        <BloqueioAlert />
        <UpdatesAlert />
      </ContextProvider>
    </NavigationContainer>
  );
}

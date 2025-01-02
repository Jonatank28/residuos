import * as React from 'react';
import I18n from 'i18n-js';
import { useUser } from '../../contextos/usuarioContexto';
import Presenter from './presenter';
import { AuthRoutes } from '../../routes/routes';
import { IControllerAuth } from '../../routes/types';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { usePresenter, useVSConnection, useVSSnack } from 'vision-common';
import { getString, setString } from '../../../core/storageHelper';

interface Props extends IControllerAuth<AuthRoutes.MeusDados> { }

export default function Controller({ navigation, params }: Props) {
  const { usuario } = useUser();
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const { connectionState } = useVSConnection();
  const presenter = usePresenter(() => new Presenter());
  const { dispatchSnack } = useVSSnack();
  const { pegarUsuario, pegarUsuarioDevice } = useUser();
  const [queueState, setQueueState] = React.useState<'true' | 'false'>();

  const onPressTrocarImagem = () => {
    bottomSheetRef.current?.present();
  };

  const toggleQueue = () => setQueueState((prev) => prev === 'true' ? 'false' : 'true');

  const goToCamera = () => {
    navigation.navigate(AuthRoutes.Camera, {
      message: I18n.t('screens.myData.photoMessage'),
      isFront: true,
      screen: AuthRoutes.MeusDados,
    });
  };

  const alterarFoto = async (base64: string) => {
    const response = connectionState
      ? await presenter.alterarFoto(base64)
      : await presenter.alterarFotoUsuarioDevice({ ...usuario, fotoBase64: base64 });

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: I18n.t('screens.myData.exceptions.photoSuccess'),
      });
    }
  };

  const goToGaleraFotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 5],
      quality: 0.3,
    });

    if (!result.cancelled && result.base64) {
      await alterarFoto(result.base64);

      if (connectionState) await pegarUsuario();
      else await pegarUsuarioDevice();
    } else if (!result.cancelled && !result.base64) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: 'Ocorreu um erro ao pegar a imagem',
      });
    }
  };

  React.useEffect(() => {
    (async () => {
      if (params.photo?.base64) {
        await alterarFoto(params.photo.base64);

        if (connectionState) await pegarUsuario();
        else await pegarUsuarioDevice();
      }
    })();
  }, [params]);

  React.useEffect(() => {
    if (queueState === 'true') {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'filas ativadas',
      });
      setString('queueState', queueState)
    } else if (queueState === 'false') {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'filas desativadas',
      });
      setString('queueState', queueState)
    }
  }, [queueState]);

  React.useEffect(() => {
    getString('queueState').then((value) => {
      setQueueState(value as 'true' | 'false')
    });
  }, []);

  return {
    toggleQueue,
    queueState,
    usuario,
    bottomSheetRef,
    goToCamera,
    goToGaleraFotos,
    onPressTrocarImagem,
  };
}

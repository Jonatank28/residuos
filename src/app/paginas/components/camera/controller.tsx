import * as React from 'react';
import { RNCamera } from 'react-native-camera';
import { IPhoto, timezoneDate, Orientation, useVSSnack } from 'vision-common';
import { IControllerAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';

interface Props extends IControllerAuth<AuthRoutes.Camera> { }

export default function Controller({ navigation, params }: Props) {
  const camRef = React.useRef<RNCamera | null>(null);
  const [type, setType] = React.useState(params.isFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back);
  const [photo, setPhoto] = React.useState<IPhoto>({});
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const { dispatchSnack } = useVSSnack();

  const navigateToScreen = async () => navigation.navigate<any>(params.screen, { photo });

  const changeCamera = () => setType(
    type === RNCamera.Constants.Type.back
      ? RNCamera.Constants.Type.front
      : RNCamera.Constants.Type.back,
  );

  const takeFoto = async () => {
    setLoadingData(true);

    if (camRef && camRef?.current) {
      const response = await camRef.current.takePictureAsync({
        quality: 0.3,
        base64: true,
        doNotSave: true,
        imageType: 'jpeg',
        pauseAfterCapture: true,
        fixOrientation: true,
        orientation: 'portrait',
      });

      if ((response.base64?.length||0) > 5 * 1024 * 1024 ) {
        setLoadingData(false);
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: 'A foto é muito grande, por favor selecione uma imagem menor.',
        });
        tirarOutraFoto();
        return;
      }

      setPhoto({
        height: response.height,
        width: response.width,
        base64: `data:image/jpg;base64,${response.base64}`,
        uri: response.uri,
        observacao: '',
        data: timezoneDate(new Date()),
        nome: '',
        origem: 'VSR',
        tipo: 'JPG',
      });
    }

    setLoadingData(false);
  };

  const tirarOutraFoto = async () => {
    if (camRef && camRef?.current) {
      await camRef.current.resumePreview();
      setPhoto({});
    }
  };

  const goBack = () => navigation.goBack();

  React.useEffect(() => {
    Orientation.allowPortraitOnly();

    return () => { };
  }, []);

  return {
    camRef,
    type,
    photo,
    loadingData,
    navigateToScreen,
    takeFoto,
    tirarOutraFoto,
    goBack,
    changeCamera
  };
}

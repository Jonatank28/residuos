import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { RNCamera } from 'react-native-camera';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { IScreenAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';

const Camera: IScreenAuth<AuthRoutes.Camera> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <Styles.Container
      ref={controller.camRef}
      type={controller.type}
      captureAudio={false}
      flashMode={RNCamera.Constants.FlashMode.off}
      androidCameraPermissionOptions={{
        title: I18n.t('components.camera.permissionTitle'),
        message: I18n.t('components.camera.permissionMessage'),
        buttonPositive: I18n.t('alerts.ok'),
        buttonNegative: I18n.t('alerts.cancel'),
      }}
    >
      <Styles.HeaderContainer>
        <Styles.VoltarContainer
          activeOpacity={0.5}
          onPress={controller.goBack}
        >
          <Styles.FeatherIcone
            name="arrow-left"
            size={30}
            color={colors.white}
          />
        </Styles.VoltarContainer>
      </Styles.HeaderContainer>
      <Styles.BodyContainer>
        <Styles.FotoContainer />
        <Styles.Mensagem>{controller.loadingData
          ? I18n.t('components.camera.loadingData')
          : controller.photo?.base64 ? I18n.t('components.camera.likePhoto') : route.params.message}
        </Styles.Mensagem>
      </Styles.BodyContainer>
      <Styles.FooterContainer>
        {!controller.photo?.base64 && !controller.loadingData
          ? (
            <>
              <Styles.FooterIconContainer activeOpacity={1} />
              <Styles.TakeCircularContainer
                onPress={controller.takeFoto}
                activeOpacity={0.5}
              >
                <Styles.TakeCircularSmallContainer />
              </Styles.TakeCircularContainer>
              <Styles.FooterIconContainer activeOpacity={0.5}>
                <Styles.FeatherIcone
                  name="refresh-ccw"
                  size={30}
                  color={colors.white}
                  onPress={controller.changeCamera}
                />
              </Styles.FooterIconContainer>
            </>
          ) : (
            !controller.loadingData ? (
              <>
                <Styles.Botao
                  activeOpacity={0.5}
                  onPress={controller.tirarOutraFoto}
                >
                  <Styles.TextoBotao>{I18n.t('components.camera.takeAgain')}</Styles.TextoBotao>
                </Styles.Botao>
                <Styles.Botao
                  activeOpacity={0.5}
                  onPress={controller.navigateToScreen}
                >
                  <Styles.TextoBotao>{I18n.t('components.camera.confirm')}</Styles.TextoBotao>
                </Styles.Botao>
              </>
            ) : <CustomActiveIndicator color={colors.white} />
          )}
      </Styles.FooterContainer>
    </Styles.Container>
  );
};

export default Camera;

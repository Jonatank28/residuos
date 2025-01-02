import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { useTheme } from 'styled-components/native';
import SignatureScreen from 'react-native-signature-canvas';
import { AuthRoutes } from '../../../routes/routes';
import Controller from './controller';
import { IScreenAuth } from '../../../routes/types';

const Assinatura: IScreenAuth<AuthRoutes.Assinatura> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });
  const { secundary, text, primary, button } = useTheme();

  const style = `
    .m-signature-pad { box-shadow: none; border: none; margin: 0; }
    .m-signature-pad--body { border: none; }
    .m-signature-pad--footer { display: none; margin: 0px; }
    .m-signature-pad {
      position: absolute;
      left: 0;
      top: 0;
      height:100%;
      width: 100%;
    }
  `;

  return !controller.loadingData
    ? (
      <Styles.Container>
        <BotaoVoltar
          goBack={controller.goBack}
          iconColor={text.headline.color}
        />
        {!route.params.codigoQuestionario && (
          <>
            <Styles.RecusaAssinaturaContainer
              activeOpacity={0.5}
              onPress={controller.navigateToRecusaAssinatura}
            >
              <Styles.TextoRecusaAsssinatra>{I18n.t('components.signature.refuseSignature')}</Styles.TextoRecusaAsssinatra>
            </Styles.RecusaAssinaturaContainer>
            <Styles.ImprimirContainer
              activeOpacity={0.5}
              onPress={controller.navigateToImpressoras}
            >
              <Styles.FeatherIcone
                name="printer"
                size={15}
                color={secundary}
              />
            </Styles.ImprimirContainer>
          </>
        )}
        <SignatureScreen
          ref={controller.signatureRef}
          webStyle={style}
          onClear={() => controller.setSignature('')}
          onOK={(signature) => controller.setSignature(signature)}
          // @ts-ignore
          onEnd={() => controller?.signatureRef?.current?.readSignature()}
        />
        <Styles.ImageContainer pointerEvents="none">
          <Styles.Image
            source={require('../../../assets/imagens/assinaturaLogo.png')}
          />
        </Styles.ImageContainer>
        <Styles.FooterContainer>
          <Styles.BotaoContainer>
            <Styles.Botao
              color={button.background}
              title={I18n.t('components.signature.clean')}
              onPress={controller.clearSignature}
            />
          </Styles.BotaoContainer>
          <Styles.DescricaoAssinaturaContainer>
            <Styles.Texto>{I18n.t('components.signature.description')}</Styles.Texto>
          </Styles.DescricaoAssinaturaContainer>
          <Styles.BotaoContainer>
            <Styles.Botao
              title={I18n.t('components.signature.confirm')}
              disabled={controller.hasDisabled}
              color={primary}
              onPress={() => {
                controller.toogleButton();
                if (route.params.coleta?.codigoOS || route.params.novaColeta) {
                  controller.verificaQuantidadeFotosOS();
                } else {
                  controller.handleSignature();
                }
              }}
            />
          </Styles.BotaoContainer>
        </Styles.FooterContainer>
      </Styles.Container>
    ) : (
      <Styles.Container>
        <BotaoVoltar
          goBack={controller.goBack}
          iconColor={text.headline.color}
        />
        <Styles.LoadingContainer>
          <Styles.Texto>{I18n.t('loading')}</Styles.Texto>
        </Styles.LoadingContainer>
      </Styles.Container>
    );
}

type Props = {
  iconColor: string;
  goBack: () => void;
}

const BotaoVoltar = (props: Props) => (
  <Styles.VoltarContainer
    activeOpacity={0.5}
    onPress={props.goBack}
  >
    <Styles.FeatherIcone
      name="arrow-left"
      size={25}
      color={props.iconColor}
    />
  </Styles.VoltarContainer>
);

export default Assinatura;

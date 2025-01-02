import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { IScreenAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';

const Scanner: IScreenAuth<AuthRoutes.Scanner> = ({ navigation, route }) => {
  const { secundary } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <Styles.Container
      captureAudio={false}
      barCodeTypes={controller.type}
      onBarCodeRead={controller.scanned ? undefined : controller.handleBarCodeScanned}
    >
      <Styles.HeaderContainer>
        <Styles.VoltarContainer
          activeOpacity={0.5}
          onPress={controller.goBack}
        >
          <Styles.FeatherIcone
            name="arrow-left"
            size={30}
            color={secundary}
          />
        </Styles.VoltarContainer>
      </Styles.HeaderContainer>
      <Styles.BodyContainer>
        <Styles.ScannerContainer>
          {route.params.scanType === 'code39' && (
            <Styles.BorderContainer borderColor={controller.changeColor} />
          )}
        </Styles.ScannerContainer>
        <Styles.MessageContainer>
          {controller.data.length === 0 && !controller.scanned
            ? <Styles.Mensagem>{route.params.message ?? ''}</Styles.Mensagem>
            : <Styles.Mensagem>{I18n.t('components.scanner.scanOK')}</Styles.Mensagem>}
        </Styles.MessageContainer>
      </Styles.BodyContainer>
      <Styles.FooterContainer>
        {controller.data.length > 0 && controller.scanned && (
          <>
            <Styles.Botao
              activeOpacity={0.5}
              onPress={controller.scanearNovamente}
            >
              <Styles.TextoBotao>{I18n.t('components.scanner.scanAgain')}</Styles.TextoBotao>
            </Styles.Botao>
            <Styles.Botao
              activeOpacity={0.5}
              onPress={controller.navigateToScreen}
            >
              <Styles.TextoBotao>{I18n.t('components.scanner.confirm')}</Styles.TextoBotao>
            </Styles.Botao>
          </>
        )}
      </Styles.FooterContainer>
    </Styles.Container >
  );
}

export default Scanner;

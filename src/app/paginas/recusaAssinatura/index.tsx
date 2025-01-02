import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { ItemContainer } from 'vision-common';
import Botao from '../../componentes/botao';
import Cabecalho from '../../componentes/cabecalho';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';

const TelaRecusaAssinatura: IScreenAuth<AuthRoutes.RecusaDeAssinatura> = ({ navigation, route }) => {
  const { text, primary, secundary } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.refuseSignature.title')} temIconeDireita={false} />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <ItemContainer title={I18n.t('screens.refuseSignature.refuseSignatureDetails')}>
            <Styles.Titulo marginBottom={5}>{I18n.t('screens.refuseSignature.responsible.title')}</Styles.Titulo>
            <Styles.Input
              autoCorrect
              maxLength={100}
              placeholderTextColor={text.input.placeholderColor}
              value={controller.responsavel}
              placeholder={I18n.t('screens.refuseSignature.responsible.placeholder')}
              onChangeText={controller.setResponsavel}
            />
            <Styles.Titulo marginTop={5} marginBottom={5}>
              {I18n.t('screens.refuseSignature.reason.title')}
            </Styles.Titulo>
            <Styles.Input
              autoCorrect
              maxLength={100}
              placeholderTextColor={text.input.placeholderColor}
              value={controller.motivoRecusa}
              placeholder={I18n.t('screens.refuseSignature.reason.placeholder')}
              onChangeText={controller.setMotivoRecusa}
            />
          </ItemContainer>
          <Styles.BotaoContainer>
            <Botao
              texto={I18n.t('screens.refuseSignature.button')}
              hasIcon={false}
              backgroundColor={primary}
              corTexto={secundary}
              onPress={controller.validarColeta}
            />
          </Styles.BotaoContainer>
        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
};

export default TelaRecusaAssinatura;

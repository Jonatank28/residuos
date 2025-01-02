import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { Form } from '@unform/mobile';
import Controller from './controller';
import Botao from '../../componentes/botao';
import { IScreenApp } from '../../routes/types';
import { AppRoutes } from '../../routes/routes';
import { useTheme } from 'styled-components/native';
import CaixaDeTexto from '../../componentes/caixaDeTexto';

const TelaEntrar: IScreenApp<AppRoutes.Home> = ({ navigation, route }) => {
  const { secundary, icon } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <Styles.Container>
      <Styles.ScrollContainer keyboardShouldPersistTaps="always">
        <Styles.LogoContainer>
          <Styles.Logo resizeMode="contain" source={require('../../assets/imagens/logo.png')} />
        </Styles.LogoContainer>
        <Styles.LoginContainer>
          <Form ref={controller.formRef} onSubmit={controller.validacaoLogin}>
            <Styles.CaixaTextoContainer>
              <CaixaDeTexto
                nome="usuario"
                temIcone
                temSenha={false}
                placeholderNome={I18n.t('screens.login.user')}
                nomeIcone="user"
                captalize="none"
              />
            </Styles.CaixaTextoContainer>
            <Styles.CaixaTextoContainer marginBottom={40}>
              <CaixaDeTexto
                nome="password"
                temIcone
                temSenha
                placeholderNome={I18n.t('screens.login.password')}
                nomeIcone="lock"
              />
            </Styles.CaixaTextoContainer>
            <Styles.BotaoContainer>
              <Botao
                hasIcon
                // @ts-ignore
                onPress={() => controller.formRef.current.submitForm()}
                iconName="log-in"
                texto={I18n.t('screens.login.login')}
                corTexto={secundary}
              />
            </Styles.BotaoContainer>
          </Form>
        </Styles.LoginContainer>
        <Styles.BotoesContainer>
          <Styles.ConfiguracoesContainer activeOpacity={0.5} onPress={controller.navigateToConfiguracaoInicial}>
            <Styles.FeatherIcone name="settings" size={25} color={icon.color} />
          </Styles.ConfiguracoesContainer>
        </Styles.BotoesContainer>
      </Styles.ScrollContainer>
      {controller.height > 800 && (
        <Styles.DesenvolvidoContainer>
          <Styles.DesenvolvidoPor>{I18n.t('developedBy')}</Styles.DesenvolvidoPor>
          <Styles.VisionTextoBotao>
            <Styles.VisionImageContainer>
              <Styles.VisionImage source={require('../../assets/imagens/visionlogo.png')} resizeMode="contain" />
            </Styles.VisionImageContainer>
          </Styles.VisionTextoBotao>
        </Styles.DesenvolvidoContainer>
      )}
    </Styles.Container>
  );
};

export default TelaEntrar;

import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { Form } from '@unform/mobile';
import { useTheme } from 'styled-components/native';
import { ItemContainer } from 'vision-common';
import Botao from '../../componentes/botao';
import Cabecalho from '../../componentes/cabecalho';
import CaixaDeTexto from '../../componentes/caixaDeTexto';
import { IScreenAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';

const TelaAlterarSenha: IScreenAuth<AuthRoutes.AlterarSenha> = ({ navigation, route }) => {
  const { secundary } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.changePassword.title')}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <Form
            ref={controller.formRef}
            onSubmit={controller.alterarSenha}
          >
            <ItemContainer
              title={I18n.t('screens.changePassword.form.currentPassword')}
            >
              <CaixaDeTexto
                temIcone={false}
                nome="senhaAtual"
                placeholderNome={I18n.t('screens.changePassword.form.currentPasswordPlaceholder')}
                temSenha
                tamanhoMaximo={50}
              />
              <Styles.Titulo>{I18n.t('screens.changePassword.form.newPassword')}</Styles.Titulo>
              <CaixaDeTexto
                temIcone={false}
                nome="novaSenha"
                placeholderNome={I18n.t('screens.changePassword.form.newPasswordPlaceholder')}
                temSenha
                tamanhoMaximo={50}

              />
              <Styles.Titulo>{I18n.t('screens.changePassword.form.repeatPassword')}</Styles.Titulo>
              <CaixaDeTexto
                temIcone={false}
                nome="confirmarNovaSenha"
                placeholderNome={I18n.t('screens.changePassword.form.repeatPasswordPlaceholder')}
                temSenha
                tamanhoMaximo={50}

              />
            </ItemContainer>
            <Styles.BotaoContainer>
              <Botao
                texto={I18n.t('screens.changePassword.button')}
                hasIcon={false}
                corTexto={secundary}
                onPress={() => controller.formRef.current.submitForm()}
              />
            </Styles.BotaoContainer>
          </Form>
        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
}

export default TelaAlterarSenha;

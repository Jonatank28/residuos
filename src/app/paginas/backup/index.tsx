import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { ItemContainer } from 'vision-common';
import Botao from '../../componentes/botao';
import Cabecalho from '../../componentes/cabecalho';
import { IScreenAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';

const TelaBackup: IScreenAuth<AuthRoutes.Backup> = ({ navigation, route }) => {
  const { secundary, text } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        temIconeDireita
        nomeIconeDireita="share-2"
        titulo={I18n.t('screens.backup.title')}
        onPressIconeEsquerda={controller.goBackFunction}
        onPressIconeDireita={controller.openSharing}
      />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <ItemContainer
            title={I18n.t('screens.backup.server')}
          >
            <Styles.Input
              autoCorrect={false}
              placeholderTextColor={text.input.placeholderColor}
              value={controller.servidor}
              placeholder={I18n.t('screens.backup.serverPlaceholder')}
              onChangeText={(text) => controller.setServidor(text.replace(' ', ''))}
            />
            <Styles.Titulo>{I18n.t('screens.backup.password')}</Styles.Titulo>
            <Styles.Input
              autoCorrect={false}
              placeholderTextColor={text.input.placeholderColor}
              value={controller.senha}
              placeholder={I18n.t('screens.backup.passwordPlaceholder')}
              onChangeText={(text) => controller.setSenha(text)}
              secureTextEntry
            />
          </ItemContainer>
          <Styles.BotaoContainer>
            <Botao
              hasIcon={false}
              corTexto={secundary}
              onPress={controller.fazerBackup}
              texto={I18n.t('screens.backup.button')}
            />
          </Styles.BotaoContainer>
        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
}

export default TelaBackup;

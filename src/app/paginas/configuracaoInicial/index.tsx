import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { useTheme } from 'styled-components/native';
import { ItemContainer } from 'vision-common';
import Botao from '../../componentes/botao';
import Cabecalho from '../../componentes/cabecalho';
import Controller from './controller';
import { IScreenApp } from '../../routes/types';
import { CommonRoutes } from '../../routes/routes';

const TelaConfiguracaoIncial: IScreenApp<CommonRoutes.ConfiguracaoInicial> = ({ navigation, route }) => {
  const { secundary, text } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        temIconeDireita
        nomeIconeDireita="package"
        onPressIconeDireita={controller.showRestauracaoAlert}
        titulo={I18n.t('screens.initialSetting.title')}
      />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <ItemContainer title={I18n.t('screens.initialSetting.server')}>
            <Styles.Input
              autoCorrect={false}
              value={controller.ip}
              placeholderTextColor={text.input.placeholderColor}
              hasOK={!!!(controller.hasColetasPendentes || controller.offline)}
              editable={!!!(controller.hasColetasPendentes || controller.offline)}
              keyboardType="numbers-and-punctuation"
              placeholder={I18n.t('screens.initialSetting.placeholdIP')}
              onChangeText={text => controller.setIp(text.replace(' ', ''))}
            />
            <Styles.Titulo>{I18n.t('screens.initialSetting.route')}</Styles.Titulo>
            <Styles.Input
              autoCorrect={false}
              value={controller.rota}
              hasOK={!!!(controller.hasColetasPendentes || controller.offline)}
              placeholderTextColor={text.input.placeholderColor}
              editable={!!!(controller.hasColetasPendentes || controller.offline)}
              placeholder={I18n.t('screens.initialSetting.placeholdRoute')}
              onChangeText={text => controller.setRota(text.replace(' ', ''))}
            />
            <Styles.VersaoContainer>
              <Styles.VersaoTexto>{I18n.t('appVersion', { version: controller.version ?? '-' })}</Styles.VersaoTexto>
            </Styles.VersaoContainer>
          </ItemContainer>
          <Styles.BotaoContainer>
            {!!!(controller.hasColetasPendentes || controller.offline) ? (
              <Botao
                texto={I18n.t('screens.initialSetting.button')}
                hasIcon={false}
                corTexto={secundary}
                onPress={controller.gravarConfiguracaoInicial}
              />
            ) : (
              <Styles.VersaoContainer>
                <Styles.VersaoTexto>
                  {controller.offline
                    ? 'Você não pode fazer essa alteração com a opção offline ativo'
                    : 'Existem coletas pendentes de sincronização'}
                </Styles.VersaoTexto>
              </Styles.VersaoContainer>
            )}
          </Styles.BotaoContainer>
        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
};

export default TelaConfiguracaoIncial;

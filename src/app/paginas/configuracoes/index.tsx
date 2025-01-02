import * as React from 'react';
import * as Styles from './styles';
import { ItemContainer } from 'vision-common';
import { useTheme } from 'styled-components/native';
import I18n from 'i18n-js';
import { Button, Platform, TextInput } from 'react-native';
import Controller from './controller';
import Cabecalho from '../../componentes/cabecalho';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';
import { OrientacaoUsoPdfAlert } from '../../componentes/pdfAlert';

const TelaConfiguracoes: IScreenAuth<AuthRoutes.Configuracoes> = ({ navigation, route }) => {
  const { card, primary, colors } = useTheme();
  const controller = Controller({ navigation, params: route.params });
  const [debugging, setDebugging] = React.useState(false);
  const [sql, setSql] = React.useState('');
  const [clickCount, setClickCount] = React.useState(0);

  const click = () => {
    setClickCount(count => count + 1);
    setDebugging(clickCount >= 25);
  }

  React.useEffect(() => {
    const timer = setInterval(() => clickCount && setClickCount(count => count - 1), 100);
    return ()=>clearInterval(timer);
  }, [clickCount]);

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.settings.title')} temIconeDireita={false} />
      <Styles.Container>
        <OrientacaoUsoPdfAlert isActived={controller.showPdfOrientacaoUso} onFinished={controller.setModelShowPdfOrientacaoUso} />

        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <ItemContainer title={I18n.t('screens.settings.options.title')}>
            <>
              <Styles.OpcaoContainer activeOpacity={1}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.workOff')}</Styles.OpcaoTexto>
                <Styles.BotaoOffiline
                  value={controller.offline}
                  thumbColor={controller.offline ? colors.accent : primary}
                  onChange={undefined}
                  children={undefined}
                  trackColor={{
                    false: card.border,
                    true: colors.accent,
                  }}
                  onValueChange={controller.setOffline}
                />
              </Styles.OpcaoContainer>
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.navigateToMeusDados}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.myData')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="user-check" size={25} />
              </Styles.OpcaoContainer>
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.navigateToAlterarSenha}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.changePassword')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="lock" size={25} />
              </Styles.OpcaoContainer>
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.navigateToBackup}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.backup')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="hard-drive" size={25} />
              </Styles.OpcaoContainer>
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.setModelShowPdfOrientacaoUso}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.usageTips')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="file-text" size={25} />
              </Styles.OpcaoContainer>
              {Platform.OS !== 'ios' && (
                <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.verificarAtualizacoes}>
                  <Styles.OpcaoTexto>{I18n.t('screens.settings.options.update')}</Styles.OpcaoTexto>
                  <Styles.FeatherIcone name="check-circle" size={25} />
                </Styles.OpcaoContainer>
              )}
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.navigateToAlterarServidor}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.server')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="hard-drive" size={25} />
              </Styles.OpcaoContainer>
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.navigateToAlterarBalancas}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.balance')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="bar-chart" size={25} />
              </Styles.OpcaoContainer>
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.navigateToAlterarPlaca}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.changeBoard')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="truck" size={25} />
              </Styles.OpcaoContainer>
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.navigateToAlterarRegioes}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.changeRegions')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="map" size={25} />
              </Styles.OpcaoContainer>
              <Styles.OpcaoContainer activeOpacity={0.5} onPress={controller.verificarDeslogar}>
                <Styles.OpcaoTexto>{I18n.t('screens.settings.options.logof')}</Styles.OpcaoTexto>
                <Styles.FeatherIcone name="log-out" size={25} />
              </Styles.OpcaoContainer>
            </>

            <Styles.VersaoContainer onPress={click} >
              <Styles.VersaoTexto>{I18n.t('appVersion', { version: controller.version ?? '-' })}</Styles.VersaoTexto>
              <Styles.VersaoTexto>{I18n.t('restVersion', { version: controller.versaoRest ?? '-' })}</Styles.VersaoTexto>
            </Styles.VersaoContainer>
            <TextInput
              style={{ display: debugging ? 'flex' : 'none', borderWidth: 1, borderColor: 'black',marginVertical:20 , height: 200, width: '100%'}}
              value={sql}
              multiline
              onChangeText={setSql}/>
              {debugging&&<Button title="Executar" onPress={_=>controller.executarSql(sql)} />}
          </ItemContainer>
        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
};

export default TelaConfiguracoes;

import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import SincronizacaoAlert from '../../componentes/sincronizacaoAlert';
import { useOffline } from '../../contextos/offilineContexto';
import { IScreenAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';
import { Avatar, formatarDataHora, formatterCurrency } from 'vision-common';
import { primeiroNome } from '../../utils/formatter';

const TelaHome: IScreenAuth<AuthRoutes.Home> = ({ navigation, route }) => {
  const { secundary, colors } = useTheme();
  const { offline } = useOffline();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Styles.CabecalhoContainer activeOpacity={0.9} onPress={controller.navigateToMeusDados}>
        <Styles.Logo source={require('../../assets/imagens/visionlogopreto.png')} resizeMode="contain" />
        <Styles.UsuarioContainer onPress={controller.navigateToMeusDados} activeOpacity={0.5}>
          <Styles.UsuarioNome>
            {controller?.usuario?.nome
              ? I18n.t('screens.home.userName', { name: primeiroNome(controller?.usuario?.nome ?? '') })
              : I18n.t('screens.home.loading')}
          </Styles.UsuarioNome>
          <Avatar source={controller?.usuario?.fotoBase64} />
        </Styles.UsuarioContainer>
      </Styles.CabecalhoContainer>
      {offline && <Styles.OfflineContainer />}
      <Styles.Container>
        <SincronizacaoAlert
          active={controller.activeAlert}
          progress={controller.progress}
          onPressConfirm={controller.showSincronizarAlert}
          onPressAgain={async () => {
            await controller.storageContext.gravarAuditoria({
              descricao: `Erro ao sincronizar, motorista clicou em tentar novamente: ${controller.progress.message}`,
              rotina: 'Sincronização Completa',
              tipo: 'SINCRONIZACAO',
            });

            await controller.enviarDados();
          }}
          closeModal={() => controller.setActiveAlert(false)}
        />
        <Styles.RowContainer flex={0.8}>
          <Styles.ItemContainer width={60} activeOpacity={0.7} onPress={controller.navigateToColetasAgendadas}>
            <Styles.FeatherIcone name="clipboard" size={30} color={colors.orange} />
            <Styles.MenuTitulo color={colors.orange}>{I18n.t('screens.home.options.scheduledCollections')}</Styles.MenuTitulo>
            {controller.dadosTotaisDispositivo?.totalColetasHoje !== 0 && (
              <Styles.DescricaoContainer>
                <Styles.Descricao color={colors.orange}>
                  {`Hoje: ${formatterCurrency(
                    controller.dadosTotaisDispositivo?.totalColetasHoje ?? 0,
                  )} Coletas`}
                </Styles.Descricao>
              </Styles.DescricaoContainer>
            )}
          </Styles.ItemContainer>
          <Styles.ItemContainer
            width={38.5}
            activeOpacity={0.7}
            backgroundColor={colors.orange}
            onPress={controller.navigateToClientes}>
            <Styles.FeatherIcone name="users" size={30} color={secundary} />
            <Styles.MenuTitulo>{I18n.t('screens.home.options.clients')}</Styles.MenuTitulo>
            {controller.dadosTotaisDispositivo?.totalClientes !== 0 && (
              <Styles.DescricaoContainer>
                <Styles.Descricao>{`${formatterCurrency(
                  controller.dadosTotaisDispositivo?.totalClientes ?? 0,
                )} Clientes`}</Styles.Descricao>
              </Styles.DescricaoContainer>
            )}
          </Styles.ItemContainer>
        </Styles.RowContainer>

        <Styles.RowContainer flex={1}>
          <Styles.ColumnContainer>
            <Styles.ItemContainer heigth={46} width={97} activeOpacity={0.7} onPress={controller.navigateToRascunhos}>
              <Styles.FeatherIcone name="folder" size={30} color={colors.orange} />
              <Styles.MenuTitulo color={colors.orange}>{I18n.t('screens.home.options.drafts')}</Styles.MenuTitulo>
              {controller.dadosTotaisDispositivo?.totalRascunhos !== 0 && (
                <Styles.DescricaoContainer>
                  <Styles.Descricao color={colors.orange}>{`${formatterCurrency(
                    controller.dadosTotaisDispositivo?.totalRascunhos ?? 0,
                  )} Rascunhos`}</Styles.Descricao>
                </Styles.DescricaoContainer>
              )}
            </Styles.ItemContainer>
            <Styles.ItemContainer
              heigth={52}
              width={97}
              activeOpacity={0.7}
              backgroundColor={colors.orange}
              onPress={controller.navigateToHistoricoColetas}>
              <Styles.FeatherIcone name="archive" size={30} color={secundary} />
              <Styles.MenuTitulo>{I18n.t('screens.home.options.history')}</Styles.MenuTitulo>
              {controller.dadosTotaisDispositivo?.totalColetasPendentes !== 0 && (
                <Styles.DescricaoContainer>
                  <Styles.Descricao important>{`${formatterCurrency(
                    controller.dadosTotaisDispositivo?.totalColetasPendentes ?? 0,
                  )} Coleta${Number(controller.dadosTotaisDispositivo?.totalColetasPendentes) > 1 ? 's' : ''
                    } para Sincronizar`}</Styles.Descricao>
                </Styles.DescricaoContainer>
              )}
            </Styles.ItemContainer>
          </Styles.ColumnContainer>
          <Styles.ItemContainer width={50} activeOpacity={0.7} onPress={controller.navigateToNovaColeta}>
            <Styles.FeatherIcone name="truck" size={30} color={colors.orange} />
            <Styles.MenuTitulo color={colors.orange}>{I18n.t('screens.home.options.newCollect')}</Styles.MenuTitulo>
          </Styles.ItemContainer>
        </Styles.RowContainer>

        <Styles.RowContainer flex={0.8}>
          <Styles.ItemContainer width={60} activeOpacity={0.7} onPress={controller.navigateConfiguracoes}>
            <Styles.FeatherIcone name="settings" size={30} color={colors.orange} />
            <Styles.MenuTitulo color={colors.orange}>{I18n.t('screens.home.options.settings')}</Styles.MenuTitulo>
          </Styles.ItemContainer>
          <Styles.ItemContainer
            width={38.5}
            activeOpacity={0.7}
            backgroundColor={colors.orange}
            onPress={controller.showSincronizarAlert}>
            <Styles.FeatherIcone name="wifi" size={30} color={secundary} />
            <Styles.MenuTitulo>{I18n.t('screens.home.options.synchronize')}</Styles.MenuTitulo>
            {controller.dadosTotaisDispositivo.ultimaSincronizacao && (
              <Styles.DescricaoContainer>
                <Styles.Descricao>{`Última Sincronização: ${formatarDataHora(
                  controller.dadosTotaisDispositivo.ultimaSincronizacao,
                  'DD/MM : HH:mm',
                )}`}</Styles.Descricao>
              </Styles.DescricaoContainer>
            )}
          </Styles.ItemContainer>
        </Styles.RowContainer>

        <Styles.RowContainer flex={0.2} noBorder>
          <Styles.ItemContainer width={100} activeOpacity={0.7} onPress={controller.navigateRelatorio}>
            <Styles.MenuTitulo>{I18n.t('screens.home.options.report')}</Styles.MenuTitulo>
          </Styles.ItemContainer>
        </Styles.RowContainer>
      </Styles.Container>
    </>
  );
};

export default TelaHome;

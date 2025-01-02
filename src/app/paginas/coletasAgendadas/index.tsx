import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { useTheme } from 'styled-components/native';
import { BottomModal, formatarPlaca, SemConteudo } from 'vision-common';
import PaginationList from 'vision-common/src/app/componentes/paginationList';
import Cabecalho from '../../componentes/cabecalho';
import CartaoColetaAgendada from '../../componentes/cartaoColetaAgendada';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import DropDownOptions from '../../componentes/dropdownOptions';
import { AuthRoutes } from '../../routes/routes';
import Controller from './controller';
import { IScreenAuth } from '../../routes/types';
import { Keyboard } from 'react-native';

const TelaColetasAgendadas: IScreenAuth<AuthRoutes.ColetasAgendadas> = ({ navigation, route }) => {
  const { secundary, icon, text } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.sheduledCollections.title')}
        temIconeDireita
        nomeIconeDireita="search"
        onPressIconeEsquerda={controller.navigateToHome}
        onPressIconeDireita={controller.navigateToFiltrarColetas}
      />
      <Styles.Container>
        <BottomModal
          title={I18n.t('screens.sheduledCollections.location.title')}
          active={controller.showModalMapa}
          onPressIcone={() => controller.setShowModalMapa()}>
          <Styles.OpcaoMapaContainer activeOpacity={0.5} onPress={controller.abrirMapa}>
            <Styles.IconeMapaContainer>
              <Styles.FeatherIcone name="map-pin" size={30} color={icon.color} />
            </Styles.IconeMapaContainer>
            <Styles.TextoMapaContainer>
              <Styles.Titulo>{I18n.t('screens.sheduledCollections.location.maps')}</Styles.Titulo>
            </Styles.TextoMapaContainer>
          </Styles.OpcaoMapaContainer>
        </BottomModal>
        <Styles.RowContainer>
          <Styles.PlacaContainer>
            <Styles.Titulo>{I18n.t('screens.sheduledCollections.board')}</Styles.Titulo>
            <Styles.Descricao>{formatarPlaca(controller.placa)}</Styles.Descricao>
          </Styles.PlacaContainer>
          <Styles.MapaContainer activeOpacity={0.5} onPress={controller.setShowModalMapa}>
            <Styles.FeatherIcone name="map" size={20} color={secundary} />
          </Styles.MapaContainer>
          {controller.configuracoes?.permiteMovimentarContainerAPP && (
            <Styles.ImobilizadosContainer activeOpacity={0.5} onPress={controller.navigateToImobilizadosColeta}>
              <Styles.FeatherIcone name="package" size={20} color={secundary} />
            </Styles.ImobilizadosContainer>
          )}
          <Styles.SincronizarContainer activeOpacity={0.5} onPress={controller.showSincronizarAlert}>
            <Styles.FeatherIcone name="refresh-ccw" size={20} color={secundary} />
          </Styles.SincronizarContainer>
        </Styles.RowContainer>
        {controller.configuracoes && controller.configuracoes.permiteFiltrarCidade && (
          <DropDownOptions
            marginLeft={10}
            marginTop={5}
            marginRight={10}
            marginBottom={32}
            value={controller.cidade}
            placeholder={I18n.t('screens.sheduledCollections.allCities')}
            onChange={item => controller.setCidade(item === '1' ? '' : item)}
            items={controller.cidades}
          />
        )}
        <Styles.PesquisarContainer>
          <Styles.CaixaDePesquisaContainer>
            <Styles.CaixaDePesquisa
              onChangeText={controller.setPesquisa}
              value={controller.pesquisa}
              autoCorrect={false}
              placeholder={I18n.t('screens.sheduledCollections.searchCustomersWorks')}
              placeholderTextColor={text.input.placeholderColor}
              underlineColorAndroid="transparent"
            />
          </Styles.CaixaDePesquisaContainer>
          <Styles.BotaoPesquisarContainer
            activeOpacity={0.5}
            onPress={async () => {
              Keyboard.dismiss();
              await controller.atualizar(route.params.filtros, route.params.scanData, controller.cidade, controller.pesquisa);
            }}>
            <Styles.FeatherIcone name="search" size={20} />
          </Styles.BotaoPesquisarContainer>
        </Styles.PesquisarContainer>
        {!controller.loadingData ? (
          controller?.coletas?.length > 0 ? (
            <>
              <Styles.ContainerQuantidadeColetas>
                <Styles.Descricao>
                  {I18n.t('screens.sheduledCollections.totalCollect', {
                    page: controller.coletas.length,
                    total: controller.totalColetas,
                  })}
                </Styles.Descricao>
              </Styles.ContainerQuantidadeColetas>
              <PaginationList
                items={controller.coletas}
                hasPages={controller.hasPages}
                loadingMore={controller.loadingMore}
                refreshing={controller.refreshing}
                iconName="clipboard"
                textNotFound={I18n.t('screens.sheduledCollections.notFound')}
                onEndReached={() => controller.pegarColetas(true, route.params.filtros, route.params.scanData)}
                keyExtractor={item => String(item.codigoOS)}
                renderItem={({ item, index }) => (
                  <>
                    {index === 0 && <Styles.Spacer />}
                    <CartaoColetaAgendada
                      codigoOS={item.codigoOS}
                      codigoRoteirizacao={item?.codigoRoterizacao}
                      codigoPonto={item?.codigoPonto}
                      dataOS={item.dataOS}
                      obra={item.nomeObra}
                      endereco={item.enderecoOS}
                      periodicidade={item?.periodicidade ?? ''}
                      osPendente={controller.verificarColetaPendente(item)}
                      osPendenteOK={item.classificacaoOS === 2 && (item.coletouPendente || item.ordemColetaPendente === 0)}
                      nomeCliente={item.nomeCliente}
                      nomeFantasiaCliente={item.nomeFantasiaCliente}
                      status={item.classificacaoOS}
                      observacaoOS={item.observacaoOS}
                      referenteOS={item.referenteOS}
                      localizacaoOS={controller.compartilhandoLocalizacao}
                      onPress={() => controller.navigateToDetalhesColeta(item)}
                      onPressIconeObservacao={() => controller.showObservacaoAlert(item?.observacaoOS ?? '')}
                      onPressIconeReferente={() => controller.showReferenteAlert(item?.referenteOS ?? '')}
                      onPressIconeLocalizacao={() => controller.showPosicaoAlert(item?.codigoOS ?? 0)}
                    />
                  </>
                )}
              />
            </>
          ) : (
            <SemConteudo texto={I18n.t('screens.sheduledCollections.notFound')} nomeIcone="clipboard" />
          )
        ) : (
          <Styles.LoadingContainer>
            <CustomActiveIndicator />
          </Styles.LoadingContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaColetasAgendadas;

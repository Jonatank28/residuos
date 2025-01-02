import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { formatarData, formatarHora, SemConteudo } from 'vision-common';
import PaginationList from 'vision-common/src/app/componentes/paginationList';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import Cabecalho from '../../componentes/cabecalho';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { AuthRoutes } from '../../routes/routes';
import Controller from './controller';
import { IScreenAuth } from '../../routes/types';

const TelaRascunhos: IScreenAuth<AuthRoutes.Rascunhos> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.drafts.title')}
        temIconeDireita={false}
      />

      <Styles.Container>
        {(controller.rascunhos.length > 0 || controller.pesquisa.length > 0) && (
          <Styles.PesquisarContainer>
            <Pesquisar
              value={controller.pesquisa}
              textoPlaceholder={I18n.t('screens.drafts.search')}
              onChangeText={controller.onChangePesquisa}
              margemBaixo={20}
            />
          </Styles.PesquisarContainer>
        )}

        {!controller.loadingData
          ? (
            controller.rascunhos.length > 0
              ? (
                <PaginationList
                  items={controller.rascunhos}
                  hasPages={controller.hasPages}
                  loadingMore={controller.loadingMore}
                  refreshing={controller.refreshing}
                  iconName="file"
                  textNotFound={I18n.t('screens.drafts.notFound')}
                  onEndReached={() => controller.pegarRascunhos(true)}
                  onRefresh={controller.atualizar}
                  keyExtractor={(item) => String(item.codigoOS !== 0 ? item.codigoOS : item.codigoCliente)}
                  renderItem={({ item }) => (
                    <Styles.RascunhoContainer
                      key={item?.codigoOS ?? item?.codigoCliente}
                      activeOpacity={0.5}
                      onPress={() => controller.navigateToDetalhesRascunho(item)}
                    >
                      <>
                        <Styles.RascunhoStatusContainer status={item.classificacaoOS} />
                        <Styles.CounteudoContainer>
                          {item?.classificacaoOS && (item?.classificacaoOS === 1 || item?.classificacaoOS === 2) ? (
                            <Styles.Titulo>{I18n.t('screens.drafts.OS', { os: item?.codigoOS ?? '' })}</Styles.Titulo>
                          ) : <Styles.Titulo>{I18n.t('screens.drafts.newCollect').toUpperCase()}</Styles.Titulo>}
                          <Styles.Descricao>{item.nomeCliente ?? ''}</Styles.Descricao>
                          {String(item?.nomeObra ?? '').trim() !== '' && (
                            <Styles.Descricao>{I18n.t('screens.drafts.work', { work: item.nomeObra ?? '' })}</Styles.Descricao>
                          )}
                        </Styles.CounteudoContainer>
                        <Styles.DataContainer>
                          <Styles.Titulo>{formatarData(item.dataAtualizacao, 'DD/MM/YYYY') ?? ''}</Styles.Titulo>
                          <Styles.Descricao>{formatarHora(item.dataAtualizacao, 'HH:mm') ?? ''}</Styles.Descricao>
                        </Styles.DataContainer>
                      </>
                    </Styles.RascunhoContainer>
                  )}
                />
              ) : (
                <SemConteudo
                  nomeIcone="file"
                  texto={I18n.t('screens.drafts.notFound')}
                  onPress={controller.pesquisa.length === 0 ? () => controller.atualizar(true) : undefined}
                />
              )
          ) : (
            <Styles.LoadingContainer>
              <CustomActiveIndicator />
            </Styles.LoadingContainer>
          )}
      </Styles.Container>
    </>
  );
}

export default TelaRascunhos;

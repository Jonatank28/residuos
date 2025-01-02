import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { SemConteudo } from 'vision-common';
import PaginationList from 'vision-common/src/app/componentes/paginationList';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import Cabecalho from '../../componentes/cabecalho';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';

const TelaRegioes: IScreenAuth<AuthRoutes.Regioes> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.regions.title')}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder={I18n.t('screens.regions.search')}
            onChangeText={controller.onChangePesquisa}
            margemBaixo={20}
          />
        </Styles.PesquisarContainer>

        {!controller.loadingData
          ? (
            controller?.regioes?.length > 0
              ? (
                <PaginationList
                  items={controller.regioes}
                  hasPages={controller.hasPages}
                  loadingMore={controller.loadingMore}
                  refreshing={controller.refreshing}
                  iconName="map-pin"
                  textNotFound={I18n.t('screens.regions.notFound')}
                  onEndReached={() => controller.pegarRegioes(true)}
                  onRefresh={controller.atualizar}
                  keyExtractor={(item) => String(item.codigo)}
                  renderItem={({ item }) => (
                    <Styles.RegiaoContainer
                      key={item.codigo}
                      activeOpacity={0.5}
                      onPress={() => controller.onSelectRegiao(item)}
                    >
                      <Styles.Titulo>{item?.descricao ?? ''}</Styles.Titulo>
                    </Styles.RegiaoContainer>
                  )}
                />
              ) : (
                <SemConteudo
                  texto={I18n.t('screens.regions.notFound')}
                  nomeIcone="map-pin"
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

export default TelaRegioes;

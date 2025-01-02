import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { SemConteudo } from 'vision-common';
import Controller from './controller';
import PaginationList from 'vision-common/src/app/componentes/paginationList';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import Cabecalho from '../../../componentes/cabecalho';
import CartaoSimples from '../../../componentes/cartaoSimples';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';
import { AuthRoutes } from '../../../routes/routes';
import { IScreenAuth } from '../../../routes/types';

const TelaListaObras: IScreenAuth<AuthRoutes.ListaObras> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.work.title')}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder="Pesquisar"
            onChangeText={controller.onChangePesquisa}
            margemBaixo={20}
          />
        </Styles.PesquisarContainer>

        {!controller.loadingData
          ? (
            controller?.obras?.length > 0
              ? (
                <PaginationList
                  items={controller.obras}
                  hasPages={controller.hasPages}
                  loadingMore={controller.loadingMore}
                  refreshing={controller.refreshing}
                  iconName="folder"
                  textNotFound={I18n.t('screens.work.notFound')}
                  onEndReached={() => controller.pegarObras(true)}
                  onRefresh={controller.atualizar}
                  keyExtractor={(item) => String(item.codigo)}
                  renderItem={({ item }) => (
                    <CartaoSimples
                      descricao={`${item.codigo} - ${item.descricao}`}
                      nomeIcone="chevron-right"
                      onPress={() => controller.onSelectObra(item)}
                    />
                  )}

                />
              ) : (
                <SemConteudo
                  texto={I18n.t('screens.work.notFound')}
                  nomeIcone="folder"
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

export default TelaListaObras;

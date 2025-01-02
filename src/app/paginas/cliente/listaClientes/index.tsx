import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { SemConteudo } from 'vision-common';
import PaginationList from 'vision-common/src/app/componentes/paginationList';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import { AuthRoutes } from '../../../routes/routes';
import CartaoSimples from '../../../componentes/cartaoSimples';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../../routes/types';
import Cabecalho from '../../../componentes/cabecalho';

const TelaListaClientes: IScreenAuth<AuthRoutes.Clientes> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.clients.title')}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder={I18n.t('screens.clients.search')}
            onChangeText={controller.onChangePesquisa}
            margemBaixo={20}
          />
        </Styles.PesquisarContainer>

        {!controller.loadingData
          ? (
            controller?.clientes?.length > 0
              ? (
                <PaginationList
                  items={controller.clientes}
                  hasPages={controller.hasPages}
                  loadingMore={controller.loadingMore}
                  refreshing={controller.refreshing}
                  iconName="users"
                  textNotFound={I18n.t('screens.clients.notFound')}
                  onEndReached={() => controller.pegarClientes(true)}
                  onRefresh={controller.atualizar}
                  keyExtractor={(item) => String(item.codigo)}
                  renderItem={({ item }) => (
                    <CartaoSimples
                      descricao={`${item?.codigo ?? ''} - ${item?.nomeFantasia ?? ''}`}
                      nomeIcone="chevron-right"
                      onPress={() => controller.onSelectCliente(item)}
                    />
                  )}
                />
              ) : (
                <SemConteudo
                  texto={I18n.t('screens.clients.notFound')}
                  nomeIcone="users"
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

export default TelaListaClientes;

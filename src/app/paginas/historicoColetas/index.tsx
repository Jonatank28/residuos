import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { ListRenderItemInfo, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SemConteudo } from 'vision-common';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import { IOrder } from '../../../core/domain/entities/order';
import Cabecalho from '../../componentes/cabecalho';
import CartaoColeta from '../../componentes/cartaoColeta';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';

const TelaHistoricoColetas: IScreenAuth<AuthRoutes.HistoricoDeColetas> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        temIconeDireita
        nomeIconeDireita="search"
        onPressIconeDireita={controller.navigateToFiltrarColetas}
        titulo={I18n.t('screens.collectHistory.title')}
      />
      <Styles.Container>
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder={I18n.t('screens.collectHistory.search')}
            onChangeText={controller.onChangePesquisa}
            margemBaixo={20}
          />
        </Styles.PesquisarContainer>
        {!controller.loadingData ? (
          controller?.coletas?.length > 0 ? (
            <FlatList
              data={controller.coletas}
              key={controller.change ? 1 : 0}
              decelerationRate={0.5}
              keyboardShouldPersistTaps="always"
              keyExtractor={(_: IOrder, index: number) => String(index)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: ListRenderItemInfo<IOrder>) => (
                <CartaoColeta
                  isHistory
                  isDetails={false}
                  codigoOS={item.codigoOS}
                  alteraStatusOS={controller.alteraStatusOS}
                  codigoRoteirizacao={item?.codigoRoterizacao}
                  codigoPonto={item?.codigoPonto}
                  dataOS={item.dataOS}
                  nomeFantasiaCliente={item.nomeFantasiaCliente}
                  isOffline={item.isOffline}
                  obra={item.nomeObra}
                  endereco={item.enderecoOS}
                  nomeCliente={item.nomeCliente}
                  status={item.classificacaoOS}
                  onPress={() => controller.navigateToDetalhesColeta(item)}
                />
              )}
            />
          ) : (
            <SemConteudo texto={I18n.t('screens.collectHistory.notFound')} nomeIcone="clipboard" />
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

export default TelaHistoricoColetas;

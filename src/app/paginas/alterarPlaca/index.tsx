import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { formatarPlaca, SemConteudo } from 'vision-common';
import Cabecalho from '../../componentes/cabecalho';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';
import PaginationList from 'vision-common/src/app/componentes/paginationList';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';

const TelaAlterarPlaca: IScreenAuth<AuthRoutes.AlterarPlaca> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.changeBoard.title')} temIconeDireita={false} />
      <Styles.Container>
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder={I18n.t('screens.changeBoard.search')}
            onChangeText={controller.onChangePesquisa}
            margemBaixo={20}
          />
        </Styles.PesquisarContainer>

        {!controller.loadingData ? (
          controller?.veiculos?.length > 0 ? (
            <PaginationList
              items={controller.veiculos}
              hasPages={controller.hasPages}
              loadingMore={controller.loadingMore}
              refreshing={controller.refreshing}
              iconName="truck"
              textNotFound={I18n.t('screens.changeBoard.notFound')}
              onEndReached={() => controller.pegarVeiculos(true)}
              onRefresh={controller.atualizar}
              keyExtractor={item => String(item.codigo)}
              renderItem={({ item }) => (
                <Styles.VeiculoContainer
                  key={item.codigo}
                  // hasMarginBottom={index !== controller.veiculos.length - 1}
                  isVehicle={!!(controller?.veiculoAtual?.codigo === item.codigo)}
                  activeOpacity={0.5}
                  onPress={() => controller.onSelectVeiculo(item)}>
                  <Styles.TituloContainer>
                    <Styles.Titulo>{item?.descricao ?? ''}</Styles.Titulo>
                  </Styles.TituloContainer>
                  <Styles.TituloContainer flex={0.5} alignItems="flex-end">
                    <Styles.Titulo>{formatarPlaca(item?.placa ?? '')}</Styles.Titulo>
                  </Styles.TituloContainer>
                </Styles.VeiculoContainer>
              )}
            />
          ) : (
            <SemConteudo texto={I18n.t('screens.changeBoard.notFound')} nomeIcone="truck" />
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

export default TelaAlterarPlaca;

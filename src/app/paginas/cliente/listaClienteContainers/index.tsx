import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';
import I18n from 'i18n-js';
import Controller from './controller';
import { FlatList } from 'react-native-gesture-handler';
import { ListRenderItemInfo } from 'react-native';
import { SemConteudo } from 'vision-common';
import Cabecalho from '../../../componentes/cabecalho';
import CartaoContainer from '../../../componentes/cartaoContainer';
import { AuthRoutes } from '../../../routes/routes';
import { IContainer } from '../../../../core/domain/entities/container';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../../routes/types';

const TelaListaClienteContainers: IScreenAuth<AuthRoutes.ClienteContainers> = ({ navigation, route }) => {
  const { primary, card } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.clientContainer.title')}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.LocalContainersContainer>
          <Styles.Titulo>{I18n.t('screens.clientContainer.localOnly')}</Styles.Titulo>
          <Styles.BotaoContainersLocal
            value={controller.somenteLocal}
            thumbColor={primary}
            children={undefined}
            onChange={undefined}
            trackColor={{
              false: card.border,
              true: primary
            }}
            onValueChange={controller.onToggleOffiline}
          />
        </Styles.LocalContainersContainer>
        <Styles.ListaContainersHeader>
          {controller.containers.length > 0 && (
            <Styles.Titulo>{I18n.t('screens.clientContainer.lastDays')}</Styles.Titulo>
          )}
        </Styles.ListaContainersHeader>

        {!controller.loadingData
          ? (
            <FlatList
              data={controller.containers}
              keyboardShouldPersistTaps="always"
              keyExtractor={(_, index: number) => String(index)}
              ListEmptyComponent={(
                <Styles.SemConteudoContainer>
                  <SemConteudo
                    texto={I18n.t('screens.clientContainer.notFound')}
                    nomeIcone="archive"
                  />
                </Styles.SemConteudoContainer>
              )}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: ListRenderItemInfo<IContainer>) => (
                <CartaoContainer
                  titulo={item.descricaoContainer}
                  codMovimentacao={item.codigoMovimentacao}
                  dataColocacao={item.dataColocacao}
                  dataRetirada={item.dataRetirada}
                />
              )}
            />
          ) : (
            <Styles.SemConteudoContainer>
              <CustomActiveIndicator />
            </Styles.SemConteudoContainer>
          )}
      </Styles.Container>
    </>
  );
}

export default TelaListaClienteContainers;

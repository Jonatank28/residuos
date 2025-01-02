import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { SemConteudo } from 'vision-common';
import Cabecalho from '../../componentes/cabecalho';
import Controller from './controller';
import { IEstado } from '../../../core/domain/entities/estado';
import { AuthRoutes } from '../../routes/routes';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../routes/types';

const TelaEstadosMTR: IScreenAuth<AuthRoutes.ListaEstadosMTR> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.stateMtr.title')} temIconeDireita={false} />
      <Styles.Container>
        {!controller.loadingData ? (
          controller.estados.length > 0 || !controller.hasSinir ? (
            <Styles.ScrollContainer keyboardShouldPersistTaps="always">
              {!controller.hasSinir && (
                <Styles.EstadoSinirContainer activeOpacity={0.5} onPress={() => controller.navigateToAddMtr(undefined, true)}>
                  <Styles.Titulo>{I18n.t('screens.stateMtr.sinir')}</Styles.Titulo>
                </Styles.EstadoSinirContainer>
              )}
              {controller.estados.map((item, index) => (
                <Styles.EstadoContainer key={String(index)} activeOpacity={0.5} onPress={() => controller.navigateToAddMtr(item)}>
                  <Styles.Titulo>{item.descricao}</Styles.Titulo>
                </Styles.EstadoContainer>
              ))}
            </Styles.ScrollContainer>
          ) : (
            <Styles.SemConteudoContainer>
              <SemConteudo texto={I18n.t('screens.stateMtr.notFound')} nomeIcone="globe" />
            </Styles.SemConteudoContainer>
          )
        ) : (
          <Styles.SemConteudoContainer>
            <CustomActiveIndicator />
          </Styles.SemConteudoContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaEstadosMTR;

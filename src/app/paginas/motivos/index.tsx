import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { SemConteudo } from 'vision-common';
import { IMotivo } from '../../../core/domain/entities/motivo';
import Cabecalho from '../../componentes/cabecalho';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { AuthRoutes } from '../../routes/routes';
import Controller from './controller';
import { IScreenAuth } from '../../routes/types';

const TelaMotivos: IScreenAuth<AuthRoutes.Motivos> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.reasons.title')} temIconeDireita={false} />
      <Styles.Container>
        {!controller.loadingData ? (
          controller.motivos.length > 0 ? (
            <Styles.ScrollContainer keyboardShouldPersistTaps="always">
              {controller.motivos.map((item: IMotivo) => (
                <Styles.MotivoContainer key={item.codigo} activeOpacity={0.5} onPress={() => controller.onSelectVeiculo(item)}>
                  <Styles.Titulo>{item.descricao ?? ''}</Styles.Titulo>
                </Styles.MotivoContainer>
              ))}
            </Styles.ScrollContainer>
          ) : (
            <Styles.SemConteudoContainer>
              <SemConteudo texto={I18n.t('screens.reasons.notFound')} nomeIcone="search" />
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

export default TelaMotivos;

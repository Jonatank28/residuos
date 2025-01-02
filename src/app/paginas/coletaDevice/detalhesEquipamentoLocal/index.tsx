import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { formatarDataHora, SemConteudo } from 'vision-common';
import Cabecalho from '../../../componentes/cabecalho';
import { AuthRoutes } from '../../../routes/routes';
import { IScreenAuth } from '../../../routes/types';

const TelaDetalhesEquipamentoLocal: IScreenAuth<AuthRoutes.DetalhesDoEquipamentoLocal> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.equipamentDetailsLocal.title')}
        temIconeDireita={false}
      />
      <Styles.Container>
        {controller.equipamento
          ? (
            <Styles.ScrollContainer keyboardShouldPersistTaps="always">
              <Styles.EquipamentoContainer>
                <Styles.TituloInput>{I18n.t('screens.equipamentDetailsLocal.name')}</Styles.TituloInput>
                <Styles.InputContainer>
                  <Styles.Descricao>{controller?.equipamento?.descricaoContainer ?? ''}</Styles.Descricao>
                </Styles.InputContainer>
                <Styles.TituloInput>{I18n.t('screens.equipamentDetailsLocal.movementCode')}</Styles.TituloInput>
                <Styles.InputContainer>
                  <Styles.Descricao>{controller?.equipamento?.codigoMovimentacao ?? ''}</Styles.Descricao>
                </Styles.InputContainer>
                <Styles.TituloInput>{I18n.t('screens.equipamentDetailsLocal.datePlacement')}</Styles.TituloInput>
                <Styles.InputContainer>
                  <Styles.Descricao>
                    {controller?.equipamento?.dataColocacao
                      ? formatarDataHora(controller?.equipamento?.dataColocacao, 'DD/MM/YYYY : HH:mm')
                      : ''}
                  </Styles.Descricao>
                </Styles.InputContainer>
                <Styles.TituloInput>{I18n.t('screens.equipamentDetailsLocal.withdrawalDate')}</Styles.TituloInput>
                <Styles.InputContainer>
                  <Styles.Descricao>
                    {controller?.equipamento?.dataRetirada
                      ? formatarDataHora(controller?.equipamento?.dataRetirada, 'DD/MM/YYYY : HH:mm')
                      : ''}
                  </Styles.Descricao>
                </Styles.InputContainer>
              </Styles.EquipamentoContainer>
            </Styles.ScrollContainer>
          )
          : (
            <Styles.SemConteudoContainer>
              <SemConteudo
                texto={I18n.t('screens.equipamentDetailsLocal.notFound')}
                nomeIcone="clipboard"
              />
            </Styles.SemConteudoContainer>
          )}
      </Styles.Container>
    </>
  );
}

export default TelaDetalhesEquipamentoLocal;

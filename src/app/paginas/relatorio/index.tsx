import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';
import Cabecalho from '../../componentes/cabecalho';
import ItemRelatorio from '../../componentes/itemRelatorio';
import { formatarDataHora } from 'vision-common';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';

const TelaRelatorio: IScreenAuth<AuthRoutes.Relatorio> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho temIconeDireita={false} titulo={I18n.t('screens.report.title')} />
      <Styles.Container>
        {!controller.loadingData ? (
          <>
            <Styles.DescricaoContainer>
              {controller.dataUltimaSincronizacao && (
                <Styles.MensagemSincronizacao>{`Última Sincronização: ${formatarDataHora(
                  controller.dataUltimaSincronizacao,
                  'DD/MM/YY : HH:mm',
                )}`}</Styles.MensagemSincronizacao>
              )}
            </Styles.DescricaoContainer>
            <Styles.Mensagem>{controller.coletasPendentesDeEnvio}</Styles.Mensagem>
            {controller.coletasPendentesDeEnvio && (
              <Styles.DescricaoContainer>
                <Styles.Mensagem>{I18n.t('screens.report.subtitle')}</Styles.Mensagem>
              </Styles.DescricaoContainer>
            )}
            <Styles.ScrollContainer>
              <ItemRelatorio report={controller.coletasAgendadas} marginBottom={10} />
              <ItemRelatorio report={controller.historicoColetas} marginBottom={10} />
              <ItemRelatorio report={controller.rascunhoColetas} marginBottom={10} />
            </Styles.ScrollContainer>
          </>
        ) : (
          <Styles.LoadingContainer>
            <CustomActiveIndicator />
          </Styles.LoadingContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaRelatorio;

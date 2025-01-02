import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { SemConteudo } from 'vision-common';
import Cabecalho from '../../componentes/cabecalho';
import { AuthRoutes } from '../../routes/routes';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../routes/types';

const TelaImpressoras: IScreenAuth<AuthRoutes.Impressoras> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.printers.title')} temIconeDireita={false} />
      <Styles.Container>
        {!controller.loadingData ? (
          controller.impressoras && controller.impressoras?.length > 0 ? (
            <Styles.ScrollContainer keyboardShouldPersistTaps="always">
              {controller.impressoras.map((impressora, index) => (
                <Styles.ImpressoraContainer
                  key={String(index)}
                  activeOpacity={controller.sendingData ? 1 : 0.5}
                  hasConnected={controller?.connectedDevice === impressora?.address}
                  onPress={() => (controller.sendingData ? undefined : controller.onSelectImpressora(impressora))}>
                  <Styles.ImpressoraTituloContainer>
                    <Styles.Titulo>{impressora?.name ?? '-'}</Styles.Titulo>
                  </Styles.ImpressoraTituloContainer>
                  <Styles.ImpressoraLoadingContainer>
                    {controller.sendingData && <CustomActiveIndicator color={colors.orange} size={15} />}
                  </Styles.ImpressoraLoadingContainer>
                </Styles.ImpressoraContainer>
              ))}
            </Styles.ScrollContainer>
          ) : (
            <Styles.LoadingContainer>
              <SemConteudo nomeIcone="printer" texto={I18n.t('screens.printers.notFound')} />
            </Styles.LoadingContainer>
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

export default TelaImpressoras;

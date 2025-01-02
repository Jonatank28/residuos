import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { SemConteudo } from 'vision-common';
import { IResiduo } from '../../../../core/domain/entities/residuo';
import Cabecalho from '../../../componentes/cabecalho';
import CartaoResiduoLocal from '../../../componentes/cartaoResiduoLocal';
import { AuthRoutes } from '../../../routes/routes';
import { IScreenAuth } from '../../../routes/types';
import Controller from './controller';

const TelaListaResiduosLocal: IScreenAuth<AuthRoutes.ListaResiduosLocal> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.residuesListLocal.title')} temIconeDireita={false} />
      <Styles.Container>
        {controller.residuos.length > 0 ? (
          <Styles.ScrollContainer keyboardShouldPersistTaps="always">
            {controller.residuos.map((item: IResiduo, index: number) => (
              <CartaoResiduoLocal
                key={String(index)}
                residuo={item}
                margemBaixo={10}
                onPressCard={() => controller.navigateToDetalhesResiduo(item)}
                temIconeDireita={item.fotos && item.fotos.length > 0 ? true : false}
              />
            ))}
          </Styles.ScrollContainer>
        ) : (
          <Styles.SemConteudoContainer>
            <SemConteudo texto={I18n.t('screens.residuesListLocal.notFound')} nomeIcone="coffee" />
          </Styles.SemConteudoContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaListaResiduosLocal;

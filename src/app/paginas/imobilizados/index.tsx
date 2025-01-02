import I18n from 'i18n-js';
import * as React from 'react';
import * as Styles from './styles';
import { SemConteudo } from 'vision-common';
import { IImobilizado } from '../../../core/domain/entities/imobilizado';
import Cabecalho from '../../componentes/cabecalho';
import { AuthRoutes } from '../../routes/routes';
import Controller from './controller';
import { IScreenAuth } from '../../routes/types';

const TelaImobilizados: IScreenAuth<AuthRoutes.Imobilizados> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.immobilize.title')} temIconeDireita={false} />
      <Styles.Container>
        {controller.imobilizados.length > 0 ? (
          <Styles.ScrollContainer keyboardShouldPersistTaps="always">
            <Styles.ImobilizadosContainer>
              {controller.imobilizados.map((item: IImobilizado, index: number) => (
                <Styles.Titulo key={item.codigo}>{item.descricao ?? ''}</Styles.Titulo>
              ))}
            </Styles.ImobilizadosContainer>
          </Styles.ScrollContainer>
        ) : (
          <Styles.SemConteudoContainer>
            <SemConteudo texto={I18n.t('screens.immobilize.notFound')} nomeIcone="archive" />
          </Styles.SemConteudoContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaImobilizados;

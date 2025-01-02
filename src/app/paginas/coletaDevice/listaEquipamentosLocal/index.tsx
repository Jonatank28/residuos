import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { SemConteudo } from 'vision-common';
import { IEquipamento } from '../../../../core/domain/entities/equipamento';
import Cabecalho from '../../../componentes/cabecalho';
import { AuthRoutes } from '../../../routes/routes';
import { IScreenAuth } from '../../../routes/types';

const TelaListaEquipamentosLocal: IScreenAuth<AuthRoutes.ListaEquipamentosLocal> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.equipamentListLocal.title')} temIconeDireita={false} />
      <Styles.Container>
        {controller.equipamentos.length > 0 ? (
          <Styles.ScrollContainer keyboardShouldPersistTaps="always">
            {controller.equipamentos.map((item: IEquipamento, index) => (
              <Styles.EquipamentoContainer
                key={String(index)}
                activeOpacity={0.5}
                onPress={() => controller.navigateToDetalhesEquipamentos(item)}>
                <Styles.Titulo>{`${item.codigoContainer} - ${item.descricaoContainer}` ?? ''}</Styles.Titulo>
              </Styles.EquipamentoContainer>
            ))}
            {controller.equipamentosRemovidos.map((itemRemovido: IEquipamento) => (
              <Styles.EquipamentoContainer
                key={itemRemovido.codigoContainer}
                activeOpacity={0.5}
                onPress={() => controller.navigateToDetalhesEquipamentos(itemRemovido)}>
                <Styles.Titulo>{`${itemRemovido.codigoContainer} - ${itemRemovido.descricaoContainer}` ?? ''}</Styles.Titulo>
                <Styles.EquipamentoRemovidoContainer>
                  <Styles.DeletadoTexto>{I18n.t('screens.equipamentListLocal.deleted')}</Styles.DeletadoTexto>
                </Styles.EquipamentoRemovidoContainer>
              </Styles.EquipamentoContainer>
            ))}
          </Styles.ScrollContainer>
        ) : (
          <Styles.SemConteudoContainer>
            <SemConteudo texto={I18n.t('screens.equipamentListLocal.notFound')} nomeIcone="coffee" />
          </Styles.SemConteudoContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaListaEquipamentosLocal;

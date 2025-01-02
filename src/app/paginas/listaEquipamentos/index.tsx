import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import PaginationList from 'vision-common/src/app/componentes/paginationList';
import { SemConteudo } from 'vision-common';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import Controller from './controller';
import Cabecalho from '../../componentes/cabecalho';
import CartaoSimples from '../../componentes/cartaoSimples';
import { AuthRoutes } from '../../routes/routes';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../routes/types';

const TelaListaEquipamentos: IScreenAuth<AuthRoutes.ListaEquipamentos> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.equipamentList.title')}
        nomeIconeDireita="qrcode"
        temIconeDireita
        onPressIconeDireita={controller.navigateToQRCode}
      />
      <Styles.Container>
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder={I18n.t('screens.equipamentList.search')}
            onChangeText={controller.onChangePesquisa}
            margemBaixo={10}
          />
          <Styles.ContainerQuantidadeEquipoamentos>
            <Styles.Descricao>
              {I18n.t('screens.equipamentList.totalEquipamentList', {
                total: controller.totalEquipamentos
              })}
            </Styles.Descricao>

          </Styles.ContainerQuantidadeEquipoamentos>
        </Styles.PesquisarContainer>

        {!controller.loadingData ? (
          controller?.equipamentos?.length > 0 ? (
            <PaginationList
              items={controller.equipamentos}
              hasPages={controller.hasPages}
              loadingMore={controller.loadingMore}
              refreshing={controller.refreshing}
              iconName="clipboard"
              textNotFound={I18n.t('screens.equipamentList.notFound')}
              onEndReached={() => controller.pegarEquipamentos(true)}
              onRefresh={controller.atualizar}
              keyExtractor={(_, index) => String(index)}
              renderItem={({ item }) => (
                <Styles.EquipamentoContainer>
                  <CartaoSimples
                    naoTemIcone
                    descricao={`${controller.configuracoes?.habilitarCodIdentificacaoImobilizado
                      ? item.identificacao
                        ? `${item.identificacao} - `
                        : ''
                      : item.codigo
                        ? `${item.codigo} - `
                        : ''
                      }${item.descricao}`}
                    onPress={() => controller.onSelectEquipamento(item)}
                  />
                  {controller.verificaEquipamentoDuplicado(item)?.length > 0 && (
                    <Styles.AddedContainer>
                      <Styles.DuplicadoTexto>{I18n.t('screens.equipamentList.added')}</Styles.DuplicadoTexto>
                    </Styles.AddedContainer>
                  )}
                  {controller.verificaEquipamentoGenericoJaUtilizadoNaOS(item) && (
                    <Styles.AddedContainer>
                      <Styles.DuplicadoTexto>Já Utilizado na O.S</Styles.DuplicadoTexto>
                    </Styles.AddedContainer>
                  )}
                </Styles.EquipamentoContainer>
              )}
            />
          ) : (
            <SemConteudo texto={I18n.t('screens.equipamentList.notFound')} nomeIcone="clipboard" />
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

export default TelaListaEquipamentos;

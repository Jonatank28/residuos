import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import PaginationList from 'vision-common/src/app/componentes/paginationList';
import { useTheme } from 'styled-components/native';
import { SemConteudo } from 'vision-common';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import Controller from './controller';
import Cabecalho from '../../componentes/cabecalho';
import { AuthRoutes } from '../../routes/routes';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../routes/types';
import FeatherIcone from 'react-native-vector-icons/Feather';
import Decimal from 'decimal.js';

const TelaListaResiduos: IScreenAuth<AuthRoutes.ListaResiduos> = ({ navigation, route }) => {
  const { secundary, colors } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={
          route.params.imobilizadoPesagem?.codigoContainer && route.params.imobilizadoPesagem?.codigoContainer !== 0
            ? 'Resíduos do Imobilizado'
            : I18n.t('screens.residuesList.title')
        }
        temIconeDireita={Boolean(
          route.params.imobilizadoPesagem?.codigoContainer && route.params.imobilizadoPesagem?.codigoContainer !== 0,
        )}
        nomeIconeDireita="check"
        disableIconeDireita={controller.isSaving}
        onPressIconeDireita={controller.confirmarResiduosSelecionadosPesagem}
      />
      <Styles.Container>
        {Boolean(route.params.imobilizadoPesagem?.codigoContainer && route.params.imobilizadoPesagem?.codigoContainer !== 0) && (
          <Styles.PesoBrutoContainer>
            <Styles.Titulo>{`Peso Bruto: ${controller.arredondaPesoBruto()}`}</Styles.Titulo>
            <Styles.Titulo>{`Peso Liquído: ${controller.calculaPesoLiquido()}`}</Styles.Titulo>
          </Styles.PesoBrutoContainer>
        )}
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder={I18n.t('screens.residuesList.search')}
            onChangeText={controller.onChangePesquisa}
            margemBaixo={20}
          />
        </Styles.PesquisarContainer>

        {!controller.loadingData ? (
          controller?.residuos?.length > 0 ? (
            <PaginationList
              items={controller.residuos}
              hasPages={controller.hasPages}
              loadingMore={controller.loadingMore}
              refreshing={controller.refreshing}
              iconName="file-text"
              textNotFound={I18n.t('screens.residuesList.notFound')}
              onEndReached={() => controller.pegarResiduos(true)}
              onRefresh={controller.atualizar}
              keyExtractor={item => String(item.codigo)}
              renderItem={({ item, index }) => (
                <Styles.ResiduoContainer
                  corTexto={item?.cor && item.cor?.length > 0 ? secundary : undefined}
                  backgroundColor={item?.cor && item.cor?.length > 0 ? item.cor : undefined}>
                  <Styles.DescricaoContainer
                    activeOpacity={0.8}
                    onPress={
                      Boolean(
                        route.params.imobilizadoPesagem?.codigoContainer &&
                        route.params.imobilizadoPesagem?.codigoContainer !== 0,
                      )
                        ? () => controller.selecionarResiduoPesagem(item, index)
                        : () => controller.onSelectResiduo(item)
                    }
                    preecherTudo={
                      !Boolean(controller.verificaResiduoPesagem(item.codigo || 0) && controller.residuosPesagem.length > 1)
                    }>
                    <Styles.Descricao>{`${item.codigo} - ${item.descricao}`}</Styles.Descricao>
                  </Styles.DescricaoContainer>
                  {controller.verificaResiduoPesagem(item.codigo || 0) && controller.residuosPesagem.length > 1 && (
                    <Styles.EditarQuantidadeContainer>
                      <Styles.InputContainer>
                        <Styles.DiminuirQuantidadeContainer
                          activeOpacity={0.5}
                          onPress={() => controller.onPressDiminuirQuantidade(index)}>
                          <FeatherIcone name="minus" color={secundary} size={15} />
                        </Styles.DiminuirQuantidadeContainer>
                        <Styles.EditarInput
                          color={
                            item.xExigeInteiro && String(item?.quantidade ?? '').indexOf(',') !== -1 ? colors.accent : undefined
                          }
                          keyboardType={item.xExigeInteiro ? 'numeric' : 'decimal-pad'}
                          onBlur={() => controller.onBlurQuantidade(index)}
                          maxLength={10}
                          onFocus={() => controller.onFocusQuantidade(index)}
                          onChangeText={text => controller.onChangeQuantidadeResiduo(index, text)}
                          value={String(item?.quantidade ?? '')}
                        />
                        <Styles.UnidadeEditarContainer>
                          <Styles.Descricao>{item.unidade ?? ''}</Styles.Descricao>
                        </Styles.UnidadeEditarContainer>
                        <Styles.AdicionarQuantidadeContainer
                          activeOpacity={0.5}
                          onPress={() => controller.onPressAdicionarQuantidade(index)}>
                          <FeatherIcone name="plus" color={secundary} size={15} />
                        </Styles.AdicionarQuantidadeContainer>
                      </Styles.InputContainer>
                    </Styles.EditarQuantidadeContainer>
                  )}
                  {controller.verificaResiduoPesagem(item.codigo || 0) && (
                    <Styles.ResiudoAdicionadoPesagem></Styles.ResiudoAdicionadoPesagem>
                  )}

                  {controller.verificaResiduoDuplicado(item)?.length > 1 ? (
                    <Styles.AddedContainer>
                      <Styles.DuplicadoTexto>{I18n.t('screens.residuesList.double')}</Styles.DuplicadoTexto>
                    </Styles.AddedContainer>
                  ) : (
                    controller.verificaResiduoDuplicado(item)?.length > 0 && (
                      <Styles.AddedContainer>
                        <Styles.DuplicadoTexto>{I18n.t('screens.residuesList.added')}</Styles.DuplicadoTexto>
                      </Styles.AddedContainer>
                    )
                  )}
                </Styles.ResiduoContainer>
              )}
            />
          ) : (
            <SemConteudo texto={I18n.t('screens.residuesList.notFound')} nomeIcone="file-text" />
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

export default TelaListaResiduos;

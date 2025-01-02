import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Cabecalho from '../../../componentes/cabecalho';
import { AuthRoutes } from '../../../routes/routes';
import { enderecoFormatado } from '../../../utils/formatter';
import Controller from './controller';
import { IScreenAuth } from '../../../routes/types';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';
import { SemConteudo } from 'vision-common';
import PaginationList from 'vision-common/src/app/componentes/paginationList';

const TelaObrasNovaColeta: IScreenAuth<AuthRoutes.ObrasNovaColeta> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.work.title')}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder={I18n.t('screens.work.search')}
            onChangeText={controller.onChangePesquisa}
            margemBaixo={20}
          />
        </Styles.PesquisarContainer>

        {!controller.loadingData
          ? (
            controller?.obrasNovaColeta?.length > 0
              ? (
                <PaginationList
                  items={controller.obrasNovaColeta}
                  hasPages={controller.hasPages}
                  loadingMore={controller.loadingMore}
                  refreshing={controller.refreshing}
                  iconName="file-text"
                  textNotFound={I18n.t('screens.work.notFound')}
                  onEndReached={() => controller.pegarObrasNovaColetaPaginado(true)}
                  onRefresh={controller.atualizar}
                  keyExtractor={(item, index) => String(index)}
                  renderItem={({ item, index }) => (
                    <Styles.CartaoObraContainer
                      key={String(index)}
                      isSelected={controller.verificaObraSelecionada(item)}
                      activeOpacity={0.5}
                      onPress={() => controller.onSelectObra(item)}
                    >
                      <Styles.Titulo>{`${item.codigo} - ${item.descricao ?? ''}`}</Styles.Titulo>
                      <Styles.Descricao marginTop={0}>{`Contrato: ${item.codigoContrato ?? ''}`}</Styles.Descricao>
                      <Styles.Descricao>{enderecoFormatado(item.endereco) ?? ''}</Styles.Descricao>
                    </Styles.CartaoObraContainer>
                  )}
                />
              ) : (
                <SemConteudo
                  texto={I18n.t('screens.work.notFound')}
                  nomeIcone="file-text"
                />
              )
          ) : (
            <Styles.LoadingContainer>
              <CustomActiveIndicator />
            </Styles.LoadingContainer>
          )}
      </Styles.Container>
    </>
  );
}

export default TelaObrasNovaColeta;

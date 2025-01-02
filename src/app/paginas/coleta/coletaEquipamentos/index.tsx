import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { SemConteudo } from 'vision-common';
import Botao from '../../../componentes/botao';
import Cabecalho from '../../../componentes/cabecalho';
import CartaoEquipamento from '../../../componentes/cartaoEquipamento';
import { AuthRoutes } from '../../../routes/routes';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';
import { IScreenAuth } from '../../../routes/types';
import Pesquisar from 'vision-common/src/app/componentes/pesquisar';
import PesoImobilizadoAlert from '../../../componentes/pesoImobilizadoAlert';
import { FlatList } from 'react-native';

const VIEWABILITY_CONFIG = {
  minimumViewTime: 300,
  viewAreaCoveragePercentThreshold: 100,
}

const TelaColetaEquipamentos: IScreenAuth<AuthRoutes.EquipamentosDaColeta> = ({ navigation, route }) => {
  const { primary, secundary, colors } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.collectEquipament.title')}
        temIconeDireita
        nomeIconeDireita="qrcode"
        onPressIconeEsquerda={controller.goBackFunction}
        onPressIconeDireita={controller.navigateToQRCode}
      />
      <Styles.Container>
        <Styles.PesquisarContainer>
          <Pesquisar
            value={controller.pesquisa}
            textoPlaceholder={I18n.t('screens.collectEquipament.search')}
            onChangeText={controller.onChangePesquisa}
            margemBaixo={20}
          />
        </Styles.PesquisarContainer>

        <Styles.TotalEquipamentosContainer>
          <Styles.TotalEquipamentosTexto>Total Resíduos: {controller.totalResiduos} | Total Equipamentos: {controller.totalEquipamentos}</Styles.TotalEquipamentosTexto>
        </Styles.TotalEquipamentosContainer>

        {!controller.loadingData ? (
          controller.equipamentosFiltrados.length > 0 ? (
            <FlatList
              data={controller.equipamentosFiltrados}
              keyExtractor={(_, index) => String(index)}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              viewabilityConfig={VIEWABILITY_CONFIG}
              removeClippedSubviews={true}
              disableVirtualization
              renderItem={({ item }) => (
                <CartaoEquipamento
                  titulo={`${controller.configuracoes?.habilitarCodIdentificacaoImobilizado
                    ? item.identificacao
                      ? `${item.identificacao} - `
                      : ''
                    : item.codigoContainer
                      ? `${item.codigoContainer} - `
                      : ''
                    }${item.descricaoContainer ?? ''}`}
                  codMovimentacao={item.codigoMovimentacao}
                  dataColocacao={item.dataColocacao}
                  xEtapaPendente={item?.xEtapaPendente}
                  onPressRetirar={() => controller.showRemoverEquipamentoAlert(item)}
                  onPressSubstituir={() => controller.showSubstituirAlert(item)}
                />
              )}
              ListEmptyComponent={() => (
                <Styles.SemConteudoContainer>
                  <SemConteudo texto={I18n.t('screens.collectEquipament.notFound')} nomeIcone="clipboard" />
                </Styles.SemConteudoContainer>
              )}
            />
          ) : (
            <Styles.SemConteudoContainer>
              <SemConteudo texto={I18n.t('screens.collectEquipament.notFound')} nomeIcone="clipboard" />
            </Styles.SemConteudoContainer>
          )
        ) : (
          <Styles.SemConteudoContainer>
            <CustomActiveIndicator />
          </Styles.SemConteudoContainer>
        )}
        <Styles.BotaoContainer>
          <Botao
            texto={I18n.t('screens.collectEquipament.add')}
            backgroundColor={primary}
            corTexto={secundary}
            onPress={() => controller.navigateToListaEquipamentos(undefined)}
          />
          <Styles.Spacer />
          <Botao
            texto={I18n.t('screens.collectEquipament.continue')}
            backgroundColor={colors.orange}
            corTexto={secundary}
            onPress={controller.continuarColeta}
          />
        </Styles.BotaoContainer>
        <PesoImobilizadoAlert
          tara={controller.memoizedEquipamentoPesoTara}
          active={!!controller.equipamentoPesoImobilizadoAlert?.codigoCliente}
          onPressContinuar={controller.navegarParaAdicionarResiduosPesagem}
          onPressMovimentarSemPeso={controller.continuarPesoBrutoAsync}
          onPressClose={() => controller.setEquipamentoPesoImobilizadoAlert({})}
        />
      </Styles.Container>
    </>
  );
};

export default TelaColetaEquipamentos;

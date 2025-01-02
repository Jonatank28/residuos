import * as React from 'react';
import * as Styles from './styles';
import Controller from './controller';
import I18n from 'i18n-js';
import { useTheme } from 'styled-components/native';
import { formatarPlaca, ItemContainer } from 'vision-common';
import { IRegiao } from '../../../core/domain/entities/regiao';
import Botao from '../../componentes/botao';
import Cabecalho from '../../componentes/cabecalho';
import CartaoSimples from '../../componentes/cartaoSimples';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';
import FeaterIcon from 'react-native-vector-icons/Feather'

const TelaAdicionarRegioes: IScreenAuth<AuthRoutes.AdicionarRegioes> = ({ navigation, route }) => {
  const { secundary } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.addRegions.title')}
        onPressIconeEsquerda={controller.goBackFunction}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          {!route.params.isChange && (
            <ItemContainer
              title={I18n.t('screens.addRegions.board')}
              marginBottom={10}
            >
              <CartaoSimples
                hasBorder
                descricao={controller.veiculo && controller.veiculo.placa
                  ? formatarPlaca(controller?.veiculo?.placa)
                  : I18n.t('screens.addRegions.selectBoard')}
                nomeIcone="chevron-right"
                onPress={controller.navigateToPlacas}
              />
            </ItemContainer>
          )}
          <Styles.CartaoRegioesContainer>
            <Styles.CartaoRegioesTituloContainer
              activeOpacity={0.5}
              onPress={controller.navigateToRegioes}
            >
              <FeaterIcon
                name='plus'
                size={25}
                style={{ color: "#ffffff" }}
              >
              </FeaterIcon>
            </Styles.CartaoRegioesTituloContainer>
            {!controller.loadingData
              ? (
                !!controller.regioes?.length
                  ? (
                    controller.regioes.map((item: IRegiao) => (
                      <Styles.RegiaoContainer
                        key={item.codigo}
                      >
                        <Styles.TituloContainer>
                          <Styles.Titulo>{item.descricao ?? ''}</Styles.Titulo>
                        </Styles.TituloContainer>
                        <Styles.DeletarRegiaoContainer
                          activeOpacity={0.5}
                          onPress={() => controller.removerRegiao(item)}
                        >
                          <Styles.FeatherIcone
                            name="trash"
                            size={25}
                          />
                        </Styles.DeletarRegiaoContainer>
                      </Styles.RegiaoContainer>
                    ))
                  ) : (
                    <Styles.DescricaoContainer>
                      <Styles.Descricao>{I18n.t('screens.addRegions.placeholderRegions')}</Styles.Descricao>
                    </Styles.DescricaoContainer>
                  )
              ) : (
                <Styles.DescricaoContainer>
                  <CustomActiveIndicator />
                </Styles.DescricaoContainer>
              )}
          </Styles.CartaoRegioesContainer>
          <Styles.BotaoContainer>
            <Botao
              texto={I18n.t('screens.addRegions.button')}
              hasIcon={false}
              corTexto={secundary}
              onPress={controller.gravarRegioes}
            />
          </Styles.BotaoContainer>
        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
}

export default TelaAdicionarRegioes;

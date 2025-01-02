import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { ItemContainer, SemConteudo } from 'vision-common';
import Cabecalho from '../../../componentes/cabecalho';
import { IScreenAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import CartaoSimples from '../../../componentes/cartaoSimples';
import Botao from '../../../componentes/botao';
import CustomActiveIndicator from '../../../componentes/customActiveIndicator';

const TelaDetalhesCliente: IScreenAuth<AuthRoutes.DetalhesDoCliente> = ({ navigation, route }) => {
  const { colors, secundary } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.clientDetails.title')} temIconeDireita={false} />
      <Styles.Container>
        {!controller.loadingData ? (
          controller.cliente?.codigo ? (
            <Styles.ScrollContainer keyboardShouldPersistTaps="always">
              <ItemContainer title={I18n.t('screens.clientDetails.client')} marginBottom={10}>
                <Styles.NomeCliente>{controller.cliente.nomeFantasia ?? ''}</Styles.NomeCliente>
              </ItemContainer>
              <ItemContainer title={I18n.t('screens.clientDetails.clientAddress')} marginBottom={10}>
                <Styles.DescricaoContainer>
                  <Styles.Descricao>{controller.cliente.endereco ? controller.cliente.endereco.rua : ''}</Styles.Descricao>
                </Styles.DescricaoContainer>

                <Styles.RowContainer>
                  <Styles.DescricaoContainer>
                    <Styles.Descricao>{controller.cliente.endereco ? controller.cliente.endereco.bairro : ''}</Styles.Descricao>
                  </Styles.DescricaoContainer>
                  <Styles.Spacer />
                  <Styles.DescricaoContainer flex={0.5}>
                    <Styles.Descricao>{controller.cliente.endereco ? controller.cliente.endereco.numero : ''}</Styles.Descricao>
                  </Styles.DescricaoContainer>
                </Styles.RowContainer>

                <Styles.RowContainer>
                  <Styles.DescricaoContainer>
                    <Styles.Descricao>{controller.cliente.endereco ? controller.cliente.endereco.cidade : ''}</Styles.Descricao>
                  </Styles.DescricaoContainer>
                  <Styles.Spacer />
                  <Styles.DescricaoContainer flex={0.2}>
                    <Styles.Descricao>{controller.cliente.endereco ? controller.cliente.endereco.uf : ''}</Styles.Descricao>
                  </Styles.DescricaoContainer>
                </Styles.RowContainer>
              </ItemContainer>
              {controller.cliente.containers && controller.cliente.containers.length > 0 && (
                <CartaoSimples
                  descricao={I18n.t('screens.clientDetails.containers')}
                  nomeIcone="chevron-right"
                  marginBottom={10}
                  onPress={controller.navigateToContainers}
                />
              )}
              <CartaoSimples
                descricao={I18n.t('screens.clientDetails.addLocalization')}
                nomeIcone="map-pin"
                onPress={controller.showLocationAlert}
              />
              <Styles.BotaoContainer>
                {controller.checkIn === null ? (
                  <Botao
                    texto={I18n.t('screens.clientDetails.checkIn')}
                    corTexto={secundary}
                    onPress={controller.fazerCheckInAsync}
                  />
                ) : !controller.isCheckIn ? (
                  <Styles.HasCheckInContainer>
                    <Styles.Descricao hasCenter>{`O Cliente ${controller.checkIn} está com checkin ativo`}</Styles.Descricao>
                    <Styles.Spacer />
                    <Styles.VerClienteContainer activeOpacity={0.5} onPress={() => controller.fazerCheckOutAsync(controller.checkIn)}>
                      <Styles.NomeCliente>Fazer Checkout</Styles.NomeCliente>
                    </Styles.VerClienteContainer>
                  </Styles.HasCheckInContainer>
                ) : (
                  <Botao
                    texto={I18n.t('screens.clientDetails.checkOut')}
                    backgroundColor={colors.accent}
                    corTexto={secundary}
                    onPress={() => controller.fazerCheckOutAsync()}
                  />
                )}
              </Styles.BotaoContainer>
            </Styles.ScrollContainer>
          ) : (
            <SemConteudo
              nomeIcone="users"
              texto="Cliente não localizado. Por favor, verifique suas regiões ou, caso esteja offline, tente sincronizar novamente."
              onPress={controller.pegarCliente}
            />
          )
        ) : (
          <Styles.SemConteudoContainer>
            <CustomActiveIndicator />
          </Styles.SemConteudoContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaDetalhesCliente;

import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { formatarPlaca, ItemContainer, SemConteudo } from 'vision-common';
import { IEquipamento } from '../../../core/domain/entities/equipamento';
import Cabecalho from '../../componentes/cabecalho';
import CartaoSimples from '../../componentes/cartaoSimples';
import CustomActiveIndicator from '../../componentes/customActiveIndicator';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';

const TelaRascunhoDetalhes: IScreenAuth<AuthRoutes.DetalhesDoRascunho> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.draftsDetails.title')}
        temIconeDireita={!!controller.rascunhoDetalhes.codigoOS || !!controller.rascunhoDetalhes.codigoCliente}
        nomeIconeDireita="trash"
        onPressIconeDireita={controller.showDeletarAlert}
      />
      <Styles.Container>
        {!controller.loadingData ? (
          controller.rascunhoDetalhes?.codigoOS || controller.rascunhoDetalhes.codigoCliente ? (
            <Styles.ScrollContainer keyboardShouldPersistTaps="always">
              <CartaoSimples
                descricao={I18n.t('screens.draftsDetails.toGoCollect')}
                nomeIcone="arrow-right"
                backgroundColor={colors.green}
                onPress={controller.navigateToColeta}
                marginBottom={10}
              />
              {controller.rascunhoDetalhes?.placa && (
                <CartaoSimples
                  descricao={formatarPlaca(controller.rascunhoDetalhes.placa ?? '')}
                  nomeIcone="truck"
                  marginBottom={10}
                />
              )}
              {controller.rascunhoDetalhes?.codigoObra !== null && controller.rascunhoDetalhes.codigoObra !== 0 && (
                <ItemContainer title={I18n.t('screens.draftsDetails.workDetails.title')} marginBottom={10}>
                  <Styles.Titulo>{I18n.t('screens.draftsDetails.workDetails.work')}</Styles.Titulo>
                  <Styles.DetalhesContainer>
                    <Styles.Descricao>
                      {controller.rascunhoDetalhes?.nomeObra && controller.rascunhoDetalhes.nomeObra?.length > 0
                        ? controller.rascunhoDetalhes?.nomeObra
                        : I18n.t('notInformed')}
                    </Styles.Descricao>
                  </Styles.DetalhesContainer>
                </ItemContainer>
              )}
              <ItemContainer title={I18n.t('screens.draftsDetails.clientDetails.title')} marginBottom={10}>
                <Styles.Titulo>{I18n.t('screens.draftsDetails.clientDetails.name')}</Styles.Titulo>
                <Styles.DetalhesContainer>
                  <Styles.Descricao>
                    {controller.rascunhoDetalhes?.nomeCliente && controller.rascunhoDetalhes.nomeCliente?.length > 0
                      ? controller.rascunhoDetalhes?.nomeCliente
                      : I18n.t('notInformed')}
                  </Styles.Descricao>
                </Styles.DetalhesContainer>
                <Styles.Titulo>{I18n.t('screens.draftsDetails.clientDetails.phone')}</Styles.Titulo>
                <Styles.DetalhesContainer>
                  <Styles.Descricao>
                    {controller.rascunhoDetalhes?.telefoneCliente && controller.rascunhoDetalhes.telefoneCliente?.length > 0
                      ? controller.rascunhoDetalhes?.telefoneCliente
                      : I18n.t('notInformed')}
                  </Styles.Descricao>
                </Styles.DetalhesContainer>
              </ItemContainer>
              <ItemContainer title={I18n.t('screens.draftsDetails.responsibleDetails.title')} marginBottom={10}>
                <Styles.Titulo>{I18n.t('screens.draftsDetails.responsibleDetails.name')}</Styles.Titulo>
                <Styles.DetalhesContainer>
                  <Styles.Descricao>
                    {controller.rascunhoDetalhes?.nomeResponsavel && controller.rascunhoDetalhes.nomeResponsavel?.length > 0
                      ? controller.rascunhoDetalhes?.nomeResponsavel
                      : I18n.t('notInformed')}
                  </Styles.Descricao>
                </Styles.DetalhesContainer>
                <Styles.Titulo>{I18n.t('screens.draftsDetails.responsibleDetails.occupation')}</Styles.Titulo>
                <Styles.DetalhesContainer>
                  <Styles.Descricao>
                    {controller.rascunhoDetalhes?.funcaoResponsavel && controller.rascunhoDetalhes.funcaoResponsavel?.length > 0
                      ? controller.rascunhoDetalhes?.funcaoResponsavel
                      : I18n.t('notInformed')}
                  </Styles.Descricao>
                </Styles.DetalhesContainer>
                <Styles.Titulo>{I18n.t('screens.draftsDetails.responsibleDetails.email')}</Styles.Titulo>
                <Styles.DetalhesContainer>
                  <Styles.Descricao>
                    {controller.rascunhoDetalhes?.emailResponsavel && controller.rascunhoDetalhes.emailResponsavel?.length > 0
                      ? controller.rascunhoDetalhes?.emailResponsavel
                      : I18n.t('notInformed')}
                  </Styles.Descricao>
                </Styles.DetalhesContainer>
              </ItemContainer>
              {controller.rascunhoDetalhes?.mtr !== null && controller.rascunhoDetalhes.mtr !== '' && (
                <CartaoSimples descricao={controller.rascunhoDetalhes.mtr ?? ''} nomeIcone="hash" marginBottom={10} />
              )}
              {controller.rascunhoDetalhes.codigoBarraMTR !== null && controller.rascunhoDetalhes.codigoBarraMTR !== '' && (
                <CartaoSimples descricao={controller.rascunhoDetalhes.codigoBarraMTR ?? ''} nomeIcone="hash" marginBottom={10} />
              )}
              {controller.rascunhoDetalhes.mtrs && controller.rascunhoDetalhes.mtrs.length > 0 && (
                <ItemContainer title={I18n.t('screens.draftsDetails.mtrsDetails.title')} marginBottom={10}>
                  {controller.rascunhoDetalhes.mtrs.map((item, index) => (
                    <Styles.DetalhesContainer key={String(index)}>
                      <Styles.Descricao>
                        {`${item.estado && !item.hasSinir ? item.estado.descricao : I18n.t('screens.collectCheck.sinir')} - ${item.mtr ?? item.mtrCodBarras
                          }`}
                      </Styles.Descricao>
                    </Styles.DetalhesContainer>
                  ))}
                </ItemContainer>
              )}
              {controller.rascunhoDetalhes.motivo && controller.rascunhoDetalhes.motivo.codigo && (
                <ItemContainer title={I18n.t('screens.draftsDetails.reasonDetails.title')} marginBottom={10}>
                  <Styles.Titulo>{I18n.t('screens.draftsDetails.reasonDetails.name')}</Styles.Titulo>
                  <Styles.DetalhesContainer>
                    <Styles.Descricao>
                      {controller.rascunhoDetalhes?.motivo &&
                        controller.rascunhoDetalhes.motivo?.descricao &&
                        controller.rascunhoDetalhes.motivo.descricao?.length > 0
                        ? controller.rascunhoDetalhes.motivo.descricao
                        : I18n.t('notInformed')}
                    </Styles.Descricao>
                  </Styles.DetalhesContainer>
                  <Styles.Titulo>{I18n.t('screens.draftsDetails.reasonDetails.observation')}</Styles.Titulo>
                  <Styles.DetalhesContainer>
                    <Styles.Descricao>
                      {controller?.rascunhoDetalhes?.motivo &&
                        controller.rascunhoDetalhes.motivo?.observacao &&
                        controller.rascunhoDetalhes.motivo?.observacao?.length > 0
                        ? controller?.rascunhoDetalhes?.motivo?.observacao
                        : I18n.t('notInformed')}
                    </Styles.Descricao>
                  </Styles.DetalhesContainer>
                </ItemContainer>
              )}
              {controller.rascunhoDetalhes.residuos && controller.rascunhoDetalhes.residuos.length > 0 && (
                <ItemContainer title={I18n.t('screens.draftsDetails.residuesDetails.title')} marginBottom={10}>
                  {controller.rascunhoDetalhes.residuos.map((item, index) => (
                    <Styles.ResiduoContainer key={String(index)}>
                      <Styles.ResiduoTituloContainer>
                        <Styles.Descricao>{item.descricao ?? ''}</Styles.Descricao>
                      </Styles.ResiduoTituloContainer>
                      <Styles.ResiduosBodyContainer>
                        <Styles.DescricaoResiduo hasTitle>
                          {I18n.t('screens.draftsDetails.residuesDetails.amount')}
                        </Styles.DescricaoResiduo>
                        <Styles.ReisiduoDescricaoContainer>
                          <Styles.DescricaoResiduo>{`${item.quantidade ?? ''} - ${item.unidade ?? ''}`}</Styles.DescricaoResiduo>
                        </Styles.ReisiduoDescricaoContainer>
                      </Styles.ResiduosBodyContainer>

                      <Styles.ResiduosBodyContainer>
                        <Styles.DescricaoResiduo hasTitle>
                          {I18n.t('screens.draftsDetails.residuesDetails.subGroup')}{' '}
                          <Styles.DescricaoResiduo>{item.subGrupo ?? ''}</Styles.DescricaoResiduo>
                        </Styles.DescricaoResiduo>
                      </Styles.ResiduosBodyContainer>

                      <Styles.ResiduosBodyContainer>
                        <Styles.DescricaoResiduo hasTitle>
                          {I18n.t('screens.draftsDetails.residuesDetails.observation')}{' '}
                          <Styles.DescricaoResiduo>{item.observacao ?? ''}</Styles.DescricaoResiduo>
                        </Styles.DescricaoResiduo>
                      </Styles.ResiduosBodyContainer>

                      <Styles.ResiduosBodyContainer>
                        <Styles.DescricaoResiduo hasTitle>
                          {I18n.t('screens.draftsDetails.residuesDetails.excess')}
                        </Styles.DescricaoResiduo>
                        <Styles.ReisiduoDescricaoContainer>
                          <Styles.DescricaoResiduo>
                            {item.excesso
                              ? I18n.t('screens.draftsDetails.residuesDetails.yes')
                              : I18n.t('screens.draftsDetails.residuesDetails.no') ?? ''}
                          </Styles.DescricaoResiduo>
                        </Styles.ReisiduoDescricaoContainer>
                      </Styles.ResiduosBodyContainer>
                      <Styles.ResiduosBodyContainer>
                        <Styles.DescricaoResiduo hasTitle>
                          {I18n.t('screens.draftsDetails.residuesDetails.noConform')}
                        </Styles.DescricaoResiduo>
                        <Styles.ReisiduoDescricaoContainer>
                          <Styles.DescricaoResiduo>
                            {item.naoConforme
                              ? I18n.t('screens.draftsDetails.residuesDetails.yes')
                              : I18n.t('screens.draftsDetails.residuesDetails.no') ?? ''}
                          </Styles.DescricaoResiduo>
                        </Styles.ReisiduoDescricaoContainer>
                      </Styles.ResiduosBodyContainer>

                      <Styles.ResiduosBodyContainer>
                        <Styles.DescricaoResiduo hasTitle>
                          {I18n.t('screens.draftsDetails.residuesDetails.hasPhotos')}
                        </Styles.DescricaoResiduo>
                        <Styles.ReisiduoDescricaoContainer>
                          <Styles.DescricaoResiduo>
                            {item.fotos && item.fotos.length > 0
                              ? I18n.t('screens.draftsDetails.residuesDetails.yes')
                              : I18n.t('screens.draftsDetails.residuesDetails.no') ?? ''}
                          </Styles.DescricaoResiduo>
                        </Styles.ReisiduoDescricaoContainer>
                      </Styles.ResiduosBodyContainer>

                      <Styles.ResiduosBodyContainer>
                        <Styles.DescricaoResiduo hasTitle>
                          {I18n.t('screens.draftsDetails.residuesDetails.classification')}
                        </Styles.DescricaoResiduo>
                        <Styles.ReisiduoDescricaoContainer>
                          <Styles.DescricaoResiduo>{item.classificacao ?? I18n.t('notInformed')}</Styles.DescricaoResiduo>
                        </Styles.ReisiduoDescricaoContainer>
                      </Styles.ResiduosBodyContainer>
                    </Styles.ResiduoContainer>
                  ))}
                </ItemContainer>
              )}
              {((controller.rascunhoDetalhes?.equipamentos && controller.rascunhoDetalhes.equipamentos?.length > 0) ||
                (controller.rascunhoDetalhes?.equipamentosRetirados &&
                  controller.rascunhoDetalhes.equipamentosRetirados?.length > 0)) && (
                  <ItemContainer title={I18n.t('screens.draftsDetails.equipmentDetails.title')} marginBottom={10}>
                    {controller.rascunhoDetalhes?.equipamentos &&
                      controller.rascunhoDetalhes.equipamentos?.length > 0 &&
                      controller.rascunhoDetalhes.equipamentos.map((item: IEquipamento, index: number) => (
                        <Styles.DetalhesContainer key={String(index)}>
                          <Styles.Descricao>{`${item.codigoContainer} - ${item.descricaoContainer}` ?? ''}</Styles.Descricao>
                        </Styles.DetalhesContainer>
                      ))}
                    {controller.rascunhoDetalhes?.equipamentosRetirados &&
                      controller.rascunhoDetalhes.equipamentosRetirados?.length > 0 &&
                      controller.rascunhoDetalhes.equipamentosRetirados.map((item: IEquipamento, index: number) => (
                        <Styles.DetalhesContainer key={String(index)}>
                          <Styles.Descricao>{`${item.codigoContainer} - ${item.descricaoContainer}` ?? ''}</Styles.Descricao>
                          <Styles.EquipamentoRemovidoContainer>
                            <Styles.DeletadoTexto>{I18n.t('screens.draftsDetails.deleted')}</Styles.DeletadoTexto>
                          </Styles.EquipamentoRemovidoContainer>
                        </Styles.DetalhesContainer>
                      ))}
                  </ItemContainer>
                )}
            </Styles.ScrollContainer>
          ) : (
            <Styles.SemConteudoContainer>
              <SemConteudo texto={I18n.t('screens.draftsDetails.notFound')} nomeIcone="file" />
            </Styles.SemConteudoContainer>
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

export default TelaRascunhoDetalhes;

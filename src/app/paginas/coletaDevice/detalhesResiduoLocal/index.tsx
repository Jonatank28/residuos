import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { formatterCurrency, IPhoto, ItemContainer, SemConteudo } from 'vision-common';
import Cabecalho from '../../../componentes/cabecalho';
import { AuthRoutes } from '../../../routes/routes';
import Controller from './controller';
import { IScreenAuth } from '../../../routes/types';

const TelaDetalhesResiduoLocal: IScreenAuth<AuthRoutes.DetalhesDoResiduoLocal> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.residuesDetailsLocal.title')} temIconeDireita={false} />
      <Styles.Container>
        <Styles.ModalFoto transparent visible={controller.visivel}>
          <Styles.ModalContainer>
            <Styles.FotoModalContainer
              source={{
                uri:
                  controller?.foto && controller.foto?.base64 && controller.foto?.base64.includes('data:image/jpg;base64,')
                    ? controller?.foto?.base64
                    : `data:image/jpg;base64,${controller?.foto?.base64}`,
              }}
              resizeMode="cover"
            />
            <Styles.FecharModalContainer activeOpacity={0.5} onPress={() => controller.setVisivel(false)}>
              <Styles.FeatherIcone name="x" size={25} />
            </Styles.FecharModalContainer>
          </Styles.ModalContainer>
        </Styles.ModalFoto>
        {controller.residuo ? (
          <Styles.ScrollContainer keyboardShouldPersistTaps="always">
            <Styles.ResiduoContainer>
              <Styles.TituloInput>{I18n.t('screens.residuesDetailsLocal.name')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>{controller?.residuo?.descricao ?? ''}</Styles.Descricao>
              </Styles.InputContainer>
              <Styles.TituloInput>{I18n.t('screens.residuesDetailsLocal.subgroup')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>{controller?.residuo?.subGrupo ?? ''}</Styles.Descricao>
              </Styles.InputContainer>
              <Styles.TituloInput>{I18n.t('screens.residuesDetailsLocal.amount')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>{controller?.residuo?.quantidade ?? ''}</Styles.Descricao>
              </Styles.InputContainer>
              {controller.configuracoes?.mostrarValoresOSResiduos && (
                <>
                  <Styles.TituloInput>Valor Total</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>
                      {formatterCurrency(controller.calcularValorTotal(), { prefix: 'R$ ', precision: 2 })}
                    </Styles.Descricao>
                  </Styles.InputContainer>
                  <Styles.TituloInput>Valor Unitário</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>
                      {formatterCurrency(controller?.residuo?.valorUnitario ?? 0, { prefix: 'R$ ', precision: 2 })}
                    </Styles.Descricao>
                  </Styles.InputContainer>
                </>
              )}
              <Styles.TituloInput>{I18n.t('screens.residuesDetailsLocal.observation')}</Styles.TituloInput>
              <Styles.InputContainer>
                <Styles.Descricao>
                  {controller?.residuo?.observacao && controller.residuo?.observacao?.length > 0
                    ? controller?.residuo?.observacao
                    : I18n.t('notInformed')}
                </Styles.Descricao>
              </Styles.InputContainer>
            </Styles.ResiduoContainer>

            {controller?.residuo?.residuosSecundarios && controller.residuo.residuosSecundarios?.length > 0 && (
              <>
                <ItemContainer marginBottom={10} title="Detalhes">
                  <Styles.TituloInput>Imobilizado Real</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>{controller?.residuo?.codigoImobilizadoReal}</Styles.Descricao>
                  </Styles.InputContainer>
                  <Styles.TituloInput>Peso Bruto</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>{controller.calculaPesoBruto()}</Styles.Descricao>
                  </Styles.InputContainer>
                  <Styles.TituloInput>Peso Líquido</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>{controller.calculaPesoLiquido()}</Styles.Descricao>
                  </Styles.InputContainer>
                  <Styles.TituloInput>Tara</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>{controller.calculaTara()}</Styles.Descricao>
                  </Styles.InputContainer>
                  <Styles.TituloInput>Cubagem</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>{controller.calculaCubagem()}</Styles.Descricao>
                  </Styles.InputContainer>
                  <Styles.TituloInput>Excesso</Styles.TituloInput>
                  <Styles.InputContainer>
                    <Styles.Descricao>{controller.calculaPesoExcesso()}</Styles.Descricao>
                  </Styles.InputContainer>
                </ItemContainer>

                <ItemContainer title="Resíduos Coletados">
                  <Styles.ResiduoColetadoContainer>
                    <Styles.Descricao>Resíduo</Styles.Descricao>
                    <Styles.Spacer />
                    <Styles.Descricao>Quantidade</Styles.Descricao>
                    <Styles.Spacer />
                    <Styles.Descricao>Medida</Styles.Descricao>
                  </Styles.ResiduoColetadoContainer>

                  {controller.residuo.residuosSecundarios.map((residuoSecundario, index) => (
                    <Styles.ResiduoColetadoItem key={String(index)}>
                      <Styles.Descricao>{residuoSecundario.descricao}</Styles.Descricao>
                      <Styles.Spacer />
                      <Styles.Descricao>{residuoSecundario.quantidade}</Styles.Descricao>
                      <Styles.Spacer />
                      <Styles.Descricao>{residuoSecundario.unidade}</Styles.Descricao>
                    </Styles.ResiduoColetadoItem>
                  ))}
                </ItemContainer>
              </>
            )}

            {controller?.residuo?.fotos && controller?.residuo?.fotos?.length > 0 && (
              <ItemContainer title={I18n.t('screens.residuesDetailsLocal.photos')}>
                <Styles.FotoRowContainer>
                  {controller.residuo.fotos.map((foto: IPhoto, index: number) => (
                    <Styles.FotoContainer key={String(index)} activeOpacity={0.5} onPress={() => controller.onPressFoto(foto)}>
                      <Styles.Foto
                        source={{
                          uri:
                            foto?.base64 && foto.base64.includes('data:image/jpg;base64,')
                              ? foto.base64
                              : `data:image/jpg;base64,${foto?.base64}`,
                        }}
                        resizeMode="cover"
                      />
                    </Styles.FotoContainer>
                  ))}
                </Styles.FotoRowContainer>
              </ItemContainer>
            )}
          </Styles.ScrollContainer>
        ) : (
          <Styles.SemConteudoContainer>
            <SemConteudo texto={I18n.t('screens.residuesDetailsLocal.notFound')} nomeIcone="coffee" />
          </Styles.SemConteudoContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaDetalhesResiduoLocal;

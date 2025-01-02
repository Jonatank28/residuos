import * as React from 'react';
import * as Styles from './styles';
import { Form } from '@unform/mobile';
import { useTheme } from 'styled-components/native';
import I18n from 'i18n-js';
import { AdicionarFoto, formatterCurrency, ItemContainer } from 'vision-common';
import Controller from './controller';
import Botao from '../../../componentes/botao';
import Cabecalho from '../../../componentes/cabecalho';
import CaixaDeTexto from '../../../componentes/caixaDeTexto';
import { AuthRoutes } from '../../../routes/routes';
import { IScreenAuth } from '../../../routes/types';
import BottomSheetGaleria from '../../../componentes/bottomSheetGaleria';
import KmAlert from '../../../componentes/kmAltert';

const TelaColetaResponsavel: IScreenAuth<AuthRoutes.ColetaResponsavel> = ({ navigation, route }) => {
  const { primary, secundary, colors } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.collectCheck.title')}
        temIconeDireita={false}
        naoTemIconeEsquerda={controller.validatingSignature}
        onPressIconeEsquerda={controller.goBackFunction}
      />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <Form ref={controller.formRef} initialData={controller.initialData} onSubmit={controller.finalizarColeta}>
            <Styles.DadosContainer>
              <Styles.Titulo
                required={
                  controller.coleta && controller.coleta.motivo && controller.coleta.motivo.codigo
                    ? controller.coleta.motivo.obrigarNomeResponsavel
                    : controller.configuracoes && controller.configuracoes.obrigarNomeResponsavel
                }>
                {I18n.t('screens.collectCheck.responsibleName')}
              </Styles.Titulo>
              <CaixaDeTexto
                hasForm
                nome="responsavel"
                temIcone
                temSenha={false}
                returnText
                value={controller.coleta.nomeResponsavel ?? ''}
                onChangedMask={controller.onChangeNomeResponsavel}
                placeholderNome={I18n.t('screens.collectCheck.responsibleName')}
                nomeIcone="user"
                captalize="characters"
                tamanhoMaximo={100}
              />
              <Styles.Titulo
                required={
                  controller.coleta && controller.coleta.motivo && controller.coleta.motivo.codigo
                    ? controller.coleta.motivo.obrigarFuncaoResponsavel
                    : controller.configuracoes && controller.configuracoes.obrigarFuncaoResponsavel
                }>
                {I18n.t('screens.collectCheck.responsibleFunction')}
              </Styles.Titulo>
              <CaixaDeTexto
                hasForm
                temIcone
                temSenha={false}
                nome="funcaoResponsavel"
                returnText
                value={controller.coleta.funcaoResponsavel ?? ''}
                onChangedMask={controller.onChangeFuncaoResponsavel}
                placeholderNome={I18n.t('screens.collectCheck.responsibleFunction')}
                nomeIcone="briefcase"
                captalize="characters"
                tamanhoMaximo={60}
              />
              <Styles.Titulo>{I18n.t('screens.collectCheck.responsibleDocument')}</Styles.Titulo>
              <CaixaDeTexto
                hasForm
                nome="cpfcnpj"
                mask="cpfcnpj"
                value={controller.coleta.CPFCNPJResponsavel ?? ''}
                onChangedMask={(value: string) => controller.onChangeCPFCNPJResponsavel(value)}
                temIcone
                placeholderNome={I18n.t('screens.collectCheck.responsibleDocument')}
                temSenha={false}
                tipoTeclado="numeric"
                captalize="none"
                nomeIcone="shield"
                tamanhoMaximo={20}
              />
              <Styles.Titulo>{I18n.t('screens.collectCheck.responsibleEmail')}</Styles.Titulo>
              <CaixaDeTexto
                hasForm
                nome="emailResponsavel"
                temIcone
                temSenha={false}
                returnText
                value={controller.coleta.emailResponsavel ?? ''}
                onChangedMask={controller.onChangeEmailResponsavel}
                placeholderNome={I18n.t('screens.collectCheck.responsibleEmail')}
                nomeIcone="mail"
                captalize="none"
                tipoTeclado="email-address"
                tamanhoMaximo={60}
              />
              <Styles.Titulo>{I18n.t('screens.collectCheck.observation')}</Styles.Titulo>
              <CaixaDeTexto
                hasForm
                nome="observacao"
                temIcone
                temSenha={false}
                returnText
                value={controller.coleta.observacaoOS ?? ''}
                onChangedMask={controller.onChangeObservacao}
                placeholderNome={I18n.t('screens.collectCheck.observation')}
                nomeIcone="file-text"
                captalize="none"
                tamanhoMaximo={300}
              />
              {controller.configuracoes?.mostrarValoresOSResiduos && (
                <>
                  <Styles.Titulo>Valor</Styles.Titulo>
                  <CaixaDeTexto
                    hasForm
                    nome="valorOS"
                    temIcone
                    temSenha={false}
                    returnText
                    editavel={false}
                    margemBaixo={0}
                    value={formatterCurrency(controller.calcularValorOS() ?? 0, { precision: 2 })}
                    onChangedMask={controller.onChangeEmailResponsavel}
                    placeholderNome={'Valor da OS'}
                    nomeIcone="dollar-sign"
                    captalize="none"
                    tipoTeclado="email-address"
                    tamanhoMaximo={60}
                  />
                  <Styles.MensagemAlertaValorOS>
                    O valor acima é apenas um demonstrativo, podem ser alterados conforme necessidade ou faturamento
                  </Styles.MensagemAlertaValorOS>
                </>
              )}
              {!controller.configuracoes?.hasMTR && (
                <>
                  <Styles.Titulo>{I18n.t('screens.collectCheck.clientMtr')}</Styles.Titulo>
                  <CaixaDeTexto
                    hasForm
                    nome="mtr"
                    temIcone
                    temSenha={false}
                    returnText
                    value={controller.coleta.mtr ?? ''}
                    onChangedMask={controller.onChangeMTR}
                    placeholderNome={I18n.t('screens.collectCheck.clientMtr')}
                    nomeIcone="hash"
                    captalize="sentences"
                  />
                  <Styles.Titulo>{I18n.t('screens.collectCheck.clientMtrCode')}</Styles.Titulo>
                  <Styles.MTRContainer>
                    <CaixaDeTexto
                      hasForm
                      nome="mtrBarra"
                      temIcone
                      temSenha={false}
                      returnText
                      value={controller.coleta.codigoBarraMTR ?? ''}
                      onChangedMask={controller.onChangeCodigoBarrasMTR}
                      placeholderNome={I18n.t('screens.collectCheck.clientMtrCode')}
                      nomeIcone="hash"
                      captalize="none"
                    />
                    <Styles.IconContainer activeOpacity={0.5} onPress={controller.navigateToScanCode}>
                      <Styles.AwesomeIcone name="barcode" size={30} color={secundary} />
                    </Styles.IconContainer>
                  </Styles.MTRContainer>
                </>
              )}
            </Styles.DadosContainer>
            {controller.configuracoes?.hasMTR && (
              <ItemContainer
                hasIcon
                title={I18n.t('screens.collectCheck.mtrs')}
                marginTop={10}
                nomeIcone="plus"
                onPress={controller.navigateToAdicionarMtr}>
                <Styles.MtrContainerExterno>
                  {controller.mtrsRelacao.length > 0 ? (
                    controller.mtrsRelacao.map((item, index) => (
                      <Styles.MtrRelacaoContainer key={index.toString()}>
                        <Styles.TextoMtrContainer>
                          <Styles.Descricao>
                            {`${item.estado && !item.hasSinir ? item.estado.descricao : I18n.t('screens.collectCheck.sinir')} - ${!!(item?.mtr || item?.mtrCodBarras)
                              ? item?.mtr ?? item?.mtrCodBarras
                              : I18n.t('screens.collectCheck.notInformed')
                              }`}
                          </Styles.Descricao>
                        </Styles.TextoMtrContainer>
                        <Styles.DeleteContainer activeOpacity={0.5} onPress={() => controller.deletarMtr(item)}>
                          <Styles.FeatherIcone name="trash" size={20} color={colors.white} />
                        </Styles.DeleteContainer>
                      </Styles.MtrRelacaoContainer>
                    ))
                  ) : (
                    <Styles.SemConteudoContainer>
                      <Styles.Descricao>{I18n.t('screens.collectCheck.addMTR')}</Styles.Descricao>
                    </Styles.SemConteudoContainer>
                  )}
                </Styles.MtrContainerExterno>
              </ItemContainer>
            )}
            <AdicionarFoto
              title={I18n.t('screens.collectCheck.addPhotos')}
              photos={controller.photos}
              mensagem={I18n.t('screens.collectCheck.addPhotos')}
              screen={AuthRoutes.ColetaResponsavel}
              marginTop={10}
              onPressAdicionar={() => controller.bottomSheetRef.current?.present()}
              onPressDelete={photos => controller.setPhotos(photos)}
              maxPhotos={20}
            />
            <Styles.BotaoContainer>
              {controller.coleta &&
                controller.coleta.motivo &&
                controller.coleta.motivo.codigo &&
                !controller.validatingSignature &&
                !controller.coleta.motivo.obrigarAssinaturaResponsavel && (
                  <>
                    <Botao
                      texto={I18n.t('screens.collectCheck.send')}
                      backgroundColor={colors.orange}
                      corTexto={secundary}
                      onPress={async () => {
                        await controller.setResumo(false);
                        await controller.setIsSignature(false);
                        controller.formRef.current.submitForm();
                      }}
                    />
                    <Styles.Spacer />
                  </>
                )}
              <Botao
                texto={I18n.t('screens.collectCheck.signature')}
                backgroundColor={primary}
                corTexto={secundary}
                isLoading={controller.validatingSignature}
                onPress={async () => {
                  await controller.setResumo(false);
                  await controller.setIsSignature(true);
                  controller.formRef.current.submitForm();
                }}
              />
            </Styles.BotaoContainer>
            {(route.params.coleta && !controller.validatingSignature) && (
              <Styles.ResumoContainer>
                <Botao
                  texto={I18n.t('screens.collectCheck.resume')}
                  corTexto={secundary}
                  onPress={async () => {
                    await controller.setResumo(true);
                    controller.formRef.current.submitForm();
                  }}
                />
              </Styles.ResumoContainer>
            )}
          </Form>
        </Styles.ScrollContainer>

        <BottomSheetGaleria
          bottomSheetRef={controller.bottomSheetRef}
          goToCamera={controller.goToCamera}
          goToGaleraFotos={controller.goToGaleraFotos}
        />
        <KmAlert
          active={controller.kmAlert}
          kmInicial={controller.kmInicial}
          onPressClose={() => controller.setKmAlert(false)}
          kmFinal={controller.kmFinal}
          onPressBotao={async () => {
            await controller.setNaoMostrarAlerta(true);
            controller.formRef.current.submitForm();
          }}
          setKmFinal={controller.setKmFinal}
          setKmInicial={controller.setKmInicial}
        />
      </Styles.Container>
    </>
  );
};

export default TelaColetaResponsavel;

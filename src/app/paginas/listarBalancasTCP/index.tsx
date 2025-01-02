import * as React from 'react';
import * as Styles from './styles';
import Controller from './controller';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';
import Cabecalho from '../../componentes/cabecalho';
import { SemConteudo } from 'vision-common';
import { BottomSheetTextInput, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DropDownOptions from '../../componentes/dropdownOptions';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from 'styled-components/native';
import Botao from '../../componentes/botao';

const TelaListaBalancasTCP: IScreenAuth<AuthRoutes.ListaBalancasTCP> = ({ navigation, route }) => {
  const { border } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo="Balanças" temIconeDireita nomeIconeDireita="plus" onPressIconeDireita={controller.onPressNovaBalanca} />
      <Styles.Container>
        {controller.balancas.length > 0 ? (
          <Styles.ScrollContainer keyboardShouldPersistTaps="always">
            {controller.balancas.map((item, index) => (
              <Styles.ItemBalancaContainer activeOpacity={0.5} onPress={() => controller.onPressEditarBalanca(item)} key={index}>
                {!!item?.codigoBalancaController && (
                  <Styles.ItemBalancaSincronizadoContainer>
                    <Styles.ItemBalancaSincronizadoTexto>Controller</Styles.ItemBalancaSincronizadoTexto>
                  </Styles.ItemBalancaSincronizadoContainer>
                )}
                <Styles.ItemBalancaTexto>{`${String(item?.tipoConexao ?? '') === '0' ? 'TCP Client' : 'Bluetooth'} - ${
                  item.descricaoBalanca
                }`}</Styles.ItemBalancaTexto>
              </Styles.ItemBalancaContainer>
            ))}
          </Styles.ScrollContainer>
        ) : (
          <Styles.SemConteudoContainer>
            <SemConteudo nomeIcone="bar-chart" texto="Nenhuma balança encontrada" onPress={controller.pegarBalancas} />
          </Styles.SemConteudoContainer>
        )}
        <BottomSheetModal
          ref={controller.bottomSheetRef}
          index={0}
          enablePanDownToClose={true}
          enableDismissOnClose={true}
          snapPoints={controller.snapPoints}
          style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
          <BottomSheetScrollView>
            <Styles.TituloSheetContainer>
              <Styles.Titulo>{controller.balanca?.codigo ? 'Editar Balança' : 'Cadastrar Balança'}</Styles.Titulo>
              <FeatherIcon name="x" size={26} onPress={controller.handleClosePress} />
            </Styles.TituloSheetContainer>

            <Styles.Label>Tipo da Conexão</Styles.Label>
            <DropDownOptions
              hasBorder
              value={controller.balanca.tipoConexao?.toString()}
              defaultValue={String(controller.balanca?.tipoConexao ?? '0')}
              placeholder="Tipo da Conexão"
              marginBottom={10}
              disabled={!!controller.balanca?.codigoBalancaController}
              onChange={(item: any) => controller.handleTipoConexaoChanges(item)}
              items={controller.tiposConexao}
            />

            {String(controller.balanca?.tipoConexao ?? '') !== '' && (
              <>
                <Styles.Label>Balança</Styles.Label>
                <DropDownOptions
                  hasBorder
                  marginBottom={10}
                  defaultValue={controller.tiposBalanca[0].value}
                  value={String(controller.tiposBalanca[0].label ?? '')}
                  disabled={!!controller.balanca?.codigoBalancaController}
                  placeholder="Selecione a balança"
                  onChange={(item: any) => controller.handleTipoBalancaChanges(item)}
                  items={controller.tiposBalanca}
                />
                <Styles.Label>Nome da Balança</Styles.Label>
                <BottomSheetTextInput
                  style={{ padding: 10, borderWidth: 1, borderRadius: 5, borderColor: border.color }}
                  value={String(controller.balanca?.descricaoBalanca ?? '')}
                  placeholder="Nome da balança"
                  autoComplete="off"
                  maxLength={255}
                  autoCorrect={false}
                  editable={!controller.balanca?.codigoBalancaController}
                  onChangeText={controller.handleDescricaoBalancaChanges}
                />
                <Styles.Row>
                  {String(controller?.balanca?.tipoConexao ?? '') === '0' && (
                    <>
                      <Styles.InputContainer width={70} paddingRight={5}>
                        <Styles.Label>IP</Styles.Label>
                        <BottomSheetTextInput
                          style={{ padding: 10, borderWidth: 1, borderRadius: 5, borderColor: border.color }}
                          value={String(controller.balanca?.tcpIP ?? '')}
                          maxLength={25}
                          editable={!controller.balanca?.codigoBalancaController}
                          onChangeText={controller.handleIpChanges}
                        />
                        {!controller.ehIpValido && !!controller.balanca?.tcpIP?.length && (
                          <Styles.Error>Ip inválido.</Styles.Error>
                        )}
                      </Styles.InputContainer>
                      <Styles.InputContainer width={30} paddingLeft={5}>
                        <Styles.Label>Porta</Styles.Label>
                        <BottomSheetTextInput
                          style={{ padding: 10, borderWidth: 1, borderRadius: 5, borderColor: border.color }}
                          value={String(controller?.balanca?.tcpPorta ?? '')}
                          maxLength={5}
                          editable={!controller.balanca?.codigoBalancaController}
                          keyboardType="numeric"
                          onChangeText={controller.handlePortaChanges}
                        />
                      </Styles.InputContainer>
                    </>
                  )}
                  {String(controller?.balanca?.tipoConexao ?? '') === '1' && (
                    <Styles.InputContainer>
                      <Styles.Label>Mac Address</Styles.Label>
                      <BottomSheetTextInput
                        style={{ padding: 10, borderWidth: 1, borderRadius: 5, borderColor: border.color }}
                        value={String(controller.balanca?.bluetoothMacAddress ?? '')}
                        placeholder="Informe o endereço de conexão bluetooth"
                        maxLength={50}
                        editable={!controller.balanca?.codigoBalancaController}
                        onChangeText={controller.handleMacAddressBalancaChanges}
                      />
                    </Styles.InputContainer>
                  )}
                </Styles.Row>
                <Styles.BotoesContainer>
                  {controller.balanca?.codigo && !route.params.ehEdicao && (
                    <>
                      <Botao
                        disable={!controller.ehValido}
                        texto="Selecionar"
                        backgroundColor="green"
                        onPress={controller.selecionarBalanca}
                      />
                      <Styles.Spacer />
                    </>
                  )}
                  {controller.balanca?.codigo && !controller.balanca?.codigoBalancaController && (
                    <Botao disable={!controller.ehValido} texto="Salvar" onPress={controller.editarBalanca} />
                  )}
                  {!controller.balanca?.codigo && (
                    <Botao disable={!controller.ehValido} texto="Cadastrar" onPress={controller.cadastrarBalanca} />
                  )}
                  {controller.balanca?.codigo && !controller.balanca?.codigoBalancaController && (
                    <>
                      <Styles.Spacer />
                      <Botao texto="Excluir" backgroundColor="red" onPress={controller.deletarBalanca} />
                    </>
                  )}
                </Styles.BotoesContainer>
              </>
            )}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </Styles.Container>
    </>
  );
};

export default TelaListaBalancasTCP;

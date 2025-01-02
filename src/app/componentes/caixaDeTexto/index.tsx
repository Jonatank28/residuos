import * as React from 'react';
import * as Styles from './styles';
import { KeyboardTypeOptions } from 'react-native';
import { useTheme } from 'styled-components/native';
import Controller from './controller';

const CaixaDeTexto: React.FC<Props> = (props) => {
  const { text, icon } = useTheme();
  const controller = Controller(props.nome);

  return (
    <>
      <Styles.Container
        editavel={props?.editavel ?? true}
        temErro={!!controller.error}
        borderLeftUp={props.raioBordaEsquerdaCima ?? 5}
        borderRightUp={props.raioBordaDireitaCima ?? 5}
        borderLeftDown={props.raioBordaEsquerdaBaixo ?? 5}
        borderRightDown={props.raioBordaDireitaBaixo ?? 5}
        marginTop={props.margemCima ?? 0}
        marginBottom={props.margemBaixo ?? 0}
        marginRight={props.margemDireita ?? 0}
        marginLeft={props.margemEsquerda ?? 0}
        backgroundColor={props.backgroundColor}
      >
        {props.temIcone

          && (
            <Styles.FeatherIcone
              name={props.nomeIcone ?? 'alert-circle'}
              size={props.tamanhoIcone ?? 20}
              color={props.corIcone ?? icon.color}
            />
          )}
        <Styles.Input
          ref={controller.inputRef}
          defaultValue={controller.defaultValue}
          value={props.value}
          autoCapitalize={props.captalize}
          maxLength={props.tamanhoMaximo}
          underlineColorAndroid="transparent"
          editable={props.editavel ?? true}
          onChangeText={(text: string) => {
            if (controller.inputRef.current) {
              if (props.mask) {
                props.onChangedMask(controller.handleMask(text, props.mask));
              }

              if (props.returnText) {
                props.onChangedMask(text);
              }

              controller.inputRef.current.value = text;
            }
          }}
          placeholder={props.placeholderNome}
          placeholderTextColor={props.placeholderCor ?? text.input.placeholderColor}
          keyboardType={props.tipoTeclado ?? 'default'}
          secureTextEntry={props.temSenha}
          autoCorrect={props.autoCorrect ?? false}
        />
      </Styles.Container>
      {props.hasForm
        && (
          <Styles.ErroFormContainer>
            <Styles.ErroFormTexto>{controller.error ?? ''}</Styles.ErroFormTexto>
          </Styles.ErroFormContainer>
        )}
    </>
  );
};

type Props = {
  nome: string;
  hasForm?: boolean;
  returnText?: boolean;
  backgroundColor?: string;
  mask?: 'cep' | 'phone' | 'cpf' | 'cnpj' | 'rg' | 'ie' | 'cpfcnpj';
  tamanhoMaximo?: number;
  onChangedMask?: any;
  captalize?: 'none' | 'sentences' | 'words' | 'characters';
  temIcone: boolean;
  temSenha: boolean;
  placeholderNome?: string;
  value?: string;
  editavel?: boolean;
  placeholderCor?: string;
  tipoTeclado?: KeyboardTypeOptions;
  autoCorrect?: boolean;
  nomeIcone?: string;
  corIcone?: string;
  tamanhoIcone?: number;
  raioBordaEsquerdaCima?: number;
  raioBordaDireitaCima?: number;
  raioBordaEsquerdaBaixo?: number;
  raioBordaDireitaBaixo?: number;
  margemDireita?: number;
  margemEsquerda?: number;
  margemCima?: number;
  margemBaixo?: number;
}

export default CaixaDeTexto;

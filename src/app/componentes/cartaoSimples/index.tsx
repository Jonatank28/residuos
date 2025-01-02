import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';
import { GestureResponderEvent } from 'react-native';

const CartaoSimples: React.FC<Props> = (props) => {
  const { text } = useTheme();

  return (
    <Styles.Container
      marginTop={props?.marginTop ?? 0}
      marginBottom={props?.marginBottom ?? 0}
      marginLeft={props?.marginLeft ?? 0}
      hasBorder={props?.hasBorder}
      marginRight={props?.marginRight ?? 0}
      backgroundColor={props.backgroundColor && props.backgroundColor?.length > 0
        ? props.backgroundColor
        : undefined}
      onPress={props.onPress}
      activeOpacity={props.onPress ? props.naoTemIcone ? 1 : 0.6 : 1}
    >
      <Styles.DescricaoContainer>
        <Styles.Descricao
          cor={props.corTexto}
        >
          {props?.descricao ?? ''}
        </Styles.Descricao>
      </Styles.DescricaoContainer>
      {!props.naoTemIcone && (
        <Styles.IconContainer>
          <Styles.FeatherIcone
            name={props.nomeIcone ?? 'alert-circle'}
            size={props.tamanhoIcone ?? 25}
            color={props.corIcone ?? text.headline.color}
          />
        </Styles.IconContainer>
      )}
    </Styles.Container>
  );
};

type Props = {
  descricao?: string;
  nomeIcone?: string;
  corIcone?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  tamanhoIcone?: number;
  backgroundColor?: string;
  corTexto?: string;
  naoTemIcone?: boolean;
  hasBorder?: boolean;
  onPress?: () => void;
}

export default CartaoSimples;

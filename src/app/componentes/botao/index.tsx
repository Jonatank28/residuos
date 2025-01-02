import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';
import CustomActiveIndicator from '../customActiveIndicator';

const Botao: React.FC<Props> = (props) => {
  const { colors } = useTheme();

  return (
    <Styles.Container
      hasBorder={props?.hasBorder}
      disabled={props.disable}
      onPress={(props?.isLoading || props?.disable) ? undefined : props.onPress}
      activeOpacity={(props?.isLoading || !props.onPress || props?.disable) ? 1 : 0.5}
      backgroundColor={props.backgroundColor}
    >
      {props?.isLoading ? (
        <CustomActiveIndicator
          color={colors.white}
        />
      ) : (
        <>
          {props?.hasIcon && (
            <Styles.FeatherIcone
              name={props.iconName ?? 'alert-circle'}
              size={props.iconSize ?? 25}
              color={props.iconColor ?? colors.white}
            />
          )}
          <Styles.TextoBotao textColor={props.corTexto}>{props.texto ?? ''}</Styles.TextoBotao>
        </>
      )}
    </Styles.Container>
  );
}

type Props = {
  texto: string;
  corTexto?: string;
  hasIcon?: boolean;
  iconName?: string;
  iconSize?: number;
  disable?: boolean;
  iconColor?: string;
  backgroundColor?: string;
  isLoading?: boolean;
  hasBorder?: boolean;
  onPress?: () => void;
}

export default Botao;

import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';

const CustomActiveIndicator: React.FC<Props> = (props) => {
  const { primary } = useTheme();

  return (
    <Styles.Container
      color={props?.color ?? primary}
      children={undefined}
      size={props?.size ?? undefined}
    />
  )
}

type Props = {
  color?: string;
  size?: number;
};

export default CustomActiveIndicator;
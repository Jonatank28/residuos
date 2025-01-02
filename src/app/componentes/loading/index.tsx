import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';
import { useLoading } from '../../contextos/loadingContexto';
import CustomActiveIndicator from '../customActiveIndicator';
import { BackHandler } from 'react-native';

const Loading: React.FC<Props> = (props) => {
  const { colors } = useTheme();
  const { loadingState } = useLoading();

  React.useEffect(() => {
    const backAction = () => true;
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  } , [loadingState]);

  return (
    <>
      {typeof loadingState?.open === 'boolean' && loadingState?.open && (
        <Styles.Container>
          <CustomActiveIndicator
            size={35}
            color={colors.green}
          />
        </Styles.Container>
      )}
    </>
  );
};

type Props = {}

export default Loading;

import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { useTheme } from 'styled-components/native';
import { useStorage } from '../../contextos/storageContexto';

const BloqueioAlert: React.FC<Props> = () => {
  const { icon } = useTheme();
  const { hasSpace } = useStorage();

  return (
    <Styles.Modal
      visible={!hasSpace}
      transparent
      animationType="fade"
    >
      <Styles.FundoModal>
        <Styles.Container>
          <Styles.TituloContainer>
            <Styles.Titulo>{I18n.t('alerts.attention')}</Styles.Titulo>
          </Styles.TituloContainer>
          <Styles.DescricaoContainer>
            <Styles.ScrollContainer>
              <Styles.Description>{I18n.t('exceptions.customs.lockSpaceMessage')}</Styles.Description>
            </Styles.ScrollContainer>
          </Styles.DescricaoContainer>
          <Styles.IconContainer>
            <Styles.FeatherIcone
              name="tool"
              size={30}
              color={icon.color}
            />
          </Styles.IconContainer>
        </Styles.Container>
      </Styles.FundoModal>
    </Styles.Modal>
  );
};

type Props = {}

export default BloqueioAlert;

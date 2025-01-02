import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { formatarData } from 'vision-common';
import { useTheme } from 'styled-components/native';

const CartaoEquipamento: React.FC<Props> = props => {
  const { primary, colors } = useTheme();

  return (
    <Styles.Container>
      {Boolean(props?.xEtapaPendente) && (
        <Styles.EtapaContainer>
          <Styles.EtapaTexto>Etapas Internas Pendentes</Styles.EtapaTexto>
        </Styles.EtapaContainer>
      )}
      <Styles.RowContainer paddingTop={props?.xEtapaPendente ? 10 : 0}>
        <Styles.Titulo>{props.titulo ?? ''}</Styles.Titulo>
      </Styles.RowContainer>
      <Styles.DetalhesContainer>
        <Styles.RowContainer>
          <Styles.Descricao>{I18n.t('components.equipmentCard.placementDate')}</Styles.Descricao>
          <Styles.Descricao>{formatarData(props.dataColocacao, 'DD/MM/YYYY') ?? ''}</Styles.Descricao>
        </Styles.RowContainer>
        <Styles.RowContainer>
          <Styles.Descricao>{I18n.t('components.equipmentCard.driveCode')}</Styles.Descricao>
          <Styles.Descricao>{props.codMovimentacao ?? '-'}</Styles.Descricao>
        </Styles.RowContainer>
      </Styles.DetalhesContainer>
      <Styles.RowContainer>
        <Styles.SubstituirContainer activeOpacity={0.5} onPress={props.onPressSubstituir}>
          <Styles.OpcoesTexto color={primary}>{I18n.t('components.equipmentCard.replace')}</Styles.OpcoesTexto>
        </Styles.SubstituirContainer>
        <Styles.RetirarContainer activeOpacity={0.5} onPress={props.onPressRetirar}>
          <Styles.OpcoesTexto color={colors.accent}>{I18n.t('components.equipmentCard.remove')}</Styles.OpcoesTexto>
        </Styles.RetirarContainer>
      </Styles.RowContainer>
    </Styles.Container>
  );
};

type Props = {
  titulo?: string;
  dataColocacao?: Date;
  dataRetirada?: Date;
  xEtapaPendente?: boolean;
  codMovimentacao?: number | string;
  onPressSubstituir?: () => void;
  onPressRetirar?: () => void;
};


// @ts-ignore
export default React.memo(CartaoEquipamento, (props: Props, nextProps: Props) => {
  return (
    props.titulo === nextProps.titulo &&
    props.dataColocacao === nextProps.dataColocacao &&
    props.dataRetirada === nextProps.dataRetirada &&
    props.xEtapaPendente === nextProps.xEtapaPendente &&
    props.codMovimentacao === nextProps.codMovimentacao
  );
});

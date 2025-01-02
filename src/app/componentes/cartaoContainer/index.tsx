import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { formatarData } from 'vision-common';

const CartaoContainer: React.FC<Props> = (props) => (
  <Styles.Container>
    <Styles.TituloContainer>
      <Styles.Titulo>{props.titulo ?? ''}</Styles.Titulo>
    </Styles.TituloContainer>
    <Styles.DetalhesContainer>
      <Styles.RowContainer>
        <Styles.Descricao>{I18n.t('components.containerCard.placementDate')}</Styles.Descricao>
        <Styles.Descricao>{formatarData(props.dataColocacao, 'DD/MM/YYYY') ?? ''}</Styles.Descricao>
      </Styles.RowContainer>
      <Styles.RowContainer>
        <Styles.Descricao>{I18n.t('components.containerCard.withdrawalDate')}</Styles.Descricao>
        <Styles.Descricao>{formatarData(props.dataRetirada, 'DD/MM/YYYY') ?? ''}</Styles.Descricao>
      </Styles.RowContainer>
      <Styles.RowContainer>
        <Styles.Descricao>{I18n.t('components.containerCard.driveCode')}</Styles.Descricao>
        <Styles.Descricao>{props.codMovimentacao ?? ''}</Styles.Descricao>
      </Styles.RowContainer>
    </Styles.DetalhesContainer>
  </Styles.Container>
);

type Props = {
  titulo?: string;
  dataColocacao?: Date;
  dataRetirada?: Date;
  codMovimentacao?: number;
}

export default CartaoContainer;

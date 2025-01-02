import * as React from 'react';
import * as Styles from './styles';
import { GestureResponderEvent } from 'react-native';
import { IEquipamento } from '../../../core/domain/entities/equipamento';

const CartaoEquipamentoLocal: React.FC<Props> = (props) => (
  <Styles.Container
    marginTop={props.margemCima ?? 0}
    marginBottom={props.margemBaixo ?? 0}
    marginRight={props.margemDireita ?? 0}
    marginLeft={props.margemEsquerda ?? 0}
    activeOpacity={0.5}
    backgroundColor={props.backgroundColor}
    onPress={props.onPressCard}
  >
    <Styles.TituloContainer>
      <Styles.Titulo>
        {`${props.showIdentificacao
          ? props.equipamento?.identificacao ?? ''
          : props.equipamento?.codigoContainer ?? ''} - ${props.equipamento?.descricaoContainer ?? ''}`}
      </Styles.Titulo>
    </Styles.TituloContainer>
    <Styles.DescricaoContainer>
      <Styles.Descricao>{props.equipamento?.codigoMovimentacao ?? ''}</Styles.Descricao>
    </Styles.DescricaoContainer>
  </Styles.Container>
);

type Props = {
  equipamento: IEquipamento;
  margemDireita?: number;
  margemEsquerda?: number;
  margemCima?: number;
  margemBaixo?: number;
  showIdentificacao?: boolean;
  backgroundColor?: string;
  onPressCard?: () => void;
}

export default CartaoEquipamentoLocal;

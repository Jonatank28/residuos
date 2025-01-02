import * as React from 'react';
import * as Styles from './styles';
import { IResiduo } from '../../../core/domain/entities/residuo';
import { Text, View } from 'react-native';
import { FeatherIcone } from '../cabecalho/styles';

const CartaoResiduoLocal: React.FC<Props> = (props) => (
  <Styles.Container
    marginTop={props.margemCima ?? 0}
    marginBottom={props.margemBaixo ?? 0}
    marginRight={props.margemDireita ?? 0}
    marginLeft={props.margemEsquerda ?? 0}
    backgroundColor={props.backgroundColor}
    activeOpacity={0.5}
    hasBorder={props.hasBorder}
    onPress={props.onPressCard}
  >
    <Styles.TituloContainer>
      <Styles.Titulo>{`${props.residuo?.codigo ?? ''} - ${props.residuo?.descricao ?? ''}`}</Styles.Titulo>
      {props.temIconeDireita && (
        <View style={{ paddingLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <FeatherIcone
            name='image'
            size={25}
          />
        </View>
      )}
      {props.residuo.fotos && props.residuo.fotos?.length > 0 && (
        <Text style={{ fontSize: 10 }}>
          {props.residuo.fotos?.length}
        </Text>
      )}

    </Styles.TituloContainer>
    <Styles.DescricaoContainer>
      <Styles.Descricao>{`${props.residuo?.quantidade ?? 0}  (${props.residuo?.unidade ?? ''})`}</Styles.Descricao>
    </Styles.DescricaoContainer>
  </Styles.Container>
);

type Props = {
  residuo: IResiduo;
  margemDireita?: number;
  margemEsquerda?: number;
  margemCima?: number;
  margemBaixo?: number;
  hasBorder?: boolean;
  backgroundColor?: string;
  onPressCard?: () => void;
  temIconeDireita: boolean;
}

export default CartaoResiduoLocal;

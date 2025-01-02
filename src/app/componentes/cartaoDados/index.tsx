import * as React from 'react';
import * as Styles from './styles';

const CartaoDados = (props: Props) => (
  <Styles.Container>
    <Styles.Titulo>{props?.titulo ?? ''}</Styles.Titulo>
    <Styles.Descricao>{props?.descricao ?? ''}</Styles.Descricao>
  </Styles.Container>
);

type Props = {
  titulo?: string;
  descricao?: string | number;
}

export default CartaoDados;

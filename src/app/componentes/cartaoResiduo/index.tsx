import I18n from 'i18n-js';
import * as React from 'react';
import * as Styles from './styles';
import { capitalize, formatterCurrency } from 'vision-common';
import { useTheme } from 'styled-components/native';
import { IResiduo } from '../../../core/domain/entities/residuo';
import Decimal from 'decimal.js';

const CartaoResiduo: React.FC<Props> = props => {
  const { secundary, colors } = useTheme();

  const contarCasasDecimais = (numeroStr: string): number => {
    return props.numeroCasasDecimais ?? 2;
    //lide com esse comentário cleitão
    // if (!numeroStr) return 0;

    // let partes: string[] = [];

    // if (numeroStr.includes('.')) {
    //   partes = numeroStr.split('.');
    // } else {
    //   partes = numeroStr.split(',');
    // }

    // if (partes.length > 1) {
    //   return partes[1].length;
    // }

    // return 0;
  };

  const calculaPesoExcesso = () => {
    const cubagemString = String(props.residuo?.cubagem ?? 0);
    const pesoBrutoString = String(props.residuo?.pesoBruto ?? 0);
    const taraString = String(props.residuo.tara ?? 0);
    const casasDecimais = contarCasasDecimais(pesoBrutoString);

    const cubagem = new Decimal(cubagemString.replace(',', '.'));
    const pesoBruto = new Decimal(pesoBrutoString.replace(',', '.'));
    const tara = new Decimal(taraString.replace(',', '.'));

    const pesoLiquido = pesoBruto.minus(tara).abs();

    if (pesoLiquido.isNaN()) return new Decimal(0);

    if (pesoLiquido.gt(cubagem)) {
      const excesso = cubagem.minus(pesoLiquido).abs();

      if (casasDecimais > 0) {
        return excesso.toFixed(casasDecimais);
      }

      return excesso;
    }

    return 0;
  };

  const calculaPesoLiquido = () => {
    const pesoBrutoString = String(props.residuo?.pesoBruto ?? 0);
    const taraString = String(props.residuo.tara ?? 0);
    const casasDecimais = contarCasasDecimais(pesoBrutoString);

    const pesoBruto = new Decimal(pesoBrutoString.replace(',', '.'));
    const tara = new Decimal(taraString.replace(',', '.'));
    const pesoLiquido = pesoBruto.minus(tara).abs();

    if (pesoLiquido.isNaN()) return new Decimal(0);

    if (casasDecimais > 0) {
      return pesoLiquido.toFixed(casasDecimais);
    }

    return pesoLiquido;
  };

  const calculaPesoBruto = () => {
    const pesoBrutoString = String(props.residuo?.pesoBruto ?? 0);
    const pesoBruto = new Decimal(pesoBrutoString.replace(',', '.'));
    const casasDecimais = contarCasasDecimais(pesoBrutoString);

    if (casasDecimais > 0) {
      return pesoBruto.toFixed(casasDecimais);
    }

    return pesoBruto;
  };

  const calculaTara = () => {
    const pesoTaraString = String(props.residuo?.tara ?? 0);
    const casasDecimais = contarCasasDecimais(pesoTaraString);
    const tara = new Decimal(pesoTaraString.replace(',', '.'));

    if (casasDecimais > 0) {
      return tara.toFixed(casasDecimais);
    }

    return tara;
  };

  const calcularValorOS = () => {
    let valorTotal = 0;

    if (props.residuo.quantidade) {
      valorTotal +=
        Number(props.residuo?.valorUnitario ?? 0) * Number(String(props.residuo?.quantidade ?? '').replace(',', '.') ?? 0);
    }

    return valorTotal;
  };

  return (
    <Styles.Container
      pointerEvents={props.hasLoading ? 'none' : 'auto'}
      backgroundColor={props.residuo?.cor && props.residuo?.cor?.length > 0 ? props.residuo.cor : undefined}
      marginTop={props?.margemCima}
      marginBottom={props?.margemBaixo}
      marginRight={props?.margemDireita}
      marginLeft={props?.margemEsquerda}>
      <Styles.ColumnContainer activeOpacity={0.5} onPress={props.onPressCard !== undefined ? props.onPressCard : () => null}>
        <Styles.TituloContainer>
          <Styles.Titulo hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>{`${props.residuo?.codigo ?? ''
            } - ${props?.residuo?.descricao ?? ''}`}</Styles.Titulo>
        </Styles.TituloContainer>
        <Styles.DescricaoContainer>
          <Styles.Descricao hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>
            {I18n.t('components.residueCard.amount', {
              amount: props?.residuo?.quantidade ?? '',
              UN: props?.residuo?.unidade ?? '',
            })}
          </Styles.Descricao>
          <Styles.Descricao hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>
            {capitalize(props?.residuo?.subGrupo ?? '')}
          </Styles.Descricao>
          {props.mostrarPesoBruto && (
            <>
              <Styles.PesoBrutoContainer>
                <Styles.Descricao hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>
                  {'Excesso: ' + calculaPesoExcesso()}
                </Styles.Descricao>
                <Styles.Descricao hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>
                  {'Tara: ' + calculaTara()}
                </Styles.Descricao>
              </Styles.PesoBrutoContainer>
              <Styles.PesoBrutoContainer>
                <Styles.Descricao hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>
                  {'Peso Bruto: ' + calculaPesoBruto()}
                </Styles.Descricao>
                <Styles.Descricao hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>
                  {'Peso Líquido: ' + calculaPesoLiquido()}
                </Styles.Descricao>
              </Styles.PesoBrutoContainer>
            </>
          )}
          {props?.showValores && (
            <>
              <Styles.Descricao hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>
                {'Valor Unitário: ' + formatterCurrency(props.residuo?.valorUnitario ?? 0, { prefix: 'R$ ', precision: 2 })}
              </Styles.Descricao>
              <Styles.Descricao hasBackgroundColor={!!(props.residuo?.cor && props.residuo?.cor?.length > 0)}>
                {'Valor Total: ' + formatterCurrency(calcularValorOS(), { prefix: 'R$ ', precision: 2 })}
              </Styles.Descricao>
            </>
          )}
        </Styles.DescricaoContainer>
      </Styles.ColumnContainer>
      {!props.showDeletar &&
        props.hasQuantidadeContainer &&
        !props.mostrarPesoBruto &&
        !props?.residuo?.preCadastroReferencia && (
          <Styles.EditarQuantidadeContainer>
            <Styles.InputContainer>
              <Styles.DiminuirQuantidadeContainer activeOpacity={0.5} onPress={props.onPressDiminuirQuantidade}>
                <Styles.FeatherIcone name="minus" color={secundary} size={15} />
              </Styles.DiminuirQuantidadeContainer>
              <Styles.EditarInput
                color={
                  props?.residuo?.xExigeInteiro && String(props?.residuo?.quantidade ?? '').indexOf(',') !== -1
                    ? colors.accent
                    : undefined
                }
                keyboardType={props?.residuo?.xExigeInteiro ? 'numeric' : 'decimal-pad'}
                onBlur={props.onBlur}
                maxLength={10}
                onFocus={props.onFocus}
                onChangeText={props.onChangeQuantidade}
                value={String(props.residuo?.quantidade ?? '')}
              />
              <Styles.UnidadeEditarContainer>
                <Styles.Descricao>{props.residuo?.unidade ?? ''}</Styles.Descricao>
              </Styles.UnidadeEditarContainer>
              <Styles.AdicionarQuantidadeContainer activeOpacity={0.5} onPress={props.onPressAdicionarQuantidade}>
                <Styles.FeatherIcone name="plus" color={secundary} size={15} />
              </Styles.AdicionarQuantidadeContainer>
            </Styles.InputContainer>
          </Styles.EditarQuantidadeContainer>
        )}
      {props.podeExcluirResiduo && props.showDeletar && !props.hasLoading && (
        <Styles.DeletarContainer
          activeOpacity={0.5}
          onPress={props.onPressDelete !== undefined ? props.onPressDelete : () => null}>
          <Styles.FeatherIcone name="trash" size={20} color={secundary} />
        </Styles.DeletarContainer>
      )}
      {props.hasDuplicad && (
        <Styles.HasDuplicadoContainer>
          <Styles.DuplicadoTexto>{I18n.t('components.residueCard.double')}</Styles.DuplicadoTexto>
        </Styles.HasDuplicadoContainer>
      )}
    </Styles.Container>
  );
};

type Props = {
  residuo: IResiduo;
  hasLoading?: boolean;
  margemDireita?: number;
  margemEsquerda?: number;
  margemCima?: number;
  margemBaixo?: number;
  showDeletar?: boolean;
  mostrarPesoBruto?: boolean;
  showValores?: boolean;
  podeExcluirResiduo: boolean;
  hasQuantidadeContainer: boolean;
  hasDuplicad?: boolean;
  numeroCasasDecimais?: number;
  onPressDelete?: () => void;
  onPressCard?: () => void;
  onChangeQuantidade?: (quantidade: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onPressAdicionarQuantidade: () => void;
  onPressDiminuirQuantidade: () => void;
};

export default CartaoResiduo;
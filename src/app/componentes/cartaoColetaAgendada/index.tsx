import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { useTheme } from 'styled-components/native';
import { capitalize, formatarData, formatarHora } from 'vision-common';
import { IEndereco } from '../../../core/domain/entities/endereco';

const CartaoColetaAgendada: React.FC<Props> = props => {
  const { icon, colors, primary } = useTheme();

  const enderecoFormatado = React.useMemo(() => {
    if (props.endereco) {
      return `${capitalize(props?.endereco?.rua ?? '')}, ${props.endereco.numero ?? 'SN'}${
        props.endereco.letra ? ` - ${capitalize(props.endereco.letra)}` : ''
      }${props.endereco.bairro ? ` - ${capitalize(props.endereco.bairro)}` : ''}${
        props.endereco.complemento ? ` - ${capitalize(props.endereco.complemento)}` : ''
      }, ${capitalize(props.endereco?.cidade ?? '')} - ${String(props.endereco?.uf ?? '').toUpperCase()}`;
    }

    return '';
  }, [props.endereco]);

  return (
    <Styles.Container activeOpacity={props.onPress ? 0.5 : 1} onPress={props.onPress}>
      {String(props?.periodicidade ?? '').length > 0 && (
        <Styles.PeriodicidadeContainer>
          <Styles.PeriodicidadeTexto numberOfLines={1}>{props?.periodicidade ?? ''}</Styles.PeriodicidadeTexto>
        </Styles.PeriodicidadeContainer>
      )}
      <Styles.StatusContainer />
      <Styles.ConteudoContainer>
        <Styles.RowContainer marginBottom={2}>
          <Styles.ImageContainer>
            <Styles.Image
              source={
                props?.status === 1
                  ? require('../../assets/imagens/caminhaoverde.png')
                  : require('../../assets/imagens/caminhaoamarelo.png')
              }
            />
          </Styles.ImageContainer>
          <Styles.TituloContainer>
            <Styles.Titulo color={props.status === 1 ? primary : colors.orange}>
              {props.status === 1 ? I18n.t('components.collectCard.collect') : I18n.t('components.collectCard.delivery')}
            </Styles.Titulo>
            <Styles.TextoRowContainer>
              <Styles.OSTexto>{I18n.t('components.collectCard.OS')}</Styles.OSTexto>
              <Styles.Titulo color={props.status === 1 ? primary : colors.orange}>
                {props.codigoOS !== 0 ? props.codigoOS : ''}
              </Styles.Titulo>
            </Styles.TextoRowContainer>
          </Styles.TituloContainer>
          <Styles.DataContainer>
            <Styles.Titulo>{formatarData(props.dataOS, 'DD/MM/YYYY') ?? ''}</Styles.Titulo>
            <Styles.HoraTexto>{props.dataOS ? formatarHora(props.dataOS, 'HH:mm') : ''}</Styles.HoraTexto>
          </Styles.DataContainer>
        </Styles.RowContainer>
        <Styles.ColumnContainer>
          <Styles.DescricaoTextoContainer>
            <Styles.DescricaoTexto>
              <Styles.DescricaoTextoTitulo>{I18n.t('components.collectCard.reason')}</Styles.DescricaoTextoTitulo>
              {String(props?.nomeCliente ?? '').toUpperCase()}
            </Styles.DescricaoTexto>
          </Styles.DescricaoTextoContainer>
          <Styles.DescricaoTextoContainer>
            <Styles.DescricaoTexto>
              <Styles.DescricaoTextoTitulo>{I18n.t('components.collectCard.fantasia')}</Styles.DescricaoTextoTitulo>
              {String(props?.nomeFantasiaCliente ?? '').toUpperCase()}
            </Styles.DescricaoTexto>
          </Styles.DescricaoTextoContainer>
          {String(props?.obra ?? '').trim() !== '' && (
            <Styles.DescricaoTextoContainer>
              <Styles.DescricaoTexto>
                <Styles.DescricaoTextoTitulo>{I18n.t('components.collectCard.work')}</Styles.DescricaoTextoTitulo>
                {String(props?.obra ?? '').toUpperCase()}
              </Styles.DescricaoTexto>
            </Styles.DescricaoTextoContainer>
          )}
        </Styles.ColumnContainer>
        <Styles.RowContainer
          isBottom
          marginTop={0}
          marginBottom={props?.codigoRoteirizacao !== 0 && String(props?.codigoRoteirizacao ?? '').length > 0 ? 0 : 5}
          justifyContent="flex-end">
          <Styles.EnderecoContainer>
            <Styles.DescricaoTexto>
              <Styles.DescricaoTextoTitulo>{I18n.t('components.collectCard.address')}</Styles.DescricaoTextoTitulo>
              {enderecoFormatado}
            </Styles.DescricaoTexto>
          </Styles.EnderecoContainer>
          <Styles.OpcoesContainer>
            {props?.localizacaoOS === String(props?.codigoOS ?? '') && (
              <Styles.OpcaoContainer activeOpacity={0.8} backgroundColor={colors.accent} onPress={props.onPressIconeLocalizacao}>
                <Styles.FeatherIcone name="x" size={15} />
              </Styles.OpcaoContainer>
            )}
            {!props?.localizacaoOS && (
              <Styles.OpcaoContainer activeOpacity={0.8} backgroundColor={colors.green} onPress={props.onPressIconeLocalizacao}>
                <Styles.FeatherIcone name="map-pin" size={15} />
              </Styles.OpcaoContainer>
            )}
            {String(props?.observacaoOS ?? '').trim() !== '' && (
              <Styles.OpcaoContainer activeOpacity={0.8} backgroundColor={icon.color} onPress={props.onPressIconeObservacao}>
                <Styles.FeatherIcone name="file" size={15} />
              </Styles.OpcaoContainer>
            )}
            {String(props?.referenteOS ?? '').trim() !== '' && (
              <Styles.OpcaoContainer activeOpacity={0.8} onPress={props.onPressIconeReferente}>
                <Styles.FeatherIcone name="clipboard" size={15} />
              </Styles.OpcaoContainer>
            )}
          </Styles.OpcoesContainer>
        </Styles.RowContainer>
        {props?.codigoRoteirizacao !== 0 &&
          String(props?.codigoRoteirizacao ?? '').length > 0 &&
          props?.codigoPonto !== 0 &&
          String(props?.codigoPonto ?? '').length > 0 && (
            <Styles.RoteirizacaoContainer>
              <Styles.RoteirizacaoTexto>
                {I18n.t('components.collectCard.scripting', {
                  code: props.codigoRoteirizacao ?? '',
                  point: props.codigoPonto ?? '',
                })}
              </Styles.RoteirizacaoTexto>
            </Styles.RoteirizacaoContainer>
          )}
      </Styles.ConteudoContainer>
    </Styles.Container>
  );
};

type Props = {
  codigoOS?: number;
  codigoRoteirizacao?: number;
  codigoPonto?: number;
  dataOS?: Date;
  nomeCliente?: string;
  nomeFantasiaCliente?: string;
  obra?: string;
  periodicidade?: string;
  endereco?: IEndereco;
  status?: number;
  observacaoOS?: string;
  osPendente?: string;
  osPendenteOK?: boolean;
  referenteOS?: string;
  localizacaoOS?: string;
  onPress?: () => void;
  onPressIconeObservacao?: () => void;
  onPressIconeReferente?: () => void;
  onPressIconeLocalizacao?: () => void;
};

// @ts-ignore
export default React.memo(CartaoColetaAgendada, (props: Props, nextProps: Props) => {
  if (props.codigoOS === nextProps.codigoOS) {
    return true;
  }
});

import * as React from 'react';
import * as Styles from './styles';
import { Button, GestureResponderEvent, Text, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  capitalize, formatarData, formatarHora,
} from 'vision-common';
import I18n from 'i18n-js';
import { IEndereco } from '../../../core/domain/entities/endereco';
import Controller from './controller';
import Cores from '../../styles/colors';
import { useSincronizacaoContexto } from '../../contextos/sincronizacaoContexto';

const CartaoColeta: React.FC<Props> = (props) => {
  const { StatusCores } = Cores();
  const { icon, colors } = useTheme();
  const controller = Controller(props.endereco, props.status, props.isHistory, props.isOffline);
  const { enviarDados } = useSincronizacaoContexto();

  const handleClickRenviar = async () => {
    try {
      const response = await enviarDados();
      if (response) {
        if (props.alteraStatusOS) {
          await props.alteraStatusOS();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Styles.Container
      isDetails={props.isDetails ?? false}
      activeOpacity={props.onPress ? 0.6 : 1}
      onPress={props.onPress}
    >
      <Styles.StatusContainer
        hasBorder={!props.isHistory}
        backgroundColor={controller.statusStyle.color}
      />
      <Styles.ConteudoContainer>
        <Styles.RowContainer
          marginBottom={2}
        >
          <Styles.ImageContainer
            width={props.isList ? 32 : undefined}
            height={props.isList ? 32 : undefined}
          >

            <Styles.Image
              source={props.status === 1 || props.status === 3
                ? require('../../assets/imagens/caminhaoverde.png')
                : props.status === 4 || props.status === 5
                  ? require('../../assets/imagens/caminhaovermelho.png')
                  : require('../../assets/imagens/caminhaoamarelo.png')}
            />
          </Styles.ImageContainer>
          <Styles.TituloContainer>
            <Styles.Titulo
              fontSize={props.isList ? 12 : undefined}
              color={props.status === 3 || props.isOffline
                ? props.status === 1 || props.status === 3
                  ? StatusCores.coleta
                  : StatusCores.entrega : controller.statusStyle.color}
            >
              {props.status === 1
                ? I18n.t('components.collectCard.collect').toUpperCase()
                : props.codigoOS === 0 && props.status === 3
                  ? I18n.t('components.collectCard.collect').toUpperCase()
                  : props.status === 5
                    ? I18n.t('components.collectCard.excluded').toUpperCase()
                    : I18n.t('components.collectCard.delivery').toUpperCase()
              }
            </Styles.Titulo>
            <Styles.TextoRowContainer>
              <Styles.OSTexto
                fontSize={props.isList ? 12 : undefined}
              >
                {props.isHistory && props.codigoOS === 0
                  ? I18n.t('components.collectCard.mobileOrigin').toUpperCase()
                  : I18n.t('components.collectCard.OS')}
              </Styles.OSTexto>
              <Styles.Titulo
                fontSize={props.isList ? 12 : undefined}
                color={props.status === 3 || props.isOffline
                  ? props.status === 1 || props.status === 3
                    ? StatusCores.coleta
                    : StatusCores.entrega : controller.statusStyle.color}
              >
                {props.codigoOS !== 0 ? props.codigoOS : ''}
              </Styles.Titulo>
            </Styles.TextoRowContainer>
          </Styles.TituloContainer>
          <Styles.DataContainer>
            <Styles.Titulo fontSize={props.isList ? 12 : undefined}>{formatarData(props.dataOS, 'DD/MM/YYYY') ?? ''}</Styles.Titulo>
            <Styles.HoraTexto fontSize={props.isList ? 12 : undefined}>{props.dataOS ? formatarHora(props.dataOS, 'HH:mm') : ''}</Styles.HoraTexto>
          </Styles.DataContainer>
        </Styles.RowContainer>
        {!props.isDetails && (
          <>
            <Styles.ColumnContainer>
              <Styles.DescricaoTextoContainer>
                <Styles.DescricaoTexto>
                  <Styles.DescricaoTextoTitulo>{I18n.t('components.collectCard.reason')}</Styles.DescricaoTextoTitulo>
                  {` ${props.isList ? String(props?.nomeCliente ?? '').toUpperCase() : capitalize(props?.nomeCliente ?? '')}`}
                </Styles.DescricaoTexto>
              </Styles.DescricaoTextoContainer>
              <Styles.DescricaoTextoContainer>
                <Styles.DescricaoTexto>
                  <Styles.DescricaoTextoTitulo>{I18n.t('components.collectCard.fantasia')}</Styles.DescricaoTextoTitulo>
                  {` ${props.isList && props?.nomeFantasiaCliente ? props.nomeFantasiaCliente.toUpperCase() : capitalize(props?.nomeFantasiaCliente ?? '')}`}
                </Styles.DescricaoTexto>
              </Styles.DescricaoTextoContainer>
              {String(props?.obra ?? '').trim() !== '' && (
                <Styles.DescricaoTextoContainer>
                  <Styles.DescricaoTexto>
                    <Styles.DescricaoTextoTitulo>{I18n.t('components.collectCard.work')}</Styles.DescricaoTextoTitulo>
                    {` ${props.isList ? String(props?.obra ?? '').toUpperCase() : capitalize(props?.obra ?? '')}`}
                  </Styles.DescricaoTexto>
                </Styles.DescricaoTextoContainer>
              )}
              {(props.osPendente !== '' && props.osPendente) && (
                <Styles.DescricaoPendenteContainer>
                  <Styles.DescricaoPendente>{I18n.t('components.collectCard.osPendingShow', { os: props.osPendente ?? '' })}</Styles.DescricaoPendente>
                </Styles.DescricaoPendenteContainer>
              )}
              {props.osPendenteOK && (
                <Styles.DescricaoPendenteContainer>
                  <Styles.DescricaoPendente color={StatusCores.coleta}>{I18n.t('components.collectCard.osOK')}</Styles.DescricaoPendente>
                </Styles.DescricaoPendenteContainer>
              )}
            </Styles.ColumnContainer>
            <Styles.RowContainer
              isBottom
              marginTop={0}
              marginBottom={(props?.codigoRoteirizacao !== 0 && String(props?.codigoRoteirizacao ?? '').length > 0) ? 0 : 5}
              justifyContent="flex-end"
            >
              <Styles.EnderecoContainer>
                <Styles.DescricaoTexto>
                  <Styles.DescricaoTextoTitulo>{I18n.t('components.collectCard.address')}</Styles.DescricaoTextoTitulo>
                  {` ${props.isList
                    ? controller.enderecoFormatado.toUpperCase()
                    : controller.enderecoFormatado ?? ''}`}
                </Styles.DescricaoTexto>
              </Styles.EnderecoContainer>
              <Styles.OpcoesContainer>
                {props?.localizacaoOS === props?.codigoOS?.toString() && (
                  <Styles.OpcaoContainer
                    activeOpacity={0.8}
                    backgroundColor={colors.accent}
                    onPress={props.onPressIconeLocalizacao}
                  >
                    <Styles.FeatherIcone
                      name="x"
                      size={15}
                    />
                  </Styles.OpcaoContainer>
                )}
                {!props?.localizacaoOS && !props?.isHistory && (
                  <Styles.OpcaoContainer
                    activeOpacity={0.8}
                    backgroundColor={colors.green}
                    onPress={props.onPressIconeLocalizacao}
                  >
                    <Styles.FeatherIcone
                      name="map-pin"
                      size={15}
                    />
                  </Styles.OpcaoContainer>
                )}
                {(String(props?.observacaoOS ?? '').trim() !== '') && (
                  <Styles.OpcaoContainer
                    activeOpacity={0.8}
                    backgroundColor={icon.color}
                    onPress={props.onPressIconeObservacao}
                  >
                    <Styles.FeatherIcone
                      name="file"
                      size={15}
                    />
                  </Styles.OpcaoContainer>
                )}
                {(String(props?.referenteOS ?? '').trim() !== '') && (
                  <Styles.OpcaoContainer
                    activeOpacity={0.8}
                    onPress={props.onPressIconeReferente}
                  >
                    <Styles.FeatherIcone
                      name="clipboard"
                      size={15}
                    />
                  </Styles.OpcaoContainer>
                )}
              </Styles.OpcoesContainer>

            </Styles.RowContainer>

            {props.isHistory && (
              <Styles.StatusTextoContainer >

                <View>
                  {(props.status === 3 || props.isOffline) && (
                    <Button title='Reinviar' color="#3cc86c" onPress={handleClickRenviar} />
                  )}
                </View>

                <Styles.Titulo
                  color={controller.statusStyle.color}
                >
                  {props.status === 3 || props.isOffline
                    ? I18n.t('components.collectCard.pendingOS')
                    : props.status === 4 || props.status === 5
                      ? props.status === 4 ? I18n.t('components.collectCard.osCancel') : I18n.t('components.collectCard.osDeleted')
                      : I18n.t('components.collectCard.sentOS')}
                </Styles.Titulo>
              </Styles.StatusTextoContainer>
            )}

          </>
        )}
        {(props?.codigoRoteirizacao !== 0 && String(props?.codigoRoteirizacao ?? '').length > 0) && (props?.codigoPonto !== 0 && String(props?.codigoPonto ?? '').length > 0) && (
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
  isDetails: boolean;
  isHistory?: boolean;
  isList?: boolean;
  codigoOS?: number;
  codigoRoteirizacao?: number;
  codigoPonto?: number;
  dataOS?: Date;
  nomeCliente?: string;
  nomeFantasiaCliente?: string;
  obra?: string;
  endereco?: IEndereco;
  isOffline?: boolean;
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
  alteraStatusOS?: () => void;
}

// @ts-ignore
export default React.memo(CartaoColeta, (props: Props, nextProps: Props) => {
  if (props.codigoOS === nextProps.codigoOS) {
    return true;
  }
});

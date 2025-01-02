import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';
import { useOffline } from '../../contextos/offilineContexto';
import Controller from './controller';

const Cabecalho: React.FC<Props> = props => {
  const { offline } = useOffline();
  const { colors } = useTheme();
  const controller = Controller();

  return (
    <>
      <Styles.Container hasBorderBottom={props.temBordaAbaixo ?? false} background={props.corFundo}>
        <Styles.BotaoEsquerdoContainer
          activeOpacity={0.5}
          onPress={props.onPressIconeEsquerda !== undefined ? props.onPressIconeEsquerda : () => controller.validateGoBack()}>
          {!props.naoTemIconeEsquerda && (
            <Styles.FeatherIcone
              name={props.nomeIconeEsquerda ?? 'arrow-left'}
              size={props.tamanhoIconeEsquerda ?? 25}
              color={props.corIconeEsquerda ?? colors.white}
            />
          )}
        </Styles.BotaoEsquerdoContainer>
        {props.titulo && (
          <Styles.TituloContainer>
            <Styles.Titulo>{props.titulo ?? ''}</Styles.Titulo>
          </Styles.TituloContainer>
        )}
        <Styles.BotaoDireitoContainer>
          {props.temIconeDireita &&
            (props.nomeIconeDireita === 'qrcode' ? (
              <Styles.AwesomeIcone
                disabled={props.desabilitarIconeDireita}
                name={props.nomeIconeDireita ?? 'alert-circle'}
                size={props.tamanhoIconeDireita ?? 25}
                color={props.corIconeDireita ?? colors.white}
                onPress={props.onPressIconeDireita}
              />
            ) : (
              <Styles.FeatherIcone
                disabled={!!props?.disableIconeDireita}
                name={props.nomeIconeDireita ?? 'alert-circle'}
                size={props.tamanhoIconeDireita ?? 25}
                color={props.corIconeDireita ?? colors.white}
                onPress={props.onPressIconeDireita}
              />
            ))}
        </Styles.BotaoDireitoContainer>
      </Styles.Container>
      {offline && <Styles.OfflineContainer />}
    </>
  );
};

type Props = {
  temBadge?: boolean;
  quantidadeBadge?: number;
  temIconeDireita: boolean;
  naoTemIconeEsquerda?: boolean;
  temBordaAbaixo?: boolean;
  corFundo?: string;
  titulo?: string | number;
  nomeIconeEsquerda?: string;
  corIconeEsquerda?: string;
  tamanhoIconeEsquerda?: number;
  nomeIconeDireita?: string;
  corIconeDireita?: string;
  tamanhoIconeDireita?: number;
  tamanhoTitulo?: number;
  alinhamentoTitulo?: string;
  onPressIconeEsquerda?: any;
  onPressIconeDireita?: any;
  disableIconeDireita?: boolean;
  desabilitarIconeDireita?: boolean;
};

export default Cabecalho;

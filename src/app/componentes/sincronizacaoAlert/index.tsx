import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { useTheme } from 'styled-components/native';

const SincronizacaoAlert = (props: Props) => {
  const { primary } = useTheme();

  return (
    <>
      <Styles.Modal
        transparent
        animationType="fade"
        visible={props.active}
      >
        <Styles.FundoModal>
          <Styles.Container>
            <Styles.TituloContainer>
              <Styles.Titulo>{I18n.t('updates.title')}</Styles.Titulo>
            </Styles.TituloContainer>
            <Styles.DescricaoContainer>
              {props.progress.progress !== 0 && props.progress.progress !== 1 && !props.progress.hasError
                ? (
                  <>
                    <Styles.TextoBarraProgresso>{props.progress.message}</Styles.TextoBarraProgresso>
                    <Styles.BarraProgresso
                      progress={props.progress.progress}
                      children={undefined}
                      color={primary}
                    />
                  </>
                ) : (
                  props.progress.progress === 1
                    ? <Styles.Description>{props.progress.message}</Styles.Description>
                    : <Styles.TextoErro>{props.progress.message}</Styles.TextoErro>
                )}
            </Styles.DescricaoContainer>
            <Styles.BotoesContainer>
              {props.progress.progress === 0 && (
                <Styles.BotaoCacelar
                  onPress={props.closeModal}
                >
                  <Styles.TextoBotoes>
                    {props.progress.hasError
                      ? I18n.t('updates.buttons.no')
                      : I18n.t('updates.buttons.later')}
                  </Styles.TextoBotoes>
                </Styles.BotaoCacelar>
              )}
              <Styles.BotaoConfirmar
                activeOpacity={(props.progress.progress !== 0) ? 1 : 0.5}
                onPress={props.progress.progress !== 0
                  ? props.progress.progress === 1
                    ? props.closeModal
                    : () => null
                  : props.progress.hasError
                    ? props.onPressAgain
                    : props.onPressConfirm}
              >
                <Styles.TextoBotoes>
                  {props.progress.progress !== 0
                    ? props.progress.progress === 1 && !props.progress.hasError
                      ? 'Ok'
                      : 'Aguarde, não fechar o aplicativo'
                    : props.progress.hasError
                      ? 'Tentar novamente'
                      : 'Sim'}
                </Styles.TextoBotoes>
              </Styles.BotaoConfirmar>
            </Styles.BotoesContainer>
          </Styles.Container>
        </Styles.FundoModal>
      </Styles.Modal>
    </>
  );
};

type Props = {
  active: boolean;
  progress: { message: string, progress: number; showConfirm?: boolean; hasError?: boolean };
  closeModal: () => void;
  onPressConfirm: () => void;
  onPressAgain: () => void;
}

export default SincronizacaoAlert;

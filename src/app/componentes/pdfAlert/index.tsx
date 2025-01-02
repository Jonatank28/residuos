import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import { useTheme } from 'styled-components/native';
import Controller from './controller';

export const OrientacaoUsoPdfAlert = (props: Props) => {
  const { primary } = useTheme();
  const controller = Controller();

  React.useEffect(() => {
    (async () => {
      if (controller.hasDownloaded && props.onFinished) {
        await controller.abrirPdf();
        props.onFinished();
      }
    })()
  }, [controller.hasDownloaded]);

  return (
    <>
      <Styles.Modal
        visible={props.isActived}
        transparent
        animationType="fade"
      >
        <Styles.FundoModal>
          <Styles.Container>
            <Styles.TituloContainer>
              <Styles.Titulo>{I18n.t('usageTips.title')}</Styles.Titulo>
            </Styles.TituloContainer>
            <Styles.DescricaoContainer>
              {controller.downloading
                ? (
                  <>
                    <Styles.TextoBarraProgresso>{I18n.t('usageTips.subTitle')}</Styles.TextoBarraProgresso>
                    <Styles.BarraProgresso
                      progress={controller.progress}
                      children={undefined}
                      color={props.progressColor ?? primary}
                    />
                  </>
                ) : (
                  <Styles.Description>
                    {controller.hasErrorDownloaded
                      ? I18n.t('usageTips.downloadError')
                      : controller.hasDownloaded
                        ? I18n.t('usageTips.messageSuccess')
                        : I18n.t('usageTips.message')}
                  </Styles.Description>
                )}
            </Styles.DescricaoContainer>
            <Styles.BotoesContainer>
              {!controller.downloading && !controller.hasDownloaded && (
                <Styles.BotaoCacelar
                  onPress={props.onFinished}
                >
                  <Styles.TextoBotoes>
                    {controller.hasErrorDownloaded
                      ? I18n.t('usageTips.buttons.no')
                      : I18n.t('usageTips.buttons.later')}
                  </Styles.TextoBotoes>
                </Styles.BotaoCacelar>
              )}
              <Styles.BotaoConfirmar
                activeOpacity={controller.downloading ? 1 : 0.5}
                onPress={(controller.downloading || controller.hasDownloaded
                  ? controller.hasDownloaded
                    ? async () => {
                      await controller.abrirPdf();

                      if (props.onFinished)
                        props.onFinished();
                    }
                    : () => null
                  : () => controller.baixarPDF())}

              >
                <Styles.TextoBotoes>
                  {controller.downloading || controller.hasDownloaded
                    ? controller.hasDownloaded
                      ? I18n.t('usageTips.buttons.ok')
                      : I18n.t('usageTips.buttons.wait')
                    : controller.hasErrorDownloaded
                      ? I18n.t('usageTips.buttons.downloadAgain')
                      : I18n.t('usageTips.buttons.download')}
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
  progressColor?: string;
  isActived: boolean;
  onFinished?: () => void;
}

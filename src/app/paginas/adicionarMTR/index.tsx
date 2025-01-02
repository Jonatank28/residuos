import * as React from 'react';
import * as Styles from './styles';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { formatarData, formatarHora, ItemContainer, timezoneDate } from 'vision-common';
import I18n from 'i18n-js';
import { Platform } from 'react-native';
import Cabecalho from '../../componentes/cabecalho';
import Botao from '../../componentes/botao';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';

const TelaAdicionarMtr: IScreenAuth<AuthRoutes.AdicionarMTR> = ({ navigation, route }) => {
  const { icon, text, secundary, primary } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.addMtr.title')} temIconeDireita={false} />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <ItemContainer hasIcon={false} marginBottom={10} title={I18n.t('screens.addMtr.mtr')}>
            <Styles.Input
              autoCorrect
              keyboardType="number-pad"
              placeholderTextColor={text.input.placeholderColor}
              value={controller?.numeroMtr ?? ''}
              placeholder={I18n.t('screens.addMtr.mtrInfo')}
              onChangeText={text => controller.setNumeroMtr(text)}
              maxLength={100}
            />
          </ItemContainer>
          <ItemContainer hasIcon={false} marginBottom={10} title={I18n.t('screens.addMtr.mtrQR')}>
            <Styles.MTRContainer>
              <Styles.InputContainer>
                <Styles.Input
                  editable={false}
                  keyboardType="number-pad"
                  placeholder={I18n.t('screens.addMtr.mtrQRPlaceholder')}
                  value={controller?.numeroMtrCodBarras ?? ''}
                  onChangeText={text => controller.setNumeroMtrCodBarras(text)}
                />
              </Styles.InputContainer>
              <Styles.IconContainer activeOpacity={0.5} onPress={controller.irParaCodidoBarras}>
                <Styles.AwesomeIcone name="barcode" size={30} color={secundary} />
              </Styles.IconContainer>
            </Styles.MTRContainer>
          </ItemContainer>
          <ItemContainer hasIcon={false} title={I18n.t('screens.addMtr.mtrDate')}>
            <Styles.DataHoraContainer>
              <Styles.DataContainer activeOpacity={0.5} onPress={controller.showDatepicker}>
                <Styles.DataIconContainer>
                  <Styles.FeatherIcone name="calendar" size={20} color={icon.color} />
                  <Styles.TextoDataContainer>
                    <Styles.TextoData>{formatarData(timezoneDate(controller.dataMtr), 'DD/MM/YYYY')}</Styles.TextoData>
                  </Styles.TextoDataContainer>
                </Styles.DataIconContainer>
              </Styles.DataContainer>
              <Styles.HoraContainer activeOpacity={0.5} onPress={controller.showTimepicker}>
                <Styles.DataIconContainer>
                  <Styles.FeatherIcone name="calendar" size={20} color={icon.color} />
                  <Styles.TextoDataContainer>
                    <Styles.TextoData>{formatarHora(timezoneDate(controller.dataMtr), 'HH:mm')}</Styles.TextoData>
                  </Styles.TextoDataContainer>
                </Styles.DataIconContainer>
              </Styles.HoraContainer>
            </Styles.DataHoraContainer>
          </ItemContainer>

          <Styles.BotaoContainer>
            <Botao
              texto={I18n.t('screens.addMtr.add')}
              backgroundColor={primary}
              corTexto={secundary}
              onPress={controller.navigateTo}
            />
          </Styles.BotaoContainer>
        </Styles.ScrollContainer>
      </Styles.Container>
      {controller.show && (
        <Styles.DatePickerContainer>
          {Platform.OS === 'ios' && (
            <Styles.HideDatapicker onPress={() => controller.setShow(false)}>
              <Styles.TextoDatapicker>{I18n.t('screens.addMtr.calendarButton')}</Styles.TextoDatapicker>
            </Styles.HideDatapicker>
          )}
          <Styles.DatePicker
            testID="dateTimePicker"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            // @ts-ignore
            confirmBtnText={I18n.t('alerts.confirm')}
            cancelBtnText={I18n.t('alerts.cancel')}
            onCancel={() => controller.setShow(false)}
            textColor={text.body1.color}
            value={controller.dataMtr}
            // @ts-ignore
            mode={controller.mode}
            is24Hour
            onChange={controller.onChange}
          />
        </Styles.DatePickerContainer>
      )}
    </>
  );
};

export default TelaAdicionarMtr;

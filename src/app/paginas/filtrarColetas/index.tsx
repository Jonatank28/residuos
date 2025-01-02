import I18n from 'i18n-js';
import * as React from 'react';
import * as Styles from './styles';
import { Platform } from 'react-native';
import moment from 'moment';
import { useTheme } from 'styled-components/native';
import { formatarData, ItemContainer } from 'vision-common';
import Botao from '../../componentes/botao';
import Cabecalho from '../../componentes/cabecalho';
import CartaoSimples from '../../componentes/cartaoSimples';
import DropDownOptions from '../../componentes/dropdownOptions';
import { AuthRoutes } from '../../routes/routes';
import Controller from './controller';
import { IScreenAuth } from '../../routes/types';

const TelaFiltrarColetas: IScreenAuth<AuthRoutes.FiltrarColetas> = ({ navigation, route }) => {
  const { secundary, text, card } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.collectFilter.title')}
        temIconeDireita
        nomeIconeDireita="qrcode"
        onPressIconeDireita={controller.navigateToQRCode}
      />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          <ItemContainer title={I18n.t('screens.collectFilter.filters')}>
            <Styles.ItemsContainer>
              <CartaoSimples
                hasBorder
                naoTemIcone={!!(controller?.obra?.codigo && !controller?.cliente?.codigo)}
                descricao={
                  controller?.cliente?.nomeFantasia === '' || (controller?.obra?.codigo && !controller?.cliente?.codigo)
                    ? '-'
                    : controller?.cliente?.nomeFantasia ?? I18n.t('screens.collectFilter.selectClient')
                }
                nomeIcone="chevron-right"
                marginBottom={10}
                onPress={controller?.obra?.codigo && !controller?.cliente?.codigo ? undefined : controller.navigateToClientes}
              />
              <CartaoSimples
                hasBorder
                descricao={
                  controller?.obra?.descricao === ''
                    ? '-'
                    : controller?.obra?.descricao ?? I18n.t('screens.collectFilter.selectWork')
                }
                nomeIcone="chevron-right"
                marginBottom={10}
                onPress={controller.navigateToObras}
              />
              <DropDownOptions
                marginBottom={10}
                hasBorder
                value={controller.roterizacao ?? ''}
                placeholder={I18n.t('screens.collectFilter.scripting.allScripted')}
                onChange={item => controller.setRoterizacao(item)}
                items={controller.roterizacoes}
              />
              <DropDownOptions
                marginBottom={10}
                value={controller.classificacao ?? ''}
                hasBorder
                placeholder={I18n.t('screens.collectFilter.classification.title')}
                onChange={item => controller.setClassificacao(item)}
                items={controller.classificacoes}
              />
              <DropDownOptions
                marginBottom={10}
                hasBorder
                value={String(controller?.rota ?? '')}
                placeholder={I18n.t('screens.collectFilter.allRoutes')}
                onChange={item => controller.setRota(Number(item))}
                items={controller.rotas}
              />
              <Styles.RowContainer>
                <Styles.DataContainer onPress={controller.showDatepicker}>
                  <Styles.TextoData>
                    {controller.data && controller.data !== null
                      ? formatarData(controller.data, 'DD/MM/YYYY')
                      : I18n.t('screens.collectFilter.filterByDate')}
                  </Styles.TextoData>
                </Styles.DataContainer>
              </Styles.RowContainer>
              <Styles.BotaoContainer>
                <Botao
                  hasBorder
                  texto={I18n.t('screens.collectFilter.clean')}
                  corTexto={text.headline.color}
                  backgroundColor={card.background}
                  onPress={controller.limparFiltros}
                />
                <Styles.Spacer />
                <Botao texto={I18n.t('screens.collectFilter.filter')} corTexto={secundary} onPress={() => controller.filtrar()} />
              </Styles.BotaoContainer>
            </Styles.ItemsContainer>
          </ItemContainer>
        </Styles.ScrollContainer>
        {controller.show && (
          <Styles.DatePickerContainer>
            {Platform.OS === 'ios' && (
              <Styles.HideDatapicker onPress={() => controller.setShow(false)}>
                <Styles.TextoDatapicker>{I18n.t('screens.collectFilter.calendarButton')}</Styles.TextoDatapicker>
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
              value={moment.parseZone(controller?.data ?? new Date()).toDate()}
              // @ts-ignore
              mode={controller.mode}
              is24Hour
              onChange={controller.onChange}
            />
          </Styles.DatePickerContainer>
        )}
      </Styles.Container>
    </>
  );
};

export default TelaFiltrarColetas;

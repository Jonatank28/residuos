import React from 'react';
import { IScreenAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import Controller from './Controller';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Cabecalho from '../../../componentes/cabecalho';
import { formatarData, formatarHora, ItemContainer, timezoneDate } from 'vision-common';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from 'styled-components';
import Botao from '../../../componentes/botao';
import CartaoSimples from '../../../componentes/cartaoSimples';

const TelaAdicionarParadas: IScreenAuth<AuthRoutes.AdicionarParadas> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });
  const { icon, text, primary, secundary } = useTheme();

  return (
    <>
      <Cabecalho titulo={I18n.t('screens.addStops.title')} temIconeDireita={false} />
      <Styles.Container>
        <Styles.ScrollContainer>
          <ItemContainer hasIcon={false} title="Observaçao">
            <Styles.Input
              autoCorrect
              value={controller?.observacao ?? ''}
              onChangeText={text => controller.setObservacao(text)}
              maxLength={100}
            />
          </ItemContainer>
          {/* // Adicionar parada */}
          <Styles.Container>
            <Styles.NaoColetadoContainer>
              <CartaoSimples
                hasBorder
                descricao={I18n.t('screens.collectDetails.addstop')}
                nomeIcone="chevron-right"
                onPress={controller.navigateToAddCategory}
                marginBottom={10}
              />
            </Styles.NaoColetadoContainer>
          </Styles.Container>
          <ItemContainer hasIcon={false} title='Data e Hora Inicial'>
            <Styles.DataHoraContainer>
              <Styles.DataContainer activeOpacity={0.5} onPress={() => controller.showPicker('dataInicial')}>
                <Styles.DataIconContainer>
                  <Styles.FeatherIcone name="calendar" size={20} color={icon.color} />
                  <Styles.TextoDataContainer>
                    <Styles.TextoData>{formatarData(timezoneDate(new Date(controller.date.dataInicial)), 'DD/MM/YYYY')}</Styles.TextoData>
                  </Styles.TextoDataContainer>
                </Styles.DataIconContainer>
              </Styles.DataContainer>
              <Styles.HoraContainer activeOpacity={0.5} onPress={() => controller.showPicker('horaInicial')}>
                <Styles.DataIconContainer>
                  <Styles.FeatherIcone name="calendar" size={20} color={icon.color} />
                  <Styles.TextoDataContainer>
                    <Styles.TextoData>{formatarHora(timezoneDate(new Date(controller.hour.horaInicial)), 'HH:mm')}</Styles.TextoData>
                  </Styles.TextoDataContainer>
                </Styles.DataIconContainer>
              </Styles.HoraContainer>
            </Styles.DataHoraContainer>
          </ItemContainer>
          <ItemContainer hasIcon={false} title='Data e Hora Final'>
            <Styles.DataHoraContainer>
              <Styles.DataContainer activeOpacity={0.5} onPress={() => controller.showPicker('dataFinal')}>
                <Styles.DataIconContainer>
                  <Styles.FeatherIcone name="calendar" size={20} color={icon.color} />
                  <Styles.TextoDataContainer>
                    <Styles.TextoData>{formatarData(timezoneDate(new Date(controller.date.dataFinal)), 'DD/MM/YYYY')}</Styles.TextoData>
                  </Styles.TextoDataContainer>
                </Styles.DataIconContainer>
              </Styles.DataContainer>
              <Styles.HoraContainer activeOpacity={0.5} onPress={() => controller.showPicker('horaFinal')}>
                <Styles.DataIconContainer>
                  <Styles.FeatherIcone name="calendar" size={20} color={icon.color} />
                  <Styles.TextoDataContainer>
                    <Styles.TextoData>{formatarHora(timezoneDate(new Date(controller.hour.horaFinal)), 'HH:mm')}</Styles.TextoData>
                  </Styles.TextoDataContainer>
                </Styles.DataIconContainer>
              </Styles.HoraContainer>
            </Styles.DataHoraContainer>
          </ItemContainer>
          <Styles.BotaoContainer>
            <Botao
              texto='Adicionar'
              backgroundColor={primary}
              corTexto={secundary}
              onPress={controller.navigateTo}
            />
          </Styles.BotaoContainer>



          {controller.show && (
            <DateTimePicker
              value={new Date()}
              mode={controller.show === 'dataInicial' || controller.show === 'dataFinal' ? 'date' : 'time'}
              display="default"
              onChange={controller.onChange}
            />
          )}

        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
};

export default TelaAdicionarParadas;
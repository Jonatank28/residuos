import * as React from 'react';
import { useIsFocused } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Keyboard, Platform } from 'react-native';
import {
  useVSSnack, Orientation, timezoneDate,
} from 'vision-common';
import { IMtr } from '../../../core/domain/entities/mtr';
import { useUser } from '../../contextos/usuarioContexto';
import { AuthRoutes } from '../../routes/routes';
import { IControllerAuth } from '../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.AdicionarMTR> { }

export default function Controller({ navigation, params }: Props) {
  const isFocused = useIsFocused();
  const { dispatchSnack } = useVSSnack();
  const { configuracoes } = useUser();
  const [numeroMtr, setNumeroMtr] = React.useState<string>('');
  const [numeroMtrCodBarras, setNumeroMtrCodBarras] = React.useState<string>('');

  const [dataMinima] = React.useState(new Date());
  const [dataMtr, setDataMtr] = React.useState(dataMinima);
  const [mode, setMode] = React.useState<'date' | 'time' | 'datetime' | 'countdown'>('date');
  const [show, setShow] = React.useState(false);

  const onChange = (_event: any, selectedDate: any) => {
    const dataAtual = selectedDate || dataMtr;
    setShow(Platform.OS === 'ios');
    setDataMtr(dataAtual);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => showMode('date');

  const showTimepicker = () => showMode('time');

  React.useEffect(() => {
    (async () => {
      if (isFocused) {
        await Orientation.allowPortraitOnly();
      }
    })();
  }, [isFocused]);

  React.useEffect(() => {
    if (params.scanData && params.scanData.length > 0) {
      const valueClean = params.scanData ? params.scanData.replace(/[^0-9]/g, '') : '';

      if (valueClean) {
        setNumeroMtrCodBarras(valueClean);
        // Se não for do tipo estado ao escanear codigo de barrar preenche o numero do mtr com os 12 primeiros digitos 
        if (!params.estado?.codigo) {
          const numeroMtr = valueClean.substring(0, 12);
          setNumeroMtr(numeroMtr);
        }

      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.addMtr.lettersInfo'),
        });
      }
    }
  }, [params.scanData]);

  const navigateTo = () => {
    const numeroMtrClear = numeroMtr ? numeroMtr.replace(/[^0-9]/g, '') : '';
    const numeroCodBarrasMtrClear = numeroMtrCodBarras ? numeroMtrCodBarras.replace(/[^0-9]/g, '') : '';

    if (numeroMtrClear || (configuracoes?.obrigarInformarMtrOnline && params.estado?.codigo)) {
      const mtr: IMtr = {
        estado: params.estado,
        hasSinir: params.hasSinir,
        dataEmissao: timezoneDate(dataMtr),
        mtr: numeroMtrClear,
        mtrCodBarras: numeroCodBarrasMtrClear,
      };

      if (params.screen) {
        navigation.navigate<any>(params.screen, { mtr });
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.addMtr.screenError'),
        });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.addMtr.minMtr'),
      });
    }
  };

  const dimissKeyboard = () => Keyboard.dismiss();

  const irParaCodidoBarras = () => navigation.navigate(AuthRoutes.Scanner, {
    message: I18n.t('screens.addMtr.qrCodeMessage'),
    scanType: 'code39',
    screen: AuthRoutes.AdicionarMTR,
  });

  return {
    mode,
    show,
    dataMtr,
    numeroMtr,
    numeroMtrCodBarras,
    setNumeroMtrCodBarras,
    setShow,
    irParaCodidoBarras,
    dimissKeyboard,
    showDatepicker,
    setNumeroMtr,
    onChange,
    navigateTo,
    showTimepicker
  };
}

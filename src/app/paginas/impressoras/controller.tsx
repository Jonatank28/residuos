import * as React from "react";
import I18n from "i18n-js";
import { formatarDataHora, useVSSnack } from "vision-common";
import { BluetoothManager, BluetoothEscposPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
import { useUser } from "../../contextos/usuarioContexto";
import { IControllerAuth } from "../../routes/types";
import { AuthRoutes } from "../../routes/routes";
import { PermissionsAndroid, Platform } from "react-native";
import { DEVICE } from "../../../core/device/device";

interface IPrint {
  name?: string;
  address?: string;
}

interface Props extends IControllerAuth<AuthRoutes.Impressoras> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { usuario } = useUser();
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const [sendingData, setSendingData] = React.useState<boolean>(false);
  const [impressoras, setImpressoras] = React.useState<IPrint[]>([]);
  const [connectedDevice, setConnectedDevice] = React.useState<string>('');

  const removeAcento = (text: string) => {
    if (!text || text?.length === 0) return '';

    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  const montarOS = async () => {
    let OS = "";

    OS += I18n.t('screens.printers.print.OS', { OS: params.ordem?.codigoOS ?? '-' });
    OS += I18n.t('screens.printers.print.date', { date: formatarDataHora(params.ordem.dataOS, 'DD/MM/YY : HH:mm') });
    OS += I18n.t('screens.printers.print.client.title');
    OS += I18n.t('screens.printers.print.client.reason', { reason: removeAcento(params.ordem?.nomeCliente ?? '') });
    OS += I18n.t('screens.printers.print.client.cnpj', { cnpj: params.ordem?.CNPJCliente ?? '' });
    OS += I18n.t('screens.printers.print.client.contact', { contact: params.ordem?.telefoneCliente ?? '' });
    OS += I18n.t('screens.printers.print.client.responsible', { responsible: params.ordem?.nomeResponsavel ?? '' });
    OS += I18n.t('screens.printers.print.client.function', { function: params.ordem?.funcaoResponsavel ?? '' });
    OS += I18n.t('screens.printers.print.client.cpf', { cpf: params.ordem?.CPFCNPJResponsavel ?? '' });
    OS += I18n.t('screens.printers.print.driver.title');
    OS += I18n.t('screens.printers.print.driver.board', { board: params.ordem?.placa ?? '' });
    OS += I18n.t('screens.printers.print.driver.userName', { userName: usuario?.nome ?? '' });
    OS += I18n.t('screens.printers.print.residues.title');

    if (params.ordem?.residuos && params.ordem.residuos?.length > 0) {
      for await (const residuo of params.ordem.residuos) {
        OS += I18n.t('screens.printers.print.residues.description', { description: removeAcento(residuo?.descricao ?? '') })
        OS += I18n.t('screens.printers.print.residues.amount', { amount: residuo?.quantidade ?? '', unit: residuo?.unidade ?? '' });
      }
    } else {
      OS += I18n.t('screens.printers.print.residues.notFound');
    }

    OS += I18n.t('screens.printers.print.observations', { observations: removeAcento(params.ordem?.observacaoOS ?? '') });

    OS += "\n\n\n\r";

    return OS;
  }

  const verificarImpressoras = async () => {
    setLoadingData(true);

    try {
      const impressoras = await BluetoothManager.enableBluetooth();

      if (impressoras && impressoras?.length > 0) {
        const devices = [];
        for await (const device of impressoras) {
          devices.push(JSON.parse(device));
        }

        setImpressoras(devices);
      } else {
        setImpressoras([]);
      }
    } catch (e) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: I18n.t('screens.printers.exceptions.checkPrinters'),
      });
    }

    setLoadingData(false);
  }

  const verificarBluetooth = async () => {
    const isEnabled = await BluetoothManager.checkBluetoothEnabled();

    if (!isEnabled) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.printers.exceptions.activeBluetooth'),
      });

      navigation.goBack();
    } else {
      verificarImpressoras();
    }
  }

  const verificarImpressoraConectada = async () => {
    const response = await BluetoothManager.getConnectedDeviceAddress();

    setConnectedDevice(response as unknown as string ?? '');
  }

  const onSelectImpressora = async (impressora: IPrint) => {
    setSendingData(true);

    try {
      if (impressora.address) {
        await BluetoothManager.connect(impressora.address);
        const conteudo = await montarOS();

        await BluetoothEscposPrinter.printText(conteudo, {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 3,
          heigthtimes: 3,
          fonttype: 1,
        });
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.printers.exceptions.invalidPrint'),
        });
      }
    } catch (e) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.printers.exceptions.connectError', { name: impressora?.name ?? '' }),
      });
    }

    verificarImpressoraConectada();
    setSendingData(false);
  }

  React.useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && parseFloat(DEVICE.OS.VERSION) >= 12) {
        const isBluetoothConnected: any = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        ]);

        if (isBluetoothConnected &&
          (isBluetoothConnected['android.permission.BLUETOOTH_CONNECT'] !== 'granted' ||
            isBluetoothConnected['android.permission.BLUETOOTH_SCAN'] !== 'granted')) {

          dispatchSnack({
            type: 'open',
            alertType: 'info',
            message: I18n.t('screens.printers.exceptions.statusBluetooth')
          });

          navigation.goBack();
          return;
        }
      }

      await verificarBluetooth();
      await verificarImpressoraConectada();
    })();


    return () => { };
  }, []);

  return {
    impressoras,
    loadingData,
    sendingData,
    connectedDevice,
    onSelectImpressora
  }
}
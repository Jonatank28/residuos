import * as React from 'react';
import * as ExpoPrinter from 'expo-print';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { IOrder } from '../../../../core/domain/entities/order';
import { AuthRoutes } from '../../../routes/routes';
import { useUser } from '../../../contextos/usuarioContexto';
import { useLoading } from '../../../contextos/loadingContexto';
import { IMtr } from '../../../../core/domain/entities/mtr';
import { renderHTMLMTROS } from '../../../utils/Printer/mtrPrinter';
import { useColeta } from '../../../contextos/coletaContexto';
import { IControllerAuth } from '../../../routes/types';
import { useLocation } from '../../../contextos/localizacaoContexto';
import { IClienteCheckIn } from '../../../../core/domain/entities/clienteCheckIn';
import { IPhoto, timezoneDate, usePresenter, useVSAlert, useVSConnection, useVSSnack } from 'vision-common';
import { useStorage } from '../../../contextos/storageContexto';
import moment from 'moment';

interface Props extends IControllerAuth<AuthRoutes.DetalhesDaColetaLocal> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { dispatchAlert } = useVSAlert();
  const { dispatchLoading } = useLoading();
  const storageContext = useStorage();
  const { pegarPosicaoAtual, localizacao } = useLocation();
  const { usuario, configuracoes } = useUser();
  const { veiculo } = useColeta();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [foto, setFoto] = React.useState<IPhoto>({});
  const [coleta, setColeta] = React.useState<IOrder>({});
  const { connectionState } = useVSConnection();
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const [visivel, setVisivel] = React.useState<boolean>(false);
  const [checkinOS, setCheckinOS] = React.useState<IClienteCheckIn>();

  const diferencaFormatada = React.useMemo(() => {
    if (!checkinOS?.dataCheckIn || !checkinOS?.dataCheckOut) return '';

    const dataCheckin = moment.parseZone(checkinOS?.dataCheckIn);
    const dataCheckout = moment.parseZone(checkinOS?.dataCheckOut);
    const diferencaEmMilissegundos = dataCheckout.diff(dataCheckin);
    const diferencaMoment = moment.utc(diferencaEmMilissegundos);
    const diferencaFormatada = diferencaMoment.format('HH:mm:ss');

    return diferencaFormatada;
  }, [checkinOS]);


  const totalKM = React.useMemo(() => {

    if (!coleta.KMFinal || !coleta.KMInicial) return 0;

    return (coleta.KMFinal - coleta.KMInicial);

  }, [coleta.KMFinal])

  const pegarColetaOffline = async () => {
    const response = await presenter.pegarColetaOffline(params.codigoOS);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      response.isOffline = true;
      setColeta(response);
      await pegarCheckinPorCodigoOS(response?.codigoOS || 0);
    }
    setLoadingData(false);
  };

  const onPressResetarCheckin = () => pegarCheckinPorCodigoOS(coleta.codigoOS || 0);

  const onPressSalvarCheckin = async () => {
    if (!coleta?.codigoOS) {
      return dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'Código da OS é inválido',
      });
    }

    if (!checkinOS?.dataCheckOut) {
      return dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'Data do checkout é inválida',
      });
    }

    const dataCheckoutInvalida = moment(checkinOS.dataCheckOut).isBefore(coleta.dataOS);

    if (dataCheckoutInvalida)
      return dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'Data e hora do checkout precisa ser maior que entrada',
      });

    const response = await presenter.atualizarCheckoutOSPorCodigo(coleta.codigoOS, checkinOS.dataCheckOut, localizacao);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      await storageContext.gravarAuditoria({
        codigoRegistro: coleta.codigoOS,
        rotina: 'Alterar Data Checkout OS',
        descricao: `Foi alterado checkout da OS ${coleta.codigoOS} para: ${checkinOS.dataCheckOut}`,
        tipo: 'ATUALIZACAO_CHECKOUT_OS',
      });

      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: 'Data checkout atualizada com sucesso!',
      });
    }
  };

  const onPressFoto = (fotoSelecionada: IPhoto) => {
    if (fotoSelecionada?.base64) {
      setFoto(fotoSelecionada);
      setVisivel(!visivel);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectDetailsLocal.selectPhotoError'),
      });
    }
  };

  const calcularValorOS = () => {
    let valorTotal = 0;

    if (coleta?.residuos && coleta.residuos?.length > 0) {
      coleta.residuos.forEach(_residuo => {
        valorTotal += Number(_residuo?.valorUnitario ?? 0) * Number(String(_residuo?.quantidade ?? '').replace(',', '.') ?? 0);
      });
    }

    return valorTotal;
  };

  const verificarPDFGerado = async (mtr: IMtr) => {
    if (mtr?.base64MtrOnline && mtr.base64MtrOnline?.length > 0) {
      await ExpoPrinter.printAsync({
        uri: `data:application/pdf;base64,${mtr.base64MtrOnline}`,
      });
    } else {
      if (mtr?.estado && mtr.estado?.codigo) showGerarPDFAuxiliar(mtr.estado.codigo, String(mtr?.mtr ?? mtr?.mtrCodBarras));
    }
  };

  const gerarPDFAuxiliarMtr = async (destinadorID: number, codigoOS: number, clienteID: number, estadoID: number) => {
    const response = await presenter.gerarPDFAuxilarMtr({
      empresaID: coleta?.codigoEmpresa ?? 0,
      codigoVinculo: coleta?.codigoVinculo ?? '',
      destinadorID,
      codigoOS,
      clienteID,
      estadoID,
      obraID: coleta?.codigoObra ?? 0,
    });

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      return response;
    }
  };

  const showGerarPDFAuxiliar = (estadoMtrID: number, mtr: string) =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: I18n.t('screens.collectDetailsLocal.mtr.alertPDFAux'),
      onPressRight: async () => {
        dispatchLoading({ type: 'open' });

        if (coleta?.codigoCliente && coleta?.codigoDestinador) {
          const dadosAuxiliar = await gerarPDFAuxiliarMtr(
            coleta.codigoDestinador,
            coleta?.codigoOS ?? 0,
            coleta.codigoCliente,
            estadoMtrID,
          );

          if (dadosAuxiliar) {
            if (dadosAuxiliar?.residuos?.length !== coleta?.residuos?.length) {
              dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: I18n.t('screens.collectDetailsLocal.mtr.errors.residuesLength'),
              });
            } else if (dadosAuxiliar) {
              const htmlPDF = renderHTMLMTROS(dadosAuxiliar, veiculo?.placa ?? '', coleta?.codigoOS ?? 0, mtr);

              await ExpoPrinter.printAsync({
                html: htmlPDF,
              });
            }
          }
        } else {
          dispatchSnack({
            type: 'open',
            alertType: 'info',
            message: I18n.t('screens.collectDetailsLocal.mtr.errors.defaultError'),
          });
        }

        dispatchLoading({ type: 'close' });
      },
    });

  const showMtrGeradoAlert = () =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: I18n.t('screens.collectDetailsLocal.mtr.errors.downloadAlert'),
      onPressRight: async () => {
        dispatchLoading({ type: 'open' });

        if (connectionState) {
          if (!coleta.codigoOS || coleta?.codigoOS === 0) {
            await pegarMtrsGerados(coleta?.codigoVinculo ?? '');
          } else {
            await pegarMtrs(coleta?.codigoOS ?? 0);
          }
        } else {
          dispatchSnack({
            type: 'open',
            alertType: 'info',
            message: I18n.t('screens.collectDetailsLocal.mtr.errors.noConnection'),
          });
        }

        dispatchLoading({ type: 'close' });
      },
    });

  const pegarMtrsGerados = async (codigoVinculo: number | string) => {
    const response = await presenter.pegarMtrsGerados(codigoVinculo);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: I18n.t('screens.collectDetailsLocal.mtr.syncSuccess'),
      });

      await presenter.atualizarMtrsDevice(response, coleta);
      setColeta({ ...coleta, mtrs: response });
    }
  };

  const pegarMtrs = async (codigoOS: number) => {
    const response = await presenter.pegarMtrs(codigoOS);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: I18n.t('screens.collectDetailsLocal.mtr.syncSuccess'),
      });

      await presenter.atualizarMtrsDevice(response, coleta);
      setColeta({ ...coleta, mtrs: response });
    }
  };

  const pegarColeta = async () => {
    setLoadingData(true);
    const response = await presenter.pegarColeta(params.codigoOS, params.codigoCliente);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response && (response?.codigoOS || response?.codigoCliente)) {
      setColeta(response);
      await pegarCheckinPorCodigoOS(response?.codigoOS || 0);
    } else {
      await pegarColetaOffline();
    }

    setLoadingData(false);
  };

  const pegarCheckinPorCodigoOS = async (codigoOS: number) => {
    const response = await presenter.pegarCheckinPorCodigoOS(codigoOS);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      setCheckinOS(_ => ({ ...response, dataCheckOut: response?.dataCheckOut ?? timezoneDate(new Date()) }));
    }
  };

  const navigateToListaResiduos = () => navigation.navigate(AuthRoutes.ListaResiduosLocal, { residuos: coleta.residuos ?? [] });

  const navigateToListaEquipamentos = () =>
    navigation.navigate(AuthRoutes.ListaEquipamentosLocal, {
      equipamentos: coleta?.equipamentos ?? [],
      equipamentosRetirados: coleta?.equipamentosRetirados ?? [],
    });

  const navigateToCliente = () => {
    if (coleta.codigoCliente) {
      navigation.navigate(AuthRoutes.DetalhesDoCliente, { clienteID: coleta.codigoCliente });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectDetailsLocal.invalidClient'),
      });
    }
  };

  React.useEffect(() => {
    if ((params.codigoOS !== 0 || params.codigoCliente !== 0) && params.codigoOS !== null && params.codigoCliente !== null) {
      pegarColeta();
    } else if (params?.coleta && params.coleta?.codigoCliente) {
      setColeta(params.coleta);
      setLoadingData(false);
    }

    pegarPosicaoAtual();
  }, [params]);

  return {
    foto,
    coleta,
    visivel,
    configuracoes,
    loadingData,
    checkinOS,
    diferencaFormatada,
    totalKM,
    setVisivel,
    onPressFoto,
    onPressResetarCheckin,
    onPressSalvarCheckin,
    setCheckinOS,
    showMtrGeradoAlert,
    verificarPDFGerado,
    navigateToCliente,
    calcularValorOS,
    navigateToListaResiduos,
    navigateToListaEquipamentos,
  };
}

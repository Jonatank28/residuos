import * as React from 'react';
import { getConnection, somenteNumeros, timezoneDate, usePresenter, useVSAlert, useVSSnack } from 'vision-common';
import { Keyboard, Linking } from 'react-native';
import I18n from 'i18n-js';
import { IOrder } from '../../../../core/domain/entities/order';
import Presenter from './presenter';
import { optionsChecklist } from '../../../utils/enums';
import { verificaDiaChecklist } from '../../../utils/formatter';
import { useRascunho } from '../../../contextos/rascunhoContexto';
import { useUser } from '../../../contextos/usuarioContexto';
import { useOffline } from '../../../contextos/offilineContexto';
import { useStorage } from '../../../contextos/storageContexto';
import { AuthRoutes } from '../../../routes/routes';
import { useLocation } from '../../../contextos/localizacaoContexto';
import { IControllerAuth } from '../../../routes/types';
import { useCheckin } from '../../../contextos/checkinContexto';
import { IDeviceClienteRepositorio } from '../../../../core/domain/repositories/device/clienteRepositorio';
import DeviceClienteRepositorio from '../../../../core/device/repositories/clienteRepositorio';
import database from '../../../../core/database';
import { useColeta } from '../../../contextos/coletaContexto';

interface Props extends IControllerAuth<AuthRoutes.DetalhesDaColeta> { }

export default function Controller({ navigation, params }: Props) {
  const { localizacao, compartilharLocalizacaoUsuario, verificaLocalizacao, pegarPosicaoAtual } = useLocation();
  const { dispatchSnack } = useVSSnack();
  const { dispatchAlert, closeMe } = useVSAlert();
  const { offline } = useOffline();
  const storageContext = useStorage();
  const { veiculo } = useColeta();
  const { rascunho, pegarRascunho, atualizarGravarRascunho, deletarFotosRascunho } = useRascunho();
  const { usuario, configuracoes } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [isCheckIn, setIsCheckIn] = React.useState<boolean>(false);
  const [isLocalizacao, setIsLocalizacao] = React.useState<boolean>(false);
  const [checkIn, setCheckIn] = React.useState<number | null>(null);
  const [coleta, setColeta] = React.useState<IOrder>({});
  const [naoColetado, setNaoColetado] = React.useState<boolean>(false);
  const [showModalMapa, setModalMapa] = React.useState<boolean>(false);
  const [observacoes, setObservacoes] = React.useState<string>('');
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const { fazerCheckIn, fazerCheckOut, verificaClienteCheckIn } = useCheckin();
  const [compartilharLocalizacao, setCompartilharLocalizacao] = React.useState<string>('');
  const [realizandoCheckinCheckout, setRealizandoCheckinCheckout] = React.useState<boolean>(false);

  const iClienteDeviceRepositorio: IDeviceClienteRepositorio = new DeviceClienteRepositorio(
    usuario?.codigo ?? 0,
    getConnection(database),
  );

  const navigateToMotivos = () => navigation.navigate(AuthRoutes.Motivos, { screen: AuthRoutes.DetalhesDaColeta });
  const navigateToListStops = () => navigation.navigate(AuthRoutes.ListaParadas, { screen: AuthRoutes.ListaParadas });

  const validarKmInicial = (): boolean => Boolean(veiculo.kmFinal && coleta?.KMInicial && coleta?.KMInicial < veiculo.kmFinal);

  const setKmColeta = React.useCallback(
    (km: number) => {
      setColeta(prev => ({ ...prev, KMInicial: km }));
    },
    [coleta],
  );

  const setarUltimoKm = async () => {
    const ultimoKM = await pegarUltimoKm();
    setKmColeta(ultimoKM);
  };

  const pegarUltimoKm = async () => {
    const response = await presenter.pegarUltimoKmColetado();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      const kmVeiculo = veiculo.kmFinal || 0;

      const ultimoKM = response < kmVeiculo ? kmVeiculo : response;

      return ultimoKM;
    }

    return 0;
  };

  React.useEffect(() => {
    (async () => {
      if (!naoColetado) {
        setObservacoes('');
        navigation.setParams({ motivo: {} });

        if (coleta && coleta.codigoOS) {
          await storageContext.gravarAuditoria({
            codigoRegistro: coleta.codigoOS,
            descricao: 'Removido motivo de não coletada',
            rotina: 'Alterar Motivo',
            tipo: 'COLETA_AGENDADA',
          });

          await atualizarGravarRascunho({
            ...coleta,
            motivo: {},
          });
        }
      }
    })();
  }, [naoColetado]);

  React.useEffect(() => {
    (async () => {
      if (params.coletaID && params.motivo?.codigo && navigation.isFocused()) {
        await storageContext.gravarAuditoria({
          codigoRegistro: params.coletaID,
          descricao: `Selecionado motivo de não coletada ${params.motivo.codigo}`,
          rotina: 'Alterar Motivo',
          tipo: 'COLETA_AGENDADA',
        });
      }
    })();
  }, [params.motivo]);

  const setObjetoColeta = () => ({
    ...coleta,
    dataChegada: rascunho?.dataChegada,
    codigoDispositivo: usuario?.codigoDispositivo ?? 0,
    codigoMotorista: usuario?.codigo ?? 0,
    motivo: {
      ...params.motivo,
      observacao: observacoes,
    },
  });

  const verificarDependenciaOS = async (ordemIDDependente: number) => {
    const response = await presenter.verificarDependenciaColeta(ordemIDDependente, coleta?.placa ?? '');

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      if (response && response !== 0) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: I18n.t('screens.collectCheck.osPending', { os: response ?? '' }),
        });

        return true;
      }

      return false;
    }
  };

  const continuarColeta = async () => {

    if (configuracoes.obrigatorioKmOs && (coleta.KMInicial == null || coleta.KMInicial === 0)) {
      return dispatchAlert({
        type: 'open',
        alertType: 'info',
        message:
          'O  KM Inicial é obrigatório, caso clique no icone ao lado do campo irá trazer o último utilizado',
        onPressRight: () => null,
      });
    }
    if (coleta?.KMInicial && coleta.KMInicial !== 0 && (await pegarUltimoKm()) > Number(coleta?.KMInicial || 0)) {
      return dispatchAlert({
        type: 'open',
        alertType: 'info',
        message:
          'Informe um valor inicial de quilometragem acima do último, caso clique no icone ao lado do campo irá trazer o último utilizado',
        onPressRight: () => null,
      });
    }

    if (naoColetado && !params.motivo.codigo) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectDetails.reasonRequired'),
      });
    } else {
      const newColeta = setObjetoColeta();

      const hasDependencia = newColeta?.coletouPendente
        ? false
        : await verificarDependenciaOS(newColeta?.ordemColetaPendente ?? 0);

      if (!hasDependencia) {
        const isToday = verificaDiaChecklist(coleta?.checklist);

        await atualizarGravarRascunho(newColeta);

        if (coleta?.checklist !== null && isToday && coleta?.checklist?.momentoExibicao === optionsChecklist.INICIAR) {
          navigation.navigate(AuthRoutes.Checklist, { coleta: newColeta });
        } else {
          navigation.navigate(AuthRoutes.ResiduosDaColeta, { coleta: newColeta, novaColeta: false, residuo: {} });
        }
      }
    }
  };

  const atualizarColeta = async (coletaResponse: IOrder) => {
    if (coleta && (coletaResponse?.codigoOS || coletaResponse?.codigoCliente)) {
      await pegarRascunho(coletaResponse);
    }
  };

  const usarColeta = async () => deletarFotosRascunho(coleta);

  React.useEffect(() => {
    if (rascunho && rascunho?.codigoCliente && params.coletaID) {
      setColeta(rascunho);

      if (rascunho?.motivo && rascunho.motivo?.codigo && coleta && coleta?.codigoOS) {
        setObservacoes(rascunho?.motivo?.observacao ?? '');
        setNaoColetado(true);
        navigation.setParams({ motivo: rascunho && rascunho.motivo ? rascunho.motivo : {} });
      }
    }
  }, [rascunho]);

  const goBackFunction = async () => {
    if (realizandoCheckinCheckout) return;

    if (coleta && coleta?.codigoOS) {
      const newColeta = setObjetoColeta();
      await atualizarGravarRascunho(newColeta);
    }

    setColeta({});
    navigation.goBack();
  };

  const onToggleNaoColetado = () => setNaoColetado(!naoColetado);

  const onToggleCompartilharLocalizacao = async () => {
    const value = compartilharLocalizacao && compartilharLocalizacao.length > 0 ? '' : String(coleta?.codigoOS ?? 0);

    await compartilharLocalizacaoUsuario(value);
    await pegarPosicaoAtual();
    await verificaLocalizacao().then(response => {
      setCompartilharLocalizacao(response && response.length > 0 ? response : '');
      setIsLocalizacao(response && response.length > 0 ? !!response : false);
    });
  };

  const dimissKeyboard = () => Keyboard.dismiss();

  const verificaCheckInAtivo = async () => {
    const response = await verificaClienteCheckIn(iClienteDeviceRepositorio);

    setCheckIn(response ?? null);
  };

  const verificaCheckIn = async () => setIsCheckIn(checkIn === coleta.codigoCliente);

  const setShowModalMapa = () => setModalMapa(!showModalMapa);

  const showRascunhoAlert = (coletaResponse: IOrder) =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: I18n.t('screens.collectDetails.draftMessage'),
      textLeft: I18n.t('alerts.no'),
      textRight: I18n.t('alerts.yes'),
      onPressRight: () => atualizarColeta(coletaResponse),
      onPressLeft: () => {
        closeMe();
        usarColeta();
      },
    });

  React.useEffect(() => {
    if (coleta?.codigoCliente && checkIn) {
      verificaCheckIn();
    }
  }, [coleta, checkIn]);

  const pegarColeta = async () => {
    setLoadingData(true);

    const response = offline ? await presenter.pegarColetaStorage(params.coletaID) : await presenter.pegarColeta(params.coletaID);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response && response?.codigoOS) {
      if (configuracoes?.naoUsarNomeFuncaoResponsavelColeta) {
        response.nomeResponsavel = '';
        response.funcaoResponsavel = '';
      }

      setColeta(response);

      const hasRascunho = await pegarRascunho(response, true);

      if (hasRascunho?.codigoOS) {
        showRascunhoAlert(response);
      }
    }

    setLoadingData(false);
  };

  const navigateToClienteCheckIn = () => {
    if (checkIn && checkIn !== 0 && checkIn !== null) {
      navigation.navigate(AuthRoutes.DetalhesDoCliente, { clienteID: checkIn });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.clientDetails.clientInvalidCode'),
      });
    }
  };

  const validarCheckinOS = (): boolean => {
    if (configuracoes?.checkinObrigatorio) {
      return checkIn === null || checkIn === 0 || checkIn !== coleta?.codigoCliente;
    }

    return false;
  };

  React.useEffect(() => {
    if (params.coletaID) {
      navigation.addListener('focus', async () => {
        await verificaCheckInAtivo();
        await verificaLocalizacao().then(response => {
          setCompartilharLocalizacao(response && response.length > 0 ? response : '');
          setIsLocalizacao(response && response.length > 0 ? !!response : false);
        });
      });

      (async () => {
        await storageContext.gravarAuditoria({
          codigoRegistro: params.coletaID ?? 0,
          descricao: `Acessou OS ${params.coletaID}`,
          rotina: 'Abrir Coleta Agendada',
          tipo: 'COLETA_AGENDADA',
        });

        pegarColeta();
      })();
    }
  }, [params.coletaID]);

  const ligarParaCliente = async (phone: string) => {
    const canOpen = await Linking.canOpenURL(`tel:${phone}`);

    if (canOpen) {
      Linking.openURL(`tel:${phone}`);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectDetails.phoneInvalid'),
      });
    }
  };

  const navigateToCliente = () => {
    if (realizandoCheckinCheckout) return;

    if (coleta.codigoCliente) {
      navigation.navigate(AuthRoutes.DetalhesDoCliente, { clienteID: coleta.codigoCliente });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectDetails.invalidClient'),
      });
    }
  };

  const navigateToVerificarColeta = async () => {
    const novaColeta = false;
    const newColeta = setObjetoColeta();

    const hasDependencia = newColeta?.coletouPendente ? false : await verificarDependenciaOS(newColeta?.ordemColetaPendente ?? 0);

    if (
      !hasDependencia &&
      ((!naoColetado && !params.motivo?.codigo && newColeta?.residuos && newColeta.residuos?.length > 0) ||
        (naoColetado && params.motivo?.codigo))
    ) {
      const regEX = /^((-)?(0|([1-9][0-9]*))(,[0-9]+)?)$/;

      const isValid =
        newColeta?.residuos && newColeta.residuos?.length > 0
          ? !newColeta.residuos.some(_residuo => !regEX.test(_residuo?.quantidade ?? ''))
          : params.motivo?.codigo || false;

      if (isValid) {
        let isNotInteger = false;

        if (newColeta?.residuos && newColeta.residuos?.length > 0) {
          const newResiduos = newColeta.residuos.filter(_residuo => {
            _residuo.quantidade = _residuo.quantidade ? String(_residuo?.quantidade ?? '').replace(/ /g, '') : '0';

            if (
              _residuo.xExigeInteiro &&
              _residuo.quantidade?.length > 0 &&
              String(_residuo?.quantidade ?? '').indexOf(',') !== -1
            ) {
              isNotInteger = true;
            }

            return _residuo;
          });

          newColeta.residuos = newResiduos;
        }

        if (isNotInteger) {
          dispatchSnack({
            type: 'open',
            alertType: 'info',
            message: I18n.t('screens.residue.amountInteger'),
          });
        } else {
          await atualizarGravarRascunho(newColeta);

          navigation.navigate(AuthRoutes.ColetaResponsavel, {
            coleta: newColeta,
            novaColeta,
            assinatura: '',
            mtr: {},
            photo: {},
            scanData: '',
          });
        }
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.collectResidues.residuesValidate'),
        });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.residueRequired'),
      });
    }
  };

  const fazerCheckInAsync = async () => {
    setRealizandoCheckinCheckout(true);

    const response = await fazerCheckIn(
      localizacao,
      coleta?.codigoCliente ?? 0,
      offline,
      iClienteDeviceRepositorio,
      coleta?.codigoOS,
    );

    if (response) {
      const dataAtual = timezoneDate(new Date());

      await storageContext.gravarAuditoria({
        codigoRegistro: coleta?.codigoOS,
        descricao: `Fez checkin no Cliente: ${coleta?.codigoCliente}`,
        rotina: 'Clicou para fazer checkin na OS',
        tipo: 'COLETA_AGENDADA',
      });

      await atualizarGravarRascunho({ ...coleta, dataChegada: dataAtual as unknown as Date });
    }

    await verificaCheckInAtivo();

    setRealizandoCheckinCheckout(false);
  };

  const fazerCheckOutAsync = async (clienteID?: number | null) => {
    setRealizandoCheckinCheckout(true);

    const codigoCliente = clienteID ?? coleta?.codigoCliente ?? 0;

    await fazerCheckOut(localizacao, codigoCliente, offline, iClienteDeviceRepositorio);

    await storageContext.gravarAuditoria({
      codigoRegistro: coleta?.codigoOS,
      descricao: `Fez checkout no Cliente: ${coleta?.codigoCliente}`,
      rotina: 'Clicou para fazer checkout na OS',
      tipo: 'COLETA_AGENDADA',
    });

    await verificaCheckInAtivo();
    setRealizandoCheckinCheckout(false);
  };

  const pegarEnderecosMapa = async () => {
    let endereco: string = '';
    endereco = `${coleta?.enderecoOS?.numero ?? ''}${coleta?.enderecoOS?.letra ?? ''} ${coleta?.enderecoOS?.rua ?? ''} ${coleta?.enderecoOS?.bairro ?? ''
      } ${coleta?.enderecoOS?.cidade ?? ''} ${coleta?.enderecoOS?.uf ?? ''}`;
    return endereco;
  };

  const abrirMapa = async (type: 'waze' | 'maps') => {
    let scheme: string;
    const enderecos = await pegarEnderecosMapa();

    if (type === 'maps') {
      scheme = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${enderecos.replace(
        ' ',
        '+',
      )}&travelmode=driving`;
    } else {
      scheme = `https://waze.com/ul?q=${enderecos.replace(' ', '%20')}&navigate=yes&zoom=17`;
    }
    await Linking.openURL(scheme);
    setShowModalMapa();
  };

  const showPhoneAlert = (phone: string) =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      textLeft: I18n.t('alerts.no'),
      textRight: I18n.t('alerts.yes'),
      message: I18n.t('screens.collectDetails.callCustomerMessage'),
      onPressRight: () => ligarParaCliente(phone),
    });

  return {
    checkIn,
    isCheckIn,
    coleta,
    loadingData,
    observacoes,
    naoColetado,
    isLocalizacao,
    showModalMapa,
    compartilharLocalizacao,
    veiculo,
    realizandoCheckinCheckout,
    validarCheckinOS,
    validarKmInicial,
    goBackFunction,
    showPhoneAlert,
    atualizarColeta,
    ligarParaCliente,
    setObservacoes,
    setarUltimoKm,
    navigateToVerificarColeta,
    navigateToCliente,
    dimissKeyboard,
    navigateToMotivos,
    navigateToListStops,
    onToggleNaoColetado,
    navigateToClienteCheckIn,
    onToggleCompartilharLocalizacao,
    fazerCheckOutAsync,
    fazerCheckInAsync,
    continuarColeta,
    abrirMapa,
    usarColeta,
    setShowModalMapa,
    setKmColeta,
  };
}

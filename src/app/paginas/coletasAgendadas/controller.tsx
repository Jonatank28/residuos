import * as React from 'react';
import { useVSSnack, Orientation, wait, useVSAlert, usePresenter, useVSConnection } from 'vision-common';
import { Linking } from 'react-native';
import I18n from 'i18n-js';
import { IDropDownItems } from '../../componentes/dropdownOptions';
import { IOrder } from '../../../core/domain/entities/order';
import Presenter from './presenter';
import { useRascunho } from '../../contextos/rascunhoContexto';
import { useOffline } from '../../contextos/offilineContexto';
import { IFiltro } from '../../../core/domain/entities/filtro';
import { AuthRoutes } from '../../routes/routes';
import { useStorage } from '../../contextos/storageContexto';
import { useLocation } from '../../contextos/localizacaoContexto';
import { useUser } from '../../contextos/usuarioContexto';
import { useLoading } from '../../contextos/loadingContexto';
import { useColeta } from '../../contextos/coletaContexto';
import { useIsFocused } from '@react-navigation/native';
import { IControllerAuth } from '../../routes/types';
import { BackHandler } from 'react-native';

interface Props extends IControllerAuth<AuthRoutes.ColetasAgendadas> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { placa } = useColeta();
  const isFocused = useIsFocused();
  const { offline } = useOffline();
  const { dispatchAlert } = useVSAlert();
  const { usuario, configuracoes } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const { dispatchLoading } = useLoading();
  const { compartilharLocalizacaoUsuario, verificaLocalizacao } = useLocation();
  const { setRascunho } = useRascunho();
  const storageContext = useStorage();
  const [coletas, setColetas] = React.useState<IOrder[]>([]);
  const [compartilhandoLocalizacao, setCompartilhandoLocalizacao] = React.useState<string>('');
  const [cidade, setCidade] = React.useState<string>('');
  const [showModalMapa, setModalMapa] = React.useState<boolean>(false);

  const [cidades, setCidades] = React.useState<IDropDownItems[]>([]);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalColetas, setTotalColetas] = React.useState<number>(0);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const [updating, setUpdating] = React.useState<boolean>(false);
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const { connectionState, connectionType } = useVSConnection();

  const setShowModalMapa = () => setModalMapa(!showModalMapa);

  const navigateToDetalhesColeta = async (coleta: IOrder) => {
    await storageContext.gravarAuditoria({
      codigoRegistro: coleta.codigoOS,
      descricao: `Clicou para acessar a OS ${coleta.codigoOS}`,
      rotina: 'Acessar Coleta Agendada',
      tipo: 'COLETA_AGENDADA',
    });

    navigation.navigate(
      AuthRoutes.DetalhesDaColeta, {
      coletaID: coleta?.codigoOS ?? 0,
      motivo: {}
    },
    );
  };

  const navigateToFiltrarColetas = () => {
    let newFiltros: IFiltro = {};

    if (configuracoes?.qrCode === 1) {
      newFiltros = {
        ...params.filtros,
        obra: params?.scanData && params.scanData?.length > 0 ? {
          codigo: Number(params.scanData),
          descricao: coletas?.length > 0 ? coletas[0].nomeObra : '',
        } : params.filtros?.obra,
      };
    } else {
      newFiltros = {
        ...params.filtros,
        cliente: params?.scanData && params?.scanData?.length > 0 ? {
          codigo: Number(params.scanData),
          nomeFantasia: coletas?.length > 0 ? coletas[0].nomeCliente : '',
        } : params.filtros?.cliente,
      };
    }

    navigation.navigate(AuthRoutes.FiltrarColetas, {
      filtros: newFiltros,
      placa: placa ?? '',
      screen: AuthRoutes.ColetasAgendadas,
      cliente: {},
      obra: {}
    });
  };

  const pegarCidadesAgendadas = async (newFiltros?: IFiltro) => {
    const response = await presenter.pegarCidadesAgendadas(placa, newFiltros);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message
      });
    } else {
      setCidades(response);
    }
  };

  const gravarColetasStorage = async (coletasAgendadas: IOrder[]) => {
    const deletarColetasResponse = await presenter.deletarColetasAgendadasDevice();

    if (deletarColetasResponse instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: deletarColetasResponse.message,
      });
    } else if (coletasAgendadas?.length > 0) {
      const response = await presenter.gravarColetasAgendadas(coletasAgendadas);
      atualizar();

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      }
    }
  };

  const pegarColetas = async (
    loadMore?: boolean,
    filtrosSelecionados?: IFiltro,
    scan?: string,
    cidadeSelecionada?: string,
    pesquisaSelecionada?: string,
  ) => {
    if (hasPages) {
      const amount = 20;
      let newFiltro: IFiltro = {};

      if (loadMore) setLoadingMore(true);
      if ((scan && scan?.length > 0 || (params?.scanData && params.scanData?.length > 0)) && !params.filtros?.cliente?.codigo) {
        if (configuracoes?.qrCode === 1) {
          newFiltro = {
            ...filtrosSelecionados ?? params.filtros,
            obra: {
              codigo: Number((scan && scan?.length > 0 ? scan : params.scanData)),
            },
          };
        } else {
          newFiltro = {
            ...filtrosSelecionados ?? params.filtros,
            cliente: {
              codigo: Number((scan && scan?.length > 0 ? scan : params.scanData)),
            },
          };
        }
      } else {
        newFiltro = filtrosSelecionados ?? {} ?? params.filtros;
      }

      const response = offline
        ? await presenter.pegarColetasAgendadasStorage({
          filtros: newFiltro,
          placa,
          cidade: cidadeSelecionada ?? cidade,
          pagination: {
            page,
            search: pesquisaSelecionada ?? '',
            amount
          }
        })
        : await presenter.pegarColetas({
          placa,
          cidade: cidadeSelecionada ?? cidade,
          filtros: newFiltro,
          pagination: {
            page,
            search: pesquisaSelecionada ?? '',
            amount
          }
        });

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else if (response) {
        setTotalColetas(response.length);

        if (page <= response.pages) {
          if (response.items.length > 0) {
            if (response.items.length === 1 && params?.scanData && params.scanData?.length > 0) {
              navigateToDetalhesColeta(response.items[0]);
            }

            if (loadMore) {
              setColetas(coletas.concat(response.items));
            } else {
              setColetas(response.items);
            }
            setUpdating(false);
          }

          setPage((prev) => prev + 1);
        } else {
          setHasPages(false);
        }

        if (response.items.length < amount) {
          setHasPages(false);
        }
      }

      setLoadingMore(false);
      if (!loadMore) pegarCidadesAgendadas(newFiltro);
    }

    setLoadingData(false);
  };

  const verificarColetaPendente = (coleta: IOrder) => {
    if (coleta.coletouPendente) return '';

    if (coleta.ordemColetaPendente !== 0) {
      const osPendente = coletas.filter((item) => item.codigoOrdem === coleta.ordemColetaPendente);

      if (osPendente?.length > 0 && osPendente[0]?.codigoOS) {
        return osPendente[0].codigoOS.toString();
      }
    }

    return '';
  };

  const pegarTodasColetas = async () => {
    dispatchLoading({ type: 'open' });

    const response = await presenter.pegarTodasColetas();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      await gravarColetasStorage(response);
    }

    dispatchLoading({ type: 'close' });
  };

  const atualizar = React.useCallback((filtrosSelecionados?: IFiltro, scan?: string, cidadeSelecionada?: string, pesquisaSelecionada?: string) => {

    if (!updating) {
      setRefreshing(true);
      setLoadingData(true);
      setUpdating(true);

      wait(200).then(() => {
        setColetas([]);
        setPage(1);
        setHasPages(true);
        setRefreshing(false);
        pegarColetas(false, filtrosSelecionados, scan, cidadeSelecionada, pesquisaSelecionada);
      });
    }
    return () => { };
  }, []);

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', navigateToHome);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', navigateToHome);
    };
  }, [navigation]);

  React.useEffect(() => {
    const update = params.scanData || params.codigoOSEnviada || !!params.filtros || !!cidade;

    if (update) {
      atualizar(params.filtros, params.scanData, cidade);
    }

    return () => { };
  }, [params, cidade]);

  React.useEffect(() => {
    (async () => {
      if (isFocused) {
        await Orientation.defaultOrientation();
        const locationResponse = await verificaLocalizacao();
        setCompartilhandoLocalizacao(locationResponse ?? '');
        setRascunho(null);
      }
    })();

    return () => { };
  }, [isFocused]);

  const navigateToImobilizadosColeta = () => {
    let codigosOS: string = '';

    coletas.forEach((coleta: IOrder) => {
      codigosOS += (`&codigoOS=${coleta?.codigoOS}`);
    });

    navigation.navigate(AuthRoutes.Imobilizados, { codigosOS });
  };

  const navigateToHome = () => {
    navigation.navigate(AuthRoutes.Home);
    return true;
  };

  const formatarEnderecosShowMapa = () => {
    if (coletas && coletas.length === 0) return '';

    const enderecos: string[] = [];
    let paradas: string = '&waypoints=';

    coletas.forEach((coleta: IOrder) => {
      // eslint-disable-next-line max-len
      const enderecoFormatado = `${coleta?.enderecoOS?.numero ?? ''}${coleta?.enderecoOS?.letra ?? ''}+${coleta?.enderecoOS?.rua ?? ''}+${coleta?.enderecoOS?.bairro ?? ''}+${coleta?.enderecoOS?.cidade ?? ''}+${coleta?.enderecoOS?.uf ?? ''}`;
      enderecos.push(enderecoFormatado.replace(' ', '+'));
    });

    let scheme = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${enderecos[0] ?? ''}&travelmode=driving`;

    if (enderecos.length > 1) {
      enderecos.forEach((_, index) => {
        if (enderecos[index + 1]) paradas += `${enderecos[index + 1]}%7C`;
      });

      scheme += paradas;
    }

    return scheme;
  };

  const abrirMapa = async () => {
    const scheme = formatarEnderecosShowMapa();

    const canOpen = await Linking.canOpenURL(scheme);

    if (canOpen) {
      await Linking.openURL(scheme);
      setShowModalMapa();
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.sheduledCollections.showMapError'),
      });
    }
  };

  const showObservacaoAlert = (message: string) => dispatchAlert({
    type: 'open',
    alertType: 'info',
    title: I18n.t('screens.sheduledCollections.observation'),
    message,
    onPressRight: () => null,
  });

  const showReferenteAlert = (message: string) => dispatchAlert({
    type: 'open',
    alertType: 'info',
    title: I18n.t('screens.sheduledCollections.referring'),
    message,
    onPressRight: () => null,
  });

  const showPosicaoAlert = (codigoOS: number) => dispatchAlert({
    type: 'open',
    alertType: 'confirm',
    message: !compartilhandoLocalizacao
      ? I18n.t('screens.sheduledCollections.startLocation')
      : I18n.t('screens.sheduledCollections.stopLocation'),
    textLeft: I18n.t('alerts.no'),
    textRight: I18n.t('alerts.yes'),
    onPressRight: async () => {
      const value = compartilhandoLocalizacao && compartilhandoLocalizacao.length > 0
        ? ''
        : String(codigoOS ?? '');
      await compartilharLocalizacaoUsuario(value);
      const locationResponse = await verificaLocalizacao();
      setCompartilhandoLocalizacao(locationResponse ?? '');
    },
  });

  const showSincronizarAlert = () =>
    !connectionState
      ? dispatchAlert({
        type: 'open',
        alertType: 'info',
        message: 'Para sincronizar é necessário estar conectado a internet!',
        onPressRight: () => undefined ?? null,
      })
      : dispatchAlert({
        type: 'open',
        alertType: 'confirm',
        message: I18n.t('screens.sheduledCollections.synchronizeMessage'),
        textLeft: I18n.t('alerts.no'),
        textRight: I18n.t('alerts.yes'),
        onPressRight: pegarTodasColetas,
      });

  return {
    coletas,
    placa,
    cidade,
    cidades,
    loadingData,
    configuracoes,
    showModalMapa,
    totalColetas,
    compartilhandoLocalizacao,
    loadingMore,
    hasPages,
    refreshing,
    pesquisa,
    setPesquisa,
    atualizar,
    setCidade,
    abrirMapa,
    showObservacaoAlert,
    showReferenteAlert,
    showPosicaoAlert,
    showSincronizarAlert,
    navigateToHome,
    setShowModalMapa,
    verificarColetaPendente,
    pegarColetas,
    navigateToDetalhesColeta,
    navigateToFiltrarColetas,
    navigateToImobilizadosColeta
  };
}

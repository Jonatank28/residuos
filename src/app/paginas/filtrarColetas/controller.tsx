import * as React from 'react';
import I18n from 'i18n-js';
import { Platform } from 'react-native';
import Presenter from './presenter';
import { timezoneDate, usePresenter, useVSSnack } from 'vision-common';
import { ICliente } from '../../../core/domain/entities/cliente';
import { IDropDownItems } from '../../componentes/dropdownOptions';
import { IFiltro } from '../../../core/domain/entities/filtro';
import { AuthRoutes } from '../../routes/routes';
import { IObra } from '../../../core/domain/entities/obra';
import { useOffline } from '../../contextos/offilineContexto';
import { useUser } from '../../contextos/usuarioContexto';
import { IControllerAuth } from '../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.FiltrarColetas> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { offline } = useOffline();
  const { usuario, configuracoes } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [cliente, setCliente] = React.useState<ICliente | null>(null);
  const [rota, setRota] = React.useState<number>(0);
  const [roterizacao, setRoterizacao] = React.useState<string>('0');
  const [classificacao, setClassificacao] = React.useState<string>('0');
  const [obra, setObra] = React.useState<IObra | null>(null);
  const [screen, setScreen] = React.useState<string>('');

  const [rotas, setRotas] = React.useState<IDropDownItems[]>([
    { label: I18n.t('screens.collectFilter.allRoutes'), value: '0' },
  ]);

  const roterizacoes: IDropDownItems[] = [
    { label: I18n.t('screens.collectFilter.scripting.allScripted'), value: '0' },
    { label: I18n.t('screens.collectFilter.scripting.notScripted'), value: '1' },
    { label: I18n.t('screens.collectFilter.scripting.onlyScripted'), value: '2' },
  ];

  const classificacoes: IDropDownItems[] = [
    { label: I18n.t('screens.collectFilter.classification.title'), value: '0' },
    { label: I18n.t('screens.collectFilter.classification.collect'), value: '1' },
    { label: I18n.t('screens.collectFilter.classification.delivery'), value: '2' },
  ];

  const [data, setData] = React.useState<Date | null>(null);
  const [mode, setMode] = React.useState<'date' | 'time' | 'datetime' | 'countdown'>('date');
  const [show, setShow] = React.useState(false);

  const onChange = (_event: any, selectedDate: any) => {
    const dataAtual = selectedDate || data;
    setShow(Platform.OS === 'ios');
    setData(dataAtual);
  };

  const showDatepicker = () => {
    setShow(true);
    setMode('date');
  };

  const navigateToClientes = () => navigation.navigate(AuthRoutes.Clientes, {
    isSelect: true,
    screen: AuthRoutes.FiltrarColetas,
  });

  const navigateToObras = () => navigation.navigate(AuthRoutes.ListaObras, {
    clienteID: cliente?.codigo ?? 0,
    placa: params.isHistico ? '' : params.placa,
  });

  const navigateToQRCode = () => navigation.navigate(AuthRoutes.Scanner, {
    screen: params.screen,
    scanType: 'qr',
    message: configuracoes?.qrCode === 1
      ? I18n.t('screens.collectFilter.qrCodePointMessage')
      : I18n.t('screens.collectFilter.qrCodeClientMessage'),
  });

  const limparFiltros = () => {
    setRota(0);
    setObra(null);
    setCliente(null);
    setRoterizacao('0');
    setClassificacao('0');
    setData(null);
    navigation.setParams({ cliente: {} });
  };

  const pegarRotas = async () => {
    const response = offline
      ? await presenter.pegarRotasDevice()
      : await presenter.pegarRotas(params.placa);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response && response.length > 0) {
      response.forEach((item) => setRotas([...rotas, {
        value: String(item.codigo),
        label: item?.descricao ?? '',
      }]));
    }
  };

  React.useEffect(() => {
    pegarRotas();
  }, []);

  React.useEffect(() => {
    if (params.filtros?.rota && params.filtros.rota !== 0 && rotas?.length > 0) {
      const rotaSelecionada = rotas.filter((item) => params.filtros.rota === Number(item.value));

      if (rotaSelecionada?.length > 0) {
        setRota(Number(rotaSelecionada[0].value));
      }
    }
  }, [rotas]);

  React.useEffect(() => {
    if (params.cliente?.nomeFantasia) {
      setCliente(params.cliente);
    }
  }, [params.cliente]);

  React.useEffect(() => {
    if (params.obra?.codigo) {
      setObra(params.obra);
    }
  }, [params.obra]);

  React.useEffect(() => {
    if (params.screen && params.screen?.length > 0) {
      setScreen(params.screen);
    }
  }, [params.screen]);

  React.useEffect(() => {
    if (params.filtros) {
      if (params.filtros?.classificacao) {
        setClassificacao(String(params.filtros.classificacao));
      }

      if (params.filtros?.roterizacao) {
        setRoterizacao(String(params.filtros.roterizacao));
      }

      if (params.filtros.cliente && params.filtros.cliente.codigo) {
        setCliente(params.filtros.cliente);
      }

      if (params.filtros.obra && params.filtros.obra?.codigo) {
        setObra(params.filtros.obra);
      }

      if (params.filtros?.dataColeta) {
        setData(params.filtros.dataColeta);
      }
    }
  }, [params.filtros]);

  const filtrar = () => {
    if (screen?.length > 0) {
      const newFiltro: IFiltro = {
        rota,
        classificacao: Number(classificacao),
        roterizacao: Number(roterizacao),
        obra: obra ?? {},
        cliente: cliente ?? {},
        dataColeta: data !== null && data !== undefined ? timezoneDate(data) : undefined,
        xTemData: data !== null && data !== undefined,
      };

      navigation.navigate<any>(screen, { filtros: newFiltro, scanData: '' });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectFilter.screenError'),
      });
    }
  };

  return {
    rotas,
    rota,
    data,
    classificacoes,
    roterizacoes,
    roterizacao,
    cliente,
    classificacao,
    show,
    mode,
    obra,
    onChange,
    setShow,
    navigateToObras,
    navigateToQRCode,
    showDatepicker,
    setRoterizacao,
    setRota,
    filtrar,
    setClassificacao,
    limparFiltros,
    navigateToClientes
  };
}

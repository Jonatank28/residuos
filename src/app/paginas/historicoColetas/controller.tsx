import * as React from 'react';
import { usePresenter, useVSSnack } from 'vision-common';
import Presenter from './presenter';
import { IOrder } from '../../../core/domain/entities/order';
import { AuthRoutes } from '../../routes/routes';
import { IFiltro } from '../../../core/domain/entities/filtro';
import { useUser } from '../../contextos/usuarioContexto';
import { useColeta } from '../../contextos/coletaContexto';
import { IControllerAuth } from '../../routes/types';
import { useSincronizacaoContexto } from '../../contextos/sincronizacaoContexto';

interface Props extends IControllerAuth<AuthRoutes.HistoricoDeColetas> { }

export default function Controller({ navigation, params }: Props) {
  const { usuario } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const { dispatchSnack } = useVSSnack();
  const { placa } = useColeta();
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [coletas, setColetas] = React.useState<IOrder[]>([]);
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [change, setChange] = React.useState<boolean>(false);

  console.log('loadingData: ', loadingData)
  const onChangePesquisa = (text: string) => {
    setPesquisa(text);
    setLoadingData(true);
  };

  const navigateToFiltrarColetas = () => {
    let codigosOS: string = '';

    if (coletas?.length > 0) {
      coletas.forEach((coleta: IOrder) => {
        codigosOS += codigosOS.length === 0 ? `codigoOS=${coleta.codigoOS}` : `&codigoOS=${coleta.codigoOS}`;
      });
    }

    const newFiltros: IFiltro = {
      ...params.filtros,
      cliente:
        params.scanData?.length > 0
          ? {
            codigo: Number(params.scanData),
            nomeFantasia: coletas?.length > 0 ? coletas[0].nomeCliente : '',
          }
          : params.filtros?.cliente,
    };

    navigation.navigate(AuthRoutes.FiltrarColetas, {
      cliente: {},
      obra: {},
      filtros: newFiltros,
      placa: placa,
      screen: AuthRoutes.HistoricoDeColetas,
      isHistico: true,
    });
  };

  const pegarNovasColetas = async (newColetas: IOrder[]) => {
    try {
      setLoadingData(true);

      const response = await presenter.pegarNovasColetas(params.filtros ?? {}, pesquisa);

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else {
        newColetas = [...newColetas, ...response];
        setColetas(newColetas?.length > 0 ? newColetas.reverse() : []);
      }
      setLoadingData(false);

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingData(false);
    }
  };

  const pegarColetasAgendadasOffline = async (newColetas: IOrder[]) => {

    try {
      const response = await presenter.pegarColetasAgendadasOffline(pesquisa, params.filtros ?? {});

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else if (response && response.length > 0) {
        response.forEach(coleta => {
          coleta.isOffline = true;
          newColetas.push(coleta);
        });
      }
      await pegarNovasColetas(newColetas ?? []);

    } catch (error) {
      console.log(error);
    }

  };

  const pegarColetas = async () => {
    setLoadingData(true);
    const response = await presenter.pegarColetas(pesquisa, params.filtros ?? {});

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      await pegarColetasAgendadasOffline(response ?? []);
    }

    setLoadingData(false);
  };

  React.useEffect(() => {
    if (pesquisa.length > 0) {
      const timeout = setTimeout(() => {
        setColetas([]);
        pegarColetas();
      }, 500);

      return () => clearTimeout(timeout);
    }
    if (pesquisa.length === 0) {
      pegarColetas();
    }

    return () => { };
  }, [pesquisa]);

  const navigateToDetalhesColeta = (coleta: IOrder) => {
    if (coleta.codigoCliente && coleta.classificacaoOS === 3) {
      coleta.isOffline = true;

      navigation.navigate(AuthRoutes.DetalhesDaColetaLocal, {
        coleta,
        codigoCliente: 0,
        codigoOS: 0,
      });
    } else {
      navigation.navigate(AuthRoutes.DetalhesDaColetaLocal, {
        codigoOS: coleta?.codigoOS ?? 0,
        codigoCliente: coleta?.codigoVinculo ?? '',
        coleta: {},
      });
    }
  };

  React.useEffect(() => {
    if (params.filtros) {
      pegarColetas();
    }
  }, [params.filtros]);

  React.useEffect(() => {
    if (params.scanData && params.scanData.length > 0) {
      const coletasCliente = coletas.filter(item => Number(params.scanData) === item.codigoCliente);

      setColetas(coletasCliente);
    }
  }, [params.scanData]);

  const alteraStatusOS = () => {
    const alteraStatus = coletas.map(item => {
      return {
        ...item,
        classificacaoOS: 1,
        isOffline: false
      }
    });

    setColetas(alteraStatus);
    setChange(!change);
  }

  return {
    coletas,
    pesquisa,
    loadingData,
    change,
    onChangePesquisa,
    navigateToFiltrarColetas,
    navigateToDetalhesColeta,
    alteraStatusOS,
  };
}

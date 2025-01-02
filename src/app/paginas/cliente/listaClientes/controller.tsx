import * as React from 'react';
import { Keyboard } from 'react-native';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { IRegiao, usePresenter, useVSSnack, wait } from 'vision-common';
import { ICliente } from '../../../../core/domain/entities/cliente';
import { useOffline } from '../../../contextos/offilineContexto';
import { useUser } from '../../../contextos/usuarioContexto';
import { AuthRoutes } from '../../../routes/routes';
import { IControllerAuth } from '../../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.Clientes> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { offline } = useOffline();
  const { usuario } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [clientes, setClientes] = React.useState<ICliente[]>([]);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);

  const pegarCodigosRegioes = async () => {
    const response: IRegiao[] = await presenter.pegarCodigosRegioes();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    }

    return response;
  };

  const pegarClientes = async (loadMore?: boolean) => {
    if (hasPages) {
      const amount = 10;
      if (loadMore) setLoadingMore(true);

      const regioes = await pegarCodigosRegioes();

      const response = offline
        ? await presenter.pegarClientesDevice({ page, search: pesquisa, amount })
        : await presenter.pegarClientes({ page, search: pesquisa, amount }, regioes);

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else if (response) {
        if (page <= response.pages) {
          if (response.items.length > 0) {
            if (loadMore) {
              setClientes(clientes.concat(response.items));
            } else {
              setClientes(response.items);
            }
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
    }

    setLoadingData(false);
  };

  const atualizar = React.useCallback((isSearch?: boolean) => {
    if (!isSearch) setRefreshing(true);

    wait(!isSearch ? 2000 : 0).then(() => {
      pegarClientes();
      if (!isSearch) setPage(1);
      if (!isSearch) setPesquisa('');
      if (!isSearch) setHasPages(true);
      if (!isSearch) Keyboard.dismiss();
      if (!isSearch) setRefreshing(false);
    });
  }, []);

  React.useEffect(() => {
    if (pesquisa.length > 0) {
      const timeout = setTimeout(() => {
        setClientes([]);
        pegarClientes();
      }, 500);

      return () => clearTimeout(timeout);
    } if (pesquisa.length === 0) {
      atualizar(true);
    }

    return () => { };
  }, [pesquisa]);

  const onChangePesquisa = (text: string) => {
    setPesquisa(text);
    setPage(1);
    setHasPages(true);
    setLoadingData(true);
  };

  const onSelectCliente = (cliente: ICliente) => {
    if (cliente.codigo) {
      if (params.isSelect && params.screen) {
        navigation.navigate<any>(params.screen, { cliente });
      } else {
        navigation.navigate(AuthRoutes.DetalhesDoCliente, { clienteID: cliente.codigo });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.clients.selectClientError'),
      });
    }
  };

  return {
    clientes,
    pesquisa,
    loadingMore,
    hasPages,
    refreshing,
    loadingData,
    atualizar,
    pegarClientes,
    onSelectCliente,
    onChangePesquisa
  };
}

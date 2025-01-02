import * as React from 'react';
import Presenter from './presenter';
import { Keyboard } from 'react-native';
import { usePresenter, useVSSnack, wait } from 'vision-common';
import { IOrder } from '../../../core/domain/entities/order';
import { AuthRoutes } from '../../routes/routes';
import { useUser } from '../../contextos/usuarioContexto';
import { IControllerAuth } from '../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.Rascunhos> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { usuario } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [rascunhos, setRascunhos] = React.useState<IOrder[]>([]);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);

  const onChangePesquisa = (text: string) => {
    setPesquisa(text);
    setPage(1);
    setHasPages(true);
    setLoadingData(true);
  };

  const pegarRascunhos = async (loadMore?: boolean) => {
    setLoadingData(prev => prev = true);
    if (hasPages) {
      const amount = 10;
      if (loadMore) setLoadingMore(true);

      const response = await presenter.pegarRascunhos({
        page,
        search: pesquisa,
        amount
      });

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message
        });
      } else if (response) {
        if (page <= response.pages) {
          if (response.items.length > 0) {
            if (loadMore) {
              setRascunhos(rascunhos.concat(response.items));
            } else {
              setRascunhos(response.items);
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

      setLoadingMore(prev => prev = false);
    }

    setLoadingData(prev => prev = false);
  };

  const atualizar = React.useCallback((isSearch?: boolean) => {
    if (!isSearch) setRefreshing(true);

    wait(!isSearch ? 2000 : 0).then(() => {
      setRascunhos([]);
      pegarRascunhos();

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
        setRascunhos([]);
        pegarRascunhos();
      }, 500);

      return () => clearTimeout(timeout);
    } if (pesquisa.length === 0) {
      atualizar(true);
    }

    return () => { };
  }, [pesquisa]);

  React.useEffect(() => {
    if (params.rascunhoDeletado?.codigoOS || params.rascunhoDeletado?.codigoCliente) {
      const removerRascunho = rascunhos.filter((rascunho) => rascunho.codigoOS !== params.rascunhoDeletado.codigoOS || rascunho.codigoCliente !== params.rascunhoDeletado.codigoCliente);

      setRascunhos(removerRascunho);
    }
  }, [params.rascunhoDeletado]);

  const navigateToDetalhesRascunho = (rascunho: IOrder) => navigation.navigate(AuthRoutes.DetalhesDoRascunho, {
    rascunho
  });

  return {
    pesquisa,
    rascunhos,
    hasPages,
    refreshing,
    loadingData,
    loadingMore,
    pegarRascunhos,
    atualizar,
    setLoadingData,
    onChangePesquisa,
    navigateToDetalhesRascunho
  };
}

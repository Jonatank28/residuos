import * as React from 'react';
import { usePresenter, useVSSnack, wait } from 'vision-common';
import { Keyboard } from 'react-native';
import Presenter from './presenter';
import { useOffline } from '../../../contextos/offilineContexto';
import { AuthRoutes } from '../../../routes/routes';
import { IObra } from '../../../../core/domain/entities/obra';
import { useUser } from '../../../contextos/usuarioContexto';
import { IControllerAuth } from '../../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.ListaObras> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { offline } = useOffline();
  const { usuario } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [obras, setObras] = React.useState<IObra[]>([]);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);

  const pegarObras = async (loadMore?: boolean) => {
    if (hasPages) {
      const amount = 10;
      if (loadMore) setLoadingMore(true);

      const response = offline || !params.placa
        ? await presenter.pegarObrasPaginadoDevice({
          pagination: {
            page,
            search: pesquisa,
            amount
          },
          clienteID: params.clienteID,
          placa: params.placa
        })
        : await presenter.pegarObrasPaginado({
          pagination: {
            page,
            search: pesquisa,
            amount
          },
          clienteID: params.clienteID,
          placa: params.placa

        });
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
              setObras(obras.concat(response.items));
            } else {
              setObras(response.items);
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
      pegarObras();
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
        setObras([]);
        pegarObras();
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

  const onSelectObra = (obra: IObra) => navigation.navigate(AuthRoutes.FiltrarColetas, {
    obra,
    cliente: {},
    filtros: {},
    placa: params.placa,
    screen: ''
  });

  return {
    obras,
    pesquisa,
    loadingMore,
    hasPages,
    refreshing,
    loadingData,
    atualizar,
    pegarObras,
    onSelectObra,
    onChangePesquisa
  };
}

import * as React from 'react';
import I18n from 'i18n-js';
import { usePresenter, useVSSnack, wait } from 'vision-common';
import { IObra } from '../../../../core/domain/entities/obra';
import { IControllerAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import ObrasPresenter from './presenter';
import { Keyboard } from 'react-native';
import { useUser } from '../../../contextos/usuarioContexto';
import { useOffline } from '../../../contextos/offilineContexto';

interface Props extends IControllerAuth<AuthRoutes.ObrasNovaColeta> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { usuario } = useUser();
  const { offline } = useOffline();
  const presenter = usePresenter(() => new ObrasPresenter(usuario?.codigo ?? 0))

  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [obrasNovaColeta, setObrasNovaColeta] = React.useState<IObra[]>([]);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);

  const pegarObrasNovaColetaPaginado = async (loadMore?: boolean) => {
    if (hasPages) {
      const amount = 10;
      if (loadMore) setLoadingMore(true);

      const response = offline
        ? await presenter.paginarObrasClientePaginadoDevice(params.clienteID, { page, search: pesquisa, amount })
        : await presenter.paginarObrasClientePaginadoOnline(params.clienteID, { page, search: pesquisa, amount });

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
              setObrasNovaColeta(obrasNovaColeta.concat(response.items));
            } else {
              setObrasNovaColeta(response.items);
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
      setObrasNovaColeta([])
      pegarObrasNovaColetaPaginado();
      if (!isSearch) setPage(1);
      if (!isSearch) setPesquisa('');
      if (!isSearch) setHasPages(true);
      if (!isSearch) Keyboard.dismiss();
      if (!isSearch) setRefreshing(false);
    });
  }, []);

  const verificaObraSelecionada = (obra: IObra) => {
    if (!params.obraSelecionada || !params.obraSelecionada?.codigo) return false;

    return params.obraSelecionada.codigo === obra.codigo && params.obraSelecionada.codigoContrato === obra.codigoContrato;
  }

  const onSelectObra = (obra: IObra) => {
    if (obra.codigo) {
      if (params.isSelect && params.screen) {
        navigation.navigate<any>(params.screen, { obra });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.work.selectWorkError'),
      });
    }
  };

  React.useEffect(() => {
    if (pesquisa.length > 0) {
      const timeout = setTimeout(() => {
        setObrasNovaColeta([]);
        pegarObrasNovaColetaPaginado();
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

  return {
    pesquisa,
    obrasNovaColeta,
    hasPages,
    loadingData,
    loadingMore,
    refreshing,
    onSelectObra,
    onChangePesquisa,
    atualizar,
    verificaObraSelecionada,
    pegarObrasNovaColetaPaginado
  };
}

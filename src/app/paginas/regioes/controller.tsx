import * as React from 'react';
import { usePresenter, useVSSnack, wait } from 'vision-common';
import I18n from 'i18n-js';
import { Keyboard } from 'react-native';
import { IRegiao } from '../../../core/domain/entities/regiao';
import Presenter from './presenter';
import { AuthRoutes } from '../../routes/routes';
import { IControllerAuth } from '../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.Regioes> { }

export default function Controller({ navigation, params }: Props) {
  const presenter = usePresenter(() => new Presenter());
  const { dispatchSnack } = useVSSnack();
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [regioes, setRegioes] = React.useState<IRegiao[]>([]);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);

  const pegarRegioes = async (loadMore?: boolean) => {
    if (hasPages) {
      const amount = 20;
      if (loadMore) setLoadingMore(true);

      const response = await presenter.pegarRegioes({
        search: pesquisa,
        page,
        amount
      });

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else if (response) {
        let filterExists: IRegiao[];

        if (page <= response.pages) {
          if (response.items.length > 0) {
            if (params.regioes && params.regioes.length > 0) {
              filterExists = response.items.filter((regiao) => !params.regioes.find((regiaoSelecionada) => (regiaoSelecionada.codigo === regiao.codigo)));
            } else {
              filterExists = response.items;
            }

            if (loadMore) {
              setRegioes(regioes.concat(filterExists));
            } else {
              setRegioes(filterExists);
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
      if (!isSearch) setPage(1);
      if (!isSearch) setPesquisa('');
      if (!isSearch) setHasPages(true);
      if (!isSearch) Keyboard.dismiss();
      if (!isSearch) setRefreshing(false);
      pegarRegioes();
    });
  }, []);

  React.useEffect(() => {
    if (pesquisa.length > 0) {
      const timeout = setTimeout(() => {
        setRegioes([]);
        pegarRegioes();
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

  const onSelectRegiao = (regiao: IRegiao) => {
    if (regiao && regiao.codigo) {
      navigation.navigate(AuthRoutes.AdicionarRegioes, { regiao, isChange: params.isChange });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.regions.selectRegionError'),
      });
    }
  };

  React.useEffect(() => {
    if (regioes.length === 0 && params.regioes && params.regioes.length >= 20) {
      setHasPages(true);
      setLoadingMore(true);
      pegarRegioes();
    }
  }, [regioes]);

  return {
    regioes,
    pesquisa,
    hasPages,
    loadingData,
    loadingMore,
    refreshing,
    atualizar,
    pegarRegioes,
    onSelectRegiao,
    onChangePesquisa
  };
}

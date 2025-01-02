import * as React from 'react';
import I18n from 'i18n-js';
import { IVeiculo, usePresenter, useVSSnack, wait } from 'vision-common';
import Presenter from './presenter';
import { useStorage } from '../../contextos/storageContexto';
import { useColeta } from '../../contextos/coletaContexto';
import { IControllerAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';
import { Keyboard } from 'react-native';


interface Props extends IControllerAuth<AuthRoutes.AlterarPlaca> { }

export default function Controller({ navigation, params }: Props) {
  const presenter = usePresenter(() => new Presenter());
  const { dispatchSnack } = useVSSnack();
  const { setVeiculo } = useColeta();
  const storageContext = useStorage();
  const [veiculos, setVeiculos] = React.useState<IVeiculo[]>([]);
  const [veiculoAtual, setVeiculoAtual] = React.useState<IVeiculo>({});
  const [pesquisa, setPesquisa] = React.useState<string>('');

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);



  const pegarVeiculos = async (loadMore?: boolean) => {
    if (hasPages) {
      const amount = 10;
      if (loadMore) setLoadingMore(true);

      const response = await presenter.pegarVeiculos({ page, search: pesquisa, amount });

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
              setVeiculos(veiculos.concat(response.items));
            } else {
              setVeiculos(response.items);
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
      pegarVeiculos();
      if (!isSearch) setPage(1);
      if (!isSearch) setPesquisa('');
      if (!isSearch) setHasPages(true);
      if (!isSearch) Keyboard.dismiss();
      if (!isSearch) setRefreshing(false);
    });
  }, []);

  const onChangePesquisa = (text: string) => {
    setPesquisa(text);
    setPage(1);
    setHasPages(true);
    setLoadingData(true);
  };

  const onSelectVeiculo = async (veiculo: IVeiculo) => {
    if (veiculo.placa) {
      if (params.isSelect) {
        navigation.navigate<any>(params.screen, { veiculo });
      } else if (veiculoAtual?.codigo === veiculo.codigo) {
        navigation.goBack();
      } else {
        const response = await presenter.setVeiculo(veiculo);

        if (response instanceof Error) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: response.message,
          });
        } else {
          await storageContext.gravarAuditoria({
            codigoRegistro: 0,
            rotina: 'Alterar Placa',
            descricao: `Alterada configuração de placa: ${veiculo.placa}`,
            tipo: 'CONFIGURACOES',
          });
          setVeiculo(veiculo);
          dispatchSnack({
            type: 'open',
            alertType: 'success',
            message: I18n.t('screens.changeBoard.chageSuccess'),
          });
          navigation.goBack();
        }
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.changeBoard.changeError'),
      });
    }
  };

  const pegarVeiculoAtual = async () => {
    const response = await presenter.getVeiculo();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: 'Erro ao pegar placa atual',
      });
    } else if (response && response.codigo) {
      setVeiculoAtual(response);
    }
  };

  React.useEffect(() => {
    if (pesquisa.length > 0) {
      const timeout = setTimeout(() => {
        setVeiculo;
        pegarVeiculos();
      }, 500);

      return () => clearTimeout(timeout);
    } if (pesquisa.length === 0) {
      atualizar(true);
    }

    return () => { };
  }, [pesquisa]);



  React.useEffect(() => {
    (async () => {
      await pegarVeiculoAtual();
      // await pegarVeiculos();
    })()
  }, []);

  return {
    veiculos,
    loadingData,
    veiculoAtual,
    pesquisa,
    page,
    hasPages,
    refreshing,
    loadingMore,
    onSelectVeiculo,
    onChangePesquisa,
    atualizar,
    pegarVeiculos
  };
}

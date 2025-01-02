import * as React from 'react';
import { IPaginationResponse, timezoneDate, usePresenter, useVSAlert, useVSSnack, wait } from 'vision-common';
import { Keyboard } from 'react-native';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { useLoading } from '../../contextos/loadingContexto';
import { IImobilizado } from '../../../core/domain/entities/imobilizado';
import { IEquipamento } from '../../../core/domain/entities/equipamento';
import { useOffline } from '../../contextos/offilineContexto';
import { AuthRoutes } from '../../routes/routes';
import { useUser } from '../../contextos/usuarioContexto';
import { useColeta } from '../../contextos/coletaContexto';
import { IControllerAuth } from '../../routes/types';
import { useRascunho } from '../../contextos/rascunhoContexto';
import Decimal from 'decimal.js';

interface Props extends IControllerAuth<AuthRoutes.ListaEquipamentos> {}

export default function Controller({ navigation, params }: Props) {
  const { dispatchLoading } = useLoading();
  const { dispatchSnack } = useVSSnack();
  const { dispatchAlert } = useVSAlert();
  const { veiculo } = useColeta();
  const { rascunho } = useRascunho();
  const { usuario, configuracoes } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const { offline } = useOffline();
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [equipamentos, setEquipamentos] = React.useState<IImobilizado[]>([]);
  const [totalEquipamentos, setTotalEquipamentos] = React.useState<number>(0);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);

  const pegarEquipamentos = async (loadMore?: boolean, optionalSearch?: string) => {
    if (hasPages) {
      const amount = 20;
      if (loadMore) setLoadingMore(true);


      if (params.screen == AuthRoutes.Residuo) {
        let imobilizados: Error | IPaginationResponse<IImobilizado>;
        if (offline) {
          const response = await presenter.pegarTodosImobilizadosDevice({
            paginacao: {
              amount: 10,
              page: optionalSearch ? 1 : page,
              search: optionalSearch ?? pesquisa,
            }
          })
          if (response instanceof Error) {
            dispatchSnack({
              type: 'open',
              alertType: 'error',
              message: response.message,
            });
          } else {
            imobilizados = response
            setTotalEquipamentos(imobilizados.length);
            if (page <= imobilizados.pages) {
              if (imobilizados.items.length > 0) {
                if (loadMore) {
                  setEquipamentos(equipamentos.concat(imobilizados.items));
                } else {
                  setEquipamentos(imobilizados.items);
                }
              }

              setPage(prev => prev + 1);
            } else {
              setHasPages(false);
            }
            if (imobilizados.items.length < amount) {
              setHasPages(false);
            }
          }
        } else {
          const response = await presenter.pegarTodosImobilizados({
            paginacao: {
              amount: 10,
              page: optionalSearch ? 1 : page,
              search: optionalSearch ?? pesquisa,
            }
          })
          if (response instanceof Error) {
            dispatchSnack({
              type: 'open',
              alertType: 'error',
              message: response.message,
            });
          } else {
            imobilizados = response
            setTotalEquipamentos(imobilizados.length);
            if (page <= imobilizados.pages) {
              if (imobilizados.items.length > 0) {
                if (loadMore) {
                  setEquipamentos(equipamentos.concat(imobilizados.items));
                } else {
                  setEquipamentos(imobilizados.items);
                }
              }

              setPage(prev => prev + 1);
            } else {
              setHasPages(false);
            }

            if (imobilizados.items.length < amount) {
              setHasPages(false);
            }
          }
        }
      } else {
        const response = offline
          ? configuracoes.somenteEquipamentosPontoColeta || configuracoes.somenteEquipamentosGenericos
            ? await presenter.pegarEquipamentosContratosDevice(
              params.coleta?.codigoContratoObra ?? 0,
              {
                amount,
                page: optionalSearch ? 1 : page,
                search: optionalSearch ?? pesquisa,
              },
              params.equipamentos,
              rascunho?.residuos || [],
              configuracoes.controleEtapaImobilizados ?? false,
              configuracoes.somenteEquipamentosGenericos ?? false,
            )
            : await presenter.pegarEquipamentosDevice(
              {
                amount,
                page: optionalSearch ? 1 : page,
                search: optionalSearch ?? pesquisa,
              },
              params.equipamentos,
              configuracoes.controleEtapaImobilizados ?? false,
            )
          : await presenter.pegarEquipamentos(
            {
              amount,
              page: optionalSearch ? 1 : page,
              search: optionalSearch ?? pesquisa,
            },
            configuracoes.somenteEquipamentosPontoColeta || configuracoes.somenteEquipamentosGenericos
              ? params.coleta.codigoContratoObra
              : 0,
            params.equipamentos || [],
          );

        if (response instanceof Error) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: response.message,
          });
        } else if (response) {
          setTotalEquipamentos(response.length);
          if (optionalSearch) return response.items;

          if (page <= response.pages) {
            if (response.items.length > 0) {
              if (loadMore) {
                setEquipamentos(equipamentos.concat(response.items));
              } else {
                setEquipamentos(response.items);
              }
            }

            setPage(prev => prev + 1);
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
  }

  const verificaEquipamentoDuplicado = (imobilizado: IImobilizado) => {
    let founded: IEquipamento[] = [];

    if (params.equipamentos?.length > 0 && imobilizado.codigo) {
      founded = params.equipamentos.filter((item: IEquipamento) => item.codigoContainer === imobilizado.codigo);
    }

    return founded;
  };

  const verificaEquipamentoGenericoJaUtilizadoNaOS = (imobilizado: IImobilizado) => {
    const residuoGenericoMesmoImobilizado = rascunho?.residuos?.filter(residuoColeta =>
      new Decimal(residuoColeta?.codigoImobilizadoReal || '0').equals(new Decimal(imobilizado?.codigo || '0')),
    );

    return !!residuoGenericoMesmoImobilizado?.length;
  };

  const navigateToQRCode = () =>
    navigation.navigate(AuthRoutes.Scanner, {
      message: I18n.t('screens.equipamentList.scanMessage'),
      scanType: 'qr',
      screen: AuthRoutes.ListaEquipamentos,
    });

  const setToOfflineEquipamentObject = async (imobilizado: IImobilizado) => {
    const mensagem =
      params.equipamentoSubstituir && params.equipamentoSubstituir.codigoContainer
        ? I18n.t('screens.equipamentList.equipamentReplaceSuccess')
        : I18n.t('screens.equipamentList.equipamentAddSuccess');

    dispatchSnack({
      type: 'open',
      alertType: 'success',
      message: mensagem,
    });

    const equipamento: IEquipamento = {
      ...imobilizado,
      codigoCliente: params.coleta?.codigoCliente ?? undefined,
      codigoOS: params.coleta?.codigoOS ?? undefined,
      dataColocacao: timezoneDate(new Date()),
      dataRetirada: undefined,
      identificacao: imobilizado?.identificacao ?? '',
      codigoContainer: imobilizado?.codigo ?? undefined,
      descricaoContainer: imobilizado?.descricao ?? '',
      codigoMovimentacao: undefined,
      codigoObra: params.coleta?.codigoObra ?? undefined,
      naoGerarMovimentacao: imobilizado.naoGerarMovimentacao,
      xPesoEResiduoImobilizado: !!imobilizado?.xPesoEResiduoImobilizado,
    };

    navigation.navigate<any>(params.screen, { equipamento });
  };

  const substituirEquipamento = async (imobilizado: IImobilizado) => {
    if (offline || params.novaColeta || imobilizado.naoGerarMovimentacao) {
      await setToOfflineEquipamentObject(imobilizado);
    } else {
      const response = await presenter.substituirEquipamento({
        ordem: params.coleta,
        equipamento: params.equipamentoSubstituir,
        novoEquipamento: imobilizado,
        placaID: veiculo?.codigo ?? 0,
      });

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'success',
          message: I18n.t('screens.equipamentList.equipamentReplaceSuccess'),
        });

        navigation.navigate<any>(params.screen, { equipamento: response });
      }
    }
  };

  const adicionarEquipamento = async (imobilizado: IImobilizado) => {
    if (((offline || params.novaColeta) && veiculo.codigo) || imobilizado.naoGerarMovimentacao) {
      await setToOfflineEquipamentObject(imobilizado);
    } else {
      const response = await presenter.adicionarEquipamento({
        coleta: params.coleta,
        equipamento: imobilizado,
        placaID: veiculo?.codigo ?? 0,
      });

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'success',
          message: I18n.t('screens.equipamentList.equipamentAddSuccess'),
        });

        navigation.navigate<any>(params.screen, { equipamento: response });
      }
    }
  };

  const onSelectEquipamento = async (imobilizado: IImobilizado) => {
    if (params.screen == AuthRoutes.Residuo) {
      const codigoVinculo = `@IMOBILIZADO_RESIDUO:${
        params.residuo?.codigo
      }-${
        params.novaColeta?'CLIENTE':'OS'
      }:${
        params.novaColeta? params.codigoCliente: params.codigoColeta
      }`;

      presenter.vincularImobilizadoNoResiduo({codigoVinculo,imobilizado});
      navigation.navigate<any>(AuthRoutes.Residuo, { imobilizado });
      return;
    }

    const exist = params.equipamentos.filter(equipamento => equipamento.codigoContainer === imobilizado.codigo);

    if (exist.length > 0) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.equipamentList.equipamentExist'),
      });
    } else {
      dispatchLoading({ type: 'open' });

      if (imobilizado.codigo) {
        if (params.equipamentoSubstituir && params.equipamentoSubstituir.codigoContainer) {
          await substituirEquipamento(imobilizado);
        } else {
          await adicionarEquipamento(imobilizado);
        }
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.equipamentList.selectEquipamentError'),
        });
      }

      dispatchLoading({ type: 'close' });
    }
  };

  React.useEffect(() => {
    (async () => {
      if (params.scanData && params.scanData.length > 0) {
        let exist: IImobilizado[] = [];
        const response = await pegarEquipamentos(false, params.scanData);

        if (response && response.length > 0) {
          if (configuracoes?.habilitarCodIdentificacaoImobilizado) {
            exist = response.filter(
              (item: IImobilizado) => item?.identificacao && params.scanData.toLowerCase() === item.identificacao.toLowerCase(),
            );
          } else {
            exist = response.filter((item: IImobilizado) => Number(params.scanData) === item.codigo);
          }
        }

        if (exist && exist.length > 0) {
          onSelectEquipamento(exist?.shift() ?? {});
        } else {
          dispatchAlert({
            type: 'open',
            alertType: 'info',
            onPressRight: () => null,
            message: `EQUIPAMENTO ${params.scanData || ''} NÃO ENCONTRATO, OU NÃO DISPONÍVEL PARA ADICIONAR`,
          });
        }
      }

      return () => {};
    })();
  }, [params.scanData]);

  const atualizar = React.useCallback((isSearch?: boolean) => {
    if (!isSearch) setRefreshing(true);

    wait(!isSearch ? 2000 : 0).then(() => {
      pegarEquipamentos();
      if (!isSearch) setPage(1);
      if (!isSearch) setPesquisa('');
      if (!isSearch) setHasPages(true);
      if (!isSearch) Keyboard.dismiss();
      if (!isSearch) setRefreshing(false);
    });

    return () => {};
  }, []);

  React.useEffect(() => {
    if (pesquisa.length > 0) {
      const timeout = setTimeout(() => {
        setEquipamentos([]);
        pegarEquipamentos();
      }, 500);

      return () => clearTimeout(timeout);
    }
    if (pesquisa.length === 0) {
      atualizar(true);
    }

    return () => {};
  }, [pesquisa]);

  const onChangePesquisa = (text: string) => {
    setPesquisa(text);
    setPage(1);
    setHasPages(true);
    setLoadingData(true);
  };

  React.useEffect(() => {
    pegarEquipamentos();
    return () => {};
  }, []);

  return {
    pesquisa,
    refreshing,
    configuracoes,
    loadingMore,
    equipamentos,
    loadingData,
    hasPages,
    totalEquipamentos,
    atualizar,
    verificaEquipamentoGenericoJaUtilizadoNaOS,
    verificaEquipamentoDuplicado,
    navigateToQRCode,
    pegarEquipamentos,
    onSelectEquipamento,
    onChangePesquisa,
  };
}

import * as React from 'react';
import { ILocalStorageConnection, usePresenter, useVSAlert, useVSSnack, wait } from 'vision-common';
import { Keyboard } from 'react-native';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { IResiduo } from '../../../core/domain/entities/residuo';
import { AuthRoutes } from '../../routes/routes';
import { useUser } from '../../contextos/usuarioContexto';
import { IControllerAuth } from '../../routes/types';
import { useRascunho } from '../../contextos/rascunhoContexto';
import Decimal from 'decimal.js';
import { IOrder } from '../../../core/domain/entities/order';
import { useLoading } from '../../contextos/loadingContexto';
import { useStorage } from '../../contextos/storageContexto';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import { IConfiguracao } from '../../../core/domain/entities/configuracao';
import { $SETTINGS_KEY } from '../../../core/constants';

interface Props extends IControllerAuth<AuthRoutes.ListaResiduos> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { dispatchAlert } = useVSAlert();
  const { dispatchLoading } = useLoading();
  const storageContext = useStorage();
  const { usuario, configuracoes } = useUser();
  const { rascunho, atualizarGravarRascunho, pegarRascunho } = useRascunho();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [residuos, setResiduos] = React.useState<IResiduo[]>([]);
  const [residuosPesagem, setResiduosPesagem] = React.useState<IResiduo[]>([]);
  const [residuoGenerico, setResiduoGenerico] = React.useState<IResiduo>();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [hasPages, setHasPages] = React.useState<boolean>(true);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const [numeroCasasDecimais, setNumeroCasasDecimais] = React.useState<number>(2);

  const pegarResiduos = async (loadMore?: boolean) => {
    if (hasPages) {
      const amount = 10;
      if (loadMore) setLoadingMore(true);

      // PROVISÓRIO ATÈ POLETTO ARRUMAR API ONLINE, OU SEJA, FOREVER CLEITON
      const response = await presenter.pegarResiduosDevice({
        pagination: {
          page,
          search: pesquisa,
          amount,
        },
        contratoID: params.contratoID,
        clienteID: params.clienteID,
        imobilizadoGenerico: Boolean(params.imobilizadoPesagem?.codigoImobilizadoGenerico),
      });

      // const response = offline
      //   ? await presenter.pegarResiduosDevice(page, pesquisa, amount, contratoID, clienteID)
      //   : await presenter.pegarResiduos(page, pesquisa, amount, contratoID, clienteID);

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else if (response && response.items.length > 0) {
        if (page <= response.pages) {
          if (configuracoes.permitirResiduosDuplicados) {
            const listaResiduos: IResiduo[] = [];

            response.items.forEach(element => {
              const founded = params.residuos.filter(residuo => element.codigo === residuo.codigo);

              if (founded.length === 0) {
                listaResiduos.push(element);
              }
            });

            if (listaResiduos.length > 0) {
              if (loadMore) {
                setResiduos(residuos.concat(listaResiduos));
              } else {
                setResiduos(listaResiduos);
              }
            }
            setPage(prev => prev + 1);
          } else {
            if (response.items.length > 0) {
              if (loadMore) {
                setResiduos(residuos.concat(response.items));
              } else {
                setResiduos(response.items);
              }
            }
            setPage(prev => prev + 1);
          }
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
      pegarResiduos();
      if (!isSearch) setPage(1);
      if (!isSearch) setPesquisa('');
      if (!isSearch) setHasPages(true);
      if (!isSearch) Keyboard.dismiss();
      if (!isSearch) setRefreshing(false);
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      if (params.imobilizadoPesagem && params.imobilizadoPesagem?.codigoImobilizadoGenerico) {
        const residuoGenericoImobilizado = await presenter.pegarImobilizadoGenericoPorCodigo(
          params.imobilizadoPesagem?.codigoImobilizadoGenerico || 0,
        );

        if (residuoGenericoImobilizado instanceof Error) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: residuoGenericoImobilizado.message,
          });

          return;
        }

        if (!residuoGenericoImobilizado.codigo || residuoGenericoImobilizado.codigo === 0) {
          dispatchAlert({
            type: 'open',
            alertType: 'info',
            onPressRight: () => null,
            message: 'Imobilizado genérico não encontrado nos resíduos da OS',
          });

          navigation.goBack();

          return;
        }

        setResiduoGenerico(residuoGenericoImobilizado);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (pesquisa.length > 0) {
      const timeout = setTimeout(() => {
        setResiduos([]);
        pegarResiduos();
      }, 500);

      return () => clearTimeout(timeout);
    }
    if (pesquisa.length === 0) {
      atualizar(true);
    }

    return () => { };
  }, [pesquisa]);

  const verificaResiduoDuplicado = (residuo: IResiduo) => {
    let founded: IResiduo[] = [];

    if (params.residuos?.length > 0 && residuo.codigo) {
      founded = params.residuos.filter((item: IResiduo) => item.codigo === residuo.codigo);
    }

    return founded;
  };

  const onChangePesquisa = (text: string) => {
    setPesquisa(text);
    setPage(1);
    setHasPages(true);
    setLoadingData(true);
  };
  const onFocusQuantidade = (index: number) => {
    if (residuos?.length > 0) {
      const residuosIndex = residuos.filter((residuoFocus, fotusIndex) => {
        if (fotusIndex === index) {
          residuoFocus.quantidade =
            residuoFocus?.quantidade && parseFloat(residuoFocus?.quantidade ?? '0') !== 0
              ? String(residuoFocus?.quantidade ?? '').replace(/ /g, '')
              : '';
        }

        return residuoFocus;
      });

      if (residuosIndex?.length > 0) {
        setResiduos(residuosIndex);
      }
    }
  };

  const onChangeQuantidadeResiduo = (index: number, quantidade: string) => {
    const residuosIndex = residuos.filter((_residuo, _index) => {
      if (_index === index) {
        _residuo.quantidade = quantidade
          ? String(quantidade ?? '')
            .replace('.', ',')
            .replace(/ /g, '')
          : quantidade;
      }

      return _residuo;
    });

    if (residuosIndex?.length > 0) {
      setResiduos(residuosIndex);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.amountChangeError'),
      });
    }
  };

  const onBlurQuantidade = (index: number) => {
    if (residuos?.length > 0) {
      const residuosIndex = residuos.filter((value, _index) => {
        if (_index === index) {
          value.quantidade = value?.quantidade ? String(value?.quantidade ?? '').replace(/ /g, '') : '0';
        }
        return value;
      });

      if (residuosIndex?.length > 0) {
        setResiduos(residuosIndex);
      }
    }
  };

  const iLocalStorageConnection: ILocalStorageConnection = new LocalStorageConnection();

  const pegarNumeroCasasDecimais = async () => {
    const response = await iLocalStorageConnection.getStorageDataObject<IConfiguracao>($SETTINGS_KEY);
    setNumeroCasasDecimais(response?.numeroCasasDecimaisResiduos ?? 2);
  };

  React.useEffect(() => {
    pegarNumeroCasasDecimais();
  }, []);

  const contarCasasDecimais = (numeroStr: string): number => {
    return numeroCasasDecimais ?? 2;
    //provisório até ter tempo para resolver
    // if (!numeroStr) return 0;

    // let partes: string[] = [];

    // if (numeroStr.includes('.')) {
    //   partes = numeroStr.split('.');
    // } else {
    //   partes = numeroStr.split(',');
    // }

    // if (partes.length > 1) {
    //   return partes[1].length;
    // }

    // return 0;
  };

  const arredondaPesoBruto = () => {
    return new Decimal((params.imobilizadoPesagem?.pesoBruto ?? '0').replace(',', '.')).toFixed(numeroCasasDecimais).toString()
  }

  const calculaPesoLiquido = () => {
    const pesoBrutoString = String(params.imobilizadoPesagem?.pesoBruto ?? 0);
    const taraString = String(residuoGenerico?.tara ?? 0);
    const casasDecimais = contarCasasDecimais(pesoBrutoString);

    const pesoBruto = new Decimal(pesoBrutoString.replace(',', '.'));
    const tara = new Decimal(taraString.replace(',', '.'));

    const pesoLiquido = pesoBruto.minus(tara).abs();

    if (pesoLiquido.isNaN()) return new Decimal(0);

    if (casasDecimais > 0) return pesoLiquido.toFixed(casasDecimais);

    return pesoLiquido;
  };

  const confirmarResiduosSelecionadosPesagem = async () => {
    setIsSaving(true);
    dispatchLoading({ type: 'open' });

    try {
      if (!residuosPesagem || residuosPesagem?.length === 0) {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: 'Você deve selecionar ao menos 1 resíduo',
        });

        return;
      }

      const residuosSemPeso =
        residuosPesagem.length > 1 &&
        residuos.some(_residuo => residuosPesagem.includes(_residuo) && (!_residuo.quantidade || _residuo.quantidade === '0'));

      if (residuosSemPeso) {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: 'Você deve informar manualmente os pesos dos resíduos',
        });

        return;
      }

      if (!residuoGenerico?.codigo) {
        dispatchAlert({
          type: 'open',
          alertType: 'info',
          onPressRight: () => null,
          message: 'Imobilizado genérico não encontrado nos resíduos da OS',
        });

        navigation.goBack();

        return;
      }

      const novosResiduos = residuos.filter(_residuo => residuosPesagem.includes(_residuo));

      if (!novosResiduos) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: 'Ocorreu um erro ao tratar os resíduos',
        });

        return;
      }

      let pesoResiduos = new Decimal(0);
      const pesoLiquido = calculaPesoLiquido();
      const casasDecimais = contarCasasDecimais(String(pesoLiquido));

      novosResiduos.forEach(_novoResiduo => {
        const quantidade = String(_novoResiduo.quantidade ?? 0);

        if (quantidade !== '0') {
          pesoResiduos = pesoResiduos.plus(quantidade.replace(',', '.'));
        }
      });

      let pesoValidacao: any;

      if (casasDecimais > 0) {
        pesoValidacao = pesoResiduos.toFixed(casasDecimais);
      } else {
        pesoValidacao = pesoResiduos;
      }

      if (pesoValidacao < pesoLiquido && novosResiduos.length > 1) {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: `Você deve informar um peso máximo de ${pesoLiquido}`,
        });

        return;
      } else if (pesoResiduos > pesoLiquido && novosResiduos.length > 1) {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: `A soma dos pesos passa do peso líquido de ${pesoLiquido}`,
        });

        return;
      }

      // Caso tenha 1 resíduo deve fazer o cálculo automáticamente e atribuir na quantidade
      if (novosResiduos.length === 1) {
        novosResiduos.forEach(_residuo => {
          _residuo.quantidade = calculaPesoLiquido().toString();
        });
      }

      const residuoGenericoImobilizado = residuoGenerico;

      residuoGenericoImobilizado.quantidade = '1';
      residuoGenericoImobilizado.codigoImobilizadoReal = String(params.imobilizadoPesagem?.codigoContainer || '0');
      residuoGenericoImobilizado.pesoBruto = String(params.imobilizadoPesagem?.pesoBruto || '0');
      residuoGenericoImobilizado.residuosSecundarios = novosResiduos;

      await adicionarResiduosNaOS(residuoGenericoImobilizado);

      const codigo = params.novaColeta ? rascunho?.codigoCliente : rascunho?.codigoOS;

      await storageContext.gravarAuditoria({
        codigoRegistro: codigo,
        rotina: 'Genérico',
        descricao: `Adicionado Genérico: ${residuoGenericoImobilizado?.codigoImobilizadoReal}`,
        tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
      });

      navigation.navigate<any>(params.screen, { equipamentoRemovidoParams: params.imobilizadoPesagem });
    } finally {
      setIsSaving(false);
      dispatchLoading({ type: 'close' });
    }
  };

  const adicionarResiduosNaOS = async (residuoGenericoImobilizado: IResiduo) => {
    const residuosRascunho = rascunho?.residuos || [];
    let newResiduosRascunho: IResiduo[] = [];

    if (residuoGenericoImobilizado?.residuosSecundarios && residuoGenericoImobilizado.residuosSecundarios?.length > 0) {
      residuosRascunho.forEach(_residuoRascunho => {
        let existeResiduo = false;

        residuoGenericoImobilizado.residuosSecundarios?.forEach(_residuosSecundario => {
          if (_residuoRascunho.codigo === _residuosSecundario.codigo) {
            existeResiduo = true;
          }
        });

        if (!existeResiduo) newResiduosRascunho.push(_residuoRascunho);
      });
    }

    const novoRascunho = await pegarRascunho(rascunho as IOrder);

    await atualizarGravarRascunho(

      { ...novoRascunho, residuos: [...newResiduosRascunho, residuoGenericoImobilizado] });
  };

  const onPressDiminuirQuantidade = (index: number) => {
    const residuosIndex = residuos.filter((_residuo, _index) => {
      if (_index === index) {
        if (Number(_residuo.quantidade) !== 0) {
          const quantidade = parseFloat(_residuo?.quantidade ?? '') - 1;
          _residuo.quantidade = quantidade.toString();
        }
      }

      return _residuo;
    });

    if (residuosIndex?.length > 0) {
      setResiduos(residuosIndex);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.amountDimError'),
      });
    }
  };

  const onPressAdicionarQuantidade = (index: number) => {
    const residuosIndex = residuos.filter((_residuo, _index) => {
      if (_index === index) {
        const quantidade = parseFloat(_residuo?.quantidade ?? '0') + 1;
        _residuo.quantidade = quantidade.toString();
      }

      return _residuo;
    });

    if (residuosIndex?.length > 0) {
      setResiduos(residuosIndex);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.amountMoreError'),
      });
    }
  };

  const selecionarResiduoPesagem = (residuo: IResiduo, index: number) => {
    const ehResiduoGenerico = residuo.codigo === params.imobilizadoPesagem?.codigoImobilizadoGenerico;
    const jaAdicionado = !!residuosPesagem.find(_residuo => _residuo.codigo === residuo.codigo)?.codigo;

    if (ehResiduoGenerico) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'Resíduo Genérico do imobilizado não pode ser selecionado',
      });

      return;
    }

    if (jaAdicionado) {
      const residuosIndex = residuos.filter((_residuo, _index) => {
        if (_index === index) {
          const quantidade = 0;
          _residuo.quantidade = quantidade.toString();
        }

        return _residuo;
      });

      if (residuosIndex?.length > 0) {
        setResiduos(residuosIndex);
      }

      setResiduosPesagem(prev => prev.filter(_prev => _prev.codigo !== residuo.codigo));
    } else setResiduosPesagem(prev => [...prev, residuo]);
  };

  const verificaResiduoPesagem = (codigoResiduo: number) =>
    !!residuosPesagem.find(_residuo => _residuo.codigo === codigoResiduo)?.codigo;

  const onSelectResiduo = (residuo: IResiduo) => {
    if (residuo.codigo) {

      if (Boolean(residuo.xColetarSomenteComEquipamento)) {
        dispatchAlert({
          type: 'open',
          alertType: 'info',
          onPressRight: () => null,
          message: 'PARA A COLETA DESSE RESÍDUO É NECESSÁRIO USAR UM EQUIPAMENTO'
        });

        return;
      }

      const founded = verificaResiduoDuplicado(residuo);

      navigation.navigate(AuthRoutes.Residuo, {
        residuo,
        adicionado: founded?.length > 1 ? false : founded?.length > 0,
        duplicado: founded?.length > 1,
        isEdit: false,
        photo: {},
        balanca: {},
        codigoCliente: params.clienteID,
        codigoColeta: params.codigoColeta,
        novaColeta: params.novaColeta,
        residuos: params.residuos,
      });
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.residuesList.selectResidueError'),
      });
    }
  };

  return {
    pesquisa,
    refreshing,
    loadingMore,
    residuos,
    loadingData,
    hasPages,
    residuoGenerico,
    residuosPesagem,
    isSaving,
    numeroCasasDecimais,
    atualizar,
    onPressDiminuirQuantidade,
    onChangeQuantidadeResiduo,
    selecionarResiduoPesagem,
    onPressAdicionarQuantidade,
    verificaResiduoPesagem,
    confirmarResiduosSelecionadosPesagem,
    pegarResiduos,
    onFocusQuantidade,
    onBlurQuantidade,
    onSelectResiduo,
    onChangePesquisa,
    calculaPesoLiquido,
    verificaResiduoDuplicado,
    arredondaPesoBruto
  };
}
function pegarNumeroCasasDecimais() {
  throw new Error('Function not implemented.');
}


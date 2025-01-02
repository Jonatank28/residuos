import * as React from 'react';
import { usePresenter, useVSAlert, useVSSnack, wait } from 'vision-common';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { IEquipamento } from '../../../../core/domain/entities/equipamento';
import { useLoading } from '../../../contextos/loadingContexto';
import { useRascunho } from '../../../contextos/rascunhoContexto';
import { useOffline } from '../../../contextos/offilineContexto';
import { useUser } from '../../../contextos/usuarioContexto';
import { IControllerAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import { Keyboard } from 'react-native';
import Decimal from 'decimal.js';
import { useStorage } from '../../../contextos/storageContexto';

interface Props extends IControllerAuth<AuthRoutes.EquipamentosDaColeta> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { dispatchLoading } = useLoading();
  const { offline } = useOffline();
  const storageContext = useStorage();
  const { usuario, configuracoes } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const { dispatchAlert } = useVSAlert();
  const { rascunho, atualizarGravarRascunho } = useRascunho();
  const [codigoPlaca, setCodigoPlaca] = React.useState<number>();
  const [equipamentos, setEquipamentos] = React.useState<IEquipamento[]>([]);
  const [equipamentosRetirados, setEquipamentosRetirados] = React.useState<IEquipamento[]>([]);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = React.useState<IEquipamento>({});
  const [tipoMovimentacao, setTipoMovimentacao] = React.useState<'SUBSTITUIR' | 'REMOVER' | ''>('');
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [pesquisa, setPesquisa] = React.useState<string>('');
  const [equipamentosFiltrados, setEquipamentosFiltrados] = React.useState<IEquipamento[]>([]);
  const totalEquipamentos = React.useMemo(() => equipamentosFiltrados.length, [equipamentosFiltrados]);
  const totalResiduos = React.useMemo(() => rascunho?.residuos?.length || 0, [rascunho]);

  const [equipamentoPesoImobilizadoAlert, setEquipamentoPesoImobilizadoAlert] = React.useState<IEquipamento>({});
  const [equipamentoPesoTara, setEquipamentoPesoTara] = React.useState<number>(0);

  const fetchData = React.useCallback(async () => {
    if (equipamentoPesoImobilizadoAlert && equipamentoPesoImobilizadoAlert?.codigoImobilizadoGenerico) {
      const residuoGenericoImobilizado = await presenter.pegarImobilizadoGenericoPorCodigo(
        equipamentoPesoImobilizadoAlert?.codigoImobilizadoGenerico || 0,
      );

      if (residuoGenericoImobilizado instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: residuoGenericoImobilizado.message,
        });

        return;
      }

      setEquipamentoPesoTara(residuoGenericoImobilizado?.tara || 0);
    }
  }, [equipamentoPesoImobilizadoAlert]);

  const memoizedEquipamentoPesoTara = React.useMemo(() => {
    return equipamentoPesoTara;
  }, [equipamentoPesoTara]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onChangePesquisa = (text: string) => {
    setPesquisa(text);
    setLoadingData(true);
  };

  const atualizar = React.useCallback((isSearch?: boolean) => {
    setLoadingData(false);

    wait(!isSearch ? 2000 : 0).then(() => {
      if (!isSearch) setPesquisa('');
      if (!isSearch) Keyboard.dismiss();
    });
  }, []);

  const pegarEquipamentosFiltrados = async (_equipamentos?: IEquipamento[]) => {
    let newEquipamentos: IEquipamento[] = [];

    if (_equipamentos) {
      newEquipamentos = _equipamentos.filter(eq => {
        return (
          String(eq.codigoContainer).includes(pesquisa) ||
          String(eq.identificacao).toLocaleLowerCase()?.includes(pesquisa.toLocaleLowerCase()) ||
          String(eq.descricaoContainer).toLowerCase()?.includes(pesquisa.toLocaleLowerCase())
        );
      });
    } else {
      newEquipamentos = equipamentos.filter(eq => {
        return (
          String(eq.codigoContainer).includes(pesquisa) ||
          String(eq.identificacao).toLocaleLowerCase()?.includes(pesquisa.toLocaleLowerCase()) ||
          String(eq.descricaoContainer).toLowerCase()?.includes(pesquisa.toLocaleLowerCase())
        );
      });
    }

    setEquipamentosFiltrados(newEquipamentos);
    setLoadingData(false);
  };

  React.useEffect(() => {
    if (pesquisa.length > 0) {
      const timeout = setTimeout(() => {
        setEquipamentosFiltrados([]);
        pegarEquipamentosFiltrados();
      }, 1000);

      return () => clearTimeout(timeout);
    }
    if (pesquisa.length === 0) {
      atualizar(true);
      pegarEquipamentosFiltrados();
    }

    return () => { };
  }, [pesquisa]);

  const goBackFunction = async () => {
    if (rascunho?.codigoCliente || rascunho?.codigoOS) {
      await atualizarGravarRascunho(
        rascunho
          ? {
            ...rascunho,
            equipamentos,
            equipamentosRetirados,
          }
          : {
            ...params.coleta,
            equipamentos,
            equipamentosRetirados,
          },
      );
    }

    navigation.goBack();
  };

  const pegarEquipamentosColeta = async (clienteID: number) => {
    setLoadingData(true);

    const somenteEquipamentosComPontoColeta = configuracoes?.somenteEquipamentosPontoColeta;
    const mostrarEquipamentosComPontoColetaOuCliente = Boolean(configuracoes?.mostrarEquipamentosPontoColetaOuCliente);

    if (somenteEquipamentosComPontoColeta && !params.coleta?.codigoObra) {
      setEquipamentos([]);
      atualizar();
      setLoadingData(false);
      return;
    }

    const response = offline
      ? await presenter.pegarEquipamentosDevice(
        clienteID,
        params.coleta?.codigoObra,
        configuracoes?.mostrarEquipamentosPontoColetaOuCliente,
      )
      : await presenter.pegarEquipamentos(clienteID, params.coleta?.codigoObra);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response?.length > 0) {
      if ((somenteEquipamentosComPontoColeta || mostrarEquipamentosComPontoColetaOuCliente) && params.coleta.equipamentos) {
        const novosEquipamentos = [
          ...response,
          ...params.coleta.equipamentos.filter(e => {
            const equipamentosPorObra = Boolean(params.coleta.codigoObra && params.coleta.codigoObra !== 0);

            if (equipamentosPorObra && e.codigoObra === params.coleta.codigoObra) {
              return e;
            } else if (
              mostrarEquipamentosComPontoColetaOuCliente &&
              !equipamentosPorObra &&
              (!e.codigoObra || e.codigoObra === 0)
            ) {
              return e;
            }
          }),
        ];

        const unique = [...new Map(novosEquipamentos.map(m => [m.codigoContainer, m])).values()];

        setEquipamentos(unique);
        setEquipamentosFiltrados(unique);
      } else {
        setEquipamentos(response);
        setEquipamentosFiltrados(response);
      }
    } else if (response?.length === 0) {
      if ((somenteEquipamentosComPontoColeta || mostrarEquipamentosComPontoColetaOuCliente) && params.coleta.equipamentos) {
        const novosEquipamentos = [
          ...response,
          ...params.coleta.equipamentos.filter(e => {
            const equipamentosPorObra = Boolean(params.coleta.codigoObra && params.coleta.codigoObra !== 0);

            if (equipamentosPorObra && e.codigoObra === params.coleta.codigoObra) {
              return e;
            } else if (
              mostrarEquipamentosComPontoColetaOuCliente &&
              !equipamentosPorObra &&
              (!e.codigoObra || e.codigoObra === 0)
            ) {
              return e;
            }
          }),
        ];

        const unique = [...new Map(novosEquipamentos.map(m => [m.codigoContainer, m])).values()];

        setEquipamentos(unique);
        setEquipamentosFiltrados(unique);
      }
    }

    setLoadingData(false);
  };

  const onPressDelete = (equipamento: IEquipamento) => {
    if (equipamento?.codigoContainer) {
      const newEquipamentos = equipamentos.filter((item: IEquipamento) => item.codigoContainer !== equipamento.codigoContainer);
      setEquipamentos(newEquipamentos);
      pegarEquipamentosFiltrados(newEquipamentos);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectEquipament.invalidCode'),
      });
    }
  };

  const continuarColeta = async () => {
    const newColeta = rascunho
      ? {
        ...rascunho,
        equipamentosRetirados,
        equipamentos,
      }
      : {
        ...params.coleta,
        equipamentosRetirados,
        equipamentos,
      };

    await atualizarGravarRascunho({
      ...newColeta,
    });

    navigation.navigate(AuthRoutes.ColetaResponsavel, {
      coleta: newColeta,
      novaColeta: params.novaColeta,
      assinatura: '',
      mtr: {},
      photo: {},
      scanData: '',
    });
  };

  const pegarVeiculo = async () => {
    const response = await presenter.pegarVeiculo();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (response && response.codigo) {
      setCodigoPlaca(response.codigo);
    }
  };

  const mensagemEquipamentoRemovido = async (equipamentoScan: IEquipamento) => {
    dispatchSnack({
      type: 'open',
      alertType: 'success',
      message: I18n.t('screens.collectEquipament.removeEquipamentSuccess'),
    });

    if (equipamentoScan?.codigoMovimentacao || equipamentoSelecionado?.codigoMovimentacao) {
      const equipamentoRetirado = equipamentoScan?.codigoContainer ? equipamentoScan : equipamentoSelecionado;

      setEquipamentosRetirados([
        ...equipamentosRetirados,
        {
          ...equipamentoRetirado,
          dataRetirada: new Date(),
        },
      ]);
    }

    onPressDelete(equipamentoScan?.codigoContainer ? equipamentoScan : equipamentoSelecionado);
    setEquipamentoSelecionado({});
    navigation.setParams({ scanData: '' });
  };

  const removerEquipamentoOnline = async (equipamentoScan: IEquipamento) => {
    const response = await presenter.removerEquipamento(
      equipamentoScan?.codigoContainer ? equipamentoScan : equipamentoSelecionado,
      codigoPlaca ?? 0,
      params.coleta?.codigoOS ?? 0,
      params.coleta.codigoOrdem ?? 0,
    );

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      mensagemEquipamentoRemovido(equipamentoScan);
    }
  };

  const removerEquipamento = async (equipamentoScan?: IEquipamento) => {
    dispatchLoading({ type: 'open' });
    const codigoContainer = equipamentoScan?.codigoContainer ?? equipamentoSelecionado?.codigoContainer;
    const naoGerarMovimentacao = equipamentoScan?.naoGerarMovimentacao ?? equipamentoSelecionado?.naoGerarMovimentacao;

    if (codigoContainer && equipamentoScan) {
      if (offline || params.novaColeta || naoGerarMovimentacao) {
        onPressDelete(equipamentoScan?.codigoContainer ? equipamentoScan : equipamentoSelecionado);

        mensagemEquipamentoRemovido(equipamentoScan);
      } else {
        await removerEquipamentoOnline(equipamentoScan);
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectEquipament.selectEquipamentError'),
      });
    }

    dispatchLoading({ type: 'close' });
  };

  const navigateToListaEquipamentos = (_equipamento?: IEquipamento) => {
    if (_equipamento?.codigoContainer) {
      if (_equipamento?.codigoMovimentacao) {
        setEquipamentosRetirados([
          ...equipamentosRetirados,
          {
            ..._equipamento,
            dataRetirada: new Date(),
          },
        ]);
      }
    }

    navigation.navigate(AuthRoutes.ListaEquipamentos, {
      screen: AuthRoutes.EquipamentosDaColeta,
      coleta: params.coleta,
      equipamentoSubstituir: !_equipamento ? {} : params.equipamento,
      equipamentos,
      novaColeta: params.novaColeta,
      scanData: '',
    });

    if (_equipamento?.codigoContainer) onPressDelete(_equipamento);
  };

  const showSubstituirAlert = (item: IEquipamento) =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: I18n.t('screens.collectEquipament.replaceMessage'),
      onPressRight: async () => {
        if (Boolean(item?.xPesoEResiduoImobilizado)) {
          const codigo = params.novaColeta ? params.coleta?.codigoCliente : params.coleta?.codigoOS;

          await storageContext.gravarAuditoria({
            codigoRegistro: codigo,
            descricao: `Clicou em substituir equipamento: ${item?.codigoContainer}`,
            rotina: 'Clicou em Substituir Equipamento',
            tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
          });

          const residuoGenericoMesmoImobilizado = rascunho?.residuos?.filter(residuoColeta =>
            new Decimal(residuoColeta?.codigoImobilizadoReal || '0').equals(new Decimal(item?.codigoContainer || '0')),
          );

          if (!!residuoGenericoMesmoImobilizado?.length) {
            // dispatchSnack({
            //   type: 'open',
            //   alertType: 'info',
            //   message: 'Já existe um imobilizado genérico adicionado na OS',
            // });

            navigateToListaEquipamentos(item);

            return;
          }

          setTipoMovimentacao('SUBSTITUIR');
          setEquipamentoPesoImobilizadoAlert(item);

          return;
        }

        navigateToListaEquipamentos(item);
      },
    });

  const navigateToQRCode = () =>
    navigation.navigate(AuthRoutes.Scanner, {
      message: I18n.t('screens.collectEquipament.scanMessage'),
      scanType: 'qr',
      screen: AuthRoutes.EquipamentosDaColeta,
    });

  const verificaScan = async () => {
    const exist = equipamentos.filter((item: IEquipamento) => Number(params.scanData) === item.codigoContainer);

    if (exist && exist.length > 0) {
      const equipamento = exist.shift();

      if (!equipamento) return;

      showRemoverEquipamentoAlert(equipamento);
    } else {
      dispatchAlert({
        type: 'open',
        alertType: 'info',
        onPressRight: () => null,
        message: `EQUIPAMENTO ${params.scanData || ''} NÃO ENCONTRATO, OU NÃO DISPONÍVEL PARA REMOVER`,
      });
    }
  };

  const verificarEquipamentosExistePendente = async () => {
    const response = await presenter.verificarExisteEquipamentosPendentes(params.coleta);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: response.message,
      });
    } else if (response?.length > 0) {
      setEquipamentos(response);
      pegarEquipamentosFiltrados(response);
    }
  };

  React.useEffect(() => {
    if (params.coleta?.equipamentos && params.coleta.equipamentos?.length > 0) {
      const somenteEquipamentosComPontoColeta = configuracoes?.somenteEquipamentosPontoColeta;
      const mostrarEquipamentosComPontoColetaOuCliente = configuracoes?.mostrarEquipamentosPontoColetaOuCliente;

      if ((somenteEquipamentosComPontoColeta || mostrarEquipamentosComPontoColetaOuCliente) && params.coleta.codigoCliente) {
        pegarEquipamentosColeta(params.coleta.codigoCliente);
      } else {
        setEquipamentos(params.coleta.equipamentos);
        pegarEquipamentosFiltrados(params.coleta.equipamentos);
      }
    } else if (
      params.novaColeta &&
      params.coleta?.codigoCliente &&
      !params.coleta?.equipamentos &&
      !params.coleta?.equipamentosRetirados
    ) {
      pegarEquipamentosColeta(params.coleta.codigoCliente);
    }

    if (params.coleta?.equipamentosRetirados && params.coleta.equipamentosRetirados?.length > 0) {
      setEquipamentosRetirados(params.coleta.equipamentosRetirados);
    }

    verificarEquipamentosExistePendente();
    pegarVeiculo();

    return () => { };
  }, [params.coleta]);

  React.useEffect(() => {
    if (params.scanData?.length > 0) {
      verificaScan();
    }
  }, [params.scanData]);

  React.useEffect(() => {
    if (params.equipamento?.codigoContainer) {
      const exist = equipamentos.filter((item: IEquipamento) => params.equipamento.codigoContainer === item.codigoContainer);

      if (exist && exist.length > 0) {
        const newEquipamentos = equipamentos.map(item =>
          item.codigoContainer !== params.equipamento.codigoContainer ? item : params.equipamento,
        );
        setEquipamentos(newEquipamentos);
        pegarEquipamentosFiltrados(newEquipamentos);
      } else {
        setEquipamentos([...equipamentos, params.equipamento]);
        pegarEquipamentosFiltrados([...equipamentos, params.equipamento]);
      }
    }
  }, [params.equipamento]);

  const continuarPesoBrutoAsync = () => {
    if (tipoMovimentacao === 'REMOVER') {
      if (equipamentoPesoImobilizadoAlert && equipamentoPesoImobilizadoAlert.codigoContainer) {
        setEquipamentoSelecionado(equipamentoPesoImobilizadoAlert);
      }

      removerEquipamento(equipamentoPesoImobilizadoAlert);
    } else {
      navigateToListaEquipamentos(equipamentoPesoImobilizadoAlert);
    }

    setTipoMovimentacao('');
  };

  const navegarParaAdicionarResiduosPesagem = (pesoBruto: string) => {
    if (!equipamentoPesoImobilizadoAlert?.codigoImobilizadoGenerico || !equipamentoPesoImobilizadoAlert?.codigoContainer) {
      dispatchAlert({
        type: 'open',
        alertType: 'info',
        onPressRight: () => null,
        message: 'Imobilizado genérico não encontrado no cadastro de imobilizado',
      });

      return;
    }

    navigation.navigate(AuthRoutes.ListaResiduos, {
      residuos: [],
      contratoID: params.coleta?.codigoContratoObra ?? 0,
      clienteID: params.coleta?.codigoCliente ?? 0,
      screen: AuthRoutes.EquipamentosDaColeta,
      novaColeta: params.novaColeta,
      imobilizadoPesagem: { ...equipamentoPesoImobilizadoAlert, pesoBruto },
    });
  };

  const showRemoverEquipamentoAlert = (equipamentoSelecionado: IEquipamento) => {
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: `Tem certeza que deseja remover o equipamento ${equipamentoSelecionado?.codigoContainer || ''}?`,
      textRight: I18n.t('screens.collectEquipament.remove'),
      onPressRight: async () => {
        if (Boolean(equipamentoSelecionado?.xPesoEResiduoImobilizado)) {
          const codigo = params.novaColeta ? params.coleta?.codigoCliente : params.coleta?.codigoOS;

          await storageContext.gravarAuditoria({
            codigoRegistro: codigo,
            descricao: `Clicou em remover equipamento: ${equipamentoSelecionado?.codigoContainer}`,
            rotina: 'Clicou em Remover Equipamento',
            tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
          });

          const residuoGenericoMesmoImobilizado = rascunho?.residuos?.filter(residuoColeta =>
            new Decimal(residuoColeta?.codigoImobilizadoReal || '0').equals(
              new Decimal(equipamentoSelecionado?.codigoContainer || '0'),
            ),
          );

          if (!!residuoGenericoMesmoImobilizado?.length) {
            // dispatchSnack({
            //   type: 'open',
            //   alertType: 'info',
            //   message: 'Já existe um imobilizado genérico adicionado na OS',
            // });

            if (equipamentoSelecionado && equipamentoSelecionado.codigoContainer) {
              setEquipamentoSelecionado(equipamentoSelecionado);
            }

            removerEquipamento(equipamentoSelecionado);

            return;
          }

          setTipoMovimentacao('REMOVER');
          setEquipamentoPesoImobilizadoAlert(equipamentoSelecionado);

          return;
        }

        if (equipamentoSelecionado && equipamentoSelecionado.codigoContainer) {
          setEquipamentoSelecionado(equipamentoSelecionado);
        }

        removerEquipamento(equipamentoSelecionado);
      },
    });
  };

  React.useEffect(() => {
    if (params.equipamentoRemovidoParams && params.equipamentoRemovidoParams?.codigoContainer) {
      if (tipoMovimentacao === 'REMOVER') {
        if (params.equipamentoRemovidoParams && params.equipamentoRemovidoParams.codigoContainer) {
          setEquipamentoSelecionado(params.equipamentoRemovidoParams);
        }

        removerEquipamento(params.equipamentoRemovidoParams);
      } else if (tipoMovimentacao === 'SUBSTITUIR') {
        navigateToListaEquipamentos(params.equipamentoRemovidoParams);
      }

      params.equipamentoRemovidoParams = {};
    }
  }, [params.equipamentoRemovidoParams]);

  return {
    loadingData,
    equipamentos,
    configuracoes,
    pesquisa,
    totalResiduos,
    equipamentosFiltrados,
    totalEquipamentos,
    memoizedEquipamentoPesoTara,
    equipamentoPesoImobilizadoAlert,
    setEquipamentoPesoImobilizadoAlert,
    goBackFunction,
    showSubstituirAlert,
    continuarPesoBrutoAsync,
    onChangePesquisa,
    showRemoverEquipamentoAlert,
    removerEquipamento,
    navegarParaAdicionarResiduosPesagem,
    continuarColeta,
    navigateToQRCode,
    navigateToListaEquipamentos,
  };
}

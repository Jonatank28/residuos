import * as React from 'react';
import { Keyboard } from 'react-native';
import { usePresenter, useVSAlert, useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { ICliente } from '../../../../core/domain/entities/cliente';
import { IObra } from '../../../../core/domain/entities/obra';
import { IOrder } from '../../../../core/domain/entities/order';
import { useUser } from '../../../contextos/usuarioContexto';
import { useOffline } from '../../../contextos/offilineContexto';
import { useRascunho } from '../../../contextos/rascunhoContexto';
import { useStorage } from '../../../contextos/storageContexto';
import { AuthRoutes } from '../../../routes/routes';
import { useColeta } from '../../../contextos/coletaContexto';
import { useLocation } from '../../../contextos/localizacaoContexto';
import { IControllerAuth } from '../../../routes/types';
import { deleteParadasFromStorage } from '../../../utils/paradas';

interface Props extends IControllerAuth<AuthRoutes.NovaColeta> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { usuario, configuracoes } = useUser();
  const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
  const { placa } = useColeta();
  const { pegarPosicaoAtual } = useLocation();
  const { veiculo } = useColeta();
  const { dispatchAlert, closeMe } = useVSAlert();
  const storageContext = useStorage();
  const { offline } = useOffline();
  const { rascunho, pegarRascunho, setRascunho, atualizarGravarRascunho } = useRascunho();
  const [naoColetado, setNaoColetado] = React.useState<boolean>(false);
  const [observacoes, setObservacoes] = React.useState<string>('');
  const [temVariasObras, setTemVariasObras] = React.useState<boolean>(false);
  const [obra, setObra] = React.useState<IObra>({});
  const [cliente, setCliente] = React.useState<ICliente>({});
  const [coleta, setColeta] = React.useState<IOrder>({});
  const [loadingObra, setLoadingObra] = React.useState<boolean>(false);
  const [KMUltimaColeta, setKMUltimaColeta] = React.useState(0);
  const [KMInicial, setKMInicial] = React.useState(0);
  const [KMFinalValido, setKMFinalValido] = React.useState(false);


  const navigateToMotivos = () => navigation.navigate(AuthRoutes.Motivos, { screen: AuthRoutes.NovaColeta });

  const navigateToListStops = () => navigation.navigate(AuthRoutes.ListaParadas, { screen: AuthRoutes.ListaParadas, osID: cliente?.codigo ?? 0 });

  const navigateToClientes = () =>
    navigation.navigate(AuthRoutes.Clientes, {
      isSelect: true,
      screen: AuthRoutes.NovaColeta,
    });

  const navigateToObras = () =>
    navigation.navigate(AuthRoutes.ObrasNovaColeta, {
      isSelect: true,
      screen: AuthRoutes.NovaColeta,
      obraSelecionada: obra,
      clienteID: cliente?.codigo ?? 0,
    });

  const verificarObrasCliente = async () => {
    const response = offline
      ? await presenter.verificarObrasContratoClienteDevice(params.cliente?.codigo ?? 0, { amount: 10, page: 1, search: '' })
      : await presenter.verificarObrasContratoClienteOnline(params.cliente?.codigo ?? 0, { amount: 10, page: 1, search: '' });

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else if (typeof response === 'number') {
      setTemVariasObras(response > 0);
    } else {
      setObra(response);
    }
  };

  React.useEffect(() => {
    (async () => {
      if (params.obra?.codigo) {
        setObra(params.obra);
      }
    })();
  }, [params.obra]);

  const validaObra = () =>
    (coleta.codigoObra !== params.obra || rascunho?.codigoObra !== params.obra) && configuracoes.somenteEquipamentosPontoColeta;

  const setObjetoColeta = (): IOrder => {
    const codigoUnico = `${Math.random()}-${new Date().getTime()}`;

    return {
      ...coleta,
      codigoOS: 0,
      codigoUnico: rascunho?.codigoUnico || codigoUnico,
      codigoEmpresa: obra?.codigoEmpresa,
      codigoDestinador: obra?.codigoDestinador,
      codigoDispositivo: usuario?.codigoDispositivo,
      codigoMotorista: usuario?.codigo,
      codigoCliente: cliente?.codigo ?? rascunho?.codigoCliente,
      nomeCliente: cliente?.razaoSocial ?? rascunho?.nomeCliente,
      equipamentos: validaObra() ? undefined : coleta?.equipamentos ?? rascunho?.equipamentos,
      equipamentosRetirados: validaObra() ? undefined : coleta?.equipamentosRetirados ?? rascunho?.equipamentosRetirados,
      telefoneCliente: cliente?.telefone ?? rascunho?.telefoneCliente,
      motivo: {
        ...params.motivo,
        observacao: observacoes,
      },
      codigoContratoObra: obra?.codigoContrato ?? 0,
      codigoObra: obra?.codigo ?? 0,
      nomeObra: obra?.descricao,
      enderecoOS: obra?.endereco ?? cliente?.endereco,
      placa,
      KMInicial
    };
  };

  const setarUltimoKm = async () => {
    const ultimoKm = await pegarUltimoKm();
    setKMUltimaColeta(ultimoKm);
    setKMInicial(ultimoKm);
  };

  const pegarUltimoKm = async () => {
    const response = await presenter.pegarUltimoKmColetado();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
      return 0;
    }

    return Math.max(veiculo.kmFinal || 0, response);
  };

  const showRascunhoAlert = (_cliente: ICliente) =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: I18n.t('screens.collectDetails.draftMessage'),
      textLeft: I18n.t('alerts.no'),
      textRight: I18n.t('alerts.yes'),
      onPressRight: () => {
        pegarRascunho({
          codigoCliente: _cliente?.codigo ?? 0,
        });
      },
      onPressLeft: () => {
        deleteParadasFromStorage(_cliente?.codigo ?? 0);
        closeMe();
      },
    });



  React.useEffect(() => {
    if (params.cliente?.codigo) {
      setLoadingObra(prev => (prev = true));
      navigation.setParams({ obra: {}, motivo: {} });
      setObservacoes(prev => (prev = ''));
      setNaoColetado(prev => (prev = false));
      setObra(prev => (prev = {}));

      verificarObrasCliente().then(() => {
        setCliente(prev => (prev = params.cliente));

        pegarRascunho({ codigoCliente: params.cliente.codigo }, true).then(response => {
          if (response?.codigoCliente) showRascunhoAlert(params.cliente);
        });

        setLoadingObra(prev => (prev = false));
      });

      storageContext.gravarAuditoria({
        codigoRegistro: params.cliente?.codigo ?? 0,
        descricao: `Selecionou Cliente ${params.cliente.codigo}`,
        rotina: 'Alterar Cliente',
        tipo: 'NOVA_COLETA',
      });
    }
  }, [params.cliente]);

  React.useEffect(() => {
    storageContext.gravarAuditoria({
      codigoRegistro: 0,
      descricao: 'Acessou Tela de Nova Coleta',
      rotina: 'Abrir Tela Nova Coleta',
      tipo: 'NOVA_COLETA',
    });
    setRascunho({});
    setarUltimoKm();
    pegarPosicaoAtual();
  }, []);

  React.useEffect(() => {
    if (cliente?.codigo && params.motivo?.codigo && navigation.isFocused()) {
      storageContext.gravarAuditoria({
        codigoRegistro: cliente?.codigo ?? 0,
        descricao: `Selecionado motivo de não coletada ${params.motivo.codigo}`,
        rotina: 'Alterar Motivo',
        tipo: 'NOVA_COLETA',
      });
    }
  }, [params.motivo]);

  React.useEffect(() => {
    if (!naoColetado) {
      setObservacoes('');
      navigation.setParams({ motivo: {} });
      if (cliente && cliente.codigo) {
        const newColeta = setObjetoColeta();

        atualizarGravarRascunho({
          ...newColeta,
          motivo: {},
        });

        storageContext.gravarAuditoria({
          codigoRegistro: cliente?.codigo ?? 0,
          descricao: 'Removido motivo de não coletada',
          rotina: 'Alterar Motivo',
          tipo: 'COLETA_AGENDADA',
        });
      }
    }
  }, [naoColetado]);

  React.useEffect(() => {
    if (rascunho?.codigoCliente && cliente?.codigo) {
      setColeta(rascunho);

      if (rascunho.codigoObra) {
        const newObra: IObra = {
          codigo: rascunho.codigoObra,
          codigoDestinador: rascunho?.codigoDestinador,
          codigoEmpresa: rascunho?.codigoEmpresa,
          codigoCliente: rascunho.codigoCliente,
          codigoContrato: rascunho.codigoContratoObra ?? 0,
          descricao: rascunho.nomeObra ?? '',
          endereco: rascunho.enderecoOS ?? undefined,
        };
        setObra(newObra);
        navigation.setParams({ obra: newObra });
      }

      if (rascunho?.motivo && rascunho.motivo?.codigo) {
        setObservacoes(rascunho.motivo?.observacao ?? '');
        setNaoColetado(true);
        navigation.setParams({ motivo: rascunho && rascunho.motivo ? rascunho.motivo : {} });
      }
      if (rascunho.KMInicial) {
        setKMInicial(rascunho.KMInicial);
      }
    }
  }, [rascunho]);

  React.useEffect(() => {
    setKMFinalValido((KMInicial - KMUltimaColeta) >= 0);
  }, [KMUltimaColeta, KMInicial]);

  const goBackFunction = async () => {
    if (cliente?.codigo) {
      const newColeta = setObjetoColeta();
      await atualizarGravarRascunho(newColeta);
    }

    setCliente({});
    navigation.goBack();
  };

  const novaColeta = async () => {
    if (naoColetado && !params.motivo.codigo) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.newCollect.reasonRequired'),
      });
    } else if (cliente?.codigo) {
      if (placa && placa.length > 0) {
        if (temVariasObras && !obra.codigo) {
          dispatchSnack({
            type: 'open',
            alertType: 'info',
            message: I18n.t('screens.newCollect.workRequired'),
          });
        } else {
          const newColeta = setObjetoColeta();

          storageContext.gravarAuditoria({
            codigoRegistro: newColeta?.codigoCliente ?? 0,
            descricao: newColeta?.codigoContratoObra
              ? `Selecionado Contrato ${newColeta.codigoContratoObra}`
              : 'Nenhum Contrato Selecionado',
            rotina: 'Contrato',
            tipo: 'NOVA_COLETA',
          });

          await atualizarGravarRascunho(newColeta);
          navigation.navigate(AuthRoutes.ResiduosDaColeta, { coleta: newColeta, novaColeta: true, residuo: {} });
        }
      } else {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.newCollect.boardRequired'),
        });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.newCollect.clientRequired'),
      });
    }
  };

  const onToggleNaoColetado = () => setNaoColetado(!naoColetado);

  return {
    obra,
    coleta,
    temVariasObras,
    rascunho,
    cliente,
    naoColetado,
    loadingObra,
    observacoes,
    goBackFunction,
    navigateToMotivos,
    setarUltimoKm,
    setObservacoes,
    novaColeta,
    navigateToClientes,
    navigateToObras,
    onToggleNaoColetado,
    setKMInicial,
    KMInicial,
    KMFinalValido,
    navigateToListStops,
  };
}
